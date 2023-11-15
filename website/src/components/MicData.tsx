'use client'

import useMic from '@/lib/utils/hooks/useMic'
import events from 'events';
import React from 'react'
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/table';

export default function MicData() {
  const [micRecordings] = useMic();
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Peak-to-peak</TableHead>
            <TableHead>Fundamental frequency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {micRecordings && micRecordings.map((micRecording, index) => {
            const {p2p, ff, timestamp} = micRecording
            return (
              <TableRow key={index}>
                <TableCell>{new Date(micRecording.timestamp).toTimeString()}</TableCell>
                <TableCell>{p2p}</TableCell>
                <TableCell>{ff}</TableCell>
              </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
