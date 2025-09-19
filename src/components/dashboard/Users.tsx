import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Shield, 
  User, 
  Crown,
  Edit,
  Trash2,
  Eye,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Super Admin',
      workspaces: ['E-commerce Store', 'SaaS Platform'],
      status: 'active',
      lastLogin: '2 hours ago',
      createdAt: '2024-01-15',
      avatar: null
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      role: 'Admin',
      workspaces: ['E-commerce Store'],
      status: 'active',
      lastLogin: '1 day ago',
      createdAt: '2024-02-20',
      avatar: null
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Account Manager',
      workspaces: ['SaaS Platform', 'Local Services'],
      status: 'active',
      lastLogin: '3 hours ago',
      createdAt: '2024-03-10',
      avatar: null
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Account Manager',
      workspaces: ['Local Services'],
      status: 'invited',
      lastLogin: 'Never',
      createdAt: '2024-03-25',
      avatar: null
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@company.com',
      role: 'Account Manager',
      workspaces: ['E-commerce Store'],
      status: 'inactive',
      lastLogin: '2 weeks ago',
      createdAt: '2024-01-08',
      avatar: null
    }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Super Admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'Admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'Account Manager':
        return <User className="h-4 w-4 text-gray-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      'Super Admin': { className: 'bg-yellow-600', text: 'Super Admin' },
      'Admin': { className: 'bg-blue-600', text: 'Admin' },
      'Account Manager': { className: 'bg-gray-600', text: 'Account Manager' }
    };
    
    const config = variants[role] || variants['Account Manager'];
    return (
      <Badge className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { className: 'bg-green-600', text: 'Active' },
      inactive: { className: 'bg-gray-600', text: 'Inactive' },
      invited: { className: 'bg-yellow-600', text: 'Invited' }
    };
    
    const config = variants[status] || variants.inactive;
    return (
      <Badge className={config.className}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400">Manage users, roles, and workspace access</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Team Members ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Manage user access and permissions across workspaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Workspaces</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Last Login</TableHead>
                <TableHead className="text-gray-300 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gray-600 text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.workspaces.map((workspace, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="border-gray-600 text-gray-300 text-xs"
                        >
                          {workspace}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-300">{user.lastLogin}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700" align="end">
                        <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        {user.status === 'invited' && (
                          <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                            <Mail className="mr-2 h-4 w-4" />
                            Resend Invitation
                          </DropdownMenuItem>
                        )}
                        {user.role !== 'Super Admin' && (
                          <>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem className="text-red-400 hover:bg-red-900/20">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Super Admins</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'Super Admin').length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'Admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Account Managers</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'Account Manager').length}
                </p>
              </div>
              <User className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <InviteUserModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}

function InviteUserModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Account Manager');
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableWorkspaces = ['E-commerce Store', 'SaaS Platform', 'Local Services'];

  const handleInvite = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  const toggleWorkspace = (workspace) => {
    if (workspaces.includes(workspace)) {
      setWorkspaces(workspaces.filter(w => w !== workspace));
    } else {
      setWorkspaces([...workspaces, workspace]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white">Invite Team Member</CardTitle>
          <CardDescription className="text-gray-400">
            Send an invitation to join your Campaign AI team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email Address</label>
            <Input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="Account Manager">Account Manager</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Workspace Access</label>
            <div className="space-y-2">
              {availableWorkspaces.map((workspace) => (
                <label key={workspace} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workspaces.includes(workspace)}
                    onChange={() => toggleWorkspace(workspace)}
                    className="rounded border-gray-600 bg-gray-700"
                  />
                  <span className="text-gray-300">{workspace}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInvite}
              disabled={isLoading || !email}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}