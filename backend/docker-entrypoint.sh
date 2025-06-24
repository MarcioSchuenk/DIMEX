#!/bin/sh
# docker-entrypoint.sh

# Para o script se um comando falhar (segurança)
set -e

# Extrai as variáveis de conexão da variável de ambiente DATABASE_URL
# Isso torna o script adaptável, desde que a variável DATABASE_URL exista.
DB_HOST=$(echo $DATABASE_URL | sed -E 's/.*@([^:]+):.*/\1/')
DB_PORT=$(echo $DATABASE_URL | sed -E 's/.*:([0-9]+)\/.*/\1/')
DB_USER=$(echo $DATABASE_URL | sed -E 's/postgresql:\/\/([^:]+):.*/\1/')

# Exporta a senha para o pg_isready não precisar de interação do usuário
export PGPASSWORD=$(echo $DATABASE_URL | sed -E 's/.*:([^@]+)@.*/\1/')

echo "Aguardando o banco de dados em $DB_HOST:$DB_PORT..."

# Loop que aguarda o banco de dados ficar pronto para aceitar conexões
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -q; do
  echo "Banco de dados indisponível - aguardando..."
  sleep 2
done

echo "O banco de dados está pronto para aceitar conexões."

# Limpa a variável de senha do ambiente por segurança
unset PGPASSWORD

echo "Executando o comando 'prisma migrate deploy'..."
npx prisma migrate deploy

echo "Migrações finalizadas. Iniciando a aplicação..."

# Linha final e crucial: executa o comando principal que foi passado ao contêiner
# (que será o CMD do seu Dockerfile)
exec "$@"