import { IdentificationBadge, PhoneCall, PhoneX } from 'phosphor-react'
import { useRef } from 'react'
import { toast } from 'react-toastify'

import { useSocket } from '../hooks/useSocket'
import { isMobileDevice } from '../utils/isMobileDevice'
import { type IMakeACallModalHandle, MakeACallModal } from './MakeACallModal'

const FloatButtons = () => {
  const { me, userSocketId, call, callAccepted, callEnded, leaveCall, user } =
    useSocket()

  const makeACallModalRef = useRef<IMakeACallModalHandle>(null)

  async function handleCopyYourId() {
    await navigator.clipboard.writeText(me)

    toast('ID copied to clipboard', {
      autoClose: 3000,
      type: 'info',
      position: isMobileDevice() ? 'top-left' : 'bottom-left',
      closeButton: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      theme: 'dark',
    })
  }

  function handleLeaveCall() {
    // If I called another user, disconnect him too
    if (userSocketId) {
      console.log('userSocketId', userSocketId)
      leaveCall(userSocketId)

      return
    }

    // If I'm the one who accepted the call, disconnect the other user who called me
    if (call?.from) {
      console.log('callfrom', call.from)
      leaveCall(call.from)
    }
  }

  return (
    <>
      <MakeACallModal ref={makeACallModalRef} />

      <div className='fixed flex flex-col items-center justify-center right-4 bottom-4 gap-y-2'>
        <button
          className='p-2 transition-colors bg-blue-500 rounded-full hover:bg-blue-400'
          type='button'
          onClick={handleCopyYourId}
        >
          <IdentificationBadge className='text-white' size={30} />
        </button>

        {!callAccepted && (
          <button
            className='p-2 transition-colors bg-green-500 rounded-full hover:bg-green-400'
            type='button'
            onClick={() => makeACallModalRef?.current?.openModal()}
          >
            <PhoneCall className='text-white' size={30} />
          </button>
        )}

        {callAccepted && !callEnded && (
          <button
            className='p-2 transition-colors bg-red-500 rounded-full hover:bg-red-400'
            type='button'
            onClick={handleLeaveCall}
          >
            <PhoneX className='text-white' size={30} />
          </button>
        )}
      </div>
    </>
  )
}

export { FloatButtons }
