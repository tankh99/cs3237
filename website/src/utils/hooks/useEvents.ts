// import { socket } from '@/utils/socket';
import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import {socket} from '@/utils/socket';

export type IOTEvent = {
  imu: {
    x: number;
    y: number;
    z: number;
  }
}

export default function useEvents() {

  const [events, setEvents] = useState<Event[]>([]);
  const [initialised, setInitialised] = useState(false);;
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
      const data = await res.json();
      setEvents(data);
    }
    // fetchEvents();
  }, [])
  useEffect(() => {
    if (initialised) return;
    setInitialised(true);
    socket.on('connect', () => {
      console.log("Socket listening")
    })
    // socket.on('events-output', (data) => {
    //   console.log("Events output data", data)
    // })
    socket.on('events', (data) => {
      console.log("Events", data)
      setEvents((prev) => [...prev, data]);
    })
    // socket.onAny((data) => {
    //   console.log("Hey", data)
    // })
    
    // setSocket(ws);
    // socket.on('message', (data) => {
    //   console.log("Data received", data);
    //   setEvents((prev) => [...prev, data]);
    // })
  }, [])
  return [events] as const
  
}
