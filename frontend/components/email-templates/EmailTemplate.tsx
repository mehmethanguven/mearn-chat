import {
  Container,
  Heading,
  Img,
  Tailwind,
  Text,
  Button,
} from '@react-email/components'

interface EmailTemplateProps {
  buttonTitle: string
  desc: string
  imageUrl?: string
  title: string
  url: string
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  buttonTitle = 'Submit',
  desc,
  imageUrl,
  title,
  url,
}) => {
  return (
    <div className='grid justify-center grid-cols-1 p-8 mx-auto shadow-lg'>
      <Tailwind>
        <div className='flex flex-col items-center justify-center my-4 font-sans bg-white'>
          <Container className='p-8'>
            {imageUrl && (
              <Img
                src={imageUrl}
                className='w-24 mx-auto mb-8 border-2 border-red-500'
              />
            )}

            <Heading className='pt-4 mb-8 text-3xl font-bold'>{title}</Heading>
            <Text className='text-lg font-medium text-gray-700'>{desc}</Text>
          </Container>
          <Button
            className='w-40 px-4 py-2 text-center text-white rounded-md bg-slate-600'
            href={url}
          >
            {buttonTitle}
          </Button>
        </div>
      </Tailwind>
    </div>
  )
}

export default EmailTemplate
