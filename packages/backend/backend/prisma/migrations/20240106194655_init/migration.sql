-- CreateTable
CREATE TABLE "Matricula" (
    "id" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "situacao" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "margensId" INTEGER NOT NULL,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Margem" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "disponivel" DOUBLE PRECISION NOT NULL,
    "matriculaId" TEXT NOT NULL,

    CONSTRAINT "Margem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_matricula_key" ON "Matricula"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Margem" ADD CONSTRAINT "Margem_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "Matricula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
