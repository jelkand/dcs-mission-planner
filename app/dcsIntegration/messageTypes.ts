export type DCSMessage = InputMessage | ReadStateMessage | LuaCommandMessage

export interface InputMessage {
  action: "input"
  payload: {
    deviceId: number
    inputId: number
    value: number
  }
}

export interface ReadStateMessage {
  action: "read"
  payload: {}
}

export interface LuaCommandMessage {
  action: "lua"
  payload: {
    lua: string
  }
}

export interface InfoMessage {
  action: "info"
  payload: {}
}

export interface InfoMessageResponse {
  version: string
  result: {
    airframe: string
  }
}

export interface MessageResponse {
  version: string
  result: any
  error?: string
}
