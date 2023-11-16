import { AppGateway } from '../../../../../server/src/app.gateway';
// import { socket } from '@/utils/socket';
import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import {socket} from '@/lib/utils/socket';
import { EVENTS_CLIENT } from '@/lib/sockets';
import { ActivityMetadata } from '@/components/ActivityForm';
import { IMUActivityEventRecording, IMUTremorRecording, addEvents, resetEvents } from '@/redux/store/eventSlice';
import { useAppDispatch, useAppSelector } from './useRedux';
import { TremorMetadata } from '@/components/TremorForm';
import { DATA_THRESHOLD } from '@/lib/constants';

export default function useEvents() {

  // TODO: Change event types to remove activity type. 
  const events = useAppSelector((state) => state.events.events);
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
      
      socket.on(EVENTS_CLIENT, (data: string) => {
        const events: IMUActivityEventRecording[] = JSON.parse(data);
        dispatch(addEvents(events));
      })
    }
      initConnection();
    // fetchEvents();
  }, [])
  
  const uploadActivityClassification = async (values: ActivityMetadata) => {
    let activityClassifications: IMUActivityEventRecording[] = []
    for (let event of events) {
      const activityClassification: IMUActivityEventRecording = {
        ...event,
        sessionName: values.name, // Identify whose data it belongs to
        activityType: values.activityType
      }
      activityClassifications.push(activityClassification)
    }
    
    try {
      if (activityClassifications.length === 0) return;
      if (activityClassifications.length > DATA_THRESHOLD) {
        alert(`Too many events to upload at once. Truncating to the last ${DATA_THRESHOLD} entries.`)
        activityClassifications = activityClassifications.slice(-DATA_THRESHOLD);
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(activityClassifications)
      })
      console.log("Uploaded", activityClassifications)
      dispatch(resetEvents());
      alert(`Uploaded data as activity type ${values.activityType}`);
      console.log(res);
    } catch (ex) {
      console.error(ex)
    }
  }

  const uploadTremorClassification = async (values: TremorMetadata) => {
    let tremorClassifications: IMUTremorRecording[] = []
    for (let event of events) {
      const tremorClassification: IMUTremorRecording = {
        ...event,
        sessionName: values.name, // Identify whose data it belongs to
        medicationStatus: values.medicationStatus
      }
      tremorClassifications.push(tremorClassification)
    }
    try {
      if (tremorClassifications.length === 0) return;
      if (tremorClassifications.length > DATA_THRESHOLD) {
        alert(`Too many events to upload at once. Truncating to the last ${DATA_THRESHOLD} entries.`)
        tremorClassifications = tremorClassifications.slice(-DATA_THRESHOLD);
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/tremors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tremorClassifications)
      })
      console.log("Uploaded", tremorClassifications)
      dispatch(resetEvents());
      alert(`Uploaded data with medication status ${values.medicationStatus.toString()}`);
      console.log(res);
    } catch (ex) {
      console.error(ex)
    }
  }

  return [events, uploadActivityClassification, uploadTremorClassification, loading]
}
