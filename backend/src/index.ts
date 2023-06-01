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
//   console.log('socket connected to client')
//   socket.emit('message', 'hello world')
// })
type User = {
  id: number
  email: string
  username: string
  socketId: string
  isOnline: boolean
}

const onlineUsers: User[] = []
io.on('connection', (socket: any) => {
  const connectedUsers: { [key: string]: User } = {}
  //console.log(socket.id)
  socket.emit('me', { socketId: socket.id })

  socket.on(EventEnum.SET_ONLINE, (user: User) => {
    try {
      const index = onlineUsers.findIndex((i: User) => i.id === user.id)
      //	console.log('set_online is called and index is', index)
      if (index === -1) {
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
      //console.log('onlineUsers', onlineUsers);
      // console.log('onlineUsers length ', onlineUsers.length.toString())
      // if (connectedUsers.hasOwnProperty(user.id)) {
      //   connectedUsers[user._id].emit('is_online', true);
      // }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  })

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
    //console.log('to', userToCall, 'from', from, 'name', name)
    io.to(userToCall).emit('calluser', { signal: signalData, from, name })
  })

  socket.on('answercall', (data: IAnswerCall) => {
    io.to(data.to).emit('callaccepted', { signal: data.signal })
  })

  socket.on('leavecall', ({ socketId }: { socketId: string }) => {
    io.to(socketId).emit('leavecall', true)
  })
})

export default app
