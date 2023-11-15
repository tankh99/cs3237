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
            <TableHead>UPDRS</TableHead>
            {/* <TableHead>UPDRS</TableHead>
            <TableHead>Fundamental frequency</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {micRecordings && micRecordings.map((micRecording, index) => {
            // const {p2p, ff, timestamp} = micRecording
            // const {p2p, ff, timestamp} = micRecording
            return (
              <TableRow key={index}>
                <TableCell>{micRecording.updrs}</TableCell>
              </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
