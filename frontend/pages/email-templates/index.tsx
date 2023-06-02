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
import SuccessfulJoin from '../../components/email-templates/SuccessfulJoin'
import VerifyEmail from '../../components/email-templates/VerifyEmail'
import ResetPassword from '../../components/email-templates/ResetPassword'
import EmailTemplate from '../../components/email-templates/EmailTemplate'

const EmailsPages = () => {
  return (
    <div className='grid grid-cols-1 gap-8 mt-5'>
      <EmailTemplate
        desc=' Thanks for the joining me on this journey, check out online
                users down here below'
        imageUrl='https://lh3.googleusercontent.com/a/AAcHTtes8LUsER_94MmULVw8uVsK_so5qA-FlHV0e85fZg=s96-c-rg-br100'
        title=' Thanks for joining to '
        url='www.merkezsoft.com'
        buttonTitle='Click me'
      />

      <EmailTemplate
        desc="If you want to verify your email please click 'Verify Email'
              button to verify your email."
        title='Verify you email.'
        url='https://www.merkezsoft.com/verify-email'
        buttonTitle='Verify Email'
      />
      <EmailTemplate
        desc="If you want to reset your password please click 'Reset Password'
                button to reset your password."
        title='Reset your password.'
        url='https://www.merkezsoft.com/reset-password'
        buttonTitle='Reset Password'
      />
    </div>
  )
}

export default EmailsPages
