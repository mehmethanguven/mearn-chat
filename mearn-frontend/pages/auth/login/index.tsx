'use client'

import { NextPage } from 'next'
import Image from 'next/image'
import React, { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../../services/features/auth/authSlice'
import { AppDispatch } from '../../../services/store'
import { toast } from 'react-toastify'
import logo from '../../../assets/images/logo.svg'
import { VscLoading } from 'react-icons/vsc'

const loginPage: NextPage = () => {
  const [userInput, setUserInput] = useState({
    username: '',
    password: '',
  })
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isSuccess, isLoading, isError, errorMessage } = useSelector(
    (state: any) => state.auth,
  )

  const handleChange = (e: any) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value })
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(login(userInput))
  }

  useEffect(() => {
    if (isError) toast.error(errorMessage)
    if (user && isSuccess) {
      toast.success(`Login as ${user && user.name} ${user && user.lastname}`)
      router.push('/')
    }
  }, [isSuccess, isError, user, dispatch])
  return (
    <div className='w-screen h-screen bg-gray-900'>
      <div className='container relative flex items-center justify-center h-screen px-5 py-20 mx-auto '>
        <div className='box-border flex flex-col-reverse w-full h-full rounded-md shadow-md md:flex-row'>
          <div className='box-border flex flex-col justify-center w-full h-full p-8 text-gray-600 rounded-lg md:w-1/2 bg-slate-100 sm:px-10 lg:px-20 md:rounded-none md:rounded-l-lg'>
            <form className='w-full' onSubmit={handleSubmit}>
              <h2 className='text-3xl font-bold text-blue-800'>Login</h2>
              <div className='flex flex-col justify-center my-3'>
                <label htmlFor='username'>Username or email</label>
                <input
                  type='text'
                  name='username'
                  id='username'
                  placeholder='cedric karungu'
                  className='p-2 border-2 rounded-md bg-slate-100'
                  onChange={handleChange}
                />
              </div>
              <div className='flex flex-col justify-center my-3'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  placeholder='1234567890'
                  className='p-2 border-2 rounded-md bg-slate-100'
                  onChange={handleChange}
                />
              </div>
              <div className='flex flex-wrap justify-center w-full gap-2 my-3 md:justify-start'>
                <button
                  className='flex items-center justify-center w-full px-5 py-2 bg-blue-700 rounded-md text-slate-50 md:w-1/2'
                  type='submit'
                >
                  {isLoading ? (
                    <VscLoading className='text-center animate-spin' />
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
                <div className='flex py-2 md:hidden'>
                  <p>Or</p>
                </div>
                <button
                  className='flex items-center justify-center w-full px-5 py-2 text-center text-blue-700 border-2 border-blue-700 rounded-md md:hidden md:w-1/2 bg-slate-100'
                  type='reset'
                  onClick={() => router.push('/auth/signup')}
                >
                  <span>Create an account</span>
                </button>
              </div>
            </form>
          </div>
          <div className='flex-col items-center justify-center hidden w-full p-20 bg-blue-900 rounded-r-lg md:flex md:w-1/2'>
            <div className='mb-4 w-60'>
              <Image src={logo} />
            </div>

            <h2 className='text-4xl font-bold text-slate-50'>Crypto chat</h2>
            <p className='m-4 text-sm text-center text-white'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
            <button
              className='px-5 py-2 m-5 border border-white rounded-md text-slate-50'
              onClick={() => router.push('/auth/signup')}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default loginPage
