import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  User, 
  CreditCard, 
  Building, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

interface CombinedFormStepsProps {
  customerData: any;
  validationErrors: any;
  isAutoPopulating: boolean;
  onInputChange: (field: string, value: string) => void;
}

export const CombinedFormSteps: React.FC<CombinedFormStepsProps> = ({
  customerData,
  validationErrors,
  isAutoPopulating,
  onInputChange
}) => {
  const renderFieldWithError = (
    fieldName: string,
    label: string,
    inputElement: React.ReactElement,
    required: boolean = true
  ) => {
    const hasError = validationErrors[fieldName];
    const isAutopopulated = isAutoPopulating && customerData[fieldName];
    
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
          {isAutopopulated && (
            <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />
          )}
        </Label>
        <div className={`relative ${isAutopopulated ? 'animate-pulse' : ''}`}>
          {React.cloneElement(inputElement, {
            id: fieldName,
            className: `${inputElement.props.className || ''} ${
              hasError 
                ? 'border-red-500 focus:ring-red-500' 
                : isAutopopulated 
                ? 'border-green-500 bg-green-50' 
                : ''
            }`.trim()
          })}
        </div>
        {hasError && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {hasError}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Auto-population Alert */}
      {isAutoPopulating && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>AI is auto-populating fields</strong> based on your uploaded documents. Please review and update as needed.
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFieldWithError(
              'firstName',
              'First Name',
              <Input
                value={customerData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
              />
            )}
            
            {renderFieldWithError(
              'lastName',
              'Last Name',
              <Input
                value={customerData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
              />
            )}
            
            {renderFieldWithError(
              'dateOfBirth',
              'Date of Birth',
              <Input
                type="date"
                value={customerData.dateOfBirth}
                onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
              />
            )}
            
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-1">
                Gender
                <span className="text-red-500">*</span>
              </Label>
              <Select value={customerData.gender} onValueChange={(value) => onInputChange('gender', value)}>
                <SelectTrigger className={validationErrors.gender ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.gender && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.gender}
                </p>
              )}
            </div>
            
            {renderFieldWithError(
              'phoneNumber',
              'Phone Number',
              <Input
                value={customerData.phoneNumber}
                onChange={(e) => onInputChange('phoneNumber', e.target.value)}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
            )}
            
            {renderFieldWithError(
              'email',
              'Email Address',
              <Input
                type="email"
                value={customerData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
            )}
          </div>

          <div className="space-y-6">
            {renderFieldWithError(
              'currentAddress',
              'Current Address',
              <Textarea
                value={customerData.currentAddress}
                onChange={(e) => onInputChange('currentAddress', e.target.value)}
                placeholder="Enter your current address"
                rows={3}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderFieldWithError(
                'pincode',
                'PIN Code',
                <Input
                  value={customerData.pincode}
                  onChange={(e) => onInputChange('pincode', e.target.value)}
                  placeholder="6-digit PIN code"
                  maxLength={6}
                />
              )}
              
              {renderFieldWithError(
                'city',
                'City',
                <Input
                  value={customerData.city}
                  onChange={(e) => onInputChange('city', e.target.value)}
                  placeholder="Enter your city"
                />
              )}
              
              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center gap-1">
                  State
                  <span className="text-red-500">*</span>
                </Label>
                <Select value={customerData.state} onValueChange={(value) => onInputChange('state', value)}>
                  <SelectTrigger className={validationErrors.state ? 'border-red-500 focus:ring-red-500' : ''}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="bihar">Bihar</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="haryana">Haryana</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.state && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.state}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Requirements Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CreditCard className="w-5 h-5" />
            Loan Requirements
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="loanType" className="flex items-center gap-1">
                Loan Type
                <span className="text-red-500">*</span>
              </Label>
              <Select value={customerData.loanType} onValueChange={(value) => onInputChange('loanType', value)}>
                <SelectTrigger className={validationErrors.loanType ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal-loan">Personal Loan</SelectItem>
                  <SelectItem value="business-loan">Business Loan</SelectItem>
                  <SelectItem value="home-loan">Home Loan</SelectItem>
                  <SelectItem value="vehicle-loan">Vehicle Loan</SelectItem>
                  <SelectItem value="education-loan">Education Loan</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.loanType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.loanType}
                </p>
              )}
            </div>
            
            {renderFieldWithError(
              'loanAmount',
              'Loan Amount (₹)',
              <Input
                type="number"
                value={customerData.loanAmount}
                onChange={(e) => onInputChange('loanAmount', e.target.value)}
                placeholder="Enter loan amount"
                min="10000"
                max="10000000"
              />
            )}
          </div>
          
          {renderFieldWithError(
            'loanPurpose',
            'Loan Purpose',
            <Textarea
              value={customerData.loanPurpose}
              onChange={(e) => onInputChange('loanPurpose', e.target.value)}
              placeholder="Describe the purpose of the loan"
              rows={3}
            />
          )}
        </CardContent>
      </Card>

      {/* Employment & Income Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Building className="w-5 h-5" />
            Employment & Income
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="employmentType" className="flex items-center gap-1">
                Employment Type
                <span className="text-red-500">*</span>
              </Label>
              <Select value={customerData.employmentType} onValueChange={(value) => onInputChange('employmentType', value)}>
                <SelectTrigger className={validationErrors.employmentType ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaried">Salaried</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                  <SelectItem value="business-owner">Business Owner</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.employmentType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.employmentType}
                </p>
              )}
            </div>
            
            {renderFieldWithError(
              'monthlyIncome',
              'Monthly Income (₹)',
              <Input
                type="number"
                value={customerData.monthlyIncome}
                onChange={(e) => onInputChange('monthlyIncome', e.target.value)}
                placeholder="Enter monthly income"
                min="10000"
              />
            )}
          </div>

          {/* Business Information - Show only for self-employed/business owner */}
          {(customerData.employmentType === 'self-employed' || customerData.employmentType === 'business-owner') && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Business Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={customerData.businessName}
                    onChange={(e) => onInputChange('businessName', e.target.value)}
                    placeholder="Enter business name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={customerData.businessType}
                    onChange={(e) => onInputChange('businessType', e.target.value)}
                    placeholder="e.g., Retail, Manufacturing"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearlyTurnover">Yearly Turnover (₹)</Label>
                  <Input
                    id="yearlyTurnover"
                    type="number"
                    value={customerData.yearlyTurnover}
                    onChange={(e) => onInputChange('yearlyTurnover', e.target.value)}
                    placeholder="Enter yearly turnover"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={customerData.businessAddress}
                  onChange={(e) => onInputChange('businessAddress', e.target.value)}
                  placeholder="Enter business address"
                  rows={2}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};