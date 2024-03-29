/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { generateRefreshToken, generateToken } from '../utils/functions'
import cloudinary from '../config/cloudinary'
import { validateLoginData, validateRegister } from '../utils/validation'
import { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find()
      res.status(200).json({ users })
    } catch (error) {
      const err = new Error('internal error')
      res.status(500)
      return next(err)
    }
  },
)

export const getCurrentUser = asyncHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('currentUser is called')
    try {
      const user = res.locals.user
      res.status(200).json({ user })
    } catch (error) {
      const err = new Error('internal error')
      res.status(500)
      return next(err)
    }
  },
)

export const getOneUser = asyncHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
      const user = await User.findById(id)
      if (user) res.status(200).json({ user })
      else {
        const err = new Error('user dont exist')
        res.status(400)
        return next(err)
      }
    } catch (error) {
      const err = new Error('internal error')
      res.status(500)
      return next(err)
    }
  },
)

export const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh } = req.body
    console.log('refresh', refresh)
    try {
      //verify
      const decoded = jwt.verify(
        refresh,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.JWT_SECRET!,
      ) as JwtPayload

      // Get user from the token
      const user = await User.findById(decoded.id)
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        res.status(201).json({
          accessToken: generateToken(user._id),
          refreshToken: generateRefreshToken(user._id),
        })
      } else {
        const error = new Error('user not found')
        res.status(404)
        return next(error)
      }
    } catch (err) {
      console.log('err', err)
      const error = new Error('internal error')
      res.status(500)
      return next(error)
    }
  },
)

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = validateRegister(req.body)
    if (validation.error) {
      const err = new Error('invalid user data provided')
      res.status(400)
      return next(err)
    }
    const { name, lastname, email, username, password } = req.body

    // check if user exist
    const existUser = await User.findOne({ email })
    if (existUser) {
      const err = new Error('user already exist')
      res.status(409)
      return next(err)
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      username,
    })
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        imageUrl: user.imageUrl,
        token: generateToken(user._id),
        accessToken: generateToken(user._id),
      })
    } else {
      const err = new Error('internal error')
      res.status(500)
      return next(err)
    }
  },
)

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('loginUser is called')
    try {
      const validation = validateLoginData(req.body)
      console.log(validation)
      if (validation.error) {
        const err = new Error('Email or password is incorrect')
        res.status(400)
        return next(err)
      }

      const { username, email, password } = req.body

      if (!password || (!username && !email)) {
        const error = new Error('some fields missing')
        res.status(409)
        return next(error)
      }

      let user

      if (username) {
        user = await User.findOne({ $or: [{ username }, { email: username }] })
        console.log(user)
      }

      if (email) {
        user = await User.findOne({
          email,
        })
        console.log(user)
      }

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const isPasswordValid = bcrypt.compare(password, user.password!)
        if (!isPasswordValid) {
          const error = new Error('Auth error')
          res.status(400)
          return next(error)
        } else {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            imageUrl: user.imageUrl,
            phoneNumber: user.phoneNumber,
            token: generateToken(user._id),
            accessToken: generateToken(user._id),
            refreshToken: generateRefreshToken(user._id),
          })
        }
      } else {
        const error = new Error('user not found')
        res.status(400)
        return next(error)
      }
    } catch (err) {
      console.log('err', err)
      const error = new Error('internal error')
      res.status(500)
      return next(error)
    }
  },
)

export const updateImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        const error = new Error('No image provided')
        res.status(400)
        return next(error)
      }
      const resCloud = await cloudinary.uploader.upload(req.file.path, {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      const userId = req.user?.id
      const user = await User.findById(userId)
      if (user) {
        user.imageUrl = resCloud.secure_url
        user.cloudinary_id = resCloud.public_id
        await user.save()

        res.status(201).json({
          _id: user._id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          imageUrl: user.imageUrl,
          token: generateToken(user._id),
          accessToken: generateToken(user._id),
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const error = new Error(err)
      res.status(500)
      return next(error)
    }
  },
)

export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const {
      name,
      lastname,
      email,
      username,
      password,
      password2,
      currentpassword,
    } = req.body
    if (!id) {
      const error = new Error('user invalid')
      res.status(400)
      return next(error)
    }
    const user = await User.findById(id)
    if (user) {
      const passwordMatched = await bcrypt.compare(
        currentpassword,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user.password!,
      )
      if (!passwordMatched) {
        const error = new Error('invalid current password')
        res.status(400)
        return next(error)
      }
      if (password && password2 && password !== password2) {
        const error = new Error('new password validation error')
        res.status(400)
        return next(error)
      }
      const hashedNewPassword =
        password === password2
          ? await bcrypt.hash(password, await bcrypt.genSalt(10))
          : user.password
      const updatedUser = await User.updateOne(user._id, {
        name: name || user.name,
        lastname: lastname || user.lastname,
        email: email || user.email,
        username: username || user.username,
        password: hashedNewPassword,
      })
      res.status(201).json(updatedUser)
    } else {
      const error = new Error(`User wthi id ${id} not found`)
      res.status(400)
      return next(error)
    }
  },
)
