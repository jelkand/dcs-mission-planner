-- CreateTable
CREATE TABLE "Waypoint" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "waypointType" "WaypointType" NOT NULL,

    CONSTRAINT "Waypoint_pkey" PRIMARY KEY ("id")
);
