'use client'

import React, { useEffect } from 'react'
import { Button } from './ui/button'

export default function Data() {
  
  const sendData = async () => {
    try {
      const res = await fetch(process.env.BACKEND_URL || 'http://localhost:4000')
      const data = await res.json();
      alert("Message successfully sent: " + data);
    } catch (err: any) {
      alert("Exception occurred " + err)
    }
  }
  
  return (
    <div>
      <Button onClick={sendData}>Send message</Button>
    </div>
  )
}
