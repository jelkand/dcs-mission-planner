import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { decimalValueToDDMString } from "app/coordinates/transformers"
import { ElevationUnit } from "db"

interface WaypointTableProps {
  waypoints: {
    elementOrder: number
    id?: number
    waypoint: {
      name: string
      coordinate: {
        latitude: number
        longitude: number
        elevation: number
        elevationUnit: ElevationUnit
      }
    }
  }[]
}

export const WaypointTable = ({ waypoints }: WaypointTableProps) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Index</Th>
        <Th>Waypoint</Th>
        <Th>Latitude</Th>
        <Th>Longitude</Th>
        <Th>Elevation</Th>
      </Tr>
    </Thead>
    <Tbody>
      {waypoints.map(({ id, waypoint, elementOrder }) => (
        <Tr key={id || `waypoint-${elementOrder}`}>
          <Td>{elementOrder}</Td>
          <Td>{waypoint.name}</Td>
          <Td>{decimalValueToDDMString(waypoint.coordinate.latitude, true)}</Td>
          <Td>{decimalValueToDDMString(waypoint.coordinate.longitude, false)}</Td>
          <Td>
            {waypoint.coordinate.elevation} {waypoint.coordinate.elevationUnit}
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)
