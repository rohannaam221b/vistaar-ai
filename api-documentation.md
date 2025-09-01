# Vistaar Finance - Loan Quality Check System API Documentation

## Overview
The Vistaar Finance Loan Quality Check System is a comprehensive, multi-step, multi-page GenAI-powered solution for automated loan application processing. It features role-based access control, AI-powered document verification, real-time processing pipelines, and advanced analytics for high-volume loan processing environments.

## Base URL
```
Production: https://api.vistaar.finance/v1
Staging: https://staging-api.vistaar.finance/v1
Development: http://localhost:3001/api/v1
```

## Authentication
All API requests require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## System Features
- **Multi-Agent AI Processing Pipeline**: 4 specialized AI agents for comprehensive verification
- **Batch Application Processing**: Supports high-volume application intake with staggered processing
- **Real-time Status Updates**: Live progress tracking across all verification stages
- **Role-based Access Control**: Loan Officer and Admin roles with granular permissions
- **Customer Portal Integration**: Self-service application tracking and document submission
- **Comprehensive Analytics**: Real-time KPIs, fraud detection metrics, and performance monitoring
- **Document Verification**: AI-powered authenticity checks with confidence scoring
- **Face Matching Technology**: Biometric verification with liveness detection
- **Credit Risk Assessment**: Automated scoring with bureau integration
- **Audit Trail**: Complete application lifecycle tracking for compliance

---

## 📋 API Quick Reference

### 🔐 Authentication & User Management
- `POST /auth/login` - Authenticate user credentials with role-based access
- `POST /auth/refresh` - Refresh authentication token
- `POST /auth/logout` - Logout user and invalidate token
- `GET /auth/me` - Get current user information and permissions

### 📄 Applications Management
- `GET /applications` - Get paginated list of loan applications with advanced filtering
- `GET /applications/:id` - Get specific application details with verification steps
- `POST /applications` - Create new loan application (supports batch processing)
- `POST /applications/batch` - Submit multiple applications simultaneously
- `PUT /applications/:id/status` - Update application status with reviewer comments
- `DELETE /applications/:id` - Archive application (Admin only)
- `GET /applications/:id/history` - Get complete application timeline
- `POST /applications/:id/assign` - Assign application to loan officer
- `GET /applications/queue` - Get applications queue with Kanban/List view support
- `PUT /applications/:id/priority` - Update application priority

### 🤖 AI Processing & Verification Pipeline
- `POST /ai/start-processing` - Initiate multi-agent AI processing pipeline
- `POST /ai/batch-processing` - Start batch processing for multiple applications
- `GET /ai/processing-status/:applicationId` - Get real-time processing status
- `GET /ai/agent-status/:applicationId/:agentId` - Get specific agent status
- `GET /ai/processing-results/:applicationId` - Get comprehensive processing results
- `POST /ai/reprocess` - Reprocess application with updated parameters
- `GET /ai/models/status` - Get AI models status and versions
- `POST /ai/processing/cancel/:applicationId` - Cancel ongoing AI processing
- `GET /ai/pipeline/metrics` - Get processing pipeline performance metrics
- `POST /ai/agents/config` - Update agent configuration (Admin only)

### 📁 Document Management & Processing
- `POST /documents/upload` - Upload documents with auto-classification
- `POST /documents/bulk-upload` - Upload multiple documents with batch processing
- `GET /documents/:applicationId` - Get all documents with verification status
- `GET /documents/:documentId/download` - Download document with access logging
- `DELETE /documents/:documentId` - Archive document with audit trail
- `PUT /documents/:documentId/metadata` - Update document metadata
- `GET /documents/:documentId/preview` - Get document preview/thumbnail
- `POST /documents/auto-extract` - Auto-extract data from uploaded documents
- `GET /documents/requirements/:loanType` - Get required documents for loan type
- `POST /documents/validate` - Validate document completeness

### 🔍 Advanced Image Verification
- `POST /verification/image-match` - AI-powered face matching with confidence scoring
- `GET /verification/image-match/:applicationId` - Get detailed image verification results
- `POST /verification/image-quality-check` - Comprehensive image quality assessment
- `POST /verification/liveness-detection` - Advanced liveness detection with anti-spoofing
- `GET /verification/biometric-data/:applicationId` - Get complete biometric analysis
- `POST /verification/image-preprocessing` - Auto-classification and image enhancement
- `GET /verification/face-match/history/:applicationId` - Get face matching history
- `POST /verification/image-compare` - Compare multiple images for consistency

