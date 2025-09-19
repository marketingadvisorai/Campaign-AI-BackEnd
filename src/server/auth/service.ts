import {
  CreateUserInput,
  DatabaseAdapter,
  UserRecord,
} from '../adapters/database.ts';

export interface PublicUser {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

interface TokenPayload {
  sub: string;
  email: string;
  name?: string | null;
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(password: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 310000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.padEnd(value.length + (4 - (value.length % 4)) % 4, '=');
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const output = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    output[i] = binary.charCodeAt(i);
  }
  return output;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

async function signHmac(content: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(content));
  return base64UrlEncode(signature);
}

async function verifyHmac(content: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['verify'],
  );
  const signatureBytes = base64UrlDecode(signature);
  return crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(content));
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await deriveKey(password, salt);
  return `${base64UrlEncode(salt)}.${base64UrlEncode(derived)}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltPart, hashPart] = stored.split('.');
  if (!saltPart || !hashPart) {
    return false;
  }
  const salt = base64UrlDecode(saltPart);
  const derived = await deriveKey(password, salt);
  const encoded = base64UrlEncode(derived);
  return timingSafeEqual(encoder.encode(encoded), encoder.encode(hashPart));
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    createdAt: user.createdAt,
  };
}

export class AuthService {
  private adapter: DatabaseAdapter;
  private jwtSecret: string;
  private tokenTtl: number;

  constructor(adapter: DatabaseAdapter) {
    this.adapter = adapter;
    this.jwtSecret = Deno.env.get('JWT_SECRET') ?? '';
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required for authentication');
    }
    this.tokenTtl = Number(Deno.env.get('JWT_TTL_SECONDS') ?? '3600');
  }

  async signUp(input: SignUpInput): Promise<AuthResponse> {
    const normalizedEmail = input.email.toLowerCase();
    const existing = await this.adapter.getUserByEmail(normalizedEmail);
    if (existing) {
      throw new Error('Email is already registered');
    }

    const passwordHash = await hashPassword(input.password);
    const stored = await this.adapter.createUser({
      email: normalizedEmail,
      passwordHash,
      name: input.name ?? null,
    } satisfies CreateUserInput);

    const token = await this.issueToken(stored);
    return { user: toPublicUser(stored), token };
  }

  async authenticateRequest(request: Request): Promise<PublicUser> {
    const token = this.extractToken(request.headers.get('Authorization'));
    if (!token) {
      throw new Error('No access token provided');
    }
    const payload = await this.verifyToken(token);
    const user = await this.adapter.getUserById(payload.sub);
    if (!user) {
      throw new Error('User referenced by token no longer exists');
    }
    return toPublicUser(user);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const [headerPart, payloadPart, signaturePart] = parts;
    const headerJson = decoder.decode(base64UrlDecode(headerPart));
    const header = JSON.parse(headerJson) as Record<string, unknown>;
    if (header['alg'] !== 'HS256') {
      throw new Error('Unsupported token algorithm');
    }
    const isValid = await verifyHmac(`${headerPart}.${payloadPart}`, signaturePart, this.jwtSecret);
    if (!isValid) {
      throw new Error('Invalid token signature');
    }
    const payloadJson = decoder.decode(base64UrlDecode(payloadPart));
    const payload = JSON.parse(payloadJson) as TokenPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token has expired');
    }
    return payload;
  }

  private async issueToken(user: UserRecord): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name ?? null,
      iat: now,
      exp: now + this.tokenTtl,
    };
    const header = base64UrlEncode(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
    const signature = await signHmac(`${header}.${body}`, this.jwtSecret);
    return `${header}.${body}.${signature}`;
  }

  private extractToken(authorizationHeader: string | null): string | null {
    if (!authorizationHeader) {
      return null;
    }
    const [scheme, value] = authorizationHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer') {
      return null;
    }
    return value ?? null;
  }

  async validateCredentials(email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.adapter.getUserByEmail(normalizedEmail);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    const token = await this.issueToken(user);
    return { user: toPublicUser(user), token };
  }
}
