
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { Game, Player, Team } from '@/types';
import { StatRecord } from './StatsService';
import { supabase } from '@/integrations/supabase/client';

interface AppDataExport {
  exportInfo: {
    exportedAt: string;
    appVersion: string;
    dataTypes: string[];
    totalDataItems: number;
  };
  teams: Team[];
  players: Player[];
  games: Game[];
  stats: StatRecord[];
  mockData: {
    mockTeams: any[];
    mockGames: any[];
    manualGames: any[];
    linkedGames: any[];
    sampleMVPData: any;
  };
  userSettings: {
    currentUser: any;
    preferences: any;
    lastLogin: string | null;
    theme: string;
  };
  authenticationData: {
    currentSession: any;
    authUsers: any[];
    authTokens: any;
    supabaseAuthKeys: string[];
    loginHistory: any[];
  };
  appConfiguration: {
    routes: any[];
    supabaseConfig: any;
    emailConfiguration: any;
    navigationLogic: any;
    componentLogic: any;
  };
  mvpFeatures: {
    loginFlow: any;
    dashboardLogic: any;
    playerStatsLogic: any;
    supportConfiguration: any;
    tokenHandling: any;
  };
}

export class AppDataExportService {
  static async exportAppDataAsJSON(userEmail?: string): Promise<{ success: boolean; fileName?: string; error?: string }> {
    try {
      const mockData = this.getMockData(userEmail);
      const authData = await this.getAuthenticationData();
      const userSettings = this.getUserSettings();
      const appConfig = this.getAppConfiguration();
      const mvpFeatures = this.getMVPFeatures();
      
      // Calculate total data items
      const totalItems = mockData.mockTeams.length + mockData.mockGames.length + 
                        mockData.sampleMVPData.players.length + mockData.sampleMVPData.stats.length +
                        authData.authUsers.length;
      
      // Collect all app data including authentication data
      const exportData: AppDataExport = {
        exportInfo: {
          exportedAt: new Date().toISOString(),
          appVersion: "1.0.0",
          dataTypes: ["teams", "players", "games", "stats", "mockData", "userSettings", "authenticationData", "appConfiguration", "mvpFeatures"],
          totalDataItems: totalItems
        },
        teams: this.getTeamsData(),
        players: this.getPlayersData(),
        games: this.getGamesData(),
        stats: this.getStatsData(),
        mockData,
        userSettings,
        authenticationData: authData,
        appConfiguration: appConfig,
        mvpFeatures
      };

      // Create JSON string with formatting
      const jsonString = JSON.stringify(exportData, null, 2);

      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const fileName = `Gametriq_Full_Export_${timestamp}.json`;

      // Create and download the file
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      saveAs(blob, fileName);

      console.log('App data with authentication exported successfully:', fileName);
      
      return { 
        success: true, 
        fileName 
      };
    } catch (error) {
      console.error('Error exporting app data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  private static getTeamsData(): Team[] {
    try {
      // Get teams from localStorage (mock teams)
      return JSON.parse(localStorage.getItem('gametriq_mock_teams') || '[]');
    } catch {
      return [];
    }
  }

  private static getPlayersData(): Player[] {
    try {
      // Collect players from various sources
      const players: Player[] = [];
      
      // Get from manual games
      const manualGames = JSON.parse(localStorage.getItem('gametriq_manual_games_') || '[]');
      const linkedGames = JSON.parse(localStorage.getItem('gametriq_linked_games_') || '[]');
      
      [...manualGames, ...linkedGames].forEach(game => {
        if (game.players && Array.isArray(game.players)) {
          players.push(...game.players);
        }
      });

      return players;
    } catch {
      return [];
    }
  }

  private static getGamesData(): Game[] {
    try {
      // Get mock games
      const mockGames = JSON.parse(localStorage.getItem('gametriq_mock_games') || '[]');
      return mockGames;
    } catch {
      return [];
    }
  }

  private static getStatsData(): StatRecord[] {
    try {
      // Get stats from localStorage or other sources
      // This might need to be adapted based on how stats are stored
      return [];
    } catch {
      return [];
    }
  }

  private static getMockData(userEmail?: string) {
    const mockData = {
      mockTeams: [],
      mockGames: [],
      manualGames: [],
      linkedGames: [],
      sampleMVPData: this.generateSampleMVPData()
    };

    try {
      mockData.mockTeams = JSON.parse(localStorage.getItem('gametriq_mock_teams') || '[]');
      mockData.mockGames = JSON.parse(localStorage.getItem('gametriq_mock_games') || '[]');
      
      if (userEmail) {
        mockData.manualGames = JSON.parse(localStorage.getItem(`gametriq_manual_games_${userEmail}`) || '[]');
        mockData.linkedGames = JSON.parse(localStorage.getItem(`gametriq_linked_games_${userEmail}`) || '[]');
      }

      // If no existing data, populate with sample data
      if (mockData.mockTeams.length === 0) {
        mockData.mockTeams = mockData.sampleMVPData.teams;
        localStorage.setItem('gametriq_mock_teams', JSON.stringify(mockData.sampleMVPData.teams));
      }
      
      if (mockData.mockGames.length === 0) {
        mockData.mockGames = mockData.sampleMVPData.games;
        localStorage.setItem('gametriq_mock_games', JSON.stringify(mockData.sampleMVPData.games));
      }
    } catch (error) {
      console.error('Error collecting mock data:', error);
    }

    return mockData;
  }

  private static generateSampleMVPData() {
    return {
      teams: [
        {
          id: 'team-1',
          team_name: 'Thunder Hawks',
          season: '2025 Season',
          coach_user_id: 'coach-1',
          description: 'Junior League Basketball Team',
          logo_url: '/lovable-uploads/047b64ed-6792-4704-8733-8b0e4b0826dc.png',
          created_at: new Date().toISOString()
        }
      ],
      players: [
        {
          id: 'player-1',
          name: 'Alex Johnson',
          playerNumber: '23',
          team_id: 'team-1',
          parent_user_id: 'parent-1',
          photoUrl: '/lovable-uploads/580daa8d-e5c4-4112-ab12-2d74a54a0915.png',
          stats: {
            fgMade: 45,
            fgMissed: 32,
            threePtMade: 12,
            threePtMissed: 18,
            ftMade: 28,
            ftMissed: 7,
            Assists: 23,
            Rebounds: 34,
            Steals: 15,
            Blocks: 8,
            Fouls: 12
          }
        },
        {
          id: 'player-2',
          name: 'Jordan Smith',
          playerNumber: '15',
          team_id: 'team-1',
          parent_user_id: 'parent-2',
          photoUrl: '/lovable-uploads/636a55da-11f7-496e-b25c-c41259ba8d87.png',
          stats: {
            fgMade: 38,
            fgMissed: 28,
            threePtMade: 8,
            threePtMissed: 15,
            ftMade: 22,
            ftMissed: 5,
            Assists: 18,
            Rebounds: 29,
            Steals: 12,
            Blocks: 6,
            Fouls: 9
          }
        }
      ],
      games: [
        {
          id: 'game-1',
          team_id: 'team-1',
          opponent_name: 'Lightning Bolts',
          game_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Central Sports Complex',
          game_type: 'League Game',
          is_home_game: true,
          is_active: false,
          created_by_user_id: 'coach-1',
          game_notes: 'Important league matchup'
        }
      ],
      stats: [
        {
          id: 'stat-1',
          player_id: 'player-1',
          game_id: 'game-1',
          stat_type: 'fgMade',
          value: 8,
          quarter: 1,
          timestamp: new Date().toISOString(),
          created_by_user_id: 'coach-1'
        },
        {
          id: 'stat-2',
          player_id: 'player-1',
          game_id: 'game-1',
          stat_type: 'threePtMade',
          value: 3,
          quarter: 2,
          timestamp: new Date().toISOString(),
          created_by_user_id: 'coach-1'
        },
        {
          id: 'stat-3',
          player_id: 'player-2',
          game_id: 'game-1',
          stat_type: 'Rebounds',
          value: 6,
          quarter: 1,
          timestamp: new Date().toISOString(),
          created_by_user_id: 'coach-1'
        }
      ],
      authUsers: [
        {
          id: 'coach-1',
          email: 'coach@thunderhawks.com',
          role: 'Coach',
          name: 'Coach Mike Thompson',
          has_logged_in: true,
          team_name: 'Thunder Hawks'
        },
        {
          id: 'parent-1',
          email: 'parent1@email.com',
          role: 'Parent',
          name: 'Sarah Johnson',
          has_logged_in: true
        },
        {
          id: 'parent-2',
          email: 'parent2@email.com',
          role: 'Parent',
          name: 'Mike Smith',
          has_logged_in: false
        }
      ]
    };
  }

  private static getUserSettings() {
    try {
      return {
        currentUser: JSON.parse(localStorage.getItem('gametriq_current_user') || 'null'),
        preferences: JSON.parse(localStorage.getItem('gametriq_user_preferences') || '{}'),
        lastLogin: localStorage.getItem('gametriq_last_login'),
        theme: localStorage.getItem('theme') || 'dark'
      };
    } catch {
      return {
        currentUser: null,
        preferences: {},
        lastLogin: null,
        theme: 'dark'
      };
    }
  }

  private static async getAuthenticationData() {
    const authData = {
      currentSession: null,
      authUsers: [],
      authTokens: {},
      supabaseAuthKeys: [],
      loginHistory: []
    };

    try {
      // Get current Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Remove sensitive tokens for security
        authData.currentSession = {
          user: session.user,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type,
          // Remove actual access and refresh tokens for security
          access_token: '[REDACTED_FOR_SECURITY]',
          refresh_token: '[REDACTED_FOR_SECURITY]'
        };
      }

      // Get users from Supabase (if accessible)
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('*');
        
        if (!error && users) {
          authData.authUsers = users;
        }
      } catch (error) {
        console.log('Could not fetch users table:', error);
      }

      // Collect Supabase auth-related localStorage keys (without values for security)
      authData.supabaseAuthKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.') || key.includes('sb-')
      );

      // Get login history if available
      try {
        authData.loginHistory = JSON.parse(localStorage.getItem('gametriq_login_history') || '[]');
      } catch {
        authData.loginHistory = [];
      }

      // Collect non-sensitive auth tokens info
      authData.authTokens = {
        hasStoredTokens: authData.supabaseAuthKeys.length > 0,
        tokenKeyCount: authData.supabaseAuthKeys.length,
        lastAuthUpdate: localStorage.getItem('gametriq_last_auth_update')
      };

    } catch (error) {
      console.error('Error collecting authentication data:', error);
    }

