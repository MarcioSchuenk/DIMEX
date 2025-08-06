FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build


FROM node:22-alpine
WORKDIR /api
COPY package*.json ./

# --- MUDANÇA: Instala o cliente do postgresql para o script de espera ---
RUN npm install --omit=dev && apk add --no-cache postgresql-client

# Copia os artefatos do estágio builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# --- MUDANÇA: Copia o script de entrypoint para dentro da imagem ---
COPY docker-entrypoint.sh .

# --- MUDANÇA: Garante que o script seja executável dentro da imagem ---
RUN chmod +x ./docker-entrypoint.sh

# --- MUDANÇA: Define o nosso script como o ponto de entrada ---
ENTRYPOINT ["/api/docker-entrypoint.sh"]

# O CMD permanece o mesmo, mas agora ele é passado como um argumento para o ENTRYPOINT
CMD ["node", "dist/server.js"]