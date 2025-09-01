import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  DollarSign,
  Shield,
  ArrowRight,
  Eye
} from 'lucide-react';

interface DashboardProps {
  user: any;
  applications: any[];
  onNavigate: (page: any, application?: any) => void;
}

export function Dashboard({ user, applications, onNavigate }: DashboardProps) {
  const totalApplications = applications.length;
  const processingQueue = applications.filter(app => app.status === 'processing').length;
  const fraudAlerts = 2; // Mock data
  const avgTime = 4.2; // Mock data in hours
  const successRate = 85; // Mock percentage
  const systemHealth = 98; // Mock percentage

  const kpiCards = [
    {
      title: 'Total Applications',
      value: totalApplications.toString(),
      description: 'This month',
      icon: FileText,
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Processing Queue',
      value: processingQueue.toString(),
      description: 'Awaiting review',
      icon: Clock,
      trend: '-8%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Fraud Alerts',
      value: fraudAlerts.toString(),
      description: 'Requires attention',
      icon: AlertTriangle,
      trend: '+2',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Avg. Processing Time',
      value: `${avgTime}h`,
      description: 'Per application',
      icon: TrendingUp,
      trend: '-15%',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      description: 'Approved applications',
      icon: CheckCircle2,
      trend: '+3%',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'System Health',
      value: `${systemHealth}%`,
      description: 'All services operational',
      icon: Shield,
      trend: '+1%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const recentApplications = applications.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-blue-100">
              {user.role === 'admin' ? 'System Administrator' : 'Loan Processing Officer'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Today</p>
            <p className="text-xl">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {kpi.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>



      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest submissions requiring attention</CardDescription>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onNavigate('applications')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{app.applicantName}</p>
                    <p className="text-sm text-muted-foreground">{app.loanType}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{formatAmount(app.amount)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(app.submittedAt)}</p>
                  </div>
                  
                  <Badge className={getStatusColor(app.status)}>
                    {app.status}
                  </Badge>
                  
                  {app.score && (
                    <div className="text-right">
                      <p className="text-sm font-medium">Score: {app.score}%</p>
                    </div>
                  )}
                  
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    onClick={() => onNavigate('processing', app)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}