-- Migration script untuk mengupdate tabel users untuk integrasi Clerk
-- Jalankan script ini di database Neon Anda

-- Backup existing users table (jika ada data)
-- CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop dan recreate users table dengan struktur baru
DROP TABLE IF EXISTS users CASCADE;

-- Create updated users table untuk Clerk integration
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,          -- Clerk user ID
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    image_url TEXT,                         -- Profile picture dari Clerk
    age INTEGER,
    weight DOUBLE PRECISION,
    height DOUBLE PRECISION,
    activity_level TEXT,
    dietary_preferences TEXT,
    is_verified BOOLEAN DEFAULT TRUE,       -- Clerk handles verification
    last_sign_in_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);

-- Update trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at();

-- Restore foreign key constraints untuk tabel lain yang reference users
-- (sesuaikan dengan tabel yang sudah ada)

-- Update nutrition_logs table jika ada
-- ALTER TABLE nutrition_logs DROP CONSTRAINT IF EXISTS nutrition_logs_user_id_fkey;
-- ALTER TABLE nutrition_logs ADD CONSTRAINT nutrition_logs_user_id_fkey 
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update food_analysis table jika ada
-- ALTER TABLE food_analysis DROP CONSTRAINT IF EXISTS food_analysis_user_id_fkey;
-- ALTER TABLE food_analysis ADD CONSTRAINT food_analysis_user_id_fkey 
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;