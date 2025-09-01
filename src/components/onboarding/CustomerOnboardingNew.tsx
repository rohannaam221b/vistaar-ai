import React, { useState, useEffect, useMemo } from 'react';
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

  // Rest of the functionality remains the same as in the original component...
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
        state: 'karnataka'
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
        const personalFields = ['firstName', 'lastName', 'phoneNumber', 'email', 'dateOfBirth', 'currentAddress', 'pincode', 'city'];
        personalFields.forEach(field => {
          const error = validateField(field, customerData[field as keyof CustomerData] as string);
          if (error) errors[field] = error;
        });
        
        // Validate dropdown fields separately
        if (!customerData.gender || !customerData.gender.trim()) {
          errors.gender = 'Gender is required';
        }
        if (!customerData.state || !customerData.state.trim()) {
          errors.state = 'State is required';
        }
        
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
    if (currentStepIndex < steps.length - 1) {
      if (validateCurrentStep()) {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmitApplication = async () => {
    // Validate before submitting
    if (!validateCurrentStep()) {
      return;
    }
    
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

  // Memoized validation state to prevent infinite loops
  const isCurrentStepValid = useMemo(() => {
    try {
      const errors: ValidationErrors = {};
      
      switch (currentStepIndex) {
        case 0: // Document Upload - no validation required
          return true;
          
        case 1: // Combined Application Form
          // Personal Information validation
          const personalFields = ['firstName', 'lastName', 'phoneNumber', 'email', 'dateOfBirth', 'currentAddress', 'pincode', 'city'];
          personalFields.forEach(field => {
            const error = validateField(field, customerData[field as keyof CustomerData] as string);
            if (error) errors[field] = error;
          });
          
          // Validate dropdown fields separately
          if (!customerData.gender || !customerData.gender.trim()) {
            errors.gender = 'Gender is required';
          }
          if (!customerData.state || !customerData.state.trim()) {
            errors.state = 'State is required';
          }
          
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
          
          return Object.keys(errors).length === 0;
          
        case 2: // Verification
          if (!customerData.consentDataProcessing) {
            errors.consentDataProcessing = 'Data processing consent is required';
          }
          if (!customerData.consentCreditCheck) {
            errors.consentCreditCheck = 'Credit check consent is required';
          }
          
          return Object.keys(errors).length === 0;
          
        default:
          return true;
      }
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, [currentStepIndex, customerData]);

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
              </div>

              <div className="flex items-center gap-3">
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
                    <p className={`text-xs ${
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
      <StepContent
        currentStepIndex={currentStepIndex}
        customerData={customerData}
        validationErrors={validationErrors}
        isAutoPopulating={isAutoPopulating}
        aiProcessingState={aiProcessingState}
        onInputChange={handleInputChange}
        onFileUpload={handleFileUpload}
        onFormUpload={handleFormUpload}
        DocumentUploadBox={DocumentUploadBox}
        ApplicationFormUpload={ApplicationFormUpload}
      />

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
              {currentStepIndex < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  disabled={!isCurrentStepValid}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting || !isCurrentStepValid}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}