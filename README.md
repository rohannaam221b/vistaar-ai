# Vistaar Finance - Loan Quality Check System

A comprehensive, AI-powered loan verification and quality check system built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

1. **Clone or download this project**
2. **Navigate to the project directory**
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser and visit:** `http://localhost:3000`

## 📋 Default Login Credentials

**Loan Officer:**
- Email: `officer@vistaar.finance`
- Password: `password123`

**Admin:**
- Email: `admin@vistaar.finance`
- Password: `admin123`

## 🏗️ System Architecture

### Frontend Stack
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

### Key Features
- **Multi-role Authentication** (Loan Officer/Admin)
- **Real-time AI Processing** with progress tracking
- **Comprehensive Verification** (Image, KYC, Documents, Credit)
- **Interactive Analytics** dashboard
- **Customer Portal** for application tracking
- **Document Upload** and management
- **Risk Assessment** and fraud detection
- **Responsive Design** for all devices

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── analytics/       # Analytics dashboard
│   ├── applications/    # Application management
│   ├── auth/           # Authentication flow
│   ├── dashboard/      # Main dashboard
│   ├── layout/         # Layout components
│   ├── onboarding/     # Customer onboarding
│   ├── settings/       # Settings page
│   ├── ui/             # UI components (shadcn)
│   └── verification/   # Verification modules
├── lib/                # Utility functions
├── styles/             # Global styles
└── App.tsx            # Main application
```

## 🎯 Core Modules

### 1. Authentication System
- Role-based access control
- JWT token management
- Secure login/logout

### 2. Application Management
- Create new loan applications
- Queue management (List/Kanban views)
- Status tracking and updates
- Search and filtering

### 3. AI Processing Pipeline
- **Image Preprocessing** - Document classification and enhancement
- **Face Matching** - Biometric verification
- **Document Verification** - Authenticity checks
- **Credit Analysis** - Risk assessment and scoring

### 4. Verification Modules
- **Image Verification** - Face matching with live images
- **KYC Verification** - Identity and address verification
- **Document Completeness** - Required document validation
- **Risk Assessment** - AI-powered fraud detection

### 5. Analytics & Reporting
- Real-time KPI dashboard
- Processing metrics
- Fraud detection trends
- Performance analytics

### 6. Customer Portal
- Application tracking
- Document upload
- Status updates
- Support system

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Export from component file
3. Import in parent component or App.tsx
4. Follow TypeScript interfaces for props

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system tokens in `globals.css`
- Maintain responsive design principles
- Use shadcn/ui components when possible

## 🔧 Configuration

### Environment Variables
Create `.env.local` for local development:
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_TITLE=Vistaar Finance
```

### API Integration
See `api-documentation.md` for complete API specifications.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎨 Design System

- **Base font size**: 14px
- **Color scheme**: Professional fintech theme
- **Spacing**: 8pt grid system
- **Typography**: System fonts with proper hierarchy
- **Components**: Modern, accessible UI components

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Input validation
- XSS protection
- CSRF protection

## 📊 Performance

- Optimized bundle size
- Lazy loading for routes
- Image optimization
- Progressive loading
- Responsive design

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use conventional commit messages
3. Maintain component documentation
4. Test across different screen sizes
5. Follow accessibility guidelines

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for modern fintech applications**