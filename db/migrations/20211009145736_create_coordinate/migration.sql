-- CreateEnum
CREATE TYPE "ElevationUnit" AS ENUM ('FEET', 'METERS');

-- CreateTable
CREATE TABLE "Coordinate" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "elevation" INTEGER NOT NULL,
    "elevationUnit" "ElevationUnit" NOT NULL,

    CONSTRAINT "Coordinate_pkey" PRIMARY KEY ("id")
);
