import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  MessageCircle,
  Phone,
  Mail,
  Download,
  Upload,
  RefreshCw,
  User,
  Calendar,
  Building,
  CreditCard,
  ArrowLeft,
  Send,
  Paperclip
} from 'lucide-react';

interface CustomerPortalProps {
  onNavigate: (page: string) => void;
}

interface ApplicationStatus {
  id: string;
  applicantName: string;
  loanType: string;
  amount: number;
  currentStatus: 'submitted' | 'document_verification' | 'credit_assessment' | 'approved' | 'rejected' | 'disbursed';
  submittedAt: string;
  lastUpdated: string;
  estimatedCompletion: string;
  loanOfficer: {
    name: string;
    phone: string;
    email: string;
  };
  statusHistory: {
    status: string;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
  documents: {
    name: string;
    status: 'pending' | 'verified' | 'rejected';
    uploadedAt: string;
    remarks?: string;
  }[];
  messages: {
    id: string;
    from: 'customer' | 'officer';
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

export function CustomerPortal({ onNavigate }: CustomerPortalProps) {
  const [applicationId, setApplicationId] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
  const [activeTab, setActiveTab] = useState('status');
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Mock application data
  const mockApplicationData: ApplicationStatus = {
    id: 'VAPP123456',
    applicantName: 'Rajesh Kumar',
    loanType: 'Personal Loan',
    amount: 250000,
    currentStatus: 'document_verification',
    submittedAt: '2025-01-07T10:30:00Z',
    lastUpdated: '2025-01-07T14:30:00Z',
    estimatedCompletion: '2025-01-12T18:00:00Z',
    loanOfficer: {
      name: 'Priya Sharma',
      phone: '+91 9876543210',
      email: 'priya.sharma@vistaar.com'
    },
    statusHistory: [
      {
        status: 'Application Submitted',
        timestamp: '2025-01-07T10:30:00Z',
        description: 'Your loan application has been successfully submitted',
        completed: true
      },
      {
        status: 'Document Verification',
        timestamp: '2025-01-07T11:00:00Z',
        description: 'Our team is verifying your uploaded documents',
        completed: false
      },
      {
        status: 'Credit Assessment',
        timestamp: '',
        description: 'AI-powered risk analysis and credit evaluation',
        completed: false
      },
      {
        status: 'Final Review',
        timestamp: '',
        description: 'Senior loan officer review and decision',
        completed: false
      },
      {
        status: 'Decision & Disbursement',
        timestamp: '',
        description: 'Final decision and loan disbursement (if approved)',
        completed: false
      }
    ],
    documents: [
      {
        name: 'Aadhaar Card',
        status: 'verified',
        uploadedAt: '2025-01-07T10:30:00Z'
      },
      {
        name: 'PAN Card',
        status: 'verified',
        uploadedAt: '2025-01-07T10:32:00Z'
      },
      {
        name: 'Recent Photograph',
        status: 'verified',
        uploadedAt: '2025-01-07T10:35:00Z'
      },
      {
        name: 'Salary Slips',
        status: 'pending',
        uploadedAt: '2025-01-07T10:40:00Z',
        remarks: 'Please upload salary slips for the last 3 months'
      },
      {
        name: 'Bank Statements',
        status: 'rejected',
        uploadedAt: '2025-01-07T10:45:00Z',
        remarks: 'Bank statements are not clear. Please upload high-quality PDF'
      }
    ],
    messages: [
      {
        id: '1',
        from: 'officer',
        message: 'Hello Rajesh, welcome to Vistaar Finance! I am Priya Sharma, your assigned loan officer. I have started reviewing your application.',
        timestamp: '2025-01-07T11:00:00Z'
      },
      {
        id: '2',
        from: 'officer',
        message: 'I noticed that your bank statements are not very clear. Could you please upload a high-quality PDF version? Also, we need salary slips for the last 3 months.',
        timestamp: '2025-01-07T14:00:00Z'
      },
      {
        id: '3',
        from: 'customer',
        message: 'Hi Priya, thank you for the update. I will upload the clearer bank statements and salary slips by tomorrow.',
        timestamp: '2025-01-07T14:30:00Z'
      }
    ]
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    // Simulate search - in real app, this would make an API call
    if (applicationId === 'VAPP123456' || applicationId.toLowerCase() === 'demo') {
      setApplicationData(mockApplicationData);
    } else {
      setApplicationData(null);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSendingMessage(true);
    
    // Simulate message sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add message to the list
    const newMessageObj = {
      id: Date.now().toString(),
      from: 'customer' as const,
      message: newMessage,
      timestamp: new Date().toISOString()
    };
    
    if (applicationData) {
      setApplicationData({
        ...applicationData,
        messages: [...applicationData.messages, newMessageObj]
      });
    }
    
    setNewMessage('');
    setIsSendingMessage(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'disbursed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculateProgress = () => {
    const completedSteps = applicationData?.statusHistory.filter(step => step.completed).length || 0;
    const totalSteps = applicationData?.statusHistory.length || 1;
    return (completedSteps / totalSteps) * 100;
  };

  if (!searchPerformed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">V</span>
              </div>
              <CardTitle className="text-2xl">Track Your Application</CardTitle>
              <CardDescription>
                Enter your application ID to check the status of your loan application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="applicationId">Application ID</Label>
                <Input
                  id="applicationId"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Enter your application ID (e.g., VAPP123456)"
                />
                <p className="text-xs text-muted-foreground">
                  Try "demo" or "VAPP123456" for demonstration
                </p>
              </div>

              <Button 
                onClick={handleSearch}
                disabled={!applicationId.trim()}
                className="w-full gap-2"
              >
                <Search className="w-4 h-4" />
                Track Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl text-red-700">Application Not Found</CardTitle>
              <CardDescription>
                We couldn't find an application with ID: {applicationId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please check your application ID and try again. If you continue to face issues, 
                  please contact our customer support.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchPerformed(false)}
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => onNavigate('customer-onboarding')}
                  className="flex-1"
                >
                  New Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Tracking</h1>
              <p className="text-gray-600">ID: {applicationData.id}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setSearchPerformed(false)}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            Track Another
          </Button>
        </div>

        {/* Application Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {applicationData.applicantName}
                </CardTitle>
                <CardDescription>
                  {applicationData.loanType} • ₹{applicationData.amount.toLocaleString()}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(applicationData.currentStatus)} variant="secondary">
                {applicationData.currentStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">{new Date(applicationData.submittedAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date(applicationData.lastUpdated).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Est. Completion</p>
                <p className="font-medium">{new Date(applicationData.estimatedCompletion).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-center">
                <User className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loan Officer</p>
                <p className="font-medium">{applicationData.loanOfficer.name}</p>
              </div>
            </div>
            
            <Progress value={calculateProgress()} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(calculateProgress())}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Application Status</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Status Timeline */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Progress</CardTitle>
                <CardDescription>
                  Track the progress of your loan application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {applicationData.statusHistory.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 
                        index === applicationData.statusHistory.findIndex(s => !s.completed) ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : index === applicationData.statusHistory.findIndex(s => !s.completed) ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{step.status}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{step.description}</p>
                        {step.timestamp && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(step.timestamp).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        {step.completed ? (
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        ) : index === applicationData.statusHistory.findIndex(s => !s.completed) ? (
                          <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Status */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Status</CardTitle>
                <CardDescription>
                  Check the verification status of your uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationData.documents.map((document, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{document.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {new Date(document.uploadedAt).toLocaleDateString('en-IN')}
                          </p>
                          {document.remarks && (
                            <p className="text-sm text-red-600 mt-1">{document.remarks}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(document.status)}>
                          {document.status.toUpperCase()}
                        </Badge>
                        {document.status === 'rejected' && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Re-upload
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communicate with your loan officer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {applicationData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.from === 'customer'
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.from === 'customer' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.from === 'customer' ? 'You' : applicationData.loanOfficer.name} • 
                        {new Date(message.timestamp).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 min-h-[80px]"
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                      className="gap-2"
                    >
                      {isSendingMessage ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Send
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attach
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Your Loan Officer</CardTitle>
                <CardDescription>
                  Get in touch with your assigned loan officer for any queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{applicationData.loanOfficer.name}</h4>
                      <p className="text-sm text-muted-foreground">Senior Loan Officer</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">{applicationData.loanOfficer.phone}</p>
                        <p className="text-sm text-muted-foreground">Call for immediate assistance</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto gap-2">
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{applicationData.loanOfficer.email}</p>
                        <p className="text-sm text-muted-foreground">Email for detailed queries</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Our loan officers are available Monday to Saturday, 9:00 AM to 6:00 PM. 
                      For urgent queries outside these hours, please use the message feature above.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}