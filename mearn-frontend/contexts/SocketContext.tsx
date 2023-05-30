import { useRouter } from 'next/router'
import {
  createContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from 'react'
import Peer, { type SignalData, type Instance } from 'simple-peer'
import { io, type Socket } from 'socket.io-client'

import {
  ISocketCallUser,
  SocketListenEvents,
  SocketEmitEvents,
  ISocketMe,
  ISocketCallAccepted,
} from '../interfaces/ISocket'
import { useSelector } from 'react-redux'
import { OnlineUser } from '../types/online-user'
import EventEnum from '../utils/events'

interface ICall {
  isReceivedCall: boolean
  from: string
  name: string
  signal: SignalData
}

interface ISocketContextData {
  socketRef: any
  isLoadingCheckPermissions: boolean
  userGrantedAudioAndVideoPermissions: boolean
  stream: MediaStream
  call: ICall
  callAccepted: boolean
  callEnded: boolean
  me: string
  userSocketId: string
  name: string
  onlineUsers: OnlineUser[]
  setName: Dispatch<SetStateAction<string>>
  setCall: Dispatch<SetStateAction<ICall>>
  myVideoRef: RefObject<HTMLVideoElement>
  userVideoRef: RefObject<HTMLVideoElement>
  requestAudioAndVideoPermissions: () => Promise<void>
  callUser: (userId: string) => void
  answerCall: () => void
  leaveCall: (socketId?: string) => void
  emitLogout: () => void
}

interface ISocketContextProviderProps {
  children: ReactNode
}

const SocketContext = createContext({} as ISocketContextData)

const SocketContextProvider = ({ children }: ISocketContextProviderProps) => {
  const router = useRouter()

  const [isLoadingCheckPermissions, setIsLoadingCheckPermissions] =
    useState<boolean>(true)
  const [
    userGrantedAudioAndVideoPermissions,
    setUserGrantedAudioAndVideoPermissions,
  ] = useState<boolean>(false)
  const [stream, setStream] = useState<MediaStream>({} as MediaStream)
  const [me, setMe] = useState<string>('')
  const [userSocketId, setUserSocketId] = useState<string>('')
  const [call, setCall] = useState<ICall>({} as ICall)
  const [name, setName] = useState<string>('Anonymo')
  const [callAccepted, setCallAccepted] = useState<boolean>(false)
  const [callEnded, setCallEnded] = useState<boolean>(false)

  const socketRef = useRef<Socket>()
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const connectionRef = useRef<Instance>()
  const {
    user,
    isError: isErrorUser,
    errorMessage: errorUser,
  } = useSelector((state: any) => state.auth)

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    //if (router.asPath === '/' || router.asPath === '/online-users') {
    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URI!)

    checkAudioAndVideoPermissions()

    socketRef.current.on<SocketListenEvents>(
      'me',
      ({ socketId }: ISocketMe) => {
        setMe(socketId)
      },
    )
    const onlineUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    }
    socketRef?.current?.emit<SocketEmitEvents>('set-online', onlineUser)

    const handler = (data: any) => {
      console.log('onlineUsers data', data)
      setOnlineUsers(data)
    }
    socketRef?.current?.on<SocketListenEvents>('online-users', handler)

    socketRef.current.on<SocketListenEvents>(
      'calluser',
      ({ from, name: callerName, signal }: ISocketCallUser) => {
        setCall({
          isReceivedCall: true,
          from,
          name: callerName,
          signal,
        })
      },
    )

    socketRef?.current?.on<SocketListenEvents>('leavecall', () => {
      leaveCall()
    })
    //}
  }, [router.asPath])

  // useEffect(() => {

  //   return () => {

  //   }
  // }, [])

  async function checkAudioAndVideoPermissions() {
    setIsLoadingCheckPermissions(true)

    const audioPermission = await navigator.permissions.query({
      name: 'microphone',
    } as any)

    const videoPermission = await navigator.permissions.query({
      name: 'camera',
    } as any)

    if (
      audioPermission.state === 'granted' &&
      videoPermission.state === 'granted'
    ) {
      setUserGrantedAudioAndVideoPermissions(true)
      setIsLoadingCheckPermissions(false)

      return true
    } else {
      setUserGrantedAudioAndVideoPermissions(false)
      setIsLoadingCheckPermissions(false)

      return false
    }
  }

  async function requestAudioAndVideoPermissions() {
    const currentStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    if (currentStream) {
      setStream(currentStream)
      setUserGrantedAudioAndVideoPermissions(true)

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = currentStream
      }
    } else {
      setUserGrantedAudioAndVideoPermissions(false)
    }
  }

  function callUser(userId: string) {
    const peer = new Peer({ initiator: true, trickle: false, stream })

    setUserSocketId(userId)

    peer.on('signal', (data) => {
      socketRef?.current?.emit<SocketEmitEvents>('calluser', {
        userToCall: userId,
        signalData: data,
        from: me,
        name,
      })
    })

    peer.on('stream', (currentStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = currentStream
      }
    })

    peer.on('close', () => {
      socketRef?.current?.off('callaccepted')
    })

    socketRef?.current?.on<SocketListenEvents>(
      'callaccepted',
      ({ signal }: ISocketCallAccepted) => {
        setCallAccepted(true)

        peer.signal(signal)

        connectionRef.current = peer
      },
    )
  }

  function answerCall() {
    setCallAccepted(true)

    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (data) => {
      socketRef?.current?.emit<SocketEmitEvents>('answercall', {
        to: call.from,
        signal: data,
      })
    })

    peer.on('stream', (currentStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = currentStream
      }
    })

    peer.signal(call.signal)

    connectionRef.current = peer
  }

  function leaveCall(socketId?: string) {
    setCallEnded(true)
    setCall({} as any)
    setCallAccepted(false)

    connectionRef!.current!.destroy()

    if (socketId) {
      socketRef?.current?.emit<SocketEmitEvents>('leavecall', { socketId })
    }

    //window.location.reload()
    router.push('/')
  }

  const emitLogout = () => {
    console.log('emitLogout', user)

    socketRef?.current?.emit(EventEnum.SET_OFFLINE, user._id)
  }

  return (
    <SocketContext.Provider
      value={{
        socketRef,
        isLoadingCheckPermissions,
        userGrantedAudioAndVideoPermissions,
        stream,
        call,
        callAccepted,
        callEnded,
        me,
        onlineUsers,
        userSocketId,
        name,
        setName,
        setCall,
        myVideoRef,
        userVideoRef,
        requestAudioAndVideoPermissions,
        callUser,
        answerCall,
        leaveCall,
        emitLogout,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export { SocketContextProvider, SocketContext }
