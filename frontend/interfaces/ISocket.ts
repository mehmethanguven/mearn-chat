import type { SignalData } from 'simple-peer'

type SocketListenEvents =
  | 'set-online'
  | 'set-offline'
  | 'online-users'
  | 'me'
  | 'callended'
  | 'calluser'
  | 'callaccepted'
  | 'leavecall'
type SocketEmitEvents =
  | 'calluser'
  | 'answercall'
  | 'leavecall'
  | 'set-online'
  | 'set-offline'
  | 'set-status'

interface ISocketMe {
  socketId: string
}

interface ISocketCallUser {
  signal: SignalData
  from: string
  name: string
}

interface ISocketCallAccepted {
  signal: SignalData
}

export {
  type SocketListenEvents,
  type SocketEmitEvents,
  type ISocketMe,
  type ISocketCallUser,
  type ISocketCallAccepted,
}
