/*
  Warnings:

  - Added the required column `coordinateId` to the `Waypoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Waypoint" ADD COLUMN     "coordinateId" INTEGER NOT NULL,
ADD COLUMN     "waypointSetId" INTEGER,
ALTER COLUMN "waypointType" SET DEFAULT E'STEERPOINT';

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_coordinateId_fkey" FOREIGN KEY ("coordinateId") REFERENCES "Coordinate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_waypointSetId_fkey" FOREIGN KEY ("waypointSetId") REFERENCES "WaypointSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
