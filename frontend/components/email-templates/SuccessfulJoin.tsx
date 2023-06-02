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

interface SuccessfulJoinProps {
  url: string
}

const SuccessfulJoin: React.FC<Readonly<SuccessfulJoinProps>> = ({ url }) => {
  return (
    <div className='grid justify-center grid-cols-1 p-8 mx-auto shadow-lg'>
      <Tailwind>
        <div className='flex flex-col items-center justify-center my-4 font-sans bg-white'>
          <Container className='p-8'>
            <Img
              src='https://lh3.googleusercontent.com/a/AAcHTtes8LUsER_94MmULVw8uVsK_so5qA-FlHV0e85fZg=s96-c-rg-br100'
              className='w-24 mx-auto border-2 border-red-500'
            />

            <Heading className='pt-4 text-xl'>
              {' '}
              Thanks for joining to {url}
            </Heading>
            <Text className='text-lg font-medium text-gray-700'>
              {' '}
              Thanks for the joining me on this journey, check out online users
              down here below
            </Text>
          </Container>
          <Button
            className='w-40 px-4 py-2 text-center text-white rounded-md bg-slate-600'
            href={url}
          >
            Click me
          </Button>
        </div>
      </Tailwind>
    </div>
  )
}

export default SuccessfulJoin
