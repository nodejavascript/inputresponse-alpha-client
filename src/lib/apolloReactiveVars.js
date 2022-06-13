import { makeVar } from '@apollo/client'

// if exists, user is authenticated
export const memoryUser = makeVar()
export const memoryConnected = makeVar(false)
