-- Add leaderboard table to the EcoBee database
-- Run this in your Supabase SQL editor

-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    pseudonym TEXT NOT NULL,
    composite_score FLOAT NOT NULL,
    boundary_scores JSONB,
    campus_affiliation TEXT,
    quiz_responses JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_composite_score ON public.leaderboard(composite_score);
CREATE INDEX IF NOT EXISTS idx_leaderboard_campus_affiliation ON public.leaderboard(campus_affiliation);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON public.leaderboard(created_at);

-- Enable Row Level Security (RLS) for privacy
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserts for anonymous users
CREATE POLICY "Allow anonymous leaderboard inserts" ON public.leaderboard
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows reading leaderboard data (without sensitive info)
CREATE POLICY "Allow reading leaderboard" ON public.leaderboard
    FOR SELECT USING (true);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_leaderboard_updated_at
    BEFORE UPDATE ON public.leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT INSERT ON public.leaderboard TO anon;
GRANT SELECT ON public.leaderboard TO anon;

-- Create a view for safe leaderboard display (no sensitive data)
CREATE OR REPLACE VIEW public.leaderboard_display AS
SELECT 
    id,
    pseudonym,
    composite_score,
    campus_affiliation,
    created_at,
    ROW_NUMBER() OVER (ORDER BY composite_score ASC) as rank
FROM public.leaderboard
ORDER BY composite_score ASC
LIMIT 100;

GRANT SELECT ON public.leaderboard_display TO anon;
