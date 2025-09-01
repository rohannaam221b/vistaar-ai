import React, { useState, useEffect } from 'react';
import { LoginFlow } from './components/auth/LoginFlow';
import { Dashboard } from './components/dashboard/Dashboard';
import { ApplicationsQueue } from './components/applications/ApplicationsQueue';
import { ApplicationProcessing } from './components/applications/ApplicationProcessing';

import { Analytics } from './components/analytics/Analytics';
import { Settings } from './components/settings/Settings';
import { CustomerOnboarding } from './components/onboarding/CustomerOnboardingNew';
import { CustomerPortal } from './components/onboarding/CustomerPortal';
import { Chatbot } from './components/chat/Chatbot';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { Breadcrumbs } from './components/layout/Breadcrumbs';

type Page = 'login' | 'dashboard' | 'applications' | 'processing' | 'analytics' | 'settings' | 'customer-onboarding' | 'customer-portal';

interface User {
  id: string;
  name: string;
  role: 'loan_officer' | 'admin';
  email: string;
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'review';
  score?: number;
  completedAt?: string;
  aiAgent?: string;
  details?: any;
}

interface Application {
  id: string;
  applicantName: string;
  loanType: string;
  amount: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  score?: number;
  submittedAt: string;
  verificationSteps?: VerificationStep[];
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
  customerData?: any;
}

