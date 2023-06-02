import {
  Body,
  Container,
  Html,
  Head,
  Heading,
  Img,
  Tailwind,
  Text,
  Button,
} from '@react-email/components'
import { useEffect, useState } from 'react'

interface ResetPasswordProps {
  url: string
}

const ResetPassword: React.FC<Readonly<ResetPasswordProps>> = ({ url }) => {
  return (
    <div className='grid justify-center grid-cols-1 p-8 mx-auto shadow-lg'>
      <div className='flex flex-col items-center justify-center my-4 font-sans bg-white'>
        <Tailwind>
          <div className='flex flex-col items-center justify-center my-4 font-sans bg-white'>
            <Container className='p-8'>
              <Heading className='pt-4 text-xl'>Reset your password.</Heading>
              <Text className='text-lg font-medium text-gray-700'>
                {' '}
                If you want to reset your password please click 'Reset Password'
                button to reset your password.
              </Text>
            </Container>
            <Button
              className='w-40 px-4 py-2 text-center text-white rounded-md bg-slate-600'
              href={url}
            >
              Reset Password
            </Button>
          </div>
        </Tailwind>
      </div>
    </div>
  )
}

export default ResetPassword
