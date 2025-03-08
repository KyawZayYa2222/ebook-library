import React from 'react'
import notFound from './assets/not-found.png'

export default function PageNotFound() {
  return (
    <div className='flex w-full h-screen justify-center items-center'>
      <img src={notFound} alt="not-found-image" />
    </div>
  )
}
