-- Create event_registrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    eventid UUID NOT NULL,
    userid UUID NOT NULL,
    registeredat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_event_registrations_event 
        FOREIGN KEY (eventid) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_registrations_user 
        FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate registrations
    CONSTRAINT unique_event_user_registration 
        UNIQUE (eventid, userid)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_eventid ON event_registrations(eventid);
CREATE INDEX IF NOT EXISTS idx_event_registrations_userid ON event_registrations(userid);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_registeredat ON event_registrations(registeredat);

-- Add RLS (Row Level Security) policies
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own registrations
CREATE POLICY IF NOT EXISTS "Users can view own registrations" 
    ON event_registrations FOR SELECT 
    USING (auth.uid() = userid);

-- Policy: Users can insert their own registrations
CREATE POLICY IF NOT EXISTS "Users can create own registrations" 
    ON event_registrations FOR INSERT 
    WITH CHECK (auth.uid() = userid);

-- Policy: Admins can view all registrations
CREATE POLICY IF NOT EXISTS "Admins can view all registrations" 
    ON event_registrations FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Policy: Admins can manage all registrations
CREATE POLICY IF NOT EXISTS "Admins can manage all registrations" 
    ON event_registrations FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_event_registrations_updated_at ON event_registrations;
CREATE TRIGGER update_event_registrations_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_event_registrations_updated_at();
