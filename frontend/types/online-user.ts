export interface OnlineUser {
  id: string
  email: string
  socketId: string
  username: string
  imageUrl?: string
  isBusy: boolean
  isReady: boolean
  status: string
}
