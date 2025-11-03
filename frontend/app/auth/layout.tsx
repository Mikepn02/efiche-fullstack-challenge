import Image from 'next/image'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-1 min-h-screen'>
      <div className='flex flex-col w-full md:w-1/2 justify-center px-4 py-12  lg:px-20 xl:px-24'>{children}</div>
      <div className="bg-primary relative hidden lg:flex  justify-center items-center  w-full md:w-1/2">
        <Image
          src={'/flow-lines.svg'}
          alt='logo'
          width={400}
          height={400}
          className='absolute top-0 right-0'
        />
        <Image
          src={'/logo.svg'}
          alt='logo'
          width={150}
          height={150}
        />
        <Image
          src="/flow-lines.svg"
          alt="logo"
          width={300}
          height={100}
          className="absolute bottom-0 left-0 w-72 h-24 object-cover"
        />


      </div>
    </div>
  )
}

export default Layout