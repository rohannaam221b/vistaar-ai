import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  CreditCard,
  Eye
} from 'lucide-react';
import { CombinedFormSteps } from './CombinedFormSteps';

interface StepContentProps {
  currentStepIndex: number;
  customerData: any;
  validationErrors: any;
  isAutoPopulating: boolean;
  aiProcessingState: any;
  onInputChange: (field: string, value: string | boolean) => void;
  onFileUpload: (documentType: string, file: File) => void;
  onFormUpload: (file: File) => void;
  DocumentUploadBox: React.ComponentType<any>;
  ApplicationFormUpload: React.ComponentType<any>;
}

export const StepContent: React.FC<StepContentProps> = ({
  currentStepIndex,
  customerData,
  validationErrors,
  isAutoPopulating,
  aiProcessingState,
  onInputChange,
  onFileUpload,
  onFormUpload,
  DocumentUploadBox,
  ApplicationFormUpload
}) => {
  const renderDocumentUploadStep = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Upload
          </CardTitle>
          <p className="text-gray-600">Upload your documents to help us process your application faster. Our AI will extract information from your documents to auto-fill the form.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Application Form Upload */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Application Form (Optional)</h3>
            <ApplicationFormUpload
              file={customerData.applicationForm}
              onFileSelect={onFormUpload}
            />
          </div>

          {/* Document Uploads Grid */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Supporting Documents (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocumentUploadBox
                documentType="aadhaar"
                title="Aadhaar Card"
                description="Government ID proof"
                icon={CreditCard}
                file={customerData.documents.aadhaar}
                onFileSelect={(file: File) => onFileUpload('aadhaar', file)}
              />
              
              <DocumentUploadBox
                documentType="pan"
                title="PAN Card"
                description="Tax identification"
                icon={CreditCard}
                file={customerData.documents.pan}
                onFileSelect={(file: File) => onFileUpload('pan', file)}
              />
              
              <DocumentUploadBox
                documentType="photo"
                title="Passport Photo"
                description="Recent photograph"
                icon={Eye}
                file={customerData.documents.photo}
                onFileSelect={(file: File) => onFileUpload('photo', file)}
              />
              
              <DocumentUploadBox
                documentType="salarySlips"
                title="Salary Slips"
                description="Last 3 months"
                icon={FileText}
                file={customerData.documents.salarySlips}
                onFileSelect={(file: File) => onFileUpload('salarySlips', file)}
              />
              
              <DocumentUploadBox
                documentType="bankStatements"
                title="Bank Statements"
                description="Last 6 months"
                icon={FileText}
                file={customerData.documents.bankStatements}
                onFileSelect={(file: File) => onFileUpload('bankStatements', file)}
              />
              
              <DocumentUploadBox
                documentType="addressProof"
                title="Address Proof"
                description="Utility bill or lease"
                icon={FileText}
                file={customerData.documents.addressProof}
                onFileSelect={(file: File) => onFileUpload('addressProof', file)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Status */}
      {aiProcessingState && aiProcessingState.active && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="w-5 h-5" />
              AI Document Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-blue-800">
                Our AI is analyzing your documents and extracting information to auto-fill your application form.
              </p>
              
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
                    <Progress value={agent.progress} className="w-full h-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderVerificationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Verification & Consent
        </CardTitle>
        <p className="text-gray-600">Please review your information and provide consent to proceed</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Application Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Application Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Applicant:</span>
              <p className="font-medium">{customerData.firstName} {customerData.lastName}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{customerData.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-medium">{customerData.phoneNumber}</p>
            </div>
            <div>
              <span className="text-gray-600">Loan Type:</span>
              <p className="font-medium">{customerData.loanType}</p>
            </div>
            <div>
              <span className="text-gray-600">Loan Amount:</span>
              <p className="font-medium">₹{parseInt(customerData.loanAmount || '0').toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Monthly Income:</span>
              <p className="font-medium">₹{parseInt(customerData.monthlyIncome || '0').toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Required Consents</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consentDataProcessing"
                checked={customerData.consentDataProcessing}
                onCheckedChange={(checked) => onInputChange('consentDataProcessing', checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="consentDataProcessing" className="text-sm font-medium flex items-center gap-2">
                  Data Processing Consent
                  <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-600">
                  I consent to the processing of my personal data for loan application and assessment purposes.
                </p>
                {validationErrors.consentDataProcessing && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.consentDataProcessing}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consentCreditCheck"
                checked={customerData.consentCreditCheck}
                onCheckedChange={(checked) => onInputChange('consentCreditCheck', checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="consentCreditCheck" className="text-sm font-medium flex items-center gap-2">
                  Credit Check Consent
                  <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-600">
                  I authorize Vistaar Finance to perform credit checks and access my credit history.
                </p>
                {validationErrors.consentCreditCheck && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.consentCreditCheck}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consentMarketing"
                checked={customerData.consentMarketing}
                onCheckedChange={(checked) => onInputChange('consentMarketing', checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="consentMarketing" className="text-sm font-medium">
                  Marketing Communications (Optional)
                </Label>
                <p className="text-xs text-gray-600">
                  I agree to receive promotional communications and updates about products and services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> By submitting this application, you acknowledge that you have read and agree to our 
            <Button variant="link" className="p-0 h-auto text-blue-600 underline mx-1">
              Terms and Conditions
            </Button>
            and
            <Button variant="link" className="p-0 h-auto text-blue-600 underline mx-1">
              Privacy Policy
            </Button>.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  switch (currentStepIndex) {
    case 0:
      return renderDocumentUploadStep();
    case 1:
      return (
        <CombinedFormSteps
          customerData={customerData}
          validationErrors={validationErrors}
          isAutoPopulating={isAutoPopulating}
          onInputChange={onInputChange}
        />
      );
    case 2:
      return renderVerificationStep();
    default:
      return null;
  }
};