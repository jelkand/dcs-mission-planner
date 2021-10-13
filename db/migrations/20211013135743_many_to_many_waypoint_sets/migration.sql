/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `waypointSetId` on the `Waypoint` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Waypoint" DROP CONSTRAINT "Waypoint_coordinateId_fkey";

-- DropForeignKey
ALTER TABLE "Waypoint" DROP CONSTRAINT "Waypoint_waypointSetId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';

-- AlterTable
ALTER TABLE "Waypoint" DROP COLUMN "waypointSetId";

-- CreateTable
CREATE TABLE "WaypointSetWaypoint" (
    "id" SERIAL NOT NULL,
    "waypointSetId" INTEGER NOT NULL,
    "waypointId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "elementOrder" INTEGER NOT NULL DEFAULT 0,
    "sequenceNum" INTEGER,

    CONSTRAINT "WaypointSetWaypoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputFlag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InputFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InputFlagToWaypointSetWaypoint" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InputFlagToWaypointSetWaypoint_AB_unique" ON "_InputFlagToWaypointSetWaypoint"("A", "B");

-- CreateIndex
CREATE INDEX "_InputFlagToWaypointSetWaypoint_B_index" ON "_InputFlagToWaypointSetWaypoint"("B");

-- AddForeignKey
ALTER TABLE "WaypointSetWaypoint" ADD CONSTRAINT "WaypointSetWaypoint_waypointSetId_fkey" FOREIGN KEY ("waypointSetId") REFERENCES "WaypointSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaypointSetWaypoint" ADD CONSTRAINT "WaypointSetWaypoint_waypointId_fkey" FOREIGN KEY ("waypointId") REFERENCES "Waypoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_coordinateId_fkey" FOREIGN KEY ("coordinateId") REFERENCES "Coordinate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InputFlagToWaypointSetWaypoint" ADD FOREIGN KEY ("A") REFERENCES "InputFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InputFlagToWaypointSetWaypoint" ADD FOREIGN KEY ("B") REFERENCES "WaypointSetWaypoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
