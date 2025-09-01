import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Shield,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Search,
  Database,
  Fingerprint,
  Eye,
  CreditCard,
  Building,
  FileText
} from 'lucide-react';

interface KYCVerificationProps {
  application: any;
  onNavigate: (page: string, application?: any) => void;
}

interface VerificationStatus {
  id: string;
  category: string;
  field: string;
  applicationValue: any;
  documentValue: any;
  databaseValue: any;
  status: 'match' | 'mismatch' | 'partial' | 'pending';
  confidence: number;
  notes?: string;
}

interface KYCCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  completionRate: number;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  verifications: VerificationStatus[];
}

export function KYCVerification({ application, onNavigate }: KYCVerificationProps) {
  const [activeTab, setActiveTab] = useState('identity');
  const [isVerifying, setIsVerifying] = useState(false);
  const [kycCategories, setKycCategories] = useState<KYCCategory[]>([
    {
      id: 'identity',
      name: 'Identity Verification',
      icon: User,
      completionRate: 95,
      status: 'completed',
      verifications: [
        {
          id: 'name',
          category: 'identity',
          field: 'Full Name',
          applicationValue: 'Rajesh Kumar',
          documentValue: 'Rajesh Kumar',
          databaseValue: 'Rajesh Kumar',
          status: 'match',
          confidence: 100
        },
        {
          id: 'dob',
          category: 'identity',
          field: 'Date of Birth',
          applicationValue: '15/08/1985',
          documentValue: '15/08/1985',
          databaseValue: '15/08/1985',
          status: 'match',
          confidence: 100
        },
        {
          id: 'gender',
          category: 'identity',
          field: 'Gender',
          applicationValue: 'Male',
          documentValue: 'Male',
          databaseValue: 'Male',
          status: 'match',
          confidence: 100
        },
        {
          id: 'father_name',
          category: 'identity',
          field: 'Father\'s Name',
          applicationValue: 'Suresh Kumar',
          documentValue: 'Suresh Kumar',
          databaseValue: 'Suresh Kumar',
          status: 'match',
          confidence: 98
        }
      ]
    },
    {
      id: 'address',
      name: 'Address Verification',
      icon: MapPin,
      completionRate: 78,
      status: 'in-progress',
      verifications: [
        {
          id: 'current_address',
          category: 'address',
          field: 'Current Address',
          applicationValue: 'Plot 123, Sector 45, Gurgaon, Haryana - 122001',
          documentValue: 'Plot 123, Sector 45, Gurgaon, Haryana',
          databaseValue: 'Plot 123, Sector 45, Gurgaon, HR 122001',
          status: 'partial',
          confidence: 85,
          notes: 'Pincode format varies across sources'
        },
        {
          id: 'permanent_address',
          category: 'address',
          field: 'Permanent Address',
          applicationValue: 'Village Kaithal, District Kaithal, Haryana',
          documentValue: 'Village Kaithal, Kaithal, Haryana',
          databaseValue: 'Kaithal Village, Kaithal District, HR',
          status: 'partial',
          confidence: 72,
          notes: 'Address format differs but location matches'
        }
      ]
    },
    {
      id: 'contact',
      name: 'Contact Verification',
      icon: Phone,
      completionRate: 88,
      status: 'completed',
      verifications: [
        {
          id: 'mobile',
          category: 'contact',
          field: 'Mobile Number',
          applicationValue: '+91 9876543210',
          documentValue: '9876543210',
          databaseValue: '+919876543210',
          status: 'match',
          confidence: 95
        },
        {
          id: 'email',
          category: 'contact',
          field: 'Email Address',
          applicationValue: 'rajesh.kumar@email.com',
          documentValue: 'N/A',
          databaseValue: 'rajesh.kumar@email.com',
          status: 'match',
          confidence: 100
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Verification',
      icon: CreditCard,
      completionRate: 65,
      status: 'in-progress',
      verifications: [
        {
          id: 'bank_account',
          category: 'financial',
          field: 'Bank Account',
          applicationValue: 'HDFC Bank - ****5678',
          documentValue: 'HDFC Bank Account',
          databaseValue: 'HDFC0001234 - Active',
          status: 'match',
          confidence: 92
        },
        {
          id: 'income',
          category: 'financial',
          field: 'Monthly Income',
          applicationValue: '₹45,000',
          documentValue: '₹42,000 (ITR)',
          databaseValue: '₹43,500 (Bank Analysis)',
          status: 'partial',
          confidence: 78,
          notes: 'Income variance within acceptable range'
        }
      ]
    }
  ]);

  const overallProgress = () => {
    const totalVerifications = kycCategories.reduce((acc, cat) => acc + cat.verifications.length, 0);
    const completedVerifications = kycCategories.reduce((acc, cat) => 
      acc + cat.verifications.filter(v => v.status === 'match' || v.status === 'partial').length, 0
    );
    return Math.round((completedVerifications / totalVerifications) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'match': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      case 'mismatch': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'mismatch': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <RefreshCw className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'match':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial Match</Badge>;
      case 'mismatch':
        return <Badge className="bg-red-100 text-red-800">Mismatch</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const performVerification = async (categoryId: string) => {
    setIsVerifying(true);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsVerifying(false);
  };

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
          <p className="text-gray-500 mb-4">Please select an application to begin KYC verification.</p>
          <Button onClick={() => onNavigate('applications')}>
            Go to Applications Queue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1>KYC Verification & Data Matching</h1>
            <p className="text-muted-foreground">
              {application.applicantName} • Identity and address verification
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate('image-match', application)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Image Match
          </Button>
          <Button onClick={() => onNavigate('documents', application)} className="gap-2">
            Continue to Documents
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>KYC Verification Progress</CardTitle>
            <Badge variant="outline" className={overallProgress() > 80 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
              {overallProgress()}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress()} className="mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kycCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab(category.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      category.status === 'completed' ? 'bg-green-500' :
                      category.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-medium text-sm">{category.name}</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress value={category.completionRate} className="flex-1 mr-2" />
                    <span className="text-xs text-muted-foreground">{category.completionRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Verification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {kycCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="w-5 h-5" />
                    {category.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={category.completionRate > 80 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                      {category.completionRate}% Complete
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => performVerification(category.id)}
                      disabled={isVerifying}
                      className="gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Re-verify
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Compare data across application, documents, and external databases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {category.verifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(verification.status)}
                          <h4 className="font-medium">{verification.field}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(verification.status)}
                          <Badge variant="outline">
                            {verification.confidence}% Confidence
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Application Data */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <Label className="text-sm font-medium">Application</Label>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm">{verification.applicationValue}</p>
                          </div>
                        </div>

                        {/* Document Data */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="w-4 h-4 text-purple-500" />
                            <Label className="text-sm font-medium">Documents</Label>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm">{verification.documentValue}</p>
                          </div>
                        </div>

                        {/* Database Data */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-green-500" />
                            <Label className="text-sm font-medium">Database</Label>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm">{verification.databaseValue}</p>
                          </div>
                        </div>
                      </div>

                      {verification.notes && (
                        <div className="mt-4">
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Note:</strong> {verification.notes}
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary & Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {kycCategories.reduce((acc, cat) => 
                  acc + cat.verifications.filter(v => v.status === 'match').length, 0
                )}
              </div>
              <p className="text-sm text-green-700">Verified Fields</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {kycCategories.reduce((acc, cat) => 
                  acc + cat.verifications.filter(v => v.status === 'partial').length, 0
                )}
              </div>
              <p className="text-sm text-yellow-700">Partial Matches</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {kycCategories.reduce((acc, cat) => 
                  acc + cat.verifications.filter(v => v.status === 'mismatch').length, 0
                )}
              </div>
              <p className="text-sm text-red-700">Mismatches</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => onNavigate('image-match', application)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Image Verification
            </Button>
            <Button onClick={() => onNavigate('documents', application)} className="gap-2">
              Continue to Document Check
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}