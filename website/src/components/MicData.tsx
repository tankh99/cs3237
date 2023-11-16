'use client'

import useMic from '@/lib/utils/hooks/useMic'
import events from 'events';
import React from 'react'
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/table';
import UPDRSForm from './UPDRSForm';

export default function MicData() {
  const [micRecordings, uploadRecordings] = useMic();
  console.log("mic recordings", micRecordings)

  return (
    <div className='max-w-[800px]'>
      <UPDRSForm uploadRecordings={uploadRecordings}/>
      <Table className='max-w-[480px] overflow-h'>
        <TableHeader>
          <TableRow className='overflow-h max-w-[480px]'>
            <TableHead>Jitter (Absolute)</TableHead>
            <TableHead>Jitter (Rap)</TableHead>
            <TableHead>Jitter (PPQ5)</TableHead>
            <TableHead>Jitter (DDP)</TableHead>
            <TableHead>Shimmer (Local)</TableHead>
            <TableHead>Shimmer (Local dB)</TableHead>
            <TableHead>Shimmer (APQ3)</TableHead>
            <TableHead>Shimmer (APQ5)</TableHead>
            <TableHead>Shimmer (APQ11)</TableHead>
            <TableHead>Shimmer (DDA)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {micRecordings && micRecordings.map((micRecording, index) => {
            // const {p2p, ff, timestamp} = micRecording
            // const {p2p, ff, timestamp} = micRecording
            const {jitterAbs, jitterRap, jitterPPQ5, jitterDDP, shimmerLocal, shimmerLocalDB, shimmerAPQ3, shimmerAPQ5, shimmerAPQ11, shimmerDDA} = micRecording
            return (
              <TableRow key={index}>
                <TableCell>{jitterAbs}</TableCell>
                <TableCell>{jitterRap}</TableCell>
                <TableCell>{jitterPPQ5}</TableCell>
                <TableCell>{jitterDDP}</TableCell>
                <TableCell>{shimmerLocal}</TableCell>
                <TableCell>{shimmerLocalDB}</TableCell>
                <TableCell>{shimmerAPQ3}</TableCell>
                <TableCell>{shimmerAPQ5}</TableCell>
                <TableCell>{shimmerAPQ11}</TableCell>
                <TableCell>{shimmerDDA}</TableCell>
              </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
