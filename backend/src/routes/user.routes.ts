import express from 'express'
import {
  getAllUsers,
  getCurrentUser,
  getOneUser,
  loginUser,
  refresh,
  registerUser,
  updateImage,
  updateUser,
} from '../controllers/user.controller'
import { isAuth } from '../middlewares/auth'
import upload from '../config/multer'

const router = express.Router()

router.get('/', isAuth, getAllUsers)
router.get('/me', isAuth, getCurrentUser)
router.get('/:id', isAuth, getOneUser)
router.put('/:id', isAuth, updateUser)
router.post('/login', loginUser)
router.post('/refresh', refresh)
router.post('/signup', registerUser)
router.post('/image', isAuth, upload.single('image'), updateImage)

export default router
