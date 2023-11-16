'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import useEvents from '@/lib/utils/hooks/useEvents';
import { IMUActivityEventRecording } from '@/redux/store/eventSlice';
import { socket } from '@/lib/utils/socket';
import { EVENTS_SERVER } from '@/lib/sockets';
import { Input } from './ui/input';
import ActivityForm from './ActivityForm';
import { Table, TableHead, TableHeader, TableCaption, TableRow, TableBody, TableCell } from './ui/table';
import TremorForm from './TremorForm';

export default function TremorEvents() {
  const [events, uploadEvents, uploadTremorClassifications, loading] = useEvents();

  useEffect(() => {
    console.log(events);
  }, [events])
  
  const addEvent = () => {
    console.log("Pinging", socket)
    const event: IMUActivityEventRecording = {
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      activityType: "TEST",
      sessionName: "TEST DEVICE ID",
      timestamp: Date.now()
    }
    socket.emit(EVENTS_SERVER, event);
  }
  
  if (loading) return "Loading..."
  return (
    <div>
      {/* <Button onClick={sendData}>Send message</Button> */}
      {/* <Button onClick={ping}>Ping</Button> */}
      {/* <Button onClick={addEvent}>Add random event</Button> */}
      <TremorForm uploadTremorClassifications={uploadTremorClassifications} />
      <br/>
      <Table >
        <TableCaption>Received IMU data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>X</TableHead>
            <TableHead>Y</TableHead>
            <TableHead>Z</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='h-[400px] overflow-scroll'>
          
          {events && events.map((event, index) => {
            const {x, y, z} = event
            return (
              <TableRow key={index}>
                <TableCell>{new Date(event.timestamp).toTimeString()}</TableCell>
                <TableCell>{x}</TableCell>
                <TableCell>{y}</TableCell>
                <TableCell>{z}</TableCell>
              </TableRow>
              )
            })}
        </TableBody>
      </Table>

    </div>
  )
}
