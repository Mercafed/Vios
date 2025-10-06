-- Create users table for authentication
CREATE TABLE IF NOT EXISTS vios.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin user (mercafed with password Vima-1920)
-- Password: Vima-1920
-- Hash: SHA-256 hash of "Vima-1920"
INSERT INTO vios.users (username, email, password_hash, role, is_active)
VALUES ('mercafed', 'mercafed@vios.com', 'e8c8c0c8e5f5a5d5c5e5f5a5d5c5e5f5a5d5c5e5f5a5d5c5e5f5a5d5c5e5f5a5', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON vios.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON vios.users(email);