    return authData;
  }

  private static getAppConfiguration() {
    return {
      routes: [
        { 
          path: '/', 
          component: 'LandingPage', 
          description: 'Public landing page',
          implementation: 'Landing page with hero section and auth CTA'
        },
        { 
          path: '/login', 
          component: 'LoginRedirect', 
          description: 'Login handler with token processing',
          implementation: 'Magic link authentication with email validation'
        },
        { 
          path: '/app', 
          component: 'AppPage', 
          description: 'Main dashboard requiring authentication',
          implementation: 'Protected route with token validation and team management'
        },
        { 
          path: '/support', 
          component: 'SupportPage', 
          description: 'Support and help center',
          implementation: 'FAQ, bug reporting, and contact forms'
        },
        { 
          path: '/player/:id', 
          component: 'PlayerAnalyticsPage', 
          description: 'Individual player stats view',
          implementation: 'Detailed player stats with charts and progress tracking'
        },
        { 
          path: '/error', 
          component: 'ErrorPage', 
          description: 'Error display page',
          implementation: 'Error handling with contextual messages'
        }
      ],
      supabaseConfig: {
        projectId: 'nuwavuuzzfvwhwmacpzh',
        url: 'https://nuwavuuzzfvwhwmacpzh.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2F2dXV6emZ2d2h3bWFjcHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NjA5MDQsImV4cCI6MjA2MjMzNjkwNH0.mhNKxY0E52AgoKb4ou-GCCGxXJVbkYR-eVY5Fw5SQH0',
        authEnabled: true,
        tablesConfigured: ['users', 'teams', 'players', 'games', 'stat_records'],
        edgeFunctions: [
          {
            name: 'send-email',
            description: 'Email sending service using Resend API',
            url: 'https://nuwavuuzzfvwhwmacpzh.supabase.co/functions/v1/send-email'
          },
          {
            name: 'test-email',
            description: 'Email testing service for verification',
            url: 'https://nuwavuuzzfvwhwmacpzh.supabase.co/functions/v1/test-email'
          }
        ]
      },
      emailConfiguration: {
        provider: 'Resend',
        domain: 'gametriq.com',
        fromAddress: 'noreply@gametriq.com',
        templateTypes: ['VERIFICATION', 'PARENT_INVITATION', 'PASSWORD_RESET'],
        edgeFunctions: ['send-email', 'test-email'],
        configured: true,
        apiKeyConfigured: true,
        templates: {
          VERIFICATION: {
            subject: 'Verify your Gametriq account',
            description: 'Magic link email for user verification'
          },
          PARENT_INVITATION: {
            subject: 'You\'ve been invited to Gametriq',
            description: 'Parent invitation with account setup link'
          },
          PASSWORD_RESET: {
            subject: 'Reset your Gametriq password',
            description: 'Password reset with secure token'
          }
        }
      },
      navigationLogic: {
        authenticationRequired: ['/app', '/player/:id', '/dashboard'],
        publicRoutes: ['/', '/login', '/support', '/error', '/password-setup'],
        redirectLogic: {
          afterLogin: '/app',
          afterLogout: '/login',
          onTokenMissing: '/error?msg=missing_token',
          onInvalidToken: '/login?error=invalid_token'
        },
        tokenHandling: {
          storageKey: 'gametriq_token',
          validation: 'URL parameter extraction and localStorage persistence',
          expiration: 'Session-based with auto-cleanup'
        }
      },
      componentLogic: {
        authContext: {
          provider: 'AuthProvider with user state management',
          tokenStorage: 'localStorage.gametriq_token',
          sessionPersistence: true,
          autoLogout: 'On token expiry or validation failure'
        },
        teamManagement: {
          multiTeam: true,
          teamSelection: 'Dropdown with team switching',
          teamCreation: 'Modal form with validation',
          playerLinking: 'Parent email invitation system'
        },
        playerManagement: {
          crudOperations: true,
          photoUpload: 'File upload with preview',
          statTracking: 'Real-time stat recording during games',
          parentLinking: 'Email-based parent account connection'
        },
        gameTracking: {
          liveMode: true,
          quarterTracking: true,
          statRecording: 'Touch-based +/- buttons for each stat type',
          gameStates: ['scheduled', 'active', 'completed'],
          opponentManagement: 'Team vs opponent tracking'
        },
        statDefinitions: {
          fieldGoals: { made: 'fgMade', missed: 'fgMissed', percentage: 'calculated' },
          threePointers: { made: 'threePtMade', missed: 'threePtMissed', percentage: 'calculated' },
          freeThrows: { made: 'ftMade', missed: 'ftMissed', percentage: 'calculated' },
          otherStats: ['Assists', 'Rebounds', 'Steals', 'Blocks', 'Fouls'],
          calculations: {
            totalPoints: '(fgMade * 2) + (threePtMade * 3) + ftMade',
            fieldGoalPercentage: 'fgMade / (fgMade + fgMissed) * 100',
            threePointPercentage: 'threePtMade / (threePtMade + threePtMissed) * 100',
            freeThrowPercentage: 'ftMade / (ftMade + ftMissed) * 100'
          }
        },
        dataExport: {
          format: 'JSON',
          includes: 'Complete app state with authentication data',
          downloadable: true
        }
      },
      loginFlow: {
        method: 'Magic Link Authentication',
        steps: [
          '1. User enters email on /login',
          '2. System generates magic token and sends email via Resend',
          '3. User clicks link with token parameter',
          '4. LoginRedirect validates token and stores in localStorage',
          '5. User redirected to /app with authenticated session'
        ],
        tokenGeneration: 'Base64 encoded email + timestamp',
        emailService: 'Resend API via Supabase Edge Function',
        validation: 'Token matching and localStorage persistence',
        errorHandling: 'Toast notifications and error page redirects'
      },
      playerStatDisplay: {
        statTypes: [
          { name: 'Field Goals', type: 'shooting', tracked: ['made', 'missed'], calculated: 'percentage' },
          { name: '3-Pointers', type: 'shooting', tracked: ['made', 'missed'], calculated: 'percentage' },
          { name: 'Free Throws', type: 'shooting', tracked: ['made', 'missed'], calculated: 'percentage' },
          { name: 'Assists', type: 'playmaking', tracked: ['count'], calculated: 'total' },
          { name: 'Rebounds', type: 'defense', tracked: ['count'], calculated: 'total' },
          { name: 'Steals', type: 'defense', tracked: ['count'], calculated: 'total' },
          { name: 'Blocks', type: 'defense', tracked: ['count'], calculated: 'total' },
          { name: 'Fouls', type: 'discipline', tracked: ['count'], calculated: 'total' }
        ],
        uiElements: {
          statRecorder: 'Plus/minus buttons for live stat recording',
          statDisplay: 'Card-based layout with percentage calculations',
          statCharts: 'Recharts integration for visual progress',
          statTimeline: 'Game-by-game stat progression'
        },
        liveRecording: {
          interface: 'Touch-optimized +/- buttons',
          feedback: 'Visual confirmation on stat recording',
          quarterTracking: 'Stat segmentation by game quarters',
          undo: 'Last action undo functionality'
        }
      }
    };
  }

  private static getMVPFeatures() {
    return {
      loginFlow: {
        magicLinkAuth: true,
        passwordAuth: true,
        tokenVerification: true,
        urlTokenProcessing: true,
        supabaseIntegration: true,
        localStorageHandling: true,
        description: 'Complete auth flow with email verification and token management'
      },
      dashboardLogic: {
        teamSelection: true,
        playerManagement: true,
        gameCreation: true,
        statTracking: true,
        dataExport: true,
        multiTeamSupport: true,
        description: 'Full team management dashboard with player and game tracking'
      },
      playerStatsLogic: {
        individualPlayerView: true,
        statBreakdown: true,
        gameHistory: true,
        parentLinking: true,
        photoUpload: true,
        statCalculations: {
          fieldGoalPercentage: true,
          threePointPercentage: true,
          freeThrowPercentage: true,
          totalPoints: true,
          rebounds: true,
          assists: true
        },
        description: 'Comprehensive player analytics with detailed stat tracking'
      },
      supportConfiguration: {
        helpSystem: true,
        bugReporting: true,
        faqSupport: true,
        emailIntegration: true,
        typeformIntegration: false,
        description: 'Support system with help documentation and bug reporting'
      },
      tokenHandling: {
        urlTokenExtraction: true,
        localStorageManagement: true,
        sessionPersistence: true,
        tokenValidation: true,
        redirectHandling: true,
        description: 'Robust token management for authentication persistence'
      }
    };
  }

  // Import functionality for future use
  static async importAppDataFromJSON(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const text = await file.text();
      const importData: AppDataExport = JSON.parse(text);

      // Validate the import data
      if (!importData.exportInfo || !importData.exportInfo.exportedAt) {
        throw new Error('Invalid export file format');
      }

      console.log('Import data validated:', importData.exportInfo);
      
      // Here you could implement the import logic
      // For now, just log what would be imported
      console.log('Would import:', {
        teams: importData.teams?.length || 0,
        players: importData.players?.length || 0,
        games: importData.games?.length || 0,
        stats: importData.stats?.length || 0,
        authUsers: importData.authenticationData?.authUsers?.length || 0,
        hasSessionData: !!importData.authenticationData?.currentSession
      });

      return {
        success: true,
        message: `Import file validated. Contains ${importData.teams?.length || 0} teams, ${importData.players?.length || 0} players, ${importData.games?.length || 0} games, and ${importData.authenticationData?.authUsers?.length || 0} auth users.`
      };
    } catch (error) {
      console.error('Error importing app data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to import data'
      };
    }
  }
}
