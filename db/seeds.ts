import db from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  await db.waypointSet.create({
    data: {
      name: "RAM SEAD/DEAD 20210924",
      createdAt: new Date("2021-09-24"),
      updatedAt: new Date(),
      waypoints: {
        create: [
          {
            elementOrder: 0,
            sequenceNum: 1,
            waypoint: {
              create: {
                name: "CVN-73 George Washington",
                coordinate: {
                  create: {
                    latitude: 24.877667,
                    longitude: 53.888333,
                    elevation: 0,
                    elevationUnit: "FEET",
                  },
                },
              },
            },
          },
          {
            elementOrder: 1,
            sequenceNum: 1,
            waypoint: {
              create: {
                name: "AAR",
                coordinate: {
                  create: {
                    latitude: 25.1115,
                    longitude: 54.4,
                    elevation: 22000,
                    elevationUnit: "FEET",
                  },
                },
              },
            },
          },
          {
            elementOrder: 2,
            sequenceNum: 1,
            waypoint: {
              create: {
                name: "PUSH/FENCE",
                coordinate: {
                  create: {
                    latitude: 25.401333,
                    longitude: 54.659167,
                    elevation: 30000,
                    elevationUnit: "FEET",
                  },
                },
              },
            },
          },
          {
            elementOrder: 3,
            sequenceNum: 1,
            waypoint: {
              create: {
                name: "SEAD/DEAD",
                coordinate: {
                  create: {
                    latitude: 25.879333,
                    longitude: 55.033833,
                    elevation: 300000,
                    elevationUnit: "FEET",
                  },
                },
              },
            },
          },
          {
            elementOrder: 4,
            sequenceNum: 1,
            waypoint: {
              create: {
                name: "ALAMO",
                coordinate: {
                  create: {
                    latitude: 24.877667,
                    longitude: 53.888333,
                    elevation: 30000,
                    elevationUnit: "FEET",
                  },
                },
              },
            },
          },
          {
            elementOrder: 5,
            waypoint: {
              create: {
                waypointType: "BULLSEYE",
                name: "BULLSEYE",
                coordinate: {
                  create: {
                    latitude: 26.574567,
                    longitude: 56.311767,
                    elevation: 0,
                    elevationUnit: "FEET",
                  },
                },
              },
            },
          },
        ],
      },
    },
  })
}

export default seed
