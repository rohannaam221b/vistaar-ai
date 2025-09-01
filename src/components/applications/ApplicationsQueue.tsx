import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Eye, 
  Clock, 
  DollarSign,
  User,
  MoreHorizontal,
  ArrowUpDown,
  UserPlus,
  Plus,
  CheckCircle,
  Activity
} from 'lucide-react';

interface ApplicationsQueueProps {
  applications: any[];
  setApplications: (apps: any[]) => void;
  onNavigate: (page: any, application?: any) => void;
}

export function ApplicationsQueue({ applications, setApplications, onNavigate }: ApplicationsQueueProps) {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loanTypeFilter, setLoanTypeFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('processing');

  // Split applications into processing and completed
  const processingApplications = applications.filter(app => 
    ['pending', 'processing', 'review'].includes(app.status)
  );
  
  const completedApplications = applications.filter(app => 
    ['completed', 'approved', 'rejected'].includes(app.status)
  );

  // Get current applications based on active tab
  const getCurrentApplications = () => {
    return activeTab === 'processing' ? processingApplications : completedApplications;
  };

  const filteredApplications = getCurrentApplications()
    .filter(app => {
      const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.loanType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesLoanType = loanTypeFilter === 'all' || app.loanType === loanTypeFilter;
      return matchesSearch && matchesStatus && matchesLoanType;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'submittedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const toggleApplicationSelection = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const getKanbanColumns = () => {
    const currentApps = getCurrentApplications();
    const statuses = activeTab === 'processing' 
      ? ['pending', 'processing', 'review']
      : ['completed', 'approved', 'rejected'];
    
    return statuses.map(status => ({
      id: status,
      title: status.charAt(0).toUpperCase() + status.slice(1),
      applications: currentApps.filter(app => app.status === status)
    }));
  };

  const renderListView = () => (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                {selectedApplications.length} applications selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Bulk Approve</Button>
                <Button size="sm" variant="outline">Bulk Reject</Button>
                <Button size="sm" variant="outline">Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  No {activeTab} applications found
                </h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery || statusFilter !== 'all' || loanTypeFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : activeTab === 'processing' 
                      ? 'Get started by helping a customer apply for a loan'
                      : 'No completed applications yet'
                  }
                </p>
              </div>
              <div className="flex justify-center gap-3">
                {activeTab === 'processing' && (
                  <Button
                    onClick={() => onNavigate('customer-onboarding')}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Onboard New Customer
                  </Button>
                )}
                {(searchQuery || statusFilter !== 'all' || loanTypeFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setLoanTypeFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          filteredApplications.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedApplications.includes(app.id)}
                    onCheckedChange={() => toggleApplicationSelection(app.id)}
                  />
                  
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {app.applicantName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{app.applicantName}</p>
                    <p className="text-sm text-gray-500">{app.loanType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{formatAmount(app.amount)}</p>
                    <p className="text-sm text-gray-500">{formatDate(app.submittedAt)}</p>
                  </div>

                  <Badge className={getStatusColor(app.status)}>
                    {app.status}
                  </Badge>

                  {app.score && (
                    <div className="text-center">
                      <p className="text-sm font-medium">Score</p>
                      <p className="text-lg font-bold text-blue-600">{app.score}%</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onNavigate('processing', app)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderKanbanView = () => {
    const columns = getKanbanColumns();
    const hasApplications = filteredApplications.length > 0;

    if (!hasApplications) {
      return (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Grid3X3 className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                No {activeTab} applications in kanban view
              </h3>
              <p className="text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all' || loanTypeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : activeTab === 'processing' 
                    ? 'Get started by helping a customer apply for a loan'
                    : 'No completed applications yet'
                }
              </p>
            </div>
            <div className="flex justify-center gap-3">
              {activeTab === 'processing' && (
                <Button
                  onClick={() => onNavigate('customer-onboarding')}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Onboard New Customer
                </Button>
              )}
              {(searchQuery || statusFilter !== 'all' || loanTypeFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setLoanTypeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>
      );
    }

    return (
      <div className={`grid grid-cols-${columns.length} gap-4 h-[600px] overflow-auto`}>
        {columns.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <h3 className="font-medium text-gray-700">{column.title}</h3>
              <p className="text-sm text-gray-500">{column.applications.length} applications</p>
            </div>
            
            <div className="space-y-3 max-h-full overflow-y-auto">
              {column.applications.length === 0 && column.id === 'pending' && activeTab === 'processing' && (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                  <CardContent className="p-3 text-center">
                    <UserPlus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 mb-2">No pending applications</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => onNavigate('customer-onboarding')}
                    >
                      Add Customer
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {column.applications.map((app) => (
                <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {app.applicantName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-sm">{app.applicantName}</p>
                      </div>
                      
                      <p className="text-xs text-gray-500">{app.loanType}</p>
                      <p className="text-sm font-medium">{formatAmount(app.amount)}</p>
                      
                      {app.score && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Score:</span>
                          <span className="text-sm font-bold text-blue-600">{app.score}%</span>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => onNavigate('processing', app)}
                      >
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getTabCounts = () => ({
    processing: processingApplications.length,
    completed: completedApplications.length
  });

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications Queue</h1>
          <p className="text-gray-600">Manage and review loan applications</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Onboard Customer Button */}
          <Button
            onClick={() => onNavigate('customer-onboarding')}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Onboard Customer
          </Button>
          
          {/* View Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={view === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('kanban')}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Kanban
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-xl font-bold">{processingApplications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold">{completedApplications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold">₹{(applications.reduce((sum, app) => sum + app.amount, 0) / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="processing" className="gap-2">
            <Activity className="w-4 h-4" />
            Processing ({tabCounts.processing})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed ({tabCounts.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="processing" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Loan Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Personal Loan">Personal</SelectItem>
                      <SelectItem value="Business Loan">Business</SelectItem>
                      <SelectItem value="Home Loan">Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {view === 'list' && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedApplications.length === filteredApplications.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm text-gray-600">Select All</span>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      Sort
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {view === 'list' ? renderListView() : renderKanbanView()}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search completed applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Loan Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Personal Loan">Personal</SelectItem>
                      <SelectItem value="Business Loan">Business</SelectItem>
                      <SelectItem value="Home Loan">Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {view === 'list' && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedApplications.length === filteredApplications.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm text-gray-600">Select All</span>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      Sort
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {view === 'list' ? renderListView() : renderKanbanView()}
        </TabsContent>
      </Tabs>
    </div>
  );
}