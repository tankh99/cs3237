'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import {socket} from '@/lib/utils/socket';
import { CLASSIFICATION_CLIENT, EVENTS_CLIENT } from '@/lib/sockets';
import { ActivityMetadata } from '@/components/ActivityForm';
import { ActivityClassification, addClassifications } from '@/redux/store/activityClassificationSlice';
import { useAppDispatch, useAppSelector } from './useRedux';
import useEvents from './useEvents';

export default function useAnalytics() {

  const activityClassifications = useAppSelector((state) => state.classifications.classifications);
  const dispatch = useAppDispatch();
  const [events] = useEvents();
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    
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
      
      socket.on(CLASSIFICATION_CLIENT, (data: string) => {
        const activityClassifications: ActivityClassification[] = JSON.parse(data);
        console.log("ActivityClassifications", activityClassifications)
        dispatch(addClassifications(activityClassifications));
        // setActivityClassifications((prev) => prev.concat(activityClassifications));
      })
    }
      initConnection();
    // fetchEvents();
  }, [])
  

  return [activityClassifications]
}
