/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import morgan from 'morgan'
import path from 'path'
import socket from './socket'

// db config import
import connectDB from './config/db'

const app: Application = express()

// routes and middlewares import
import usersRoutes from './routes/user.routes'
import messagesRoutes from './routes/message.routes'
import errors from './middlewares/error.middleware'
import type { IAnswerCall } from './interfaces/IAnswerCall'
import type { ICallUser } from './interfaces/ICallUser'
import EventEnum from './utils/events'
//import { isAuth } from './middlewares/auth'
// config
dotenv.config()
connectDB()

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(multer({ fileFilter, storage: fileStorage }).single('image'));
app.use(morgan('dev'))
app.use('/images', express.static(path.join(__dirname, 'images')))

//use routes
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/messages', messagesRoutes)

// errors middlewares
app.use(errors.internalError)
app.use(errors.notFoundError)

const PORT: number | string | undefined = process.env.NODE_PORT || 4000

const httpServer = createServer(app).listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`app listening on ${PORT}`),
)

const io = socket.init(httpServer)

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
// io.on('connection', (socket: any) => {
//   // eslint-disable-next-line no-console
//   console.log('socket connected to from')
//   socket.emit('message', 'hello world')
// })
type User = {
  _id: string
  id: string
  email: string
  username: string
  socketId: string
  isOnline: boolean
  isReady: boolean
  emit: (key: string, data: any) => void
}

// io.use(isAuth)
const onlineUsers: User[] = []
// const connectedUsers = {}
const connectedUsers: { [key: string]: User } = {}

