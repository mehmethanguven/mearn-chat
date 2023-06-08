import socket from '../socket'

export const setStatus = (userId: string, isReady: boolean) => {
  socket
    .getIO()
    .emit('messages', { action: 'create', message: `${userId} ${isReady}` })
}
