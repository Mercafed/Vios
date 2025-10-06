-- Actualizar tabla de tarjetas con nuevos campos
ALTER TABLE vios.cards 
ADD COLUMN IF NOT EXISTS card_number VARCHAR(19),
ADD COLUMN IF NOT EXISTS ccv VARCHAR(4),
ADD COLUMN IF NOT EXISTS nequi_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS blocked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;

-- Crear tabla para bloqueos de emails por tienda
CREATE TABLE IF NOT EXISTS vios.email_store_blocks (
  id SERIAL PRIMARY KEY,
  email_id INTEGER REFERENCES vios.emails(id) ON DELETE CASCADE,
  store_id INTEGER REFERENCES vios.stores(id) ON DELETE CASCADE,
  blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email_id, store_id)
);

-- Agregar campo de screenshot a productos
ALTER TABLE vios.products
ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- Crear tabla para configuración de Google Drive
CREATE TABLE IF NOT EXISTS vios.google_drive_config (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES vios.users(id) ON DELETE CASCADE,
  client_id TEXT,
  client_secret TEXT,
  refresh_token TEXT,
  folder_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