// Authentication storage keys
const AUTH_STORAGE_KEY = 'vistaar_auth_user';
const PAGE_STORAGE_KEY = 'vistaar_current_page';
const SELECTED_APP_STORAGE_KEY = 'vistaar_selected_application';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      applicantName: 'Rajesh Kumar',
      loanType: 'Personal Loan',
      amount: 250000,
      status: 'pending',
      submittedAt: '2025-01-07T10:30:00Z'
    },
    {
      id: '2',
      applicantName: 'Priya Sharma',
      loanType: 'Business Loan',
      amount: 500000,
      status: 'processing',
      score: 85,
      submittedAt: '2025-01-07T09:15:00Z'
    },
    {
      id: '3',
      applicantName: 'Amit Patel',
      loanType: 'Home Loan',
      amount: 2500000,
      status: 'completed',
      score: 72,
      submittedAt: '2025-01-06T16:45:00Z'
    }
  ]);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for stored user data
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        const storedPage = localStorage.getItem(PAGE_STORAGE_KEY);
        const storedSelectedApp = localStorage.getItem(SELECTED_APP_STORAGE_KEY);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Restore the current page if it's an authenticated page
          if (storedPage && storedPage !== 'login' && storedPage !== 'customer-portal') {
            setCurrentPage(storedPage as Page);
          } else {
            setCurrentPage('dashboard');
          }

          // Restore selected application if available
          if (storedSelectedApp) {
            const selectedAppData = JSON.parse(storedSelectedApp);
            setSelectedApplication(selectedAppData);
          }
        } else {
          // No stored auth, redirect to login
          setCurrentPage('login');
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
        // Clear potentially corrupted data
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(PAGE_STORAGE_KEY);
        localStorage.removeItem(SELECTED_APP_STORAGE_KEY);
        setCurrentPage('login');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Save current page to localStorage (except for login and customer portal)
  useEffect(() => {
    if (user && currentPage !== 'login' && currentPage !== 'customer-portal') {
      localStorage.setItem(PAGE_STORAGE_KEY, currentPage);
    }
  }, [currentPage, user]);

  // Save selected application to localStorage
  useEffect(() => {
    if (selectedApplication) {
      localStorage.setItem(SELECTED_APP_STORAGE_KEY, JSON.stringify(selectedApplication));
    } else {
      localStorage.removeItem(SELECTED_APP_STORAGE_KEY);
    }
  }, [selectedApplication]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setSelectedApplication(null);
    
    // Clear all stored authentication data
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(PAGE_STORAGE_KEY);
    localStorage.removeItem(SELECTED_APP_STORAGE_KEY);
  };

  const handleNavigate = (page: Page, application?: Application) => {
    setCurrentPage(page);
    if (application) {
      setSelectedApplication(application);
    }
  };

  const generateSampleVerificationData = (applicantName: string) => {
    const completedAt = new Date().toISOString();
    
    return [
      {
        id: 'image-match',
        title: 'Image Verification',
        description: 'Face matching and document image analysis',
        status: 'completed' as const,
        score: Math.floor(Math.random() * 8) + 92, // 92-100%
        completedAt,
        aiAgent: 'facematch',
        details: {
          faceMatch: {
            selfieQuality: 'Excellent',
            idPhotoQuality: 'Good',
            matchScore: 94.7,
            livenessDetection: 'Passed',
            confidenceLevel: 'High',
            biometricPoints: 847,
            faceDetectionAccuracy: 99.2,
            sampleImages: {
              selfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
              idPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&sat=-100&con=100'
            }
          },
          documentImages: {
            clarity: 'Clear',
            readability: 'Readable',
            tamperingCheck: 'No Issues',
            formatValidation: 'Valid',
            resolution: '2048x1536',
            colorCorrection: 'Applied',
            orientation: 'Correct'
          },
          processingMetrics: {
            processingTime: '2.3 seconds',
            algorithmVersion: 'FaceNet v3.2',
            qualityThreshold: 0.85,
            matchThreshold: 0.92
          }
        }
      },
      {
        id: 'kyc',
        title: 'KYC Verification',
        description: 'Identity and address verification',
        status: 'completed' as const,
        score: Math.floor(Math.random() * 12) + 88, // 88-100%
        completedAt,
        aiAgent: 'preprocessing',
        details: {
          identity: {
            nameMatch: 'Exact Match',
            dateOfBirth: '1985-03-15',
            idNumber: 'ABCDE1234F',
            governmentDatabase: 'Verified',
            panCard: 'ABCDE1234F',
            aadhaar: '****-****-5678',
            nameVariations: ['Rajesh Kumar', 'R Kumar'],
            fatherName: 'Suresh Kumar'
          },
          address: {
            currentAddress: {
              line1: '123, MG Road',
              line2: 'Koramangala',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560034',
              landmark: 'Near Metro Station',
              residenceType: 'Apartment',
              ownership: 'Rented'
            },
            verification: {
              addressMatch: 'Verified',
              pincodeValidation: 'Valid',
              utilityBillCheck: 'Verified',
              residenceProof: 'Confirmed',
              gpsCoordinates: '12.9352, 77.6245',
              neighbourhoodVerification: 'Positive'
            },
            additionalChecks: {
              electoralRoll: 'Found',
              propertyTax: 'Updated',
              localityRisk: 'Low',
              addressHistory: '3 years at current address'
            }
          }
        }
      },
      {
        id: 'documents',
        title: 'Document Completeness',
        description: 'Required document checklist and validation',
        status: 'completed' as const,
        score: Math.floor(Math.random() * 10) + 90, // 90-100%
        completedAt,
        aiAgent: 'document-verification',
        details: {
          requiredDocuments: [
            {
              type: 'Government ID Proof',
              document: 'PAN Card',
              status: 'Verified',
              uploadedAt: '2025-01-07T10:32:00Z',
              authenticity: 'Genuine',
              quality: 'Excellent',
              readability: 100,
              securityFeatures: 'Present'
            },
            {
              type: 'Address Proof',
              document: 'Utility Bill (Electricity)',
              status: 'Verified',
              uploadedAt: '2025-01-07T10:33:00Z',
              authenticity: 'Genuine',
              quality: 'Good',
              readability: 95,
              issueDate: '2024-12-15',
              validityCheck: 'Current'
            },
            {
              type: 'Income Proof',
              document: 'Salary Slips (3 months)',
              status: 'Verified',
              uploadedAt: '2025-01-07T10:34:00Z',
              authenticity: 'Genuine',
              quality: 'Excellent',
              readability: 98,
              employer: 'TechCorp Solutions Pvt Ltd',
              grossSalary: 85000,
              netSalary: 72000
            },
            {
              type: 'Bank Statements',
              document: 'Bank Statement (6 months)',
              status: 'Verified',
              uploadedAt: '2025-01-07T10:35:00Z',
              authenticity: 'Genuine',
              quality: 'Good',
              readability: 92,
              bankName: 'HDFC Bank',
              accountType: 'Savings',
              averageBalance: 145000,
              salaryCredits: 'Regular'
            }
          ],
          validation: {
            documentQuality: 'Excellent',
            authenticity: 'Verified',
            informationMatch: 'Matched',
            formatCompliance: 'Valid',
            digitalSignatures: 'Verified',
            watermarks: 'Detected',
            metadataCheck: 'Clean'
          },
          additionalChecks: {
            crossDocumentValidation: 'Consistent',
            nameConsistency: 'Perfect Match',
            addressConsistency: 'Verified',
            dateConsistency: 'Valid',
            signatureMatch: 'Verified'
          }
        }
      },
      {
        id: 'scoring',
        title: 'Risk Assessment',
        description: 'AI-powered fraud detection and scoring',
        status: 'completed' as const,
        score: Math.floor(Math.random() * 18) + 78, // 78-95%
        completedAt,
        aiAgent: 'credit-analysis',
        details: {
          creditAssessment: {
            creditScore: 850,
            creditBureau: 'CIBIL',
            lastUpdated: '2024-12-20',
            creditHistory: '7 years',
            activeLoans: 1,
            creditUtilization: 32,
            paymentHistory: 'Excellent',
            incomeStability: 'High',
            debtToIncome: 32.5,
            employmentTenure: '4.5 years',
            monthlyIncome: 85000,
            monthlyObligations: 27625
          },
          fraudDetection: {
            identityVerification: 'Verified',
            documentAuthenticity: 'Genuine',
            behavioralPattern: 'Normal',
            deviceFingerprint: 'Clean',
            ipGeolocation: 'Consistent',
            velocityChecks: 'Normal',
            duplicateApplication: 'None',
            blacklistCheck: 'Clear',
            syntheticIdentity: 'Negative',
            riskScore: 15 // Lower is better (0-100 scale)
          },
          financialAnalysis: {
            monthlyIncome: 85000,
            fixedExpenses: 45000,
            variableExpenses: 18000,
            savingsRate: 26,
            investmentPortfolio: 750000,
            liquidAssets: 200000,
            liabilities: 1200000,
            netWorth: 1850000,
            financialStability: 'High'
          },
          riskFactors: {
            positive: [
              'Excellent credit score',
              'Stable employment history',
              'Low debt-to-income ratio',
              'Regular savings pattern',
              'No adverse credit history'
            ],
            neutral: [
              'Single income source',
              'Moderate credit utilization'
            ],
            negative: []
          },
          recommendation: {
            decision: 'Approve',
            confidence: 94.2,
            maxLoanAmount: 2500000,
            recommendedAmount: 250000,
            interestRate: 10.5,
            tenure: '3 years',
            conditions: [
              'Standard documentation',
              'No additional collateral required'
            ]
          }
        }
      }
    ];
  };

  // Generate additional sample applications to simulate batch processing
  const generateBatchApplications = (baseApplication: Application) => {
    const sampleApplicants = [
      {
        name: 'Arjun Singh',
        loanType: 'Business Loan',
        amount: 750000,
        submittedHoursAgo: 0.25,
      },
      {
        name: 'Deepika Rani',
        loanType: 'Personal Loan',
        amount: 180000,
        submittedHoursAgo: 0.5,
      },
      {
        name: 'Vikram Reddy',
        loanType: 'Vehicle Loan',
        amount: 450000,
        submittedHoursAgo: 0.75,
      },
      {
        name: 'Sneha Joshi',
        loanType: 'Home Loan',
        amount: 3200000,
        submittedHoursAgo: 1,
      },
      {
        name: 'Rohit Malhotra',
        loanType: 'Education Loan',
        amount: 650000,
        submittedHoursAgo: 1.25,
      },
    ];

    return sampleApplicants.map((applicant, index) => {
      const submittedTime = new Date();
      submittedTime.setHours(submittedTime.getHours() - applicant.submittedHoursAgo);
      
      return {
        ...baseApplication,
        id: `${Date.now()}_${index + 1}`,
        applicantName: applicant.name,
        loanType: applicant.loanType,
        amount: applicant.amount,
        submittedAt: submittedTime.toISOString(),
        aiProcessing: {
          active: true,
          agents: [
            {
              id: 'preprocessing',
              name: 'Image Preprocessing Agent',
              task: 'Auto-Classification & Image Preprocessing',
              description: 'Identifies document types (ID, shop signage, utility bill, etc.). Ensures images are clear, properly aligned, and readable.',
              outcome: 'Clean, categorized image set for validation.',
              status: 'processing' as const,
              progress: 0,
              icon: 'ImageIcon'
            },
            {
              id: 'facematch',
              name: 'Face Match Agent',
              task: 'Face Match & ID Verification',
              description: 'Extracts faces from selfie and ID documents. Performs biometric match to verify authenticity.',
              outcome: 'Face match score and fraud alert (if mismatch).',
              status: 'pending' as const,
              progress: 0,
              icon: 'Scan'
            },
            {
              id: 'document-verification',
              name: 'Document Verification Agent',
              task: 'Document Authenticity Check',
              description: 'Validates document authenticity, checks for tampering, and verifies document information against government databases.',
              outcome: 'Document authenticity score and fraud detection.',
              status: 'pending' as const,
              progress: 0,
              icon: 'FileText'
            },
            {
              id: 'credit-analysis',
              name: 'Credit Analysis Agent',
              task: 'Credit Score & Risk Assessment',
              description: 'Analyzes credit history, income patterns, and financial behavior to assess loan repayment capability.',
              outcome: 'Credit risk score and loan recommendation.',
              status: 'pending' as const,
              progress: 0,
              icon: 'Calculator'
            }
          ]
        }
      };
    });
  };

  const handleApplicationSubmit = (application: Application) => {
    // Initialize AI processing for the original application
    const originalApplicationWithAI = {
      ...application,
      aiProcessing: {
        active: true,
        agents: [
          {
            id: 'preprocessing',
            name: 'Image Preprocessing Agent',
            task: 'Auto-Classification & Image Preprocessing',
            description: 'Identifies document types (ID, shop signage, utility bill, etc.). Ensures images are clear, properly aligned, and readable.',
            outcome: 'Clean, categorized image set for validation.',
            status: 'processing' as const,
            progress: 0,
            icon: 'ImageIcon'
          },
          {
            id: 'facematch',
            name: 'Face Match Agent',
            task: 'Face Match & ID Verification',
            description: 'Extracts faces from selfie and ID documents. Performs biometric match to verify authenticity.',
            outcome: 'Face match score and fraud alert (if mismatch).',
            status: 'pending' as const,
            progress: 0,
            icon: 'Scan'
          },
          {
            id: 'document-verification',
            name: 'Document Verification Agent',
            task: 'Document Authenticity Check',
            description: 'Validates document authenticity, checks for tampering, and verifies document information against government databases.',
            outcome: 'Document authenticity score and fraud detection.',
            status: 'pending' as const,
            progress: 0,
            icon: 'FileText'
          },
          {
            id: 'credit-analysis',
            name: 'Credit Analysis Agent',
            task: 'Credit Score & Risk Assessment',
            description: 'Analyzes credit history, income patterns, and financial behavior to assess loan repayment capability.',
            outcome: 'Credit risk score and loan recommendation.',
            status: 'pending' as const,
            progress: 0,
            icon: 'Calculator'
          }
        ]
      }
    };

    // Generate additional batch applications to simulate high-volume processing
    const batchApplications = generateBatchApplications(application);
    
    // Add all applications (original + batch) to the queue
    const allNewApplications = [originalApplicationWithAI, ...batchApplications];
    setApplications(prev => [...prev, ...allNewApplications]);
    
    // Start AI processing simulation for all applications with staggered timing
    allNewApplications.forEach((app, index) => {
      setTimeout(() => {
        startAIProcessingForApplication(app.id);
      }, index * 2000); // Start each application processing 2 seconds apart
    });
  };

  const startAIProcessingForApplication = (applicationId: string) => {
    // Simulate AI processing with realistic timings
    const updateAgent = (agentId: string, updates: Partial<any>) => {
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? {
              ...app,
              aiProcessing: {
                ...app.aiProcessing!,
                agents: app.aiProcessing!.agents.map(agent =>
                  agent.id === agentId ? { ...agent, ...updates } : agent
                )
              }
            }
          : app
      ));
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

    // Mark AI processing as complete and update verification steps - Change status to 'completed'
    setTimeout(() => {
      const application = applications.find(app => app.id === applicationId);
      const applicantName = application?.applicantName || 'Unknown';
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? {
              ...app,
              aiProcessing: {
                ...app.aiProcessing!,
                active: false
              },
              status: 'completed' as const, // Changed from 'review' to 'completed'
              score: Math.floor(Math.random() * 25) + 75, // Random score between 75-100
              verificationSteps: generateSampleVerificationData(applicantName)
            }
          : app
      ));
    }, 20000);
  };

  const getBreadcrumbs = () => {
    switch (currentPage) {
      case 'dashboard':
        return [{ label: 'Dashboard', href: '#' }];
      case 'applications':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Applications', href: '#' }
        ];
      case 'processing':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Applications', href: '#' },
          { label: selectedApplication ? `Processing - ${selectedApplication.applicantName}` : 'Processing', href: '#' }
        ];

      case 'analytics':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Analytics', href: '#' }
        ];
      case 'settings':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Settings', href: '#' }
        ];
      case 'customer-onboarding':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Applications', href: '#' },
          { label: 'Customer Onboarding', href: '#' }
        ];
      case 'customer-portal':
        return [{ label: 'Application Tracking', href: '#' }];
      default:
        return [];
    }
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case 'login':
        return <LoginFlow onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard user={user!} applications={applications} onNavigate={handleNavigate} />;
      case 'applications':
        return <ApplicationsQueue applications={applications} setApplications={setApplications} onNavigate={handleNavigate} />;
      case 'processing':
        // Find the latest version of the application from the applications array
        const latestApplication = applications.find(app => app.id === selectedApplication?.id) || selectedApplication;
        return <ApplicationProcessing application={latestApplication} onNavigate={handleNavigate} />;
      case 'analytics':
        return <Analytics user={user!} applications={applications} />;
      case 'settings':
        return <Settings user={user!} />;
      case 'customer-onboarding':
        return <CustomerOnboarding onApplicationSubmit={handleApplicationSubmit} onNavigate={handleNavigate} applications={applications} />;
      case 'customer-portal':
        return <CustomerPortal onNavigate={handleNavigate} />;
      default:
        return <Dashboard user={user!} applications={applications} onNavigate={handleNavigate} />;
    }
  };

  // Show loading screen while initializing authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Customer-facing pages that don't need the admin layout
  if (currentPage === 'login' || currentPage === 'customer-portal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {renderMainContent()}
      </div>
    );
  }

  // Redirect to login if user is not authenticated for admin pages
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoginFlow onLogin={handleLogin} onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="sidebar">
        <Sidebar currentPage={currentPage} userRole={user.role} onNavigate={handleNavigate} />
      </div>
      
      <div className="flex-1 flex flex-col ml-60">
        <div className="top-nav">
          <TopNav 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
        </div>
        
        <div className="flex-1 p-6 main-content">
          <div className="mb-6">
            <Breadcrumbs items={getBreadcrumbs()} />
          </div>
          
          <main className="max-w-7xl">
            {renderMainContent()}
          </main>
        </div>
      </div>

      {/* Chatbot for admin users */}
      <Chatbot userRole={user.role} />
    </div>
  );
}