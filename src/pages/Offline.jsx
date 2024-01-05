import React from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'

function Offline() {

    const { currentColor } = useStateContext()

  return (
    <div className='flex-1 items-center justify-center conZ w-full min-h-full'>
      <center className='dark:text-gray-200 text-gray-700 text-center m-20'>
        Vous êtes déconnecté, <Link to={"/"} style={{color: currentColor}} className='rounded-md p-2' >page de connexion ?</Link>
      </center>
    </div>
  )//color='blue'
}

export default Offline
