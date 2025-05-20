-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sobras" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "data" TIMESTAMP(3),
    "quantidade" INTEGER,
    "pedido_cancelado" BOOLEAN,
    "description" TEXT,
    "localizacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sobras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caixas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "data" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caixas_pkey" PRIMARY KEY ("id")
);
