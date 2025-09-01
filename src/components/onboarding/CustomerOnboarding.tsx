import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { CombinedFormSteps } from './CombinedFormSteps';
import { StepContent } from './StepContent';

import {
  User,
  FileText,
  Camera,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  Shield,
  AlertCircle,
  Clock,
  Send,
  Eye,
  Download,
  UserPlus,
  Brain,
  Cloud,
  File,
  Image,
  FileUp,
  Loader2,
  FormInput
} from 'lucide-react';

interface CustomerOnboardingProps {
  onApplicationSubmit: (application: any) => void;
  onNavigate: (page: string, application?: any) => void;
  applications: any[];
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  current: boolean;
}

interface CustomerData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  
  // Address Information
  currentAddress: string;
  permanentAddress: string;
  pincode: string;
  city: string;
  state: string;
  
  // Loan Information
  loanType: string;
  loanAmount: string;
  loanPurpose: string;
  employmentType: string;
  monthlyIncome: string;
  
  // Business Information (if applicable)
  businessName: string;
  businessType: string;
  businessAddress: string;
  yearlyTurnover: string;
  
  // Documents
  documents: {
    [key: string]: File | null;
  };
  
  // Application Form
  applicationForm: File | null;
  
  // Consent
  consentDataProcessing: boolean;
  consentCreditCheck: boolean;
  consentMarketing: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

interface AIProcessingState {
  active: boolean;
  agents: Array<{
    id: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
  }>;
  extractedData?: {
    personalInfo?: Partial<CustomerData>;
    loanDetails?: Partial<CustomerData>;
    employmentInfo?: Partial<CustomerData>;
  };
}

// Application Form Upload Component - Enhanced
const ApplicationFormUpload = ({ 
  file, 
  onFileSelect 
}: {
  file: File | null;
  onFileSelect: (file: File) => void;
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer text-center space-y-4 ${
        dragActive
          ? 'border-purple-500 bg-purple-100'
          : file
          ? 'border-green-500 bg-green-50'
          : 'border-purple-300 bg-purple-50/50 hover:border-purple-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('application-form-upload')?.click()}
    >
      <input
        id="application-form-upload"
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileInput}
      />

      {file ? (
        <>
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Form Uploaded Successfully</h4>
            <p className="text-sm text-green-600">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-100">
            <Upload className="w-4 h-4 mr-2" />
            Replace Form
          </Button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
            <FormInput className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium text-purple-800">Upload Application Form</h4>
            <p className="text-sm text-purple-600">Drag and drop your completed form or click to browse</p>
          </div>
          <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-100">
            <Cloud className="w-4 h-4 mr-2" />
            Select Form
          </Button>
          <p className="text-xs text-purple-500">
            Supported formats: PDF, DOC, DOCX (max 10MB)
          </p>
        </>
      )}
    </div>
  );
};