### 🛡️ Comprehensive KYC Verification
- `POST /verification/kyc` - Full KYC verification pipeline
- `GET /verification/kyc/:applicationId` - Get complete KYC verification results
- `POST /verification/kyc/pan-verification` - PAN card verification with government DB
- `POST /verification/kyc/aadhar-verification` - Aadhar verification with OTP validation
- `POST /verification/kyc/address-verification` - Multi-source address verification
- `GET /verification/kyc/government-check/:applicationId` - Government database verification status
- `POST /verification/kyc/name-matching` - Cross-document name consistency check
- `GET /verification/kyc/risk-profile/:applicationId` - Get KYC risk assessment
- `POST /verification/kyc/manual-review` - Submit for manual KYC review

### 📊 Advanced Credit Scoring & Risk Assessment
- `POST /scoring/credit-check` - Comprehensive credit score analysis
- `GET /scoring/credit-report/:applicationId` - Detailed credit report with bureau data
- `POST /scoring/fraud-detection` - Multi-layered fraud detection algorithms
- `GET /scoring/risk-matrix/:applicationId` - Complete risk analysis with factors
- `POST /scoring/manual-override` - Manual credit score override with justification
- `GET /scoring/bureau-data/:applicationId` - Credit bureau data with history
- `POST /scoring/financial-analysis` - AI-powered financial stability assessment
- `GET /scoring/recommendation/:applicationId` - Get loan approval recommendation
- `POST /scoring/stress-test` - Stress test loan repayment capability

### 📈 Comprehensive Analytics & Business Intelligence
- `GET /analytics/dashboard` - Real-time dashboard with KPIs and trends
- `GET /analytics/applications-summary` - Applications statistics with drill-down
- `GET /analytics/processing-metrics` - AI processing performance analytics
- `GET /analytics/fraud-alerts` - Fraud detection alerts and patterns
- `GET /analytics/loan-officer-performance` - Individual and team performance metrics
- `GET /analytics/processing-pipeline` - Pipeline efficiency and bottleneck analysis
- `GET /analytics/verification-accuracy` - AI verification accuracy metrics
- `GET /analytics/turnaround-time` - Processing time analysis by loan type
- `GET /analytics/approval-rates` - Approval/rejection rate trends
- `GET /analytics/risk-distribution` - Risk score distribution analysis
- `POST /analytics/custom-report` - Generate custom analytics report
- `GET /analytics/export/applications` - Export applications data with filters
- `GET /analytics/export/processing-logs` - Export detailed processing logs
- `GET /analytics/export/performance` - Export performance metrics
- `POST /analytics/predictive-analysis` - Predictive analytics for loan performance

### ⚙️ Settings & Configuration
- `GET /settings/user` - Get user settings
- `PUT /settings/user` - Update user settings
- `GET /settings/system` - Get system configuration (Admin only)
- `PUT /settings/system` - Update system configuration (Admin only)
- `GET /settings/ai-models` - Get AI models configuration
- `PUT /settings/ai-models` - Update AI models configuration
- `GET /settings/thresholds` - Get scoring thresholds
- `PUT /settings/thresholds` - Update scoring thresholds

### 👥 Enhanced Customer Portal APIs
- `GET /customer/application/:trackingId` - Real-time application status tracking
- `POST /customer/applications` - Submit new loan application with auto-processing
- `POST /customer/documents/upload` - Document upload with instant AI processing
- `GET /customer/documents/:trackingId` - Get documents with verification status
- `PUT /customer/application/:trackingId/update` - Update application information
- `POST /customer/support/ticket` - Create support ticket with priority routing
- `GET /customer/support/tickets/:trackingId` - Get support tickets and responses
- `GET /customer/verification-status/:trackingId` - Get verification step progress
- `POST /customer/additional-info` - Submit additional information requests
- `GET /customer/loan-calculator` - Loan EMI calculator with real-time rates
- `POST /customer/pre-approval` - Quick pre-approval assessment

### 🔔 Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/mark-all-read` - Mark all notifications as read
- `POST /notifications/send` - Send notification (System use)
- `DELETE /notifications/:id` - Delete notification
- `GET /notifications/preferences` - Get notification preferences
- `PUT /notifications/preferences` - Update notification preferences

### 📋 Audit & Logging
- `GET /audit/logs` - Get audit logs (Admin only)
- `POST /audit/log` - Create audit log entry (System use)
- `GET /audit/user-activity/:userId` - Get user activity logs
- `GET /audit/application-trail/:applicationId` - Get application audit trail
- `POST /audit/compliance-report` - Generate compliance report
- `GET /audit/security-events` - Get security events log

### 🏢 Organization Management
- `GET /organization/users` - Get organization users (Admin only)
- `POST /organization/users` - Create new user (Admin only)
- `PUT /organization/users/:id` - Update user details (Admin only)
- `DELETE /organization/users/:id` - Deactivate user (Admin only)
- `GET /organization/roles` - Get available roles
- `PUT /organization/users/:id/role` - Update user role (Admin only)
- `GET /organization/departments` - Get departments
- `POST /organization/departments` - Create department (Admin only)

