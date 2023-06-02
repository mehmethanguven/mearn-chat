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

interface VerifyEmailProps {
  url: string
}

const VerifyEmail: React.FC<Readonly<VerifyEmailProps>> = ({ url }) => {
  return (
    <div className='grid justify-center grid-cols-1 p-8 mx-auto shadow-lg'>
      <div className='flex flex-col items-center justify-center my-4 font-sans bg-white'>
        <Tailwind>
          <div className='flex flex-col items-center justify-center my-4 font-sans bg-white'>
            <Container className='p-8'>
              <Heading className='pt-4 text-xl'>Verify your email.</Heading>
              <Text className='text-lg font-medium text-gray-700'>
                {' '}
                If you want to verify your email please click 'Verify Email'
                button to verify your email.
              </Text>
            </Container>
            <Button
              className='w-40 px-4 py-2 text-center text-white rounded-md bg-slate-600'
              href={url}
            >
              Verify Email
            </Button>
          </div>
        </Tailwind>
      </div>
    </div>
  )
}

export default VerifyEmail
