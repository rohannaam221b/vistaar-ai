# Vistaar Finance - Design System Guidelines

## General Guidelines
- Use the 8pt spacing system (multiples of 8px: 8, 16, 24, 32, etc.)
- Maintain consistent component structure with card-based layouts
- Follow fintech-focused design language with professional aesthetics
- Ensure responsive design across devices
- Use role-based access control (Loan Officer/Admin)

## Design System
- **Base font size**: 14px (set via --font-size CSS variable)
- **Color scheme**: Use the defined CSS custom properties for consistency
- **Border radius**: Use the --radius system (sm, md, lg, xl)
- **Typography**: Follow the base typography system defined in globals.css

## Component Guidelines
- Use shadcn/ui components from the /components/ui directory
- Maintain proper component hierarchy and separation of concerns
- Implement proper loading states and error handling
- Follow accessibility best practices

## AI Processing Flow
- Implement 4-stage AI verification pipeline
- Show real-time progress updates
- Use consistent status indicators (pending, processing, completed, failed)
- Provide detailed verification results with confidence scoring

## Data Flow
- Applications should support batch processing
- Maintain proper state management for real-time updates
- Implement proper error handling and recovery
- Use localStorage for session persistence where appropriate