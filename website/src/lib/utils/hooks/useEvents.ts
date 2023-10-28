import { EventsGateway } from '../../../../../server/src/events/events.gateway';
// import { socket } from '@/utils/socket';
import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import {socket} from '@/lib/utils/socket';
import { EVENTS_CLIENT } from '@/lib/sockets';
import { ActivityMetadata } from '@/components/ActivityForm';

export type IMUActivityEventRecording = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
  activity_type?: string;
  device_id?: string;
}

export default function useEvents() {

  const [events, setEvents] = useState<IMUActivityEventRecording[]>([]);
  const [loading, setLoading] = useState(false)
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
      
      socket.on(EVENTS_CLIENT, (data: string) => {
        const events: IMUActivityEventRecording[] = JSON.parse(data);
        console.log("Events", events)
        setEvents((prev) => prev.concat(events));
      })
    }
      initConnection();
    // fetchEvents();
  }, [])
  
  const uploadEvents = async (values: ActivityMetadata) => {
    for (let event of events) {
      event.device_id = values.name; // Identify whose data it belongs to
      event.activity_type = values.activityType;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(events)
      })
      console.log("Uploaded", events)
      setEvents([]);
      alert(`Uploaded data as activity type ${values.activityType}`);
      console.log(res);
    } catch (ex) {
      console.error(ex)
    }
  }

  return [events, uploadEvents, loading]
}
