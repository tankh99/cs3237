'use client'

import React, { useEffect } from 'react'
import { Button } from './ui/button'
import useEvents, { IOTEvent } from '@/lib/utils/hooks/useEvents';
import { socket } from '@/lib/utils/socket';
import { EVENTS_SERVER } from '@/lib/sockets';

export default function Data() {
  const [events, loading] = useEvents();
  const sendData = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')
      console.log(res)
      const data = await res.json();
      alert("Message successfully sent: " + data);
    } catch (err: any) {
      alert("Exception occurred " + err)
    }
  }

  // const ping = () => {
  //   console.log("Pinging", socket)
  //   socket!.emit("events", {message: "Hey, ping pong"});
  // }
  const addEvent = () => {
    console.log("Pinging", socket)
    const event: IOTEvent = {
      imu: {
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
      }
    }
    socket.emit(EVENTS_SERVER, event);
  }
  
  if (loading) return "Loading..."
  return (
    <div>
      <Button onClick={sendData}>Send message</Button>
      {/* <Button onClick={ping}>Ping</Button> */}
      <Button onClick={addEvent}>Add event</Button>
      {events && events.map((event, index) => {
        const {x, y, z} = event.imu
        return (
          <div key={index}>X: {x} Y: {y} Z: {z}</div>
        )
      })}

    </div>
  )
}
