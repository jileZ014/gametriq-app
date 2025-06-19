-- Add fields to users table for role selection and player linking
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS linked_player_id UUID,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_linked_player ON public.users(linked_player_id);