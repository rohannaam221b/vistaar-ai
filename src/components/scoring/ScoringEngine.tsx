import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import {
  Calculator,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Brain,
  Target,
  Zap,
  FileSearch,
  UserCheck,
  CreditCard,
  Building,
  Gauge
} from 'lucide-react';

interface ScoringEngineProps {
  application: any;
  onNavigate: (page: string, application?: any) => void;
}

interface ScoreComponent {
  id: string;
  name: string;
  category: string;
  weight: number;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'average' | 'poor' | 'failed';
  factors: {
    positive: string[];
    negative: string[];
  };
  icon: React.ElementType;
}

interface FraudIndicator {
  id: string;
  type: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  confidence: number;
  evidence: string[];
  recommendation: string;
}

interface ScoringResult {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  decision: 'approve' | 'reject' | 'review';
  confidence: number;
  components: ScoreComponent[];
  fraudIndicators: FraudIndicator[];
  aiAnalysis: {
    completeness: number;
    authenticity: number;
    consistency: number;
    riskAssessment: number;
  };
}

export function ScoringEngine({ application, onNavigate }: ScoringEngineProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scoringResult, setScoringResult] = useState<ScoringResult>({
    overallScore: 78,
    riskLevel: 'medium',
    decision: 'review',
    confidence: 84,
    components: [
      {
        id: 'identity',
        name: 'Identity Verification',
        category: 'verification',
        weight: 25,
        score: 92,
        maxScore: 100,
        status: 'excellent',
        factors: {
          positive: ['All identity documents verified', 'Face match confidence 96%', 'Government database match'],
          negative: []
        },
        icon: UserCheck
      },
      {
        id: 'financial',
        name: 'Financial Assessment',
        category: 'financial',
        weight: 30,
        score: 75,
        maxScore: 100,
        status: 'good',
        factors: {
          positive: ['Regular salary credits', 'Good banking behavior', 'ITR filed regularly'],
          negative: ['Income variance detected', 'Some financial documents incomplete']
        },
        icon: CreditCard
      },
      {
        id: 'documents',
        name: 'Document Completeness',
        category: 'compliance',
        weight: 20,
        score: 68,
        maxScore: 100,
        status: 'average',
        factors: {
          positive: ['Core documents submitted', 'Most documents AI-verified'],
          negative: ['Missing business premises photos', 'Some address mismatches', 'Form 16 not submitted']
        },
        icon: FileSearch
      },
      {
        id: 'business',
        name: 'Business Verification',
        category: 'business',
        weight: 25,
        score: 72,
        maxScore: 100,
        status: 'good',
        factors: {
          positive: ['Valid shop license', 'Shop signage matches license', 'GST registration active'],
          negative: ['Limited business history', 'No partnership documentation']
        },
        icon: Building
      }
    ],
    fraudIndicators: [
      {
        id: 'doc_quality',
        type: 'low',
        category: 'Document Analysis',
        description: 'Minor image quality variations detected in uploaded documents',
        confidence: 65,
        evidence: ['Slight resolution differences', 'Different scanning devices used'],
        recommendation: 'Review document originals during physical verification'
      },
      {
        id: 'address_mismatch',
        type: 'medium',
        category: 'Address Verification',
        description: 'Address format inconsistencies across different documents',
        confidence: 78,
        evidence: ['Aadhaar: Plot 123, Sector 45, Gurgaon, Haryana', 'Utility Bill: 123 Sector 45, Gurgaon HR'],
        recommendation: 'Conduct physical address verification'
      }
    ],
    aiAnalysis: {
      completeness: 85,
      authenticity: 88,
      consistency: 72,
      riskAssessment: 76
    }
  });

  const calculateOverallScore = () => {
    const weightedScore = scoringResult.components.reduce((acc, component) => {
      return acc + (component.score * component.weight / 100);
    }, 0);
    return Math.round(weightedScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'average': return <Gauge className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <TrendingDown className="w-4 h-4 text-orange-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFraudTypeColor = (type: string) => {
    switch (type) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const processApplication = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update scores with final analysis
    setScoringResult(prev => ({
      ...prev,
      overallScore: calculateOverallScore(),
      confidence: 87
    }));
    
    setIsProcessing(false);
  };

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
          <p className="text-gray-500 mb-4">Please select an application to begin scoring analysis.</p>
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
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1>AI Risk Assessment & Scoring</h1>
            <p className="text-muted-foreground">
              {application.applicantName} • Comprehensive application analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate('documents', application)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Documents
          </Button>
          <Button onClick={() => onNavigate('processing', application)} className="gap-2">
            Complete Processing
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Application Risk Score</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getRiskColor(scoringResult.riskLevel)}>
                {scoringResult.riskLevel.toUpperCase()} RISK
              </Badge>
              <Badge variant="outline">
                {scoringResult.confidence}% Confidence
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {scoringResult.overallScore}
              </div>
              <p className="text-sm text-blue-700 mb-3">Overall Score</p>
              <Badge className={scoringResult.overallScore >= 80 ? 'bg-green-100 text-green-800' : 
                               scoringResult.overallScore >= 65 ? 'bg-yellow-100 text-yellow-800' : 
                               'bg-red-100 text-red-800'}>
                {scoringResult.decision === 'approve' ? 'Approve' :
                 scoringResult.decision === 'reject' ? 'Reject' : 'Review Required'}
              </Badge>
            </div>

            {/* AI Analysis Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completeness</span>
                  <div className="flex items-center gap-2">
                    <Progress value={scoringResult.aiAnalysis.completeness} className="w-16 h-2" />
                    <span className="text-sm font-medium">{scoringResult.aiAnalysis.completeness}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Authenticity</span>
                  <div className="flex items-center gap-2">
                    <Progress value={scoringResult.aiAnalysis.authenticity} className="w-16 h-2" />
                    <span className="text-sm font-medium">{scoringResult.aiAnalysis.authenticity}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consistency</span>
                  <div className="flex items-center gap-2">
                    <Progress value={scoringResult.aiAnalysis.consistency} className="w-16 h-2" />
                    <span className="text-sm font-medium">{scoringResult.aiAnalysis.consistency}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Indicators */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Risk Indicators
              </h4>
              <div className="space-y-2">
                {scoringResult.fraudIndicators.map((indicator) => (
                  <div key={indicator.id} className={`p-2 rounded border ${getFraudTypeColor(indicator.type)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{indicator.category}</span>
                      <Badge variant="outline" size="sm">
                        {indicator.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={processApplication}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Zap className="w-4 h-4 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Reprocess
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Score Breakdown</TabsTrigger>
          <TabsTrigger value="fraud-detection">Fraud Detection</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="final-decision">Final Decision</TabsTrigger>
        </TabsList>

        {/* Score Breakdown Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="space-y-4">
            {scoringResult.components.map((component) => {
              const Icon = component.icon;
              const percentage = (component.score / component.maxScore) * 100;
              
              return (
                <Card key={component.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-500" />
                        <div>
                          <CardTitle className="text-base">{component.name}</CardTitle>
                          <CardDescription>Weight: {component.weight}%</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(component.status)}
                        <Badge variant="outline" className={getScoreColor(component.score)}>
                          {component.score}/{component.maxScore}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={percentage} className="mb-4" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Positive Factors */}
                      <div>
                        <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Positive Factors
                        </h5>
                        <ul className="space-y-1">
                          {component.factors.positive.map((factor, idx) => (
                            <li key={idx} className="text-sm text-green-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Negative Factors */}
                      <div>
                        <h5 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Areas of Concern
                        </h5>
                        <ul className="space-y-1">
                          {component.factors.negative.map((factor, idx) => (
                            <li key={idx} className="text-sm text-red-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              {factor}
                            </li>
                          ))}
                          {component.factors.negative.length === 0 && (
                            <li className="text-sm text-gray-500 italic">No significant concerns identified</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Fraud Detection Tab */}
        <TabsContent value="fraud-detection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Potential Fraud Indicators
              </CardTitle>
              <CardDescription>
                AI-powered analysis of document authenticity and data consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoringResult.fraudIndicators.map((indicator) => (
                  <div key={indicator.id} className={`p-4 rounded-lg border ${getFraudTypeColor(indicator.type)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{indicator.category}</h4>
                        <p className="text-sm mt-1">{indicator.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {indicator.confidence}% Confidence
                        </Badge>
                        <Badge className={indicator.type === 'high' ? 'bg-red-100 text-red-800' :
                                       indicator.type === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                       'bg-blue-100 text-blue-800'}>
                          {indicator.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-2">Evidence:</h5>
                      <ul className="space-y-1">
                        {indicator.evidence.map((evidence, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></span>
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Recommendation:</strong> {indicator.recommendation}
                      </AlertDescription>
                    </Alert>
                  </div>
                ))}

                {scoringResult.fraudIndicators.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-medium text-green-700 mb-2">No Fraud Indicators Detected</h3>
                    <p className="text-green-600">All documents and data appear authentic and consistent.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Officer Recommendations</CardTitle>
              <CardDescription>
                Suggested actions based on AI analysis and risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* High Priority Actions */}
                <div>
                  <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    High Priority Actions
                  </h4>
                  <div className="space-y-3">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Physical Address Verification:</strong> Conduct on-site verification due to address format inconsistencies across documents.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Missing Documents:</strong> Collect Form 16 and business premises photographs before final approval.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* Medium Priority Actions */}
                <div>
                  <h4 className="font-medium text-yellow-700 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Recommended Verification
                  </h4>
                  <div className="space-y-3">
                    <Alert>
                      <Eye className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Income Verification:</strong> Cross-verify income with bank statements and employer records.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Eye className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Business Verification:</strong> Visit business premises to verify operational status and legitimacy.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* Low Priority Actions */}
                <div>
                  <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Additional Checks
                  </h4>
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Reference Check:</strong> Contact provided references to verify applicant's character and background.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Credit Bureau Check:</strong> Review credit history and existing loan obligations.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final Decision Tab */}
        <TabsContent value="final-decision" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Final Decision Summary</CardTitle>
              <CardDescription>
                Complete analysis summary and recommended decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Decision Summary */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-6xl font-bold text-yellow-600 mb-2">
                      {scoringResult.overallScore}
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
                      REVIEW REQUIRED
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{scoringResult.confidence}%</div>
                      <p className="text-sm text-gray-600">AI Confidence</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{scoringResult.riskLevel.toUpperCase()}</div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{scoringResult.fraudIndicators.length}</div>
                      <p className="text-sm text-gray-600">Issues Found</p>
                    </div>
                  </div>
                </div>

                {/* Decision Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2 border-green-200 hover:bg-green-50">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span>Approve with Conditions</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2 border-yellow-200 hover:bg-yellow-50">
                    <Eye className="w-6 h-6 text-yellow-600" />
                    <span>Send for Review</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2 border-red-200 hover:bg-red-50">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <span>Reject Application</span>
                  </Button>
                </div>

                <Separator />

                {/* Application Summary */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Application Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applicant:</span>
                        <span>{application.applicantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan Type:</span>
                        <span>{application.loanType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span>₹{application.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Time:</span>
                        <span>2.5 hours</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Next Steps</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Schedule physical verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Collect missing documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Senior review required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Final decision within 48 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}