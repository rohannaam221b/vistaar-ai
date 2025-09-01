import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Database,
  Cpu,
  Globe,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'loan_officer' | 'admin';
  email: string;
}

interface SettingsProps {
  user: User;
  onSave?: (settings: any) => void;
}

export function Settings({ user, onSave }: SettingsProps) {
  const [settings, setSettings] = useState({
    // General Settings
    language: 'english',
    timezone: 'asia/kolkata',
    dateFormat: 'dd-mm-yyyy',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    browserNotifications: true,
    weeklyReports: true,
    
    // AI & Processing Settings
    aiConfidenceThreshold: 85,
    autoProcessing: false,
    imageQualityCheck: true,
    documentVerification: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // System Settings (Admin only)
    systemMaintenance: false,
    backupFrequency: 'daily',
    logRetention: 30,
    apiRateLimit: 1000
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave?.(settings);
    // Show success toast or feedback
  };

  const systemStats = {
    uptime: '99.8%',
    lastBackup: '2025-01-07 02:00',
    activeUsers: 24,
    processingQueue: 12,
    storageUsed: '68%',
    apiCallsToday: 1247
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1>System Settings</h1>
            <p className="text-muted-foreground">
              Configure your preferences and system settings
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai-processing">AI & Processing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {user.role === 'admin' && <TabsTrigger value="system">System</TabsTrigger>}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your personal preferences and display options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिन्दी</SelectItem>
                      <SelectItem value="gujarati">ગુજરાતી</SelectItem>
                      <SelectItem value="marathi">मराठी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="asia/dubai">Asia/Dubai (GST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about loan applications and system updates
                    </p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get SMS alerts for urgent loan processing updates
                    </p>
                  </div>
                  <Switch 
                    checked={settings.smsNotifications}
                    onCheckedChange={(value) => handleSettingChange('smsNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show desktop notifications when the app is open
                    </p>
                  </div>
                  <Switch 
                    checked={settings.browserNotifications}
                    onCheckedChange={(value) => handleSettingChange('browserNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly performance and analytics summaries
                    </p>
                  </div>
                  <Switch 
                    checked={settings.weeklyReports}
                    onCheckedChange={(value) => handleSettingChange('weeklyReports', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI & Processing Settings */}
        <TabsContent value="ai-processing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                AI & Processing Configuration
              </CardTitle>
              <CardDescription>
                Configure AI models and automated processing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>AI Confidence Threshold: {settings.aiConfidenceThreshold}%</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={settings.aiConfidenceThreshold}
                      onChange={(e) => handleSettingChange('aiConfidenceThreshold', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Badge variant={settings.aiConfidenceThreshold >= 80 ? "default" : "secondary"}>
                      {settings.aiConfidenceThreshold >= 80 ? 'High' : 'Medium'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Minimum confidence score required for automated decisions
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Processing</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process applications that meet confidence threshold
                    </p>
                  </div>
                  <Switch 
                    checked={settings.autoProcessing}
                    onCheckedChange={(value) => handleSettingChange('autoProcessing', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Image Quality Checks</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect and flag low-quality document images
                    </p>
                  </div>
                  <Switch 
                    checked={settings.imageQualityCheck}
                    onCheckedChange={(value) => handleSettingChange('imageQualityCheck', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Document Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-powered document authenticity verification
                    </p>
                  </div>
                  <Switch 
                    checked={settings.documentVerification}
                    onCheckedChange={(value) => handleSettingChange('documentVerification', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Access Control
              </CardTitle>
              <CardDescription>
                Manage your account security and access preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  These security settings help protect your account and ensure data privacy.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(value) => handleSettingChange('twoFactorAuth', value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Select 
                    value={settings.passwordExpiry.toString()} 
                    onValueChange={(value) => handleSettingChange('passwordExpiry', parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings (Admin Only) */}
        {user.role === 'admin' && (
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">System Uptime</span>
                      <Badge variant="outline">{systemStats.uptime}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Users</span>
                      <Badge variant="secondary">{systemStats.activeUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Queue</span>
                      <Badge variant="default">{systemStats.processingQueue}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Used</span>
                      <Badge variant={systemStats.storageUsed === '68%' ? "secondary" : "destructive"}>
                        {systemStats.storageUsed}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable for system updates
                      </p>
                    </div>
                    <Switch 
                      checked={settings.systemMaintenance}
                      onCheckedChange={(value) => handleSettingChange('systemMaintenance', value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select 
                      value={settings.backupFrequency} 
                      onValueChange={(value) => handleSettingChange('backupFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Log Retention (days)</Label>
                    <Input 
                      type="number" 
                      value={settings.logRetention}
                      onChange={(e) => handleSettingChange('logRetention', parseInt(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Actions */}
            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>
                  Perform system maintenance and data operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Clear Cache
                  </Button>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Last system backup: {systemStats.lastBackup} | API calls today: {systemStats.apiCallsToday}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}