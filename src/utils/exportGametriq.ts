import { AppDataExportService } from '@/services/AppDataExportService';

/**
 * Exports the complete Gametriq app for MVP analysis
 * Includes all routes, logic, sample data, and configurations
 */
export const exportGametriqMVP = async () => {
  console.log('🎯 Starting Gametriq MVP export for developer analysis...');
  
  try {
    // Export complete app data including all required MVP components
    const result = await AppDataExportService.exportAppDataAsJSON();
    
    if (result.success) {
      console.log('✅ Gametriq MVP exported successfully:', result.fileName);
      console.log('📦 Export includes:');
      console.log('   - Navigation routes (/login, /app, /player/:id, /support)');
      console.log('   - Authentication & token logic');
      console.log('   - Sample data (players, teams, games, stats)');
      console.log('   - Email/webhook configurations');
      console.log('   - Supabase setup & auth state');
      console.log('   - Component logic & app state');
      
      return result;
    } else {
      console.error('❌ Export failed:', result.error);
      return result;
    }
  } catch (error) {
    console.error('❌ Export error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Auto-export disabled for production use
// console.log('🔄 Triggering enhanced export with complete configuration...');
// exportGametriqMVP();