io.on('connection', (socket: any) => {
  console.log(socket.id)
  socket.emit('me', { socketId: socket.id })

  socket.on(EventEnum.SET_ONLINE, (user: User) => {
    try {
      const index = onlineUsers.findIndex((i: User) => i.id === user.id)
      console.log('set_online is called and index is', index)
      if (index === -1) {
        user.isReady = true
        socket.username = user.username
        socket.userId = user.id
        connectedUsers[user.id] = socket
        user.socketId = socket.id
        socket.nickname = user.username
        socket.user = user
        onlineUsers.push(user)
        //io.emit('is_online', true)
        io.emit(EventEnum.ONLINE_USERS, onlineUsers)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  })

  socket.on(EventEnum.SET_STATUS, (userId: string, isReady: boolean) =>
    setStatus(userId, isReady),
  )

  const setStatus = (userId: string, isReady: boolean) => {
    try {
      const index = onlineUsers.findIndex((i) => i.id === userId)
      const user = onlineUsers.find((i) => i.id === userId)
      console.log('set busy user is called', userId, index)
      // console.log('onlineUsers', onlineUsers)
      console.log('user', user)
      if (index > -1) {
        const user = onlineUsers.find((i) => i.id === userId)
        if (user != null) {
          user.isReady = isReady
          onlineUsers[index] = user
        }
        console.log('setBusy', user)
        io.emit(EventEnum.ONLINE_USERS, onlineUsers)
      }
      //console.log('after set-busy onlineUsers length ', onlineUsers)
    } catch (error) {
      console.log(error)
    }
  }

  socket.on(EventEnum.SET_OFFLINE, (userId: string) => {
    try {
      console.log('set offline user is called', userId)
      const index = onlineUsers.findIndex((i: any) => i.id === userId)
      if (index > -1) {
        onlineUsers.splice(index, 1)
        // console.log('onlineUsers', onlineUsers);
        io.emit(EventEnum.ONLINE_USERS, onlineUsers)
      }
      console.log('after set-offline onlineUsers length ', onlineUsers)
    } catch (error) {
      console.log(error)
    }
  })

  socket.on(EventEnum.GET_ONLINE_USERS, () => {
    // const onlineUsers = Object.values(connectedUsers)
    //   .filter((user) => user.isOnline)
    //   .map((user) => ({
    //     id: user.id,
    //     email: user.email,
    //     isOnline: user.isOnline,
    //   }));

    console.log('onlineUsers', onlineUsers)
    socket.emit(EventEnum.ONLINE_USERS, onlineUsers)
  })

  socket.on('disconnect', () => {
    const disconnectedUser = socket.userId
    console.log('disconnect called', disconnectedUser)
    const index = onlineUsers.findIndex((x: User) => x.id === disconnectedUser)
    // console.log('disconnectedUser index', disconnectedUser, index);
    if (index > -1) {
      onlineUsers.splice(index, 1)
      io.emit(EventEnum.ONLINE_USERS, onlineUsers)
    }
    socket.broadcast.emit(
      EventEnum.USER_DISCONNECTED,
      `${socket.id} disconnected!`,
    )
    socket.broadcast.emit('callended')
  })

  socket.on('calluser', ({ userToCall, signalData, from, name }: ICallUser) => {
    console.log('to', userToCall, 'from', from, 'name', name)
    //console.log('connectedUsers', connectedUsers[userToCall])
    // io.to(userToCall).emit('calluser', { signal: signalData, from, name })
    if (connectedUsers.hasOwnProperty(userToCall)) {
      console.log('find the user to call', userToCall)
      connectedUsers[userToCall].emit('calluser', {
        signal: signalData,
        from,
        name,
      })
    }
  })

  socket.on('answercall', (data: IAnswerCall) => {
    io.to(data.to).emit('callaccepted', { signal: data.signal })
    // console.log('answercall', data.to)
    // if (connectedUsers.hasOwnProperty(data.to)) {
    //   console.log('find the user answer the call', data.to)
    //   connectedUsers[data.to].emit('callaccepted', { signal: data.signal })
    // }
  })

  socket.on('leavecall', ({ socketId }: { socketId: string }) => {
    io.to(socketId).emit('leavecall', true)
    if (connectedUsers.hasOwnProperty(socketId)) {
      console.log('find the user leave the call', socketId)
      connectedUsers[socketId].emit('leavecall', true)
    }
  })

  // from knowtonow

  socket.on('message_notifier', (data: any) => {
    try {
      const id = data.receiver._id
      if (connectedUsers.hasOwnProperty(id)) {
        connectedUsers[id].emit('message_notifier', data)
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('con_cancelled', (data: any) => {
    try {
      const toId = data.to._id
      const fromId = data.client._id
      console.log('fromId', fromId, 'toId', toId)

      if (toId) {
        setStatus(toId, true)
      }
      if (fromId) {
        setStatus(toId, true)
      }
      // if (connectedUsers.hasOwnProperty(fromId)) {
      // 	connectedUsers[fromId].emit('con_cancelled', data)
      // }
      if (connectedUsers.hasOwnProperty(toId)) {
        connectedUsers[toId].emit('con_cancelled', data)
      }
    } catch (error) {
      console.log(error)
    }
  })
  socket.on('con_completed', (data: any) => {
    console.log('con_completed is called', data.from._id)
    try {
      const toId = data.to._id
      const fromId = data.from._id

      if (toId) {
        setStatus(toId, true)
      }
      if (fromId) {
        setStatus(toId, true)
      }
      if (connectedUsers.hasOwnProperty(fromId)) {
        connectedUsers[fromId].emit('con_completed', data)
      }
      if (connectedUsers.hasOwnProperty(toId)) {
        connectedUsers[toId].emit('con_completed', data)
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('con_requested', (data: any) => {
    console.log('con request from to', data.from, data.to)

    try {
      const toId = data.to._id
      const fromId = data.from._id

      if (toId) {
        setStatus(toId, false)
      }
      if (fromId) {
        setStatus(toId, false)
      }

      console.log('con request from to', data.from, data.to)
      if (connectedUsers.hasOwnProperty(toId)) {
        connectedUsers[toId].emit('con_requested', data)
      }
      // if (connectedUsers.hasOwnProperty(fromId)) {
      // 	connectedUsers[fromId].emit('con_requested', data)
      // }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('con_rejected', (data: any) => {
    try {
      const toId = data.to._id
      const fromId = data.from._id

      if (toId) {
        setStatus(toId, true)
      }
      if (fromId) {
        setStatus(toId, true)
      }
      if (connectedUsers.hasOwnProperty(fromId)) {
        connectedUsers[fromId].emit('con_rejected', data)
      }
      // if (connectedUsers.hasOwnProperty(toId)) {
      // 	connectedUsers[toId].emit('con_rejected', data)
      // }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('con_accepted', (data: any) => {
    try {
      console.log('connection accepted data', data)
      const fromId = data.from._id
      const toId = data.to._id
      if (toId) {
        setStatus(toId, false)
      }
      if (fromId) {
        setStatus(toId, false)
      }
      if (connectedUsers.hasOwnProperty(fromId)) {
        connectedUsers[fromId].emit('con_accepted', data)
      }
      // if (connectedUsers.hasOwnProperty(toId)) {
      // 	connectedUsers[toId].emit('con_accepted', data)
      // }
    } catch (error) {
      console.log(error)
    }
  })
})

export default app

// const messageNotifier = (data: any) => {
//   try {
//     const id = data.receiver._id
//     if (connectedUsers.hasOwnProperty(id)) {
//       connectedUsers[id].emit('message_notifier', data)
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }
