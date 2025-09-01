import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Eye,
  Camera,
  Shield,
  FileText,
  Calculator,
  User,
  MapPin,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Star,
  DollarSign,
  Calendar,
  Building
} from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  loanType: string;
  amount: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'review';
  score?: number;
  submittedAt: string;
  verificationSteps?: any[];
  aiProcessing?: {
    active: boolean;
    agents: Array<{
      id: string;
      name: string;
      task: string;
      description: string;
      outcome: string;
      status: 'pending' | 'processing' | 'completed' | 'error';
      progress: number;
      icon: string;
    }>;
  };
}

interface ApplicationProcessingProps {
  application: Application | null;
  onNavigate: (page: string, application?: Application) => void;
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'review';
  icon: React.ElementType;
  score?: number;
  issues?: string[];
  completedAt?: string;
  aiAgent?: string;
}

interface ProcessingState {
  currentStep: number;
  overallProgress: number;
  applicationScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  verificationSteps: VerificationStep[];
}

export function ApplicationProcessing({ application, onNavigate }: ApplicationProcessingProps) {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    currentStep: 0,
    overallProgress: 0,
    applicationScore: 0,
    riskLevel: 'medium',
    verificationSteps: [
      {
        id: 'image-match',
        title: 'Image Verification',
        description: 'Face matching and document image analysis',
        status: 'pending',
        icon: Camera,
        aiAgent: 'facematch'
      },
      {
        id: 'kyc',
        title: 'KYC Verification',
        description: 'Identity and address verification',
        status: 'pending',
        icon: Shield,
        aiAgent: 'preprocessing'
      },
      {
        id: 'documents',
        title: 'Document Completeness',
        description: 'Required document checklist and validation',
        status: 'pending',
        icon: FileText,
        aiAgent: 'document-verification'
      },
      {
        id: 'scoring',
        title: 'Risk Assessment',
        description: 'AI-powered fraud detection and scoring',
        status: 'pending',
        icon: Calculator,
        aiAgent: 'credit-analysis'
      }
    ]
  });

  const [selectedVerificationModule, setSelectedVerificationModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load verification data from application or use defaults
  useEffect(() => {
    if (application) {
      let updatedSteps = [...processingState.verificationSteps];
      let progress = 0;
      let score = application.score || 0;

      // Use verification steps from application if available (AI completed)
      if (application.verificationSteps) {
        updatedSteps = application.verificationSteps.map(appStep => ({
          ...updatedSteps.find(step => step.id === appStep.id)!,
          ...appStep
        }));
        
        // Calculate progress based on completed steps
        const completedSteps = updatedSteps.filter(step => step.status === 'completed').length;
        progress = (completedSteps / updatedSteps.length) * 100;
      } else if (application.status === 'processing') {
        // Legacy simulation for existing applications
        updatedSteps[0].status = 'completed';
        updatedSteps[0].score = 92;
        updatedSteps[0].completedAt = '2025-01-07T11:15:00Z';
        updatedSteps[1].status = 'in-progress';
        progress = 37.5;
        score = 92;
      }

      setProcessingState(prev => ({
        ...prev,
        verificationSteps: updatedSteps,
        overallProgress: progress,
        applicationScore: score,
        riskLevel: score > 85 ? 'low' : score > 70 ? 'medium' : 'high'
      }));
    }
  }, [application]);

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No application selected</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStepDetails = (stepId: string) => {
    const step = application.verificationSteps?.find(s => s.id === stepId);
    return step?.details || null;
  };

  return (
    <div className="space-y-6">
      {/* Application Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3">
                <User className="w-5 h-5" />
                {application.applicantName}
                <Badge className={getStatusColor(application.status)}>
                  {application.status.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>
                {application.loanType} • ₹{application.amount.toLocaleString('en-IN')} • 
                Applied on {new Date(application.submittedAt).toLocaleDateString('en-IN')}
              </CardDescription>
            </div>
            <div className="text-right space-y-2">
              {processingState.applicationScore > 0 && (
                <div className="text-2xl font-bold text-green-600">
                  {processingState.applicationScore}%
                </div>
              )}
              <Badge className={`${getRiskLevelColor(processingState.riskLevel)}`}>
                {processingState.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">{Math.round(processingState.overallProgress)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Status */}
      {application.aiProcessing?.active && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              AI Processing in Progress
            </CardTitle>
            <CardDescription>
              AI agents are analyzing your application data. This process typically takes 15-20 seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.aiProcessing.agents.map((agent, index) => (
                <div key={agent.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'completed' ? 'bg-green-500' :
                        agent.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                        agent.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="font-medium">{agent.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {agent.status === 'processing' ? 'PROCESSING' :
                         agent.status === 'completed' ? 'COMPLETED' :
                         agent.status === 'error' ? 'ERROR' : 'PENDING'}
                      </Badge>
                    </div>
                    {agent.status === 'completed' ? (
                      <span className="text-sm font-bold text-green-600">{agent.progress}%</span>
                    ) : (
                      <span className="text-sm text-gray-600">{agent.progress}%</span>
                    )}
                  </div>
                  {/* Only show progress bar if not completed */}
                  {agent.status !== 'completed' && (
                    <Progress 
                      value={agent.progress} 
                      className={`w-full h-2 ${
                        agent.status === 'processing' ? '[&>div]:bg-green-500' : ''
                      }`} 
                    />
                  )}
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {processingState.verificationSteps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';
          
          return (
            <div 
              key={step.id}
              className="relative p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                const getTabValue = (stepId: string) => {
                  switch (stepId) {
                    case 'image-match': return 'image-verification';
                    case 'kyc': return 'kyc';
                    case 'documents': return 'documents';
                    case 'scoring': return 'analysis';
                    default: return 'overview';
                  }
                };
                setActiveTab(getTabValue(step.id));
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isCompleted ? 'bg-green-100' : 
                  isInProgress ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isCompleted ? 'text-green-600' : 
                    isInProgress ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {step.score && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Score:</span>
                      <span className="text-sm font-medium text-green-600">{step.score}%</span>
                    </div>
                  )}
                </div>
              </div>
              {isCompleted && (
                <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-green-500" />
              )}
              {isInProgress && (
                <Clock className="absolute top-2 right-2 w-4 h-4 text-blue-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="image-verification">Image Match</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump to specific verification steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {processingState.verificationSteps.map((step) => {
                  const Icon = step.icon;
                  const getTabValue = (stepId: string) => {
                    switch (stepId) {
                      case 'image-match': return 'image-verification';
                      case 'kyc': return 'kyc';
                      case 'documents': return 'documents';
                      case 'scoring': return 'analysis';
                      default: return 'overview';
                    }
                  };
                  
                  return (
                    <Button
                      key={step.id}
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveTab(getTabValue(step.id))}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{step.title}</span>
                      {step.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Loan Type</div>
                  <div className="font-medium">{application.loanType}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Amount Requested</div>
                  <div className="font-medium">₹{application.amount.toLocaleString('en-IN')}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Application Date</div>
                  <div className="font-medium">{new Date(application.submittedAt).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image-verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Verification</CardTitle>
              <CardDescription>
                Face matching and document image analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingState.verificationSteps
                  .filter(step => step.id === 'image-match')
                  .map(step => (
                    <div key={step.id}>
                      {step.status === 'completed' ? (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Image verification completed by AI agent.</strong> 
                            {step.score && ` Score: ${step.score}%`}
                            {step.completedAt && ` • Completed: ${new Date(step.completedAt).toLocaleString('en-IN')}`}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <Camera className="h-4 w-4" />
                          <AlertDescription>
                            Image verification is pending. AI agents will automatically process face matching and document images.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                
{(() => {
                  const details = getVerificationStepDetails('image-match');
                  if (!details) return null;
                  
                  return (
                    <div className="space-y-6">
                      {/* Sample Images Section */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Uploaded Images</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Customer Selfie</label>
                            <div className="border rounded-lg overflow-hidden">
                              <img 
                                src={details.faceMatch.sampleImages?.selfie || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'} 
                                alt="Customer Selfie" 
                                className="w-full h-48 object-cover"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Quality: {details.faceMatch.selfieQuality}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ID Document Photo</label>
                            <div className="border rounded-lg overflow-hidden">
                              <img 
                                src={details.faceMatch.sampleImages?.idPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&sat=-100&con=100'} 
                                alt="ID Document Photo" 
                                className="w-full h-48 object-cover"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Quality: {details.faceMatch.idPhotoQuality}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Face Matching</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Selfie Quality</span>
                              <Badge className="bg-green-100 text-green-800">{details.faceMatch.selfieQuality}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">ID Photo Quality</span>
                              <Badge className="bg-green-100 text-green-800">{details.faceMatch.idPhotoQuality}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Face Match Score</span>
                              <span className="text-sm font-medium text-green-600">{details.faceMatch.matchScore}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Liveness Detection</span>
                              <Badge className="bg-green-100 text-green-800">{details.faceMatch.livenessDetection}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Biometric Points</span>
                              <span className="text-sm font-medium">{details.faceMatch.biometricPoints}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Document Images</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Image Clarity</span>
                              <Badge className="bg-green-100 text-green-800">{details.documentImages.clarity}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Text Readability</span>
                              <Badge className="bg-green-100 text-green-800">{details.documentImages.readability}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Tampering Check</span>
                              <Badge className="bg-green-100 text-green-800">{details.documentImages.tamperingCheck}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Format Validation</span>
                              <Badge className="bg-green-100 text-green-800">{details.documentImages.formatValidation}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Resolution</span>
                              <span className="text-sm font-medium">{details.documentImages.resolution}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Identity and address verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingState.verificationSteps
                  .filter(step => step.id === 'kyc')
                  .map(step => (
                    <div key={step.id}>
                      {step.status === 'completed' ? (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>KYC verification completed by AI agent.</strong> 
                            {step.score && ` Score: ${step.score}%`}
                            {step.completedAt && ` • Completed: ${new Date(step.completedAt).toLocaleString('en-IN')}`}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            KYC verification is pending. AI agents will automatically process identity and address verification.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                
                {(() => {
                  const details = getVerificationStepDetails('kyc');
                  if (!details) return null;
                  
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Identity Verification</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Name Match</span>
                              <Badge className="bg-green-100 text-green-800">{details.identity.nameMatch}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Date of Birth</span>
                              <span className="text-sm font-medium">{details.identity.dateOfBirth}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">PAN Number</span>
                              <span className="text-sm font-medium">{details.identity.panCard}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Government Database</span>
                              <Badge className="bg-green-100 text-green-800">{details.identity.governmentDatabase}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Father's Name</span>
                              <span className="text-sm font-medium">{details.identity.fatherName}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Address Verification</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Address Match</span>
                              <Badge className="bg-green-100 text-green-800">{details.address.verification.addressMatch}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Pincode Validation</span>
                              <Badge className="bg-green-100 text-green-800">{details.address.verification.pincodeValidation}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Utility Bill Check</span>
                              <Badge className="bg-green-100 text-green-800">{details.address.verification.utilityBillCheck}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Residence Proof</span>
                              <Badge className="bg-green-100 text-green-800">{details.address.verification.residenceProof}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Electoral Roll</span>
                              <Badge className="bg-green-100 text-green-800">{details.address.additionalChecks.electoralRoll}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Current Address</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Full Address</div>
                            <div className="font-medium">
                              {details.address.currentAddress.line1}, {details.address.currentAddress.line2}<br/>
                              {details.address.currentAddress.city}, {details.address.currentAddress.state} - {details.address.currentAddress.pincode}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Residence Details</div>
                            <div className="space-y-1">
                              <div className="text-sm">Type: {details.address.currentAddress.residenceType}</div>
                              <div className="text-sm">Ownership: {details.address.currentAddress.ownership}</div>
                              <div className="text-sm">Duration: {details.address.additionalChecks.addressHistory}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Summary</CardTitle>
              <CardDescription>
                Overview of all documents in this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingState.verificationSteps
                  .filter(step => step.id === 'documents')
                  .map(step => (
                    <div key={step.id}>
                      {step.status === 'completed' ? (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Document verification completed by AI agent.</strong> 
                            {step.score && ` Score: ${step.score}%`}
                            {step.completedAt && ` • Completed: ${new Date(step.completedAt).toLocaleString('en-IN')}`}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription>
                            Document verification is pending. AI agents will automatically process uploaded documents.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                
                {(() => {
                  const details = getVerificationStepDetails('documents');
                  if (!details) return null;
                  
                  return (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {details.requiredDocuments.map((doc: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">{doc.type}</h4>
                              <Badge className="bg-green-100 text-green-800">{doc.status}</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-sm text-gray-600">Document</div>
                                <div className="font-medium">{doc.document}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Authenticity</div>
                                <Badge className="bg-green-100 text-green-800">{doc.authenticity}</Badge>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Quality</div>
                                <Badge className="bg-green-100 text-green-800">{doc.quality}</Badge>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Readability</div>
                                <span className="text-sm font-medium text-green-600">{doc.readability}%</span>
                              </div>
                              {doc.employer && (
                                <div className="col-span-2">
                                  <div className="text-sm text-gray-600">Employer</div>
                                  <div className="font-medium">{doc.employer}</div>
                                </div>
                              )}
                              {doc.bankName && (
                                <div className="col-span-2">
                                  <div className="text-sm text-gray-600">Bank</div>
                                  <div className="font-medium">{doc.bankName} - {doc.accountType}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Validation Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Document Quality</span>
                              <Badge className="bg-green-100 text-green-800">{details.validation.documentQuality}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Authenticity Check</span>
                              <Badge className="bg-green-100 text-green-800">{details.validation.authenticity}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Information Match</span>
                              <Badge className="bg-green-100 text-green-800">{details.validation.informationMatch}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Format Compliance</span>
                              <Badge className="bg-green-100 text-green-800">{details.validation.formatCompliance}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Cross-Document Validation</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Name Consistency</span>
                              <Badge className="bg-green-100 text-green-800">{details.additionalChecks.nameConsistency}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Address Consistency</span>
                              <Badge className="bg-green-100 text-green-800">{details.additionalChecks.addressConsistency}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Date Consistency</span>
                              <Badge className="bg-green-100 text-green-800">{details.additionalChecks.dateConsistency}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Signature Match</span>
                              <Badge className="bg-green-100 text-green-800">{details.additionalChecks.signatureMatch}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis Summary</CardTitle>
              <CardDescription>
                AI-powered analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingState.verificationSteps
                  .filter(step => step.id === 'scoring')
                  .map(step => (
                    <div key={step.id}>
                      {step.status === 'completed' ? (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Risk analysis completed by AI agent.</strong> 
                            {step.score && ` Score: ${step.score}%`}
                            {step.completedAt && ` • Completed: ${new Date(step.completedAt).toLocaleString('en-IN')}`}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <Calculator className="h-4 w-4" />
                          <AlertDescription>
                            Risk analysis is pending. AI agents will process credit and fraud assessment automatically.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                
                {(() => {
                  const details = getVerificationStepDetails('scoring');
                  if (!details) return null;
                  
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Credit Assessment
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Credit Score</span>
                              <span className="text-sm font-medium text-green-600">{details.creditAssessment.creditScore}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Income Stability</span>
                              <Badge className="bg-green-100 text-green-800">{details.creditAssessment.incomeStability}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Debt-to-Income</span>
                              <span className="text-sm font-medium">{details.creditAssessment.debtToIncome}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Payment History</span>
                              <Badge className="bg-green-100 text-green-800">{details.creditAssessment.paymentHistory}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Employment Tenure</span>
                              <span className="text-sm font-medium">{details.creditAssessment.employmentTenure}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Fraud Detection
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Identity Verification</span>
                              <Badge className="bg-green-100 text-green-800">{details.fraudDetection.identityVerification}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Document Authenticity</span>
                              <Badge className="bg-green-100 text-green-800">{details.fraudDetection.documentAuthenticity}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Behavioral Pattern</span>
                              <Badge className="bg-green-100 text-green-800">{details.fraudDetection.behavioralPattern}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Risk Score</span>
                              <span className="text-sm font-medium text-red-600">{details.fraudDetection.riskScore}/100</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Blacklist Check</span>
                              <Badge className="bg-green-100 text-green-800">{details.fraudDetection.blacklistCheck}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Financial Analysis
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Monthly Income</div>
                            <div className="font-medium">₹{details.financialAnalysis.monthlyIncome.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Fixed Expenses</div>
                            <div className="font-medium">₹{details.financialAnalysis.fixedExpenses.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Savings Rate</div>
                            <div className="font-medium">{details.financialAnalysis.savingsRate}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Net Worth</div>
                            <div className="font-medium">₹{(details.financialAnalysis.netWorth / 100000).toFixed(1)}L</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          AI Recommendation
                        </h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center md:text-left">
                              <div className="text-sm text-blue-600 mb-1">Decision</div>
                              <Badge className={details.recommendation.decision === 'Approve' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {details.recommendation.decision}
                              </Badge>
                            </div>
                            <div className="text-center md:text-left">
                              <div className="text-sm text-blue-600 mb-1">Confidence</div>
                              <div className="font-medium text-blue-800">{details.recommendation.confidence}%</div>
                            </div>
                            <div className="text-center md:text-left">
                              <div className="text-sm text-blue-600 mb-1">Recommended Amount</div>
                              <div className="font-medium text-blue-800">₹{details.recommendation.recommendedAmount.toLocaleString('en-IN')}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center md:text-left">
                              <div className="text-sm text-blue-600 mb-1">Interest Rate</div>
                              <div className="font-medium text-blue-800">{details.recommendation.interestRate}% per annum</div>
                            </div>
                            <div className="text-center md:text-left">
                              <div className="text-sm text-blue-600 mb-1">Tenure</div>
                              <div className="font-medium text-blue-800">{details.recommendation.tenure}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Positive Factors
                          </h5>
                          <ul className="space-y-1">
                            {details.riskFactors.positive.map((factor: string, index: number) => (
                              <li key={index} className="text-sm text-green-600">• {factor}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium text-yellow-700 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Neutral Factors
                          </h5>
                          <ul className="space-y-1">
                            {details.riskFactors.neutral.map((factor: string, index: number) => (
                              <li key={index} className="text-sm text-yellow-600">• {factor}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Risk Factors
                          </h5>
                          {details.riskFactors.negative.length === 0 ? (
                            <p className="text-sm text-gray-500">No significant risk factors identified</p>
                          ) : (
                            <ul className="space-y-1">
                              {details.riskFactors.negative.map((factor: string, index: number) => (
                                <li key={index} className="text-sm text-red-600">• {factor}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>
                Track the progress of verification steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingState.verificationSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.status === 'completed';
                  const isInProgress = step.status === 'in-progress';
                  const isLast = index === processingState.verificationSteps.length - 1;
                  
                  return (
                    <div key={step.id} className="relative flex gap-4">
                      {/* Timeline line */}
                      {!isLast && (
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      {/* Step indicator */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : 
                        isInProgress ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : isInProgress ? (
                          <Clock className="w-4 h-4 text-white" />
                        ) : (
                          <Icon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.completedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Completed: {new Date(step.completedAt).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {step.score && (
                              <Badge className="bg-green-100 text-green-800">
                                {step.score}%
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const getTabValue = (stepId: string) => {
                                  switch (stepId) {
                                    case 'image-match': return 'image-verification';
                                    case 'kyc': return 'kyc';
                                    case 'documents': return 'documents';
                                    case 'scoring': return 'analysis';
                                    default: return 'overview';
                                  }
                                };
                                setActiveTab(getTabValue(step.id));
                              }}
                              className="gap-2"
                            >
                              {isCompleted ? <Eye className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                              {isCompleted ? 'Review' : 'View'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}