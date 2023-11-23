import React, { useEffect, useState } from 'react'
import { socket } from '../socket';

export default function useSocket() {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const initConnection = () => {
      if (socket.connected) {
        return;
      }
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
    }
      initConnection();
    // fetchEvents();
  }, [])
  return [socket, loading] as const;
}
