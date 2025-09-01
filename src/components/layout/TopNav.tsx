import React, { useState } from 'react';
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
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Code,
  Home,
  FileText,
  Users,
  Camera,
  UserCheck,
  Upload,
  Calculator,
  BarChart3,
  CreditCard
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'loan_officer' | 'admin';
  email: string;
}

interface TopNavProps {
  user: User | null;
  onLogout: () => void;
  onNavigate?: (page: string, application?: any) => void;
  currentPage?: string;
}

export function TopNav({ user, onLogout, onNavigate, currentPage }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New application submitted',
      description: 'Rajesh Kumar - Personal Loan',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Fraud alert triggered',
      description: 'Document mismatch detected',
      time: '15 min ago',
      unread: true
    },
    {
      id: 3,
      title: 'System maintenance',
      description: 'Scheduled for tonight at 2 AM',
      time: '1 hour ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getUserInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const devPages = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'applications', label: 'Applications Queue', icon: Users },
    { id: 'processing', label: 'Application Processing', icon: FileText },
    { id: 'image-match', label: 'Image Match', icon: Camera },
    { id: 'kyc', label: 'KYC Verification', icon: UserCheck },
    { id: 'documents', label: 'Document Upload', icon: Upload },
    { id: 'scoring', label: 'Scoring Engine', icon: Calculator },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'customer-onboarding', label: 'Customer Onboarding', icon: CreditCard },
    { id: 'customer-portal', label: 'Customer Portal', icon: Search },
  ];

  const handleDevNavigation = (pageId: string) => {
    if (onNavigate) {
      // For pages that need application context, use a mock application
      if (['processing', 'image-match', 'kyc', 'documents', 'scoring'].includes(pageId)) {
        const mockApplication = {
          id: '1',
          applicantName: 'Rajesh Kumar',
          loanType: 'Personal Loan',
          amount: 250000,
          status: 'pending',
          submittedAt: '2025-01-07T10:30:00Z'
        };
        onNavigate(pageId, mockApplication);
      } else {
        onNavigate(pageId);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search applications, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* DEV SHORTCUT - REMOVE IN PRODUCTION */}
          {onNavigate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100">
                  <Code className="h-4 w-4 mr-2" />
                  DEV NAV
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-orange-700 font-medium">
                  🚧 Development Navigation
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {devPages.map((page) => {
                  const Icon = page.icon;
                  const isActive = currentPage === page.id;
                  return (
                    <DropdownMenuItem 
                      key={page.id}
                      onClick={() => handleDevNavigation(page.id)}
                      className={`cursor-pointer ${isActive ? 'bg-blue-50 text-blue-700' : ''}`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{page.label}</span>
                      {isActive && <span className="ml-auto text-xs">●</span>}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="text-xs text-gray-500 justify-center">
                  ⚠️ Remove this in production
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Help */}
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary">{unreadCount} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${notification.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getUserInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1 text-xs">
                    {user?.role === 'admin' ? 'Administrator' : 'Loan Officer'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
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