import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved':
    case 'completed':
      return 'text-green-600 bg-green-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'processing':
      return 'text-blue-600 bg-blue-50'
    case 'rejected':
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'review':
      return 'text-orange-600 bg-orange-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function generateTrackingId(prefix: string = 'VF'): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  
  return `${prefix}${year}${month}${day}${random}`
}

export function calculateProcessingTime(startTime: string, endTime?: string): string {
  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : new Date()
  const diffMs = end.getTime() - start.getTime()
  
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export function getScoreCategory(score?: number): { category: string; color: string } {
  if (!score) return { category: 'Pending', color: 'text-gray-600' }
  
  if (score >= 90) return { category: 'Excellent', color: 'text-green-600' }
  if (score >= 80) return { category: 'Good', color: 'text-blue-600' }
  if (score >= 70) return { category: 'Fair', color: 'text-yellow-600' }
  if (score >= 60) return { category: 'Poor', color: 'text-orange-600' }
  return { category: 'Very Poor', color: 'text-red-600' }
}