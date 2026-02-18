-- Script de inicialização do banco de dados
-- Executado automaticamente pelo Docker na primeira inicialização

-- Criar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de log (opcional)
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices úteis
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);