### 📤 File Management
- `POST /files/upload` - Upload file to temporary storage
- `GET /files/:fileId` - Get file metadata
- `DELETE /files/:fileId` - Delete file
- `POST /files/scan` - Scan file for malware
- `GET /files/storage-stats` - Get storage usage statistics

### 🔧 System Health & Advanced Monitoring
- `GET /health` - Basic health check with response time
- `GET /health/detailed` - Comprehensive system health with component status
- `GET /health/ai-services` - AI services health and model status
- `GET /metrics` - Real-time system metrics and performance indicators
- `GET /metrics/processing-queue` - Queue depth and processing capacity
- `GET /version` - API version and feature information
- `POST /maintenance/toggle` - Toggle maintenance mode with notification
- `GET /monitoring/alerts` - Active system alerts and warnings
- `POST /monitoring/test-alert` - Test alert system functionality

---

## 📖 Detailed API Specifications

### 1. Authentication & User Management

#### POST /auth/login
**Description:** Authenticate user credentials
```json
{
  "method": "POST",
  "endpoint": "/auth/login",
  "body": {
    "email": "user@vistaar.finance",
    "password": "password123",
    "role": "loan_officer | admin"
  },
  "response": {
    "success": true,
    "data": {
      "user": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@vistaar.finance",
        "role": "loan_officer",
        "permissions": ["view_applications", "process_loans"],
        "department": "Mumbai Branch",
        "lastLogin": "2025-01-07T10:30:00Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh_token_here",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/refresh
**Description:** Refresh authentication token
```json
{
  "method": "POST",
  "endpoint": "/auth/refresh",
  "body": {
    "refreshToken": "refresh_token_here"
  },
  "response": {
    "success": true,
    "data": {
      "token": "new_jwt_token_here",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/logout
**Description:** Logout user and invalidate token
```json
{
  "method": "POST",
  "endpoint": "/auth/logout",
  "headers": {
    "Authorization": "Bearer <token>"
  },
  "response": {
    "success": true,
    "message": "Successfully logged out"
  }
}
```

#### GET /auth/me
**Description:** Get current user information
```json
{
  "method": "GET",
  "endpoint": "/auth/me",
  "response": {
    "success": true,
    "data": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@vistaar.finance",
      "role": "loan_officer",
      "permissions": ["view_applications", "process_loans"],
      "department": "Mumbai Branch",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  }
}
```

---

### 2. Applications Management

#### GET /applications
**Description:** Get paginated list of loan applications
```json
{
  "method": "GET",
  "endpoint": "/applications",
  "query": {
    "page": 1,
    "limit": 20,
    "status": "pending | processing | approved | rejected | completed",
    "search": "applicant_name",
    "sortBy": "submittedAt",
    "sortOrder": "desc",
    "assignedTo": "user_id",
    "dateFrom": "2025-01-01",
    "dateTo": "2025-01-31",
    "loanType": "personal | business | home"
  },
  "response": {
    "success": true,
    "data": {
      "applications": [
        {
          "id": "app_123",
          "applicantName": "Rajesh Kumar",
          "loanType": "Personal Loan",
          "amount": 250000,
          "status": "pending",
          "score": null,
          "submittedAt": "2025-01-07T10:30:00Z",
          "assignedTo": {
            "id": "user_456",
            "name": "John Doe"
          },
          "priority": "normal"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "pages": 8
      },
      "summary": {
        "totalPending": 45,
        "totalProcessing": 23,
        "totalCompleted": 82
      }
    }
  }
}
```

#### GET /applications/:id
**Description:** Get specific application details
```json
{
  "method": "GET",
  "endpoint": "/applications/{application_id}",
  "response": {
    "success": true,
    "data": {
      "id": "app_123",
      "applicantName": "Rajesh Kumar",
      "loanType": "Personal Loan",
      "amount": 250000,
      "status": "completed",
      "score": 85,
      "submittedAt": "2025-01-07T10:30:00Z",
      "completedAt": "2025-01-07T11:45:00Z",
      "customerData": {
        "personalInfo": {
          "firstName": "Rajesh",
          "lastName": "Kumar",
          "dateOfBirth": "1985-03-15",
          "gender": "Male",
          "maritalStatus": "Married"
        },
        "contactInfo": {
          "email": "rajesh@email.com",
          "phone": "+91-9876543210"
        }
      },
      "verificationSteps": [],
      "documents": [],
      "timeline": [],
      "assignedTo": {
        "id": "user_456",
        "name": "John Doe"
      }
    }
  }
}
```

#### POST /applications
**Description:** Create new loan application with automatic batch processing
```json
{
  "method": "POST",
  "endpoint": "/applications",
  "body": {
    "applicantName": "Rajesh Kumar",
    "loanType": "Personal Loan",
    "amount": 250000,
    "priority": "normal | high | urgent",
    "autoProcessing": true,
    "batchMode": false,
    "customerData": {
      "personalInfo": {
        "firstName": "Rajesh",
        "lastName": "Kumar",
        "dateOfBirth": "1985-03-15",
        "gender": "Male",
        "maritalStatus": "Married",
        "nationality": "Indian"
      },
      "contactInfo": {
        "email": "rajesh@email.com",
        "phone": "+91-9876543210",
        "alternatePhone": "+91-9876543211"
      },
      "addressInfo": {
        "currentAddress": {
          "line1": "123, MG Road",
          "line2": "Koramangala",
          "city": "Bangalore",
          "state": "Karnataka",
          "pincode": "560034",
          "landmark": "Near Metro Station",
          "residenceType": "Apartment",
          "ownership": "Rented"
        },
        "permanentAddress": {
          "sameAsCurrent": true
        }
      },
      "employmentInfo": {
        "employmentType": "Salaried",
        "employer": "TechCorp Solutions",
        "designation": "Software Engineer",
        "experience": "5 years",
        "monthlyIncome": 85000,
        "workLocation": "Bangalore",
        "employmentTenure": "4.5 years"
      },
      "financialInfo": {
        "bankAccount": {
          "bankName": "HDFC Bank",
          "accountNumber": "1234567890",
          "ifscCode": "HDFC0001234",
          "accountType": "Savings"
        },
        "existingLoans": [],
        "creditCards": [],
        "monthlyObligations": 27625,
        "savingsRate": 26
      }
    }
  },
  "response": {
    "success": true,
    "data": {
      "applications": [
        {
          "id": "app_124",
          "trackingId": "VF2025010001",
          "status": "pending",
          "submittedAt": "2025-01-07T10:30:00Z",
          "applicantName": "Rajesh Kumar"
        }
      ],
      "batchInfo": {
        "totalApplications": 6,
        "batchId": "batch_20250107_001",
        "processingStarted": true,
        "estimatedCompletionTime": "2025-01-07T10:32:00Z"
      },
      "processing": {
        "aiProcessingInitiated": true,
        "agentsPipeline": [
          {
            "id": "preprocessing",
            "name": "Image Preprocessing Agent",
            "status": "queued",
            "estimatedDuration": "5 seconds"
          },
          {
            "id": "facematch",
            "name": "Face Match Agent",
            "status": "pending",
            "estimatedDuration": "4 seconds"
          },
          {
            "id": "document-verification",
            "name": "Document Verification Agent",
            "status": "pending",
            "estimatedDuration": "6 seconds"
          },
          {
            "id": "credit-analysis",
            "name": "Credit Analysis Agent",
            "status": "pending",
            "estimatedDuration": "5 seconds"
          }
        ]
      }
    }
  }
}
```

#### POST /applications/batch
**Description:** Submit multiple applications simultaneously for batch processing
```json
{
  "method": "POST",
  "endpoint": "/applications/batch",
  "body": {
    "applications": [
      {
        "applicantName": "Rajesh Kumar",
        "loanType": "Personal Loan",
        "amount": 250000,
        "customerData": {}
      },
      {
        "applicantName": "Priya Sharma",
        "loanType": "Business Loan",
        "amount": 500000,
        "customerData": {}
      }
    ],
    "batchOptions": {
      "processingMode": "parallel | sequential",
      "priority": "normal | high",
      "staggerDelay": 2000,
      "autoAssign": true
    }
  },
  "response": {
    "success": true,
    "data": {
      "batchId": "batch_20250107_002",
      "applications": [
        {
          "id": "app_125",
          "trackingId": "VF2025010002",
          "applicantName": "Rajesh Kumar"
        },
        {
          "id": "app_126",
          "trackingId": "VF2025010003",
          "applicantName": "Priya Sharma"
        }
      ],
      "processing": {
        "totalApplications": 2,
        "processingStarted": true,
        "estimatedTotalTime": "45 seconds",
        "batchStatus": "processing"
      }
    }
  }
}
```

#### PUT /applications/:id/status
**Description:** Update application status
```json
{
  "method": "PUT",
  "endpoint": "/applications/{application_id}/status",
  "body": {
    "status": "approved | rejected | review | processing",
    "reason": "Approval reason or rejection reason",
    "reviewerComments": "Additional comments",
    "conditions": ["Standard documentation required"],
    "approvedAmount": 250000,
    "interestRate": 10.5,
    "tenure": 36
  },
  "response": {
    "success": true,
    "data": {
      "id": "app_123",
      "status": "approved",
      "updatedAt": "2025-01-07T11:30:00Z",
      "statusHistory": [
        {
          "status": "approved",
          "changedBy": "user_456",
          "changedAt": "2025-01-07T11:30:00Z",
          "reason": "All verifications passed"
        }
      ]
    }
  }
}
```

---

### 3. AI Processing & Verification

#### POST /ai/start-processing
**Description:** Initiate comprehensive AI processing pipeline for an application
```json
{
  "method": "POST",
  "endpoint": "/ai/start-processing",
  "body": {
    "applicationId": "app_123",
    "processingType": "full | image_only | documents_only | credit_only | verification_only",
    "priority": "normal | high | urgent",
    "skipSteps": ["image-match"],
    "processingOptions": {
      "enableRealTimeUpdates": true,
      "confidenceThreshold": 0.85,
      "enableFraudDetection": true,
      "requireManualReview": false
    }
  },
  "response": {
    "success": true,
    "data": {
      "processingId": "proc_789",
      "status": "initiated",
      "estimatedDuration": "18-22 seconds",
      "pipeline": {
        "totalSteps": 4,
        "parallelProcessing": false,
        "agents": [
          {
            "id": "preprocessing",
            "name": "Image Preprocessing Agent",
            "task": "Auto-Classification & Image Preprocessing",
            "description": "Identifies document types and ensures image quality",
            "status": "processing",
            "progress": 0,
            "estimatedDuration": "5 seconds",
            "outcome": "Clean, categorized image set for validation"
          },
          {
            "id": "facematch",
            "name": "Face Match Agent",
            "task": "Face Match & ID Verification",
            "description": "Biometric matching with liveness detection",
            "status": "pending",
            "progress": 0,
            "estimatedDuration": "4 seconds",
            "outcome": "Face match score and fraud alert if mismatch"
          },
          {
            "id": "document-verification",
            "name": "Document Verification Agent",
            "task": "Document Authenticity Check",
            "description": "Validates authenticity and checks for tampering",
            "status": "pending",
            "progress": 0,
            "estimatedDuration": "6 seconds",
            "outcome": "Document authenticity score and fraud detection"
          },
          {
            "id": "credit-analysis",
            "name": "Credit Analysis Agent",
            "task": "Credit Score & Risk Assessment",
            "description": "Comprehensive credit and financial analysis",
            "status": "pending",
            "progress": 0,
            "estimatedDuration": "5 seconds",
            "outcome": "Credit risk score and loan recommendation"
          }
        ]
      }
    }
  }
}
```

#### POST /ai/batch-processing
**Description:** Start AI processing for multiple applications with intelligent queuing
```json
{
  "method": "POST",
  "endpoint": "/ai/batch-processing",
  "body": {
    "applicationIds": ["app_123", "app_124", "app_125"],
    "batchOptions": {
      "processingMode": "parallel | sequential",
      "maxConcurrent": 3,
      "staggerDelay": 2000,
      "priority": "normal | high"
    },
    "processingType": "full"
  },
  "response": {
    "success": true,
    "data": {
      "batchId": "batch_proc_456",
      "status": "initiated",
      "applications": [
        {
          "applicationId": "app_123",
          "processingId": "proc_789",
          "status": "processing",
          "startedAt": "2025-01-07T10:30:00Z"
        },
        {
          "applicationId": "app_124",
          "processingId": "proc_790",
          "status": "queued",
          "estimatedStartTime": "2025-01-07T10:30:02Z"
        }
      ],
      "estimatedTotalTime": "60-80 seconds"
    }
  }
}
```

#### GET /ai/processing-status/:applicationId
**Description:** Get comprehensive real-time AI processing status with detailed agent information
```json
{
  "method": "GET",
  "endpoint": "/ai/processing-status/{application_id}",
  "response": {
    "success": true,
    "data": {
      "applicationId": "app_123",
      "processingId": "proc_789",
      "batchId": "batch_20250107_001",
      "status": "processing | completed | failed | cancelled",
      "overallProgress": 75,
      "startedAt": "2025-01-07T10:30:00Z",
      "estimatedCompletion": "2025-01-07T10:30:20Z",
      "actualDuration": "15.2 seconds",
      "pipeline": {
        "currentStage": 3,
        "totalStages": 4,
        "stageTransitions": [
          {
            "stage": "preprocessing",
            "startedAt": "2025-01-07T10:30:00Z",
            "completedAt": "2025-01-07T10:30:05Z"
          }
        ]
      },
      "agents": [
        {
          "id": "preprocessing",
          "name": "Image Preprocessing Agent",
          "task": "Auto-Classification & Image Preprocessing",
          "status": "completed",
          "progress": 100,
          "startedAt": "2025-01-07T10:30:00Z",
          "completedAt": "2025-01-07T10:30:05Z",
          "duration": "5.0 seconds",
          "result": {
            "documentsProcessed": 4,
            "documentsClassified": {
              "pan_card": 1,
              "bank_statement": 1,
              "salary_slip": 1,
              "utility_bill": 1
            },
            "qualityScores": {
              "average": 94.5,
              "minimum": 89.0,
              "maximum": 98.5
            },
            "imageEnhancements": [
              "brightness_correction",
              "rotation_correction",
              "noise_reduction"
            ]
          }
        },
        {
          "id": "facematch",
          "name": "Face Match Agent",
          "task": "Face Match & ID Verification",
          "status": "processing",
          "progress": 65,
          "startedAt": "2025-01-07T10:30:05Z",
          "currentTask": "Biometric feature extraction",
          "estimatedCompletion": "2025-01-07T10:30:09Z",
          "intermediateResults": {
            "faceDetected": true,
            "livenessScore": 96.2,
            "qualityScore": 94.7
          }
        },
        {
          "id": "document-verification",
          "name": "Document Verification Agent",
          "status": "pending",
          "progress": 0,
          "estimatedStartTime": "2025-01-07T10:30:09Z"
        },
        {
          "id": "credit-analysis",
          "name": "Credit Analysis Agent",
          "status": "pending",
          "progress": 0,
          "estimatedStartTime": "2025-01-07T10:30:15Z"
        }
      ],
      "metrics": {
        "queuePosition": 1,
        "averageProcessingTime": "18.5 seconds",
        "systemLoad": "moderate"
      }
    }
  }
}
```

#### GET /ai/processing-results/:applicationId
**Description:** Get comprehensive AI processing results with detailed verification outcomes
```json
{
  "method": "GET",
  "endpoint": "/ai/processing-results/{application_id}",
  "response": {
    "success": true,
    "data": {
      "applicationId": "app_123",
      "processingId": "proc_789",
      "batchId": "batch_20250107_001",
      "completedAt": "2025-01-07T10:30:20Z",
      "overallScore": 85,
      "riskLevel": "low | moderate | high",
      "recommendation": {
        "decision": "approve | reject | review",
        "confidence": 94.2,
        "maxLoanAmount": 2500000,
        "recommendedAmount": 250000,
        "interestRate": 10.5,
        "tenure": "36 months",
        "conditions": [
          "Standard documentation required",
          "No additional collateral needed"
        ]
      },
      "verificationResults": [
        {
          "stepId": "image-match",
          "title": "Image Verification",
          "status": "completed",
          "score": 94,
          "confidence": "high",
          "completedAt": "2025-01-07T10:30:09Z",
          "details": {
            "faceMatch": {
              "matchScore": 94.7,
              "livenessDetection": "passed",
              "confidenceLevel": "high",
              "biometricPoints": 847,
              "faceDetectionAccuracy": 99.2
            },
            "documentImages": {
              "clarity": "clear",
              "readability": "readable",
              "tamperingCheck": "no_issues",
              "formatValidation": "valid"
            }
          }
        },
        {
          "stepId": "kyc",
          "title": "KYC Verification",
          "status": "completed",
          "score": 92,
          "confidence": "high",
          "completedAt": "2025-01-07T10:30:15Z",
          "details": {
            "identity": {
              "nameMatch": "exact_match",
              "governmentDatabase": "verified",
              "panCard": "ABCDE1234F",
              "aadhaar": "****-****-5678"
            },
            "address": {
              "verification": "verified",
              "addressMatch": "confirmed",
              "utilityBillCheck": "verified"
            }
          }
        },
        {
          "stepId": "documents",
          "title": "Document Completeness",
          "status": "completed",
          "score": 96,
          "confidence": "high",
          "completedAt": "2025-01-07T10:30:18Z",
          "details": {
            "requiredDocuments": [
              {
                "type": "Government ID Proof",
                "document": "PAN Card",
                "status": "verified",
                "authenticity": "genuine",
                "quality": "excellent"
              }
            ],
            "completeness": "100%"
          }
        },
        {
          "stepId": "scoring",
          "title": "Risk Assessment",
          "status": "completed",
          "score": 89,
          "confidence": "high",
          "completedAt": "2025-01-07T10:30:20Z",
          "details": {
            "creditAssessment": {
              "creditScore": 850,
              "creditBureau": "CIBIL",
              "paymentHistory": "excellent",
              "debtToIncome": 32.5
            },
            "fraudDetection": {
              "riskScore": 15,
              "identityVerification": "verified",
              "behavioralPattern": "normal"
            },
            "financialAnalysis": {
              "monthlyIncome": 85000,
              "financialStability": "high",
              "savingsRate": 26
            }
          }
        }
      ],
      "flags": [],
      "alerts": [],
      "processingMetrics": {
        "totalDuration": "18.5 seconds",
        "accuracyScore": 96.2,
        "agentPerformance": {
          "preprocessing": {
            "duration": "5.0s",
            "accuracy": 98.1
          },
          "facematch": {
            "duration": "4.2s",
            "accuracy": 94.7
          },
          "document-verification": {
            "duration": "5.8s",
            "accuracy": 96.3
          },
          "credit-analysis": {
            "duration": "3.5s",
            "accuracy": 92.8
          }
        }
      },
      "auditTrail": [
        {
          "timestamp": "2025-01-07T10:30:00Z",
          "event": "processing_started",
          "agent": "preprocessing"
        },
        {
          "timestamp": "2025-01-07T10:30:20Z",
          "event": "processing_completed",
          "agent": "credit-analysis"
        }
      ]
    }
  }
}
```

---

### 4. Document Management

#### POST /documents/upload
**Description:** Upload documents for an application
```json
{
  "method": "POST",
  "endpoint": "/documents/upload",
  "contentType": "multipart/form-data",
  "body": {
    "applicationId": "app_123",
    "documentType": "pan_card | aadhar | salary_slip | bank_statement | photo | utility_bill",
    "file": "file_binary_data",
    "category": "identity | address | income | financial",
    "description": "PAN Card - front side"
  },
  "response": {
    "success": true,
    "data": {
      "id": "doc_456",
      "fileName": "pan_card_front.jpg",
      "fileSize": 1024576,
      "mimeType": "image/jpeg",
      "documentType": "pan_card",
      "uploadedAt": "2025-01-07T10:30:00Z",
      "status": "uploaded",
      "url": "/api/v1/documents/doc_456/download",
      "thumbnailUrl": "/api/v1/documents/doc_456/preview"
    }
  }
}
```

#### GET /documents/:applicationId
**Description:** Get all documents for an application
```json
{
  "method": "GET",
  "endpoint": "/documents/{application_id}",
  "response": {
    "success": true,
    "data": {
      "documents": [
        {
          "id": "doc_456",
          "fileName": "pan_card_front.jpg",
          "documentType": "pan_card",
          "category": "identity",
          "status": "verified",
          "uploadedAt": "2025-01-07T10:30:00Z",
          "verifiedAt": "2025-01-07T10:35:00Z",
          "fileSize": 1024576,
          "mimeType": "image/jpeg",
          "quality": "excellent",
          "authenticity": "genuine"
        }
      ],
      "summary": {
        "totalDocuments": 5,
        "verified": 4,
        "pending": 1,
        "rejected": 0
      }
    }
  }
}
```

---

### 5. Analytics & Reports

#### GET /analytics/dashboard
**Description:** Get dashboard analytics data
```json
{
  "method": "GET",
  "endpoint": "/analytics/dashboard",
  "query": {
    "period": "7d | 30d | 90d | 1y",
    "userRole": "loan_officer | admin",
    "department": "Mumbai Branch"
  },
  "response": {
    "success": true,
    "data": {
      "summary": {
        "totalApplications": 1247,
        "pendingApplications": 89,
        "approvedApplications": 734,
        "rejectedApplications": 123,
        "totalLoanAmount": 125000000,
        "averageProcessingTime": "2.5 hours"
      },
      "trends": {
        "applicationsByDay": [
          {
            "date": "2025-01-01",
            "applications": 15,
            "approved": 12,
            "rejected": 2,
            "pending": 1
          }
        ],
        "processingTimesByDay": [],
        "fraudDetectionByDay": []
      },
      "performance": {
        "aiAccuracy": 96.2,
        "processingSpeed": "18.5 seconds average",
        "fraudDetectionRate": 2.1
      }
    }
  }
}
```

---

### 6. Error Response Format

All API errors follow this standard format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    },
    "timestamp": "2025-01-07T10:30:00Z",
    "requestId": "req_123",
    "documentation": "https://docs.vistaar.finance/api/errors#validation-error"
  }
}
```

## Enhanced Error Codes
- `VALIDATION_ERROR`: Input validation failed with field-specific details  
- `AUTHENTICATION_REQUIRED`: Valid JWT token required
- `AUTHORIZATION_FAILED`: Insufficient permissions for requested operation
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests - rate limiting active
- `INTERNAL_SERVER_ERROR`: Server error with request tracking
- `SERVICE_UNAVAILABLE`: External service unavailable - retry recommended
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit (10MB max)
- `INVALID_FILE_TYPE`: File type not supported (JPEG, PNG, PDF, DOC, DOCX only)
- `PROCESSING_IN_PROGRESS`: AI processing already in progress for application
- `INSUFFICIENT_DOCUMENTS`: Required documents missing for verification
- `BATCH_PROCESSING_LIMIT`: Batch size exceeds maximum allowed (50 applications)
- `AI_SERVICE_UNAVAILABLE`: AI processing service temporarily unavailable
- `CONCURRENT_PROCESSING_LIMIT`: Maximum concurrent processing limit reached
- `VERIFICATION_FAILED`: Document or identity verification failed
- `CREDIT_CHECK_FAILED`: Credit bureau service unavailable
- `FRAUD_DETECTION_ALERT`: Potential fraud detected - manual review required
- `DUPLICATE_APPLICATION`: Duplicate application detected for same applicant
- `SYSTEM_MAINTENANCE`: System under maintenance - try again later

## Enhanced Rate Limiting
- **Authentication endpoints**: 5 requests per minute per IP
- **File upload endpoints**: 10 requests per minute per user (100MB total)
- **Application submission**: 20 applications per hour per user
- **Batch processing**: 5 batch requests per hour per user
- **General API endpoints**: 100 requests per minute per user
- **Analytics endpoints**: 50 requests per minute per user
- **AI processing endpoints**: 20 requests per minute per user
- **Customer portal endpoints**: 30 requests per minute per customer
- **Real-time status endpoints**: 200 requests per minute per user

## Pagination
All list endpoints support pagination with these parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- Response includes pagination metadata

## File Upload Limits
- **Maximum file size**: 10MB per file
- **Supported formats**: JPEG, PNG, PDF, DOC, DOCX
- **Maximum files per request**: 5 files
- **Total storage per application**: 50MB

## Enhanced Webhook Events
```json
{
  "events": [
    "application.created",
    "application.status_changed", 
    "application.batch_submitted",
    "ai_processing.started",
    "ai_processing.agent_completed",
    "ai_processing.completed",
    "ai_processing.failed",
    "verification.image_match_completed",
    "verification.kyc_completed", 
    "verification.document_completed",
    "verification.credit_analysis_completed",
    "verification.completed",
    "fraud.detected",
    "fraud.high_risk_alert",
    "document.uploaded",
    "document.verified",
    "document.rejected",
    "batch.processing_started",
    "batch.processing_completed",
    "user.login",
    "user.logout",
    "system.maintenance",
    "system.alert",
    "credit.bureau_check_completed",
    "loan.approved",
    "loan.rejected",
    "manual_review.required"
  ],
  "webhook_config": {
    "webhook_url": "https://your-app.com/webhooks/vistaar",
    "headers": {
      "X-Webhook-Secret": "your_webhook_secret",
      "X-API-Version": "v1",
      "Content-Type": "application/json"
    },
    "retry_policy": {
      "max_retries": 3,
      "retry_delay": "exponential",
      "timeout": 30
    },
    "signature_verification": {
      "algorithm": "sha256",
      "header": "X-Vistaar-Signature"
    }
  }
}
```

## Webhook Payload Examples
```json
{
  "event": "ai_processing.completed",
  "timestamp": "2025-01-07T10:30:20Z",
  "data": {
    "applicationId": "app_123",
    "processingId": "proc_789",
    "overallScore": 85,
    "recommendation": "approve",
    "processingDuration": "18.5 seconds"
  },
  "metadata": {
    "version": "v1",
    "requestId": "req_456"
  }
}
```
```

