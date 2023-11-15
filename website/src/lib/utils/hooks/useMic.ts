import { EventsGateway } from '../../../../../server/src/events/events.gateway';
// import { socket } from '@/utils/socket';
import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import {socket} from '@/lib/utils/socket';
import { EVENTS_CLIENT, MIC_CLIENT } from '@/lib/sockets';
import { ActivityMetadata } from '@/components/ActivityForm';
import { IMUActivityEventRecording, addEvents, resetEvents } from '@/redux/store/eventSlice';
import { useAppDispatch, useAppSelector } from './useRedux';
import { MicRecording, addMicRecordings } from '@/redux/store/micSlice';

export default function useMic() {

  const micRecordings = useAppSelector((state) => state.mic.micRecordings);
  const dispatch = useAppDispatch();
  // const [events, setEvents] = useState<IMUActivityEventRecording[]>([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // const fetchEvents = async () => {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
    //   const data = await res.json();
    //   // setEvents(data);
    // }
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
      
      socket.on(MIC_CLIENT, (data: string) => {
        const micRecordings: MicRecording[] = JSON.parse(data);
        console.log("recordings", micRecordings)
        dispatch(addMicRecordings(micRecordings));
      })
    }
      initConnection();
    // fetchEvents();
  }, [])
  
  
  return [micRecordings]
}
