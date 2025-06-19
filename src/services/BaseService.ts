
import { supabase } from '@/integrations/supabase/client';
import { APIError } from '@/utils/errorHandling';

export class BaseService {
  protected static supabase = supabase;
  
  protected static async withRetry<T>(
    operation: () => Promise<T>,
    options: {
      retries?: number;
      baseDelay?: number;
      errorMessage?: string;
    } = {}
  ): Promise<T> {
    const { retries = 3, baseDelay = 300, errorMessage } = options;
    let lastError: any;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (error instanceof APIError) {
          // Don't retry authentication errors, not found errors, etc.
          if (error.status === 401 || error.status === 403 || error.status === 404) {
            throw error;
          }
        }
        
        // Last attempt failed, don't wait before throwing
        if (attempt === retries - 1) {
          break;
        }
        
        // Wait with exponential backoff before retrying
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 100));
      }
    }
    
    throw new APIError(
      errorMessage || 'Operation failed after multiple attempts',
      undefined,
      { level: 'error' }
    );
  }
  
  protected static isOnline(): boolean {
    return navigator.onLine;
  }
}
