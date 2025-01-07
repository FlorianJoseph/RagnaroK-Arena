/*
  Warnings:

  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_organizerId_fkey";

-- DropTable
DROP TABLE "Participant";

-- DropTable
DROP TABLE "User";
