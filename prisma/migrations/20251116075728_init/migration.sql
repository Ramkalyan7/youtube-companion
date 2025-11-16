/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EventLog` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `EventLog` table. All the data in the column will be lost.
  - The `details` column on the `EventLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `eventType` to the `EventLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `EventLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventLog" DROP COLUMN "createdAt",
DROP COLUMN "type",
ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "videoId" TEXT,
DROP COLUMN "details",
ADD COLUMN     "details" JSONB;
