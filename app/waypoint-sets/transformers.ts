import { z } from "zod"

export const CombatFliteSchema = z.object({
  Objects: z.object({
    Waypoints: z.object({
      Waypoint: z.array(
        z.object({
          Name: z.string(),
          ShortName: z.string(),
          Position: z.object({
            Latitude: z.number().gt(-90).lt(90),
            Longitude: z.number().gt(-180).lt(180),
            Altitude: z.number().nonnegative(),
          }),
        })
      ),
    }),
  }),
})

export const combatFliteToWaypointSet = (combatFliteJson: z.infer<typeof CombatFliteSchema>) => ({})

export const parseCombatFliteXML = (xmlString: string) => {}
