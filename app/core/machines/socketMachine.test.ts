import { interpret } from "xstate"

import { socketMachine } from "./socketMachine"

const socket = jest.fn()
const handler = jest.fn()
const notifier = jest.fn()
const mockedSocketMachine = socketMachine
  .withConfig({
    services: {
      dcsSocketCallback: () => socket,
    },
    actions: {
      notifyInitialized: notifier,
      handleFirstInDeque: handler,
      sendToParent: jest.fn(),
    },
  })
  .withContext({
    ...socketMachine.context,
    maxRetries: 0,
  })

describe("Socket Machine", () => {
  it("Should attempt run through the lifecycle when configured with no retries", async () => {
    const socketService = interpret(mockedSocketMachine)

    socketService.start()

    expect(socketService.state.matches("open.initializing")).toBe(true)

    socketService.send({ type: "DCS_SOCKET_CONNECTED" })
    expect(socketService.state.matches("open.ready")).toBe(true)

    socketService.send({ type: "DCS_SOCKET_CLOSED" })
    expect(socketService.state.matches("closed")).toBe(true)

    socketService.send({ type: "ATTEMPT_CONNECTION" })
    expect(socketService.state.matches("open.initializing")).toBe(true)
  })
})
