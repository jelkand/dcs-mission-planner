/*
  Warnings:

  - You are about to drop the `WaypointSequence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WaypointSequence";

-- CreateTable
CREATE TABLE "WaypointSet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaypointSet_pkey" PRIMARY KEY ("id")
);
