/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { SignalData } from 'simple-peer'

interface IAnswerCall {
  to: string
  signal: SignalData
}

export { IAnswerCall }
