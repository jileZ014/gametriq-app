
/**
 * Cleans up all Supabase authentication related items from localStorage
 * to prevent authentication limbo states
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
  
  // Remove our app-specific stored user data
  localStorage.removeItem('gametriq_current_user');
  localStorage.removeItem('gametriq_mock_game');
  localStorage.removeItem('gametriq_mock_players');
};

/**
 * Signs out from Supabase and cleans up the auth state
 * for a reliable logout experience
 */
export const signOutWithCleanup = async () => {
  try {
    console.log('AuthUtils: Starting clean logout process...');
    
    // Clean up existing tokens
    cleanupAuthState();
    
    // Attempt global sign out (will work even if tokens are invalid)
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.auth.signOut({ scope: 'global' });
      console.log('AuthUtils: Global sign out completed');
    } catch (err) {
      // Continue even if this fails
      console.warn("AuthUtils: Failed to perform global sign out", err);
    }
    
    console.log('AuthUtils: Cleanup completed successfully');
    return true;
  } catch (error) {
    console.error("AuthUtils: Error during sign out cleanup:", error);
    return false;
  }
};

/**
 * Validates that a user object has the required properties
 */
export const isValidUser = (user: any): boolean => {
  return !!(
    user &&
    typeof user === 'object' &&
    user.id &&
    user.email &&
    (user.role === 'Coach' || user.role === 'Parent')
  );
};
