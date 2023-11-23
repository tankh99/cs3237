'use client';

import React from 'react'
import { Button } from './ui/button'
import {motion} from 'framer-motion'
import Link from 'next/link';

export default function AnimatedButton() {
  return (
    <motion.div 
      initial="hidden"
      variants={container}
      className='flex justify-center'
      animate={"visible"}>
      <Button className='bg-[#FF9972]'>
        <Link href='/imu'>
          Start
        </Link>
      </Button>
    </motion.div>
  )
}

const container = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,

    transition: {
      delay: 2,
      staggerChildren: 0.025,
      duration: 0.5
    }
  }
};