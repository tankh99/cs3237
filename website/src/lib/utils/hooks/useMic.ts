import { AppGateway } from '../../../../../server/src/app.gateway';
// import { socket } from '@/utils/socket';
import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import {socket} from '@/lib/utils/socket';
import { EVENTS_CLIENT, MIC_CLIENT, UPDRS_CLIENT } from '@/lib/sockets';
import { ActivityMetadata } from '@/components/ActivityForm';
import { IMUActivityEventRecording, addEvents, resetEvents } from '@/redux/store/eventSlice';
import { useAppDispatch, useAppSelector } from './useRedux';
import { UPDRSData, addMicRecordings, addUpdrsValues, resetMicRecordings } from '@/redux/store/micSlice';
import { UPDRSMetadata } from '@/components/UPDRSForm';
import { DATA_THRESHOLD } from '@/lib/constants';

export default function useMic() {

  const updrsData = useAppSelector((state) => state.mic.updrsData);
  const updrsValues = useAppSelector((state) => state.mic.updrsValues);
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
        const micRecordings: UPDRSData[] = JSON.parse(data);
        console.log("recordings", micRecordings)
        dispatch(addMicRecordings(micRecordings));
      })

      socket.on(UPDRS_CLIENT, (data: string) => {
        const updrsPreds: number[] = JSON.parse(data);
        console.log("updrs preds", updrsPreds)
        dispatch(addUpdrsValues(updrsPreds));
      })
    }
      initConnection();
    // fetchEvents();
  }, [])


  const uploadUPDRSData = async (values: UPDRSMetadata) => {
    let newUpdrsData = []
    for (let soundData of updrsData) {
      const newSoundData = {
        ...soundData,
        sessionName: values.name, // Identify whose data it belongs to
        severity: values.severity
      }
      newUpdrsData.push(newSoundData)
    }

    try {
      if (newUpdrsData.length === 0) return;
      if (newUpdrsData.length > DATA_THRESHOLD) {
        alert(`Too many events to upload at once. Truncating to the last ${DATA_THRESHOLD} entries.`)
        newUpdrsData = newUpdrsData.slice(-DATA_THRESHOLD);
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUpdrsData)
      })
      console.log("Uploaded", newUpdrsData)
      dispatch(resetMicRecordings());
      alert(`Uploaded mic recordings with name ${values.name} and severity ${values.severity}`);
      console.log(res);
    } catch (ex) {
      console.error(ex)
    }
  }
  
  
  return [updrsData, updrsValues, uploadUPDRSData]
}
