/*
  Warnings:

  - You are about to drop the `Tournament` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tournament";

-- CreateTable
CREATE TABLE "tournament" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "prix_entree" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "jeuId" INTEGER NOT NULL,

    CONSTRAINT "tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jeu" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "jeu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategorieJeu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategorieJeu_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategorieJeu_B_index" ON "_CategorieJeu"("B");

-- AddForeignKey
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_jeuId_fkey" FOREIGN KEY ("jeuId") REFERENCES "jeu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategorieJeu" ADD CONSTRAINT "_CategorieJeu_A_fkey" FOREIGN KEY ("A") REFERENCES "categorie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategorieJeu" ADD CONSTRAINT "_CategorieJeu_B_fkey" FOREIGN KEY ("B") REFERENCES "jeu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
