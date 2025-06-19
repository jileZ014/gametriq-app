
import { toast } from 'sonner';

export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  DATABASE = 'database',
  UNKNOWN = 'unknown'
}

export class APIError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

interface ErrorHandlingOptions {
  showToast?: boolean;
  retryFn?: () => void;
  context?: string;
}

/**
 * A higher order function to handle errors in async operations
 */
export function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: { message?: string } = {}
): Promise<T> {
  return fn().catch(error => {
    console.error(options.message || 'Operation failed', error);
    
    if (options.message) {
      toast.error(options.message);
    }
    
    throw error;
  });
}

/**
 * Handle different types of application errors
 */
export function handleError(
  error: unknown, 
  options: ErrorHandlingOptions = { showToast: true }
): ErrorType {
  const context = options.context ? `Error in ${options.context}: ` : '';
  console.error(context, error);
  
  // Default values
  let errorType = ErrorType.UNKNOWN;
  let errorMessage = 'An unexpected error occurred';
  let errorDetails = '';
  
  // Detect error type and customize message
  if (!navigator.onLine) {
    errorType = ErrorType.NETWORK;
    errorMessage = 'No internet connection';
    errorDetails = 'Please check your network connection and try again';
  } else if (error instanceof Error) {
    // Extract useful info from the error object
    errorDetails = error.message;
    
    if (error.message.includes('auth') || 
        error.message.includes('login') || 
        error.message.includes('password') ||
        error.message.includes('permission') ||
        error.message.includes('JWT')) {
      errorType = ErrorType.AUTH;
      errorMessage = 'Authentication error';
    } else if (error.message.includes('permission') || 
               error.message.includes('access') ||
               error.message.includes('not allowed')) {
      errorType = ErrorType.PERMISSION;
      errorMessage = 'Permission denied';
    } else if (error.message.includes('validation') || 
               error.message.includes('invalid') ||
               error.message.includes('required')) {
      errorType = ErrorType.VALIDATION;
      errorMessage = 'Validation error';
    } else if (error.message.includes('database') ||
               error.message.includes('supabase') ||
               error.message.includes('query')) {
      errorType = ErrorType.DATABASE;
      errorMessage = 'Database error';
    }
  } else if (typeof error === 'object' && error !== null) {
    // Handle error objects from APIs
    const errorObj = error as Record<string, any>;
    
    if (errorObj.status === 401 || errorObj.status === 403) {
      errorType = ErrorType.AUTH;
      errorMessage = 'Authentication error';
      errorDetails = errorObj.message || errorObj.error || '';
    } else if (errorObj.status === 400) {
      errorType = ErrorType.VALIDATION;
      errorMessage = 'Invalid input';
      errorDetails = errorObj.message || errorObj.error || '';
    } else if (errorObj.status && errorObj.status >= 500) {
      errorType = ErrorType.DATABASE;
      errorMessage = 'Server error';
      errorDetails = errorObj.message || errorObj.error || '';
    }
    
    // Handle Supabase specific errors
    if (errorObj.code) {
      if (errorObj.code.startsWith('22') || errorObj.code.startsWith('23')) {
        errorType = ErrorType.VALIDATION;
        errorMessage = 'Data validation error';
      } else if (errorObj.code.startsWith('28') || errorObj.code === '42501') {
        errorType = ErrorType.PERMISSION;
        errorMessage = 'Permission denied';
      } else if (errorObj.code === 'PGRST301' || errorObj.code === '28000') {
        errorType = ErrorType.AUTH;
        errorMessage = 'Authentication error';
      }
      errorDetails = errorObj.message || errorObj.error || '';
    }
  }
  
  // Show toast if enabled
  if (options.showToast) {
    const toastContent = {
      title: errorMessage,
      description: errorDetails || options.context,
      action: options.retryFn 
        ? { 
            label: 'Retry', 
            onClick: options.retryFn 
          } 
        : undefined
    };
    
    toast.error(toastContent.title, {
      description: toastContent.description,
      action: options.retryFn 
        ? { 
            label: 'Retry', 
            onClick: options.retryFn 
          } 
        : undefined,
      duration: 5000
    });
  }
  
  return errorType;
}
