import { EventsGateway } from '../../../../../server/src/events/events.gateway';
// import { socket } from '@/utils/socket';
import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import {socket} from '@/lib/utils/socket';
import { EVENTS_CLIENT } from '@/lib/sockets';

export type IOTEvent = {
  imu: {
    x: number;
    y: number;
    z: number;
  }
}

export default function useEvents() {

  const [events, setEvents] = useState<IOTEvent[]>([]);
  const [initialised, setInitialised] = useState(false);;
  const [loading, setLoading] = useState(false)
  const [timerId, setTimerId] = useState<any>(null)
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
      const data = await res.json();
      setEvents(data);
    }
    const initConnection = () => {
      if (!socket.connected) setLoading(true);
      console.log("Triggered")
      socket.on('connect', () => {
        console.log("Connected")
        setLoading(false);
      })
      socket.on('reconnect', () => {
        console.log("Reconnected")
        setLoading(false);
      })
      socket.on('disconnect', () => {
        console.log("Disconnected")
        setLoading(false);
      })
      // socket.on('events-output', (data) => {
      //     console.log("Events output data", data)
      //   })
      socket.on(EVENTS_CLIENT, (data: string) => {
        const events: IOTEvent[] = JSON.parse(data);
        console.log("Events", events)
        setEvents((prev) => prev.concat(events));
      })
    }
      initConnection();
    // fetchEvents();
  }, [])
  
  return [events, loading] as const
  
}