const DocumentUploadBox = ({ 
  documentType, 
  title, 
  description, 
  icon: IconComponent, 
  file, 
  onFileSelect, 
  required = false 
}: {
  documentType: string;
  title: string;
  description: string;
  icon: React.ElementType;
  file: File | null;
  onFileSelect: (file: File) => void;
  required?: boolean;
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
        file ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById(`file-${documentType}`)?.click()}
    >
      <input
        id={`file-${documentType}`}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileInput}
      />
      
      <div className="text-center space-y-3">
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
          file ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {file ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <IconComponent className="w-6 h-6 text-blue-600" />
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 flex items-center justify-center gap-2">
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <File className="w-4 h-4" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <div className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              <Upload className="w-4 h-4 mr-2" />
              Replace File
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="outline" size="sm">
              <Cloud className="w-4 h-4 mr-2" />
              Click to Upload
            </Button>
            <p className="text-xs text-gray-500">
              or drag and drop files here
            </p>
            <p className="text-xs text-gray-400">
              PDF, JPG, PNG up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export function CustomerOnboarding({ onApplicationSubmit, onNavigate, applications }: CustomerOnboardingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [aiProcessingState, setAiProcessingState] = useState<AIProcessingState | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);

  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    currentAddress: '',
    permanentAddress: '',
    pincode: '',
    city: '',
    state: '',
    loanType: '',
    loanAmount: '',
    loanPurpose: '',
    employmentType: '',
    monthlyIncome: '',
    businessName: '',
    businessType: '',
    businessAddress: '',
    yearlyTurnover: '',
    documents: {
      aadhaar: null,
      pan: null,
      salarySlips: null,
      bankStatements: null,
      photo: null,
      addressProof: null
    },
    applicationForm: null,
    consentDataProcessing: false,
    consentCreditCheck: false,
    consentMarketing: false
  });

  // Updated steps - Combined form approach
  const steps: OnboardingStep[] = [
    {
      id: 'documents',
      title: 'Document Upload',
      description: 'Upload documents and forms (optional)',
      icon: FileText,
      completed: false,
      current: currentStepIndex === 0
    },
    {
      id: 'application-form',
      title: 'Application Form',
      description: 'Complete your loan application details',
      icon: User,
      completed: false,
      current: currentStepIndex === 1
    },
    {
      id: 'verification',
      title: 'Verification & Consent',
      description: 'Review details and provide consent',
      icon: Shield,
      completed: false,
      current: currentStepIndex === 2
    }
  ];

  // Simulate AI processing when application is submitted
  useEffect(() => {
    if (applicationSubmitted && applicationId) {
      const initialState = {
        agents: [
          { id: 'preprocessing', name: 'Image Preprocessing Agent', status: 'processing', progress: 0 },
          { id: 'facematch', name: 'Face Match Agent', status: 'pending', progress: 0 },
          { id: 'document-verification', name: 'Document Verification Agent', status: 'pending', progress: 0 },
          { id: 'credit-analysis', name: 'Credit Analysis Agent', status: 'pending', progress: 0 }
        ]
      };
      setAiProcessingState(initialState);

      // Simulate AI processing progression
      const updateAgent = (agentId: string, updates: any) => {
        setAiProcessingState((prev: any) => ({
          ...prev,
          agents: prev.agents.map((agent: any) =>
            agent.id === agentId ? { ...agent, ...updates } : agent
          )
        }));
      };

      // Image Preprocessing Agent - 5 seconds
      setTimeout(() => updateAgent('preprocessing', { progress: 30 }), 1000);
      setTimeout(() => updateAgent('preprocessing', { progress: 65 }), 2500);
      setTimeout(() => updateAgent('preprocessing', { progress: 100, status: 'completed' }), 5000);

      // Face Match Agent - starts after preprocessing, takes 4 seconds
      setTimeout(() => updateAgent('facematch', { status: 'processing', progress: 20 }), 5000);
      setTimeout(() => updateAgent('facematch', { progress: 60 }), 7000);
      setTimeout(() => updateAgent('facematch', { progress: 100, status: 'completed' }), 9000);

      // Document Verification Agent - starts after face match, takes 6 seconds
      setTimeout(() => updateAgent('document-verification', { status: 'processing', progress: 15 }), 9000);
      setTimeout(() => updateAgent('document-verification', { progress: 45 }), 12000);
      setTimeout(() => updateAgent('document-verification', { progress: 80 }), 14000);
      setTimeout(() => updateAgent('document-verification', { progress: 100, status: 'completed' }), 15000);

      // Credit Analysis Agent - starts after document verification, takes 5 seconds
      setTimeout(() => updateAgent('credit-analysis', { status: 'processing', progress: 25 }), 15000);
      setTimeout(() => updateAgent('credit-analysis', { progress: 70 }), 17000);
      setTimeout(() => updateAgent('credit-analysis', { progress: 100, status: 'completed' }), 20000);
    }
  }, [applicationSubmitted, applicationId]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (documentType: string, file: File) => {
    setCustomerData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
    
    // Start AI processing immediately when document is uploaded
    startDocumentProcessing(documentType, file);
  };

  const startDocumentProcessing = async (documentType: string, file: File) => {
    // Initialize AI processing state
    const aiState: AIProcessingState = {
      active: true,
      agents: [
        { id: 'preprocessing', name: 'Document Analysis Agent', status: 'processing', progress: 0 },
        { id: 'extraction', name: 'Data Extraction Agent', status: 'pending', progress: 0 },
        { id: 'validation', name: 'Information Validation Agent', status: 'pending', progress: 0 }
      ]
    };
    
    setAiProcessingState(aiState);

    // Simulate AI processing with realistic progression
    const updateAgent = (agentId: string, updates: Partial<any>) => {
      setAiProcessingState(prev => prev ? {
        ...prev,
        agents: prev.agents.map(agent =>
          agent.id === agentId ? { ...agent, ...updates } : agent
        )
      } : null);
    };

    // Preprocessing Agent - 3 seconds
    setTimeout(() => updateAgent('preprocessing', { progress: 40 }), 800);
    setTimeout(() => updateAgent('preprocessing', { progress: 80 }), 1800);
    setTimeout(() => updateAgent('preprocessing', { progress: 100, status: 'completed' }), 3000);

    // Data Extraction Agent - starts after preprocessing, takes 4 seconds
    setTimeout(() => updateAgent('extraction', { status: 'processing', progress: 25 }), 3000);
    setTimeout(() => updateAgent('extraction', { progress: 60 }), 5000);
    setTimeout(() => updateAgent('extraction', { progress: 100, status: 'completed' }), 7000);

    // Validation Agent - starts after extraction, takes 2 seconds
    setTimeout(() => updateAgent('validation', { status: 'processing', progress: 50 }), 7000);
    setTimeout(() => updateAgent('validation', { progress: 100, status: 'completed' }), 9000);

    // Complete processing and auto-populate fields
    setTimeout(() => {
      const extractedData = simulateDataExtraction(documentType, file);
      setAiProcessingState(prev => prev ? { ...prev, active: false, extractedData } : null);
      autoPopulateFields(extractedData);
    }, 9000);
  };

  const simulateDataExtraction = (documentType: string, file: File) => {
    // Simulate extracted data based on document type
    const extractedData: any = {};
    
    if (documentType === 'aadhaar') {
      extractedData.personalInfo = {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        currentAddress: '123, MG Road, Koramangala, Bangalore, Karnataka',
        pincode: '560034',
        city: 'Bangalore',
        state: 'Karnataka'
      };
    } else if (documentType === 'pan') {
      extractedData.personalInfo = {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        dateOfBirth: '1985-03-15'
      };
    } else if (documentType === 'salarySlips') {
      extractedData.employmentInfo = {
        employmentType: 'salaried',
        monthlyIncome: '85000'
      };
    } else if (documentType === 'bankStatements') {
      extractedData.employmentInfo = {
        monthlyIncome: '85000'
      };
      extractedData.loanDetails = {
        loanAmount: '250000'
      };
    }

    return extractedData;
  };

  const autoPopulateFields = (extractedData: any) => {
    if (!extractedData) return;
    
    setIsAutoPopulating(true);
    
    // Merge extracted data with existing customer data
    setCustomerData(prev => ({
      ...prev,
      ...extractedData.personalInfo,
      ...extractedData.loanDetails,
      ...extractedData.employmentInfo
    }));

    // Show auto-population feedback
    setTimeout(() => {
      setIsAutoPopulating(false);
    }, 2000);
  };

  const handleFormUpload = (file: File) => {
    setCustomerData(prev => ({
      ...prev,
      applicationForm: file
    }));
  };

  const validateField = (fieldName: string, value: string): string | null => {
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return 'This field is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Only letters and spaces allowed';
        return null;
      
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[6-9]\d{9}$/.test(value.trim())) return 'Enter valid 10-digit mobile number';
        return null;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter valid email address';
        return null;
      
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18 || age > 100) return 'Age must be between 18 and 100 years';
        return null;
      
      case 'currentAddress':
        if (!value.trim()) return 'Current address is required';
        if (value.trim().length < 10) return 'Address must be at least 10 characters';
        return null;
      
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (!/^\d{6}$/.test(value.trim())) return 'Enter valid 6-digit pincode';
        return null;
      
      case 'city':
      case 'state':
        if (!value.trim()) return 'This field is required';
        return null;
      
      case 'loanAmount':
        if (!value.trim()) return 'Loan amount is required';
        const amount = parseFloat(value);
        if (isNaN(amount) || amount < 10000) return 'Minimum loan amount is ₹10,000';
        if (amount > 10000000) return 'Maximum loan amount is ₹1,00,00,000';
        return null;
      
      case 'monthlyIncome':
        if (!value.trim()) return 'Monthly income is required';
        const income = parseFloat(value);
        if (isNaN(income) || income < 10000) return 'Minimum monthly income is ₹10,000';
        return null;
      
      default:
        return null;
    }
  };

  const validateCurrentStep = () => {
    const errors: ValidationErrors = {};
    
    switch (currentStepIndex) {
      case 0: // Document Upload - no validation required
        return true;
        
      case 1: // Combined Application Form
        // Personal Information validation
        const personalFields = ['firstName', 'lastName', 'phoneNumber', 'email', 'dateOfBirth', 'gender', 'currentAddress', 'pincode', 'city', 'state'];
        personalFields.forEach(field => {
          const error = validateField(field, customerData[field as keyof CustomerData] as string);
          if (error) errors[field] = error;
        });
        
        // Loan Details validation
        const loanFields = ['loanType', 'loanAmount', 'loanPurpose'];
        loanFields.forEach(field => {
          const value = customerData[field as keyof CustomerData] as string;
          if (!value || !value.trim()) {
            errors[field] = 'This field is required';
          } else if (field === 'loanAmount') {
            const error = validateField(field, value);
            if (error) errors[field] = error;
          }
        });
        
        // Employment validation
        const employmentFields = ['employmentType', 'monthlyIncome'];
        employmentFields.forEach(field => {
          const value = customerData[field as keyof CustomerData] as string;
          if (!value || !value.trim()) {
            errors[field] = 'This field is required';
          } else if (field === 'monthlyIncome') {
            const error = validateField(field, value);
            if (error) errors[field] = error;
          }
        });
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
        
      case 2: // Verification
        if (!customerData.consentDataProcessing) {
          errors.consentDataProcessing = 'Data processing consent is required';
        }
        if (!customerData.consentCreditCheck) {
          errors.consentCreditCheck = 'Credit check consent is required';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    
    // Simulate application submission
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate application ID
    const newApplicationId = `VAPP${Date.now().toString().slice(-6)}`;
    setApplicationId(newApplicationId);
    
    // Create application object
    const applicationData = {
      id: newApplicationId,
      applicantName: `${customerData.firstName} ${customerData.lastName}`,
      loanType: customerData.loanType,
      amount: parseInt(customerData.loanAmount),
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
      customerData: customerData
    };
    
    // Submit to parent component
    onApplicationSubmit(applicationData);
    
    setApplicationSubmitted(true);
    setIsSubmitting(false);
  };

  if (applicationSubmitted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Application Submitted Successfully!</h1>
            <p className="text-gray-600">The customer's loan application has been processed and added to your queue</p>
          </div>
          <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="font-medium text-green-800 mb-2">Application ID</h3>
                <div className="text-xl font-bold text-green-700">{applicationId}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Applicant:</span>
                  <p className="font-medium">{customerData.firstName} {customerData.lastName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Loan Type:</span>
                  <p className="font-medium">{customerData.loanType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">₹{parseInt(customerData.loanAmount || '0').toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Processing Status */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Brain className="w-5 h-5" />
                AI Processing Live Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-3">
                  <strong>Automated verification in progress:</strong> Our AI agents are actively processing 
                  the customer's documents and information.
                </p>
                
                {aiProcessingState && (
                  <div className="space-y-3">
                    {aiProcessingState.agents.map((agent: any) => (
                      <div key={agent.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              agent.status === 'completed' ? 'bg-green-500' :
                              agent.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                              'bg-gray-300'
                            }`}></div>
                            <span className="text-sm font-medium">{agent.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {agent.status === 'processing' ? 'PROCESSING' :
                               agent.status === 'completed' ? 'COMPLETED' : 'PENDING'}
                            </Badge>
                          </div>
                          <span className={`text-sm font-bold ${
                            agent.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {agent.progress}%
                          </span>
                        </div>
                        {agent.status !== 'completed' && (
                          <Progress 
                            value={agent.progress} 
                            className="w-full h-2 [&>div]:bg-green-500" 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => onNavigate('applications')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View in Applications Queue
                </Button>
                <Button 
                  onClick={() => {
                    const newApplication = applications.find(app => app.id === applicationId);
                    if (newApplication) {
                      onNavigate('processing', newApplication);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Start Processing
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </Button>
                <Button 
                  onClick={() => {
                    setApplicationSubmitted(false);
                    setCurrentStepIndex(0);
                    setAiProcessingState(null);
                    setCustomerData({
                      firstName: '',
                      lastName: '',
                      dateOfBirth: '',
                      gender: '',
                      phoneNumber: '',
                      email: '',
                      currentAddress: '',
                      permanentAddress: '',
                      pincode: '',
                      city: '',
                      state: '',
                      loanType: '',
                      loanAmount: '',
                      loanPurpose: '',
                      employmentType: '',
                      monthlyIncome: '',
                      businessName: '',
                      businessType: '',
                      businessAddress: '',
                      yearlyTurnover: '',
                      documents: {
                        aadhaar: null,
                        pan: null,
                        salarySlips: null,
                        bankStatements: null,
                        photo: null,
                        addressProof: null
                      },
                      applicationForm: null,
                      consentDataProcessing: false,
                      consentCreditCheck: false,
                      consentMarketing: false
                    });
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  New Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Onboarding</h1>
        <p className="text-gray-600">Help customers complete their loan application step by step</p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-8">
          <div className="relative">
            {/* Progress Line Background */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 rounded-full"></div>
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-700 ease-in-out"
              style={{ 
                width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% + ${currentStepIndex === 0 ? '0px' : '12px'})` 
              }}
            ></div>
            
            {/* Steps */}
            <div className="relative flex justify-between items-start">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center max-w-[180px]">
                  {/* Step Circle */}
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-300 shadow-lg ${
                    index === currentStepIndex 
                      ? 'border-blue-500 bg-blue-500 text-white shadow-blue-200 scale-110' 
                      : index < currentStepIndex 
                      ? 'border-green-500 bg-green-500 text-white shadow-green-200'
                      : 'border-gray-300 bg-white text-gray-400 shadow-gray-100'
                  }`}>
                    {/* Animated pulse for current step */}
                    {index === currentStepIndex && (
                      <div className="absolute inset-0 w-12 h-12 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                    )}
                    
                    {index < currentStepIndex ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                    
                    {/* Step Number Badge */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${
                      index === currentStepIndex 
                        ? 'bg-blue-600 text-white' 
                        : index < currentStepIndex 
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Step Info */}
                  <div className="mt-4 text-center">
                    <h4 className={`text-sm font-semibold mb-1 ${
                      index === currentStepIndex 
                        ? 'text-blue-700' 
                        : index < currentStepIndex 
                        ? 'text-green-700'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs leading-tight ${
                      index === currentStepIndex 
                        ? 'text-blue-600' 
                        : index < currentStepIndex 
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Document Upload */}
          {currentStepIndex === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Document Upload</h3>
                <p className="text-gray-600">Please upload all required documents and forms</p>
              </div>

              <div className="mb-6">
                <ApplicationFormUpload
                  file={customerData.applicationForm}
                  onFileSelect={handleFormUpload}
                />
                
                {customerData.applicationForm && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Application form uploaded successfully. Our team will review the form and may contact you for any additional information required.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocumentUploadBox
                  documentType="aadhaar"
                  title="Aadhaar Card"
                  description="Government issued ID proof"
                  icon={FileText}
                  file={customerData.documents.aadhaar}
                  onFileSelect={(file) => handleFileUpload('aadhaar', file)}
                  required={true}
                />
                
                <DocumentUploadBox
                  documentType="pan"
                  title="PAN Card"
                  description="Permanent Account Number card"
                  icon={CreditCard}
                  file={customerData.documents.pan}
                  onFileSelect={(file) => handleFileUpload('pan', file)}
                  required={true}
                />
                
                <DocumentUploadBox
                  documentType="photo"
                  title="Passport Photo"
                  description="Recent passport size photograph"
                  icon={Camera}
                  file={customerData.documents.photo}
                  onFileSelect={(file) => handleFileUpload('photo', file)}
                  required={true}
                />
                
                <DocumentUploadBox
                  documentType="addressProof"
                  title="Address Proof"
                  description="Utility bill or rental agreement"
                  icon={MapPin}
                  file={customerData.documents.addressProof}
                  onFileSelect={(file) => handleFileUpload('addressProof', file)}
                />
                
                <DocumentUploadBox
                  documentType="salarySlips"
                  title="Salary Slips"
                  description="Last 3 months salary slips"
                  icon={Building}
                  file={customerData.documents.salarySlips}
                  onFileSelect={(file) => handleFileUpload('salarySlips', file)}
                />
                
                <DocumentUploadBox
                  documentType="bankStatements"
                  title="Bank Statements"
                  description="Last 6 months bank statements"
                  icon={FileText}
                  file={customerData.documents.bankStatements}
                  onFileSelect={(file) => handleFileUpload('bankStatements', file)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStepIndex === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600">Please provide your basic details and contact information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName"
                    value={customerData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName"
                    value={customerData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth"
                    type="date"
                    value={customerData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={customerData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input 
                    id="phoneNumber"
                    value={customerData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="currentAddress">Current Address *</Label>
                  <Textarea 
                    id="currentAddress"
                    value={customerData.currentAddress}
                    onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                    placeholder="Enter your current address"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea 
                    id="permanentAddress"
                    value={customerData.permanentAddress}
                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                    placeholder="Enter your permanent address (if different from current)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input 
                    id="pincode"
                    value={customerData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Enter PIN code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    value={customerData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state"
                    value={customerData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Loan Requirements */}
          {currentStepIndex === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Loan Requirements</h3>
                <p className="text-gray-600">Tell us about your loan requirements</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type *</Label>
                  <Select value={customerData.loanType} onValueChange={(value) => handleInputChange('loanType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Business Loan">Business Loan</SelectItem>
                      <SelectItem value="Home Loan">Home Loan</SelectItem>
                      <SelectItem value="Education Loan">Education Loan</SelectItem>
                      <SelectItem value="Vehicle Loan">Vehicle Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                  <Input 
                    id="loanAmount"
                    type="number"
                    value={customerData.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    placeholder="Enter loan amount"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                  <Textarea 
                    id="loanPurpose"
                    value={customerData.loanPurpose}
                    onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                    placeholder="Describe the purpose of the loan"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Employment & Income */}
          {currentStepIndex === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Employment & Income</h3>
                <p className="text-gray-600">Provide your employment and financial details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select value={customerData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaried">Salaried</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Business Owner">Business Owner</SelectItem>
                      <SelectItem value="Freelancer">Freelancer</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                  <Input 
                    id="monthlyIncome"
                    type="number"
                    value={customerData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    placeholder="Enter monthly income"
                    required
                  />
                </div>

                {customerData.employmentType === 'Self-Employed' || customerData.employmentType === 'Business Owner' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName"
                        value={customerData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Enter business name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input 
                        id="businessType"
                        value={customerData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        placeholder="Enter business type"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Textarea 
                        id="businessAddress"
                        value={customerData.businessAddress}
                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                        placeholder="Enter business address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearlyTurnover">Yearly Turnover (₹)</Label>
                      <Input 
                        id="yearlyTurnover"
                        type="number"
                        value={customerData.yearlyTurnover}
                        onChange={(e) => handleInputChange('yearlyTurnover', e.target.value)}
                        placeholder="Enter yearly turnover"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Step 5: Verification & Consent */}
          {currentStepIndex === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verification & Consent</h3>
                <p className="text-gray-600">Review your information and provide necessary consents</p>
              </div>

              {/* Application Summary */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Applicant Name:</span>
                      <p className="font-medium">{customerData.firstName} {customerData.lastName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{customerData.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{customerData.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loan Type:</span>
                      <p className="font-medium">{customerData.loanType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loan Amount:</span>
                      <p className="font-medium">₹{parseInt(customerData.loanAmount || '0').toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Monthly Income:</span>
                      <p className="font-medium">₹{parseInt(customerData.monthlyIncome || '0').toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consent Checkboxes */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Required Consents</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="consentDataProcessing"
                      checked={customerData.consentDataProcessing}
                      onCheckedChange={(checked) => handleInputChange('consentDataProcessing', checked)}
                    />
                    <Label htmlFor="consentDataProcessing" className="text-sm leading-relaxed">
                      I consent to the processing of my personal data for loan application purposes. I understand that my information will be used to assess my creditworthiness and may be shared with authorized credit agencies and partners. *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="consentCreditCheck"
                      checked={customerData.consentCreditCheck}
                      onCheckedChange={(checked) => handleInputChange('consentCreditCheck', checked)}
                    />
                    <Label htmlFor="consentCreditCheck" className="text-sm leading-relaxed">
                      I authorize Vistaar Finance to conduct credit checks and verify my information with relevant authorities and institutions. *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="consentMarketing"
                      checked={customerData.consentMarketing}
                      onCheckedChange={(checked) => handleInputChange('consentMarketing', checked)}
                    />
                    <Label htmlFor="consentMarketing" className="text-sm leading-relaxed">
                      I consent to receiving marketing communications and updates about Vistaar Finance products and services.
                    </Label>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  By submitting this application, you confirm that all information provided is accurate and complete. Any false information may result in rejection of your application.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              {currentStepIndex > 0 && (
                <Button 
                  onClick={handlePrevious}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!validateCurrentStep() && (
                <Alert className="inline-flex items-center px-3 py-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Please complete all required fields to continue</span>
                </Alert>
              )}

              {currentStepIndex < steps.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitApplication}
                  disabled={!validateCurrentStep() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}