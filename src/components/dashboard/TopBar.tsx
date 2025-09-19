import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  AlertCircle,
  CheckCircle,
  Info,
  Building2,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

export function TopBar({ user, toggleSidebar, onClientSelect }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  // Mock client data - in real app, fetch from API
  useEffect(() => {
    const mockClients = [
      {
        id: '999-221-223',
        name: 'TechStart Solutions',
        email: 'admin@techstart.com',
        status: 'active',
        monthlySpend: 15420,
        tokensUsed: 2840,
        connectedAccounts: ['google_ads', 'facebook']
      },
      {
        id: '888-334-556',
        name: 'Digital Marketing Pro',
        email: 'contact@digipro.com',
        status: 'active',
        monthlySpend: 8950,
        tokensUsed: 1650,
        connectedAccounts: ['google_ads']
      },
      {
        id: '777-445-667',
        name: 'E-commerce Hub',
        email: 'hello@ecomhub.com',
        status: 'trial',
        monthlySpend: 3200,
        tokensUsed: 890,
        connectedAccounts: ['facebook']
      },
      {
        id: '666-558-779',
        name: 'Local Fitness Gym',
        email: 'info@fitgym.com',
        status: 'paused',
        monthlySpend: 0,
        tokensUsed: 0,
        connectedAccounts: []
      }
    ];
    setClients(mockClients);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = clients.filter(client => 
        client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [searchQuery, clients]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleClientSelect = (client) => {
    setSearchOpen(false);
    setSearchQuery('');
    onClientSelect?.(client);
  };

  // Mock notifications - in real app, fetch from API
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Client 999-221-223: Budget Alert',
      message: 'TechStart Solutions approaching monthly budget limit',
      time: '5 min ago',
      unread: true,
      clientId: '999-221-223'
    },
    {
      id: 2,
      type: 'success',
      title: 'OAuth Connection Successful',
      message: 'Digital Marketing Pro connected Google Ads account',
      time: '2 hours ago',
      unread: true,
      clientId: '888-334-556'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Client Signup',
      message: 'E-commerce Hub completed onboarding',
      time: '1 day ago',
      unread: false,
      clientId: '777-445-667'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'trial':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground hover:bg-accent lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Global Client Search */}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={searchOpen}
                className="w-64 lg:w-96 justify-start border-border"
              >
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search clients (ID, name, email)...</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 bg-popover border-border">
              <Command>
                <CommandInput 
                  placeholder="Search clients..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No clients found.</CommandEmpty>
                  {filteredClients.length > 0 && (
                    <CommandGroup heading="Clients">
                      {filteredClients.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.id}
                          onSelect={() => handleClientSelect(client)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`}></div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-sm text-blue-400">{client.id}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {client.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-popover-foreground">{client.name}</div>
                                <div className="text-xs text-muted-foreground">{client.email}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-popover-foreground">${client.monthlySpend.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">{client.tokensUsed} tokens</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-xs p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-popover border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-popover-foreground">Admin Notifications</h4>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    Mark all read
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.unread 
                          ? 'bg-accent border-border' 
                          : 'bg-muted border-border'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${
                            notification.unread ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {notification.clientId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto"
                                onClick={() => handleClientSelect(clients.find(c => c.id === notification.clientId))}
                              >
                                View Client <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full border-border text-foreground">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Admin User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                  <AvatarFallback className="bg-muted text-foreground">
                    {user?.email?.[0]?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover border-border" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none text-popover-foreground">
                    {user?.user_metadata?.name || 'Campaign AI Admin'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1">
                    Admin Access
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Company Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}