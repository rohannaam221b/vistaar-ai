import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  userRole: 'loan_officer' | 'admin';
  onNavigate: (page: any) => void;
}

export function Sidebar({ currentPage, userRole, onNavigate }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      roles: ['loan_officer', 'admin']
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      badge: '3',
      roles: ['loan_officer', 'admin']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
      roles: ['admin']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      roles: ['loan_officer', 'admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Vistaar Finance</h2>
            <p className="text-xs text-gray-500">Loan Processing</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-10 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">System Online</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-green-600">
              <span>AI Services</span>
              <span>98%</span>
            </div>
            <div className="flex justify-between text-xs text-green-600">
              <span>Processing</span>
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}