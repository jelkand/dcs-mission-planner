import { ElevationUnit } from "db"

import { CombatFlite } from "./validations"

export const combatFliteToWaypoints = (combatFlite: CombatFlite) => ({
  waypoints: combatFlite.Objects.Waypoints.Waypoint.map((cfWypt, idx) => ({
    elementOrder: idx,
    waypoint: {
      name: cfWypt.Name,
      coordinate: {
        latitude: cfWypt.Position.Latitude,
        longitude: cfWypt.Position.Longitude,
        elevation: cfWypt.Position.Altitude,
        elevationUnit: ElevationUnit.METERS,
      },
    },
  })),
})
