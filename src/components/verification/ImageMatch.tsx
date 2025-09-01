import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import {
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  User,
  FileText,
  Eye,
  Download,
  Scan,
  Search,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Zap,
  Target,
  ImageIcon,
  Store
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ImageMatchProps {
  application: any;
  onNavigate: (page: string, application?: any) => void;
}

interface MatchResult {
  score: number;
  status: 'excellent' | 'good' | 'poor' | 'failed';
  confidence: number;
  issues: string[];
}

interface FaceMatchData {
  documentImage: string | null;
  capturedImage: string | null;
  matchResult: MatchResult | null;
  analysisComplete: boolean;
}

interface DocumentAnalysis {
  documentType: string;
  extractedData: Record<string, any>;
  confidence: number;
  issues: string[];
  shopSignageData?: {
    shopName: string;
    address: string;
    matchConfidence: number;
  };
}

export function ImageMatch({ application, onNavigate }: ImageMatchProps) {
  const [activeTab, setActiveTab] = useState('face-match');
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceMatchData, setFaceMatchData] = useState<FaceMatchData>({
    documentImage: null,
    capturedImage: null,
    matchResult: null,
    analysisComplete: false
  });
  
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysis[]>([
    {
      documentType: 'Aadhaar Card',
      extractedData: {
        name: 'Rajesh Kumar',
        aadhaarNumber: '2345-6789-0123',
        dob: '15/08/1985',
        address: 'Plot 123, Sector 45, Gurgaon, Haryana'
      },
      confidence: 94,
      issues: []
    },
    {
      documentType: 'Shop License',
      extractedData: {
        shopName: 'Kumar Electronics',
        licenseNumber: 'SL/GGN/2023/12345',
        ownerName: 'Rajesh Kumar',
        address: 'Shop 15, Main Market, Sector 45, Gurgaon'
      },
      confidence: 89,
      issues: ['Address mismatch with Aadhaar'],
      shopSignageData: {
        shopName: 'Kumar Electronics',
        address: 'Main Market, Sector 45',
        matchConfidence: 92
      }
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Simulate face matching analysis
  const performFaceMatch = useCallback(async () => {
    if (!faceMatchData.documentImage || !faceMatchData.capturedImage) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate face match result
    const mockResult: MatchResult = {
      score: 92,
      status: 'excellent',
      confidence: 96,
      issues: []
    };
    
    setFaceMatchData(prev => ({
      ...prev,
      matchResult: mockResult,
      analysisComplete: true
    }));
    
    setIsProcessing(false);
  }, [faceMatchData.documentImage, faceMatchData.capturedImage]);

  const handleImageUpload = (type: 'document' | 'captured', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setFaceMatchData(prev => ({
        ...prev,
        [type === 'document' ? 'documentImage' : 'capturedImage']: imageUrl,
        matchResult: null,
        analysisComplete: false
      }));
    };
    reader.readAsDataURL(file);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent Match</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good Match</Badge>;
      case 'poor':
        return <Badge className="bg-yellow-100 text-yellow-800">Poor Match</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const overallProgress = () => {
    let completed = 0;
    if (faceMatchData.analysisComplete) completed += 50;
    if (documentAnalysis.length > 0) completed += 50;
    return completed;
  };

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
          <p className="text-gray-500 mb-4">Please select an application to begin image verification.</p>
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1>Image Verification & Analysis</h1>
            <p className="text-muted-foreground">
              {application.applicantName} • Face matching and document data extraction
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate('processing', application)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Processing
          </Button>
          <Button onClick={() => onNavigate('kyc', application)} className="gap-2">
            Continue to KYC
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Verification Progress</CardTitle>
            <Badge variant="outline" className={getScoreColor(overallProgress())}>
              {overallProgress()}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress()} className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                faceMatchData.analysisComplete ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium">Face Matching</p>
                <p className="text-sm text-muted-foreground">
                  {faceMatchData.analysisComplete ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                documentAnalysis.length > 0 ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium">Document Analysis</p>
                <p className="text-sm text-muted-foreground">
                  {documentAnalysis.length} documents processed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="face-match">Face Matching</TabsTrigger>
          <TabsTrigger value="document-analysis">Document Analysis</TabsTrigger>
          <TabsTrigger value="shop-verification">Shop Verification</TabsTrigger>
        </TabsList>

        {/* Face Matching Tab */}
        <TabsContent value="face-match" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Images
                </CardTitle>
                <CardDescription>
                  Upload document photo and captured selfie for face matching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Image */}
                <div className="space-y-3">
                  <Label>Document Photo (ID/Passport)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {faceMatchData.documentImage ? (
                      <div className="space-y-3">
                        <ImageWithFallback
                          src={faceMatchData.documentImage}
                          alt="Document"
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Document Photo
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to upload
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('document', file);
                    }}
                  />
                </div>

                {/* Captured Image */}
                <div className="space-y-3">
                  <Label>Live Captured Photo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {faceMatchData.capturedImage ? (
                      <div className="space-y-3">
                        <ImageWithFallback
                          src={faceMatchData.capturedImage}
                          alt="Captured"
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cameraInputRef.current?.click()}
                        >
                          Retake Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <Button
                            variant="outline"
                            onClick={() => cameraInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Camera className="w-4 h-4" />
                            Capture Photo
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Take a live photo for verification
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('captured', file);
                    }}
                  />
                </div>

                {/* Analysis Button */}
                <Button
                  onClick={performFaceMatch}
                  disabled={!faceMatchData.documentImage || !faceMatchData.capturedImage || isProcessing}
                  className="w-full gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Images...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      Start Face Matching Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Face Match Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!faceMatchData.analysisComplete ? (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">Analysis Pending</h3>
                    <p className="text-gray-500">
                      Upload both images and click "Start Analysis" to begin face matching
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {faceMatchData.matchResult?.score}%
                      </div>
                      <div className="mb-3">
                        {faceMatchData.matchResult && getStatusBadge(faceMatchData.matchResult.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {faceMatchData.matchResult?.confidence}%
                      </p>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Facial Features Match</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          98%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Identity Verification</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          95%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Liveness Detection</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          93%
                        </Badge>
                      </div>
                    </div>

                    {/* Issues */}
                    {faceMatchData.matchResult?.issues && faceMatchData.matchResult.issues.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="list-disc list-inside">
                            {faceMatchData.matchResult.issues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Document Analysis Tab */}
        <TabsContent value="document-analysis" className="space-y-6">
          <div className="space-y-6">
            {documentAnalysis.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {doc.documentType}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getScoreColor(doc.confidence)}>
                        {doc.confidence}% Confidence
                      </Badge>
                      {doc.issues.length === 0 ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {doc.issues.length} Issue(s)
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Extracted Data */}
                    <div>
                      <h4 className="font-medium mb-3">Extracted Information</h4>
                      <div className="space-y-3">
                        {Object.entries(doc.extractedData).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Results */}
                    <div>
                      <h4 className="font-medium mb-3">Analysis Results</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">AI Text Recognition: Active</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Search className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Data Validation: Complete</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Target className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Format Check: Passed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  {doc.issues.length > 0 && (
                    <div className="mt-6">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-medium mb-2">Issues Found:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {doc.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm">{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shop Verification Tab */}
        <TabsContent value="shop-verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Shop Signage Verification
              </CardTitle>
              <CardDescription>
                Compare shop signage with license information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* License Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">License Information</h4>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Shop Name:</span>
                      <span className="text-sm font-medium">Kumar Electronics</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">License No:</span>
                      <span className="text-sm font-medium">SL/GGN/2023/12345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Owner:</span>
                      <span className="text-sm font-medium">Rajesh Kumar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Address:</span>
                      <span className="text-sm font-medium">Shop 15, Main Market, Sector 45</span>
                    </div>
                  </div>
                </div>

                {/* Shop Signage Analysis */}
                <div className="space-y-4">
                  <h4 className="font-medium">Signage Analysis</h4>
                  <div className="p-4 bg-green-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Shop Name Match</span>
                      <Badge className="bg-green-100 text-green-800">92%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Location Verification</span>
                      <Badge className="bg-green-100 text-green-800">89%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Match</span>
                      <Badge className="bg-green-100 text-green-800">90%</Badge>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Shop signage matches license information. Physical verification recommended for final approval.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}