## API Versioning & Compatibility
- **Current version**: `v1` (Released: January 2025)
- **Version specification**: URL-based `/api/v1/` and header-based `X-API-Version: v1`
- **Backward compatibility**: Maintained for 2 major versions (24 months)
- **Deprecation policy**: 6 months advance notice with migration guides
- **Feature flags**: Beta features available with `X-Enable-Beta-Features: true` header
- **Version detection**: Automatic version detection based on request headers

## Enhanced Security & Compliance  
- **Transport security**: TLS 1.3 encryption for all endpoints
- **Authentication**: JWT tokens with RS256 signing, 1-hour expiration
- **Refresh tokens**: Secure refresh tokens, 30-day expiration with rotation
- **Authorization**: Role-based access control (RBAC) with granular permissions
- **Rate limiting**: Distributed rate limiting with Redis-based counters
- **IP filtering**: Configurable IP whitelist/blacklist support
- **Request logging**: Comprehensive audit logging with correlation IDs
- **Data protection**: AES-256 encryption at rest, PII tokenization
- **Compliance**: SOC 2 Type II, PCI DSS Level 1 compliance
- **Session management**: Concurrent session limits, suspicious activity detection
- **API key management**: Rotating API keys for service-to-service communication

## Data Retention & Privacy
- **Application data**: Retained for 7 years for regulatory compliance
- **Processing logs**: Retained for 90 days for debugging and analytics
- **Document storage**: Encrypted storage with access logging
- **PII handling**: Tokenized sensitive data, GDPR/CCPA compliant
- **Data portability**: Export APIs available for customer data
- **Right to erasure**: Automated data deletion workflows available

## Performance & Scalability
- **Response times**: 95th percentile < 200ms for standard endpoints
- **Throughput**: Supports 10,000+ concurrent users
- **Processing capacity**: 1000+ applications per minute batch processing
- **Auto-scaling**: Dynamic scaling based on load and queue depth
- **CDN integration**: Global CDN for document delivery and caching
- **Database optimization**: Optimized queries with sub-100ms response times