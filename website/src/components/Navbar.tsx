import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <nav className='fixed top-0 w-full bg-white drop-shadow-md z-10'>
      <div className='flex justify-between items-center px-4 py-2'>
        <h3 className='font-bold'>
          <Link href="/">
            TremorGuard
          </Link>
        </h3>
        <ul className='flex gap-x-4'>
          <li>
            <Link href="/imu">
              IMU
            </Link>
          </li>
          <li>
            <Link href="/mic">
              Microphone
            </Link>
          </li>
          {/* <li>Settings</li> */}
        </ul>
      </div>
    </nav>
  )
}
