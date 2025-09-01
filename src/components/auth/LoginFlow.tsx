import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { CheckCircle2, AlertTriangle, Shield, User, Server, UserCheck, Settings } from 'lucide-react';

interface LoginFlowProps {
  onLogin: (user: any) => void;
  onNavigate?: (page: string) => void;
}

type Step = 'login' | 'security' | 'health';

export function LoginFlow({ onLogin, onNavigate }: LoginFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    role: null as 'loan_officer' | 'admin' | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { id: 'login', title: 'Login', icon: User },
    { id: 'security', title: 'Security Verification', icon: Shield },
    { id: 'health', title: 'System Health', icon: Server }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const sampleUsers = [
    {
      email: 'admin@vistaar.com',
      password: 'admin123',
      role: 'admin' as const,
      name: 'Sarah Thompson',
      title: 'System Administrator'
    },
    {
      email: 'officer@vistaar.com',
      password: 'officer123',
      role: 'loan_officer' as const,
      name: 'Rajesh Sharma',
      title: 'Senior Loan Officer'
    }
  ];

  const handleQuickLogin = (user: typeof sampleUsers[0]) => {
    setFormData({
      email: user.email,
      password: user.password,
      otp: '',
      role: user.role
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.email === 'admin@vistaar.com') {
        setFormData({ ...formData, role: 'admin' });
        setCurrentStep('security');
      } else if (formData.email === 'officer@vistaar.com') {
        setFormData({ ...formData, role: 'loan_officer' });
        setCurrentStep('security');
      } else {
        setError('Invalid credentials. Try admin@vistaar.com or officer@vistaar.com');
      }
      setLoading(false);
    }, 1000);
  };

  const handleSecurityVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (formData.otp === '123456') {
        setCurrentStep('health');
        setTimeout(() => {
          const userData = sampleUsers.find(user => user.email === formData.email);
          onLogin({
            id: '1',
            name: userData?.name || (formData.role === 'admin' ? 'Administrator' : 'Loan Officer'),
            role: formData.role!,
            email: formData.email
          });
        }, 2000);
      } else {
        setError('Invalid OTP. Try 123456');
      }
      setLoading(false);
    }, 1000);
  };

  const renderStepIndicator = () => (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-400'
              } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );

  const renderLoginStep = () => (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Vistaar Finance</CardTitle>
        <CardDescription>Secure loan processing system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-input-background"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="bg-input-background"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Continue'}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Quick Login (Demo)</p>
          </div>
          
          <div className="grid gap-2">
            {sampleUsers.map((user, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleQuickLogin(user)}
                className="w-full text-left justify-start gap-3 p-4 h-auto"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {user.role === 'admin' ? (
                    <Settings className={`w-4 h-4 text-purple-600`} />
                  ) : (
                    <UserCheck className={`w-4 h-4 text-blue-600`} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.title}</div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {user.role === 'admin' ? 'Admin' : 'Officer'}
                </Badge>
              </Button>
            ))}
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">Manual Login Credentials:</p>
            <div className="space-y-0.5">
              <p className="text-xs text-blue-600">Email: admin@vistaar.com or officer@vistaar.com</p>
              <p className="text-xs text-blue-600">Password: any | OTP: 123456</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSecurityVerification = () => (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Security Verification</CardTitle>
        <CardDescription>Enter the OTP sent to your device</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSecurityVerification} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">One-Time Password</label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              maxLength={6}
              required
              className="bg-input-background text-center text-lg tracking-widest"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Demo OTP: 123456</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderHealthCheck = () => (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>System Health Check</CardTitle>
        <CardDescription>Verifying system status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Database Connection</span>
            <Badge variant="default" className="bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">AI Services</span>
            <Badge variant="default" className="bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Operational
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Document Storage</span>
            <Badge variant="default" className="bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Available
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Security Modules</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Maintenance
            </Badge>
          </div>
        </div>

        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            System is ready. Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {renderStepIndicator()}
        
        {currentStep === 'login' && renderLoginStep()}
        {currentStep === 'security' && renderSecurityVerification()}
        {currentStep === 'health' && renderHealthCheck()}
      </div>
    </div>
  );
}