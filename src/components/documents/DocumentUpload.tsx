import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  Eye,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  FileCheck,
  Search,
  Shield,
  Camera,
  Building,
  CreditCard,
  Users,
  Banknote
} from 'lucide-react';

interface DocumentUploadProps {
  application: any;
  onNavigate: (page: string, application?: any) => void;
}

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  required: boolean;
  status: 'submitted' | 'missing' | 'invalid' | 'pending' | 'verified';
  uploadedAt?: string;
  fileSize?: string;
  fileType?: string;
  aiVerified?: boolean;
  confidence?: number;
  issues?: string[];
  icon: React.ElementType;
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  completionRate: number;
  required: number;
  submitted: number;
  verified: number;
  documents: DocumentItem[];
}

export function DocumentUpload({ application, onNavigate }: DocumentUploadProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>([
    {
      id: 'identity',
      name: 'Identity Documents',
      description: 'Government-issued identity proofs',
      icon: Shield,
      completionRate: 90,
      required: 3,
      submitted: 3,
      verified: 2,
      documents: [
        {
          id: 'aadhaar',
          name: 'Aadhaar Card',
          category: 'identity',
          required: true,
          status: 'verified',
          uploadedAt: '2025-01-07T10:30:00Z',
          fileSize: '2.3 MB',
          fileType: 'PDF',
          aiVerified: true,
          confidence: 96,
          icon: FileText
        },
        {
          id: 'pan',
          name: 'PAN Card',
          category: 'identity',
          required: true,
          status: 'verified',
          uploadedAt: '2025-01-07T10:32:00Z',
          fileSize: '1.8 MB',
          fileType: 'PDF',
          aiVerified: true,
          confidence: 98,
          icon: FileText
        },
        {
          id: 'passport',
          name: 'Passport (if applicable)',
          category: 'identity',
          required: false,
          status: 'submitted',
          uploadedAt: '2025-01-07T10:35:00Z',
          fileSize: '3.1 MB',
          fileType: 'PDF',
          aiVerified: false,
          issues: ['Quality check pending'],
          icon: FileText
        }
      ]
    },
    {
      id: 'address',
      name: 'Address Proof',
      description: 'Current and permanent address verification',
      icon: Building,
      completionRate: 75,
      required: 2,
      submitted: 2,
      verified: 1,
      documents: [
        {
          id: 'utility_bill',
          name: 'Utility Bill (Latest)',
          category: 'address',
          required: true,
          status: 'verified',
          uploadedAt: '2025-01-07T10:40:00Z',
          fileSize: '1.2 MB',
          fileType: 'PDF',
          aiVerified: true,
          confidence: 92,
          icon: FileText
        },
        {
          id: 'rent_agreement',
          name: 'Rent Agreement',
          category: 'address',
          required: true,
          status: 'pending',
          uploadedAt: '2025-01-07T10:42:00Z',
          fileSize: '4.5 MB',
          fileType: 'PDF',
          aiVerified: false,
          issues: ['Address verification in progress'],
          icon: FileText
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Documents',
      description: 'Income and financial status verification',
      icon: CreditCard,
      completionRate: 60,
      required: 4,
      submitted: 3,
      verified: 2,
      documents: [
        {
          id: 'salary_slips',
          name: 'Salary Slips (Last 3 months)',
          category: 'financial',
          required: true,
          status: 'verified',
          uploadedAt: '2025-01-07T10:45:00Z',
          fileSize: '2.8 MB',
          fileType: 'PDF',
          aiVerified: true,
          confidence: 89,
          icon: Banknote
        },
        {
          id: 'bank_statements',
          name: 'Bank Statements (Last 6 months)',
          category: 'financial',
          required: true,
          status: 'verified',
          uploadedAt: '2025-01-07T10:50:00Z',
          fileSize: '5.2 MB',
          fileType: 'PDF',
          aiVerified: true,
          confidence: 94,
          icon: Building
        },
        {
          id: 'itr',
          name: 'Income Tax Returns (Last 2 years)',
          category: 'financial',
          required: true,
          status: 'invalid',
          uploadedAt: '2025-01-07T10:55:00Z',
          fileSize: '1.9 MB',
          fileType: 'PDF',
          aiVerified: false,
          issues: ['ITR year 2024 missing', 'Incomplete documentation'],
          icon: FileText
        },
        {
          id: 'form16',
          name: 'Form 16 (Current Year)',
          category: 'financial',
          required: true,
          status: 'missing',
          icon: FileText
        }
      ]
    },
    {
      id: 'business',
      name: 'Business Documents',
      description: 'Business registration and operational proof',
      icon: Users,
      completionRate: 45,
      required: 5,
      submitted: 2,
      verified: 1,
      documents: [
        {
          id: 'shop_license',
          name: 'Shop and Establishment License',
          category: 'business',
          required: true,
          status: 'verified',
          uploadedAt: '2025-01-07T11:00:00Z',
          fileSize: '2.1 MB',
          fileType: 'PDF',
          aiVerified: true,
          confidence: 91,
          icon: FileText
        },
        {
          id: 'gst_certificate',
          name: 'GST Registration Certificate',
          category: 'business',
          required: true,
          status: 'pending',
          uploadedAt: '2025-01-07T11:05:00Z',
          fileSize: '1.7 MB',
          fileType: 'PDF',
          aiVerified: false,
          icon: FileText
        },
        {
          id: 'business_photos',
          name: 'Business Premises Photos',
          category: 'business',
          required: true,
          status: 'missing',
          icon: Camera
        },
        {
          id: 'partnership_deed',
          name: 'Partnership Deed (if applicable)',
          category: 'business',
          required: false,
          status: 'missing',
          icon: FileText
        },
        {
          id: 'trade_license',
          name: 'Trade License',
          category: 'business',
          required: true,
          status: 'missing',
          icon: FileText
        }
      ]
    }
  ]);

  const overallProgress = () => {
    const totalRequired = documentCategories.reduce((acc, cat) => acc + cat.required, 0);
    const totalVerified = documentCategories.reduce((acc, cat) => acc + cat.verified, 0);
    return Math.round((totalVerified / totalRequired) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'invalid': return 'text-red-600 bg-red-50';
      case 'missing': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'submitted': return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'invalid': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'missing': return <X className="w-4 h-4 text-gray-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'invalid':
        return <Badge className="bg-red-100 text-red-800">Invalid</Badge>;
      case 'missing':
        return <Badge variant="secondary">Missing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleFileUpload = async (documentId: string, file: File) => {
    setIsUploading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update document status
    setDocumentCategories(prev => prev.map(category => ({
      ...category,
      documents: category.documents.map(doc => 
        doc.id === documentId ? {
          ...doc,
          status: 'submitted',
          uploadedAt: new Date().toISOString(),
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: file.type.split('/')[1].toUpperCase()
        } : doc
      )
    })));
    
    setIsUploading(false);
  };

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
          <p className="text-gray-500 mb-4">Please select an application to view document requirements.</p>
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
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1>Document Completeness Check</h1>
            <p className="text-muted-foreground">
              {application.applicantName} • Required documents and verification status
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate('kyc', application)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to KYC
          </Button>
          <Button onClick={() => onNavigate('scoring', application)} className="gap-2">
            Continue to Scoring
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Completeness</CardTitle>
            <Badge variant="outline" className={overallProgress() > 80 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}>
              {overallProgress()}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress()} className="mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {documentCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab(category.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      category.completionRate >= 80 ? 'bg-green-500' :
                      category.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {category.verified}/{category.required} verified
                      </p>
                    </div>
                  </div>
                  <Progress value={category.completionRate} className="mb-2" />
                  <p className="text-xs text-muted-foreground">{category.completionRate}% complete</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Document Categories Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Document Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {documentCategories.reduce((acc, cat) => acc + cat.verified, 0)}
                  </div>
                  <p className="text-sm text-green-700">Verified Documents</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {documentCategories.reduce((acc, cat) => acc + cat.documents.filter(d => d.status === 'pending' || d.status === 'submitted').length, 0)}
                  </div>
                  <p className="text-sm text-yellow-700">Pending Review</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {documentCategories.reduce((acc, cat) => acc + cat.documents.filter(d => d.status === 'missing' || d.status === 'invalid').length, 0)}
                  </div>
                  <p className="text-sm text-red-700">Missing/Invalid</p>
                </div>
              </CardContent>
            </Card>

            {/* Missing Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Missing Documents</CardTitle>
                <CardDescription>Required documents that need to be uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentCategories.flatMap(cat => 
                    cat.documents.filter(doc => doc.status === 'missing' && doc.required)
                  ).map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <div key={doc.id} className="flex items-center gap-3 p-2 border rounded-lg">
                        <Icon className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium flex-1">{doc.name}</span>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Upload className="w-3 h-3" />
                          Upload
                        </Button>
                      </div>
                    );
                  })}
                  {documentCategories.flatMap(cat => 
                    cat.documents.filter(doc => doc.status === 'missing' && doc.required)
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      All required documents have been submitted
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentCategories
                    .flatMap(cat => cat.documents)
                    .filter(doc => doc.uploadedAt)
                    .sort((a, b) => new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime())
                    .slice(0, 5)
                    .map((doc) => {
                      const Icon = doc.icon;
                      return (
                        <div key={doc.id} className="flex items-center gap-3 p-2">
                          <Icon className="w-4 h-4 text-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(doc.uploadedAt!).toLocaleString('en-IN')}
                            </p>
                          </div>
                          {getStatusBadge(doc.status)}
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Category Specific Tabs */}
        {documentCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="w-5 h-5" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className={category.completionRate > 80 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}>
                    {category.verified}/{category.required} Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.documents.map((document) => {
                    const Icon = document.icon;
                    return (
                      <div key={document.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-500" />
                            <div>
                              <h4 className="font-medium">{document.name}</h4>
                              {document.required && (
                                <Badge variant="outline" className="text-xs">Required</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(document.status)}
                            {document.confidence && (
                              <Badge variant="outline">
                                {document.confidence}% AI
                              </Badge>
                            )}
                          </div>
                        </div>

                        {document.status !== 'missing' && (
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Uploaded:</span>
                              <p className="font-medium">
                                {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString('en-IN') : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">File Size:</span>
                              <p className="font-medium">{document.fileSize || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Format:</span>
                              <p className="font-medium">{document.fileType || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">AI Verified:</span>
                              <p className="font-medium">
                                {document.aiVerified ? (
                                  <span className="text-green-600">Yes</span>
                                ) : (
                                  <span className="text-yellow-600">Pending</span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {document.issues && document.issues.length > 0 && (
                          <Alert className="mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <ul className="list-disc list-inside">
                                {document.issues.map((issue, idx) => (
                                  <li key={idx}>{issue}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-2">
                          {document.status === 'missing' ? (
                            <Button size="sm" className="gap-2">
                              <Upload className="w-4 h-4" />
                              Upload Document
                            </Button>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                              {document.status === 'invalid' && (
                                <Button size="sm" variant="outline" className="gap-2">
                                  <Upload className="w-4 h-4" />
                                  Re-upload
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}