'use client'

import useAnalytics from '@/lib/utils/hooks/useAnalytics'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import useMic from '@/lib/utils/hooks/useMic';

export default function MicClassifications() {
  const [_, updrsValues] = useMic();
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Timestamp</TableHead> */}
            <TableHead>UPDRS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {updrsValues.map((updrs, index) => {
            // const {timestamp, medicationStatus, activityType} = activity;
            return (
              <TableRow key={index}>
                {/* <TableCell>{new Date(timestamp).toTimeString()}</TableCell>
                <TableCell>{medicationStatus ? "ON" : "OFF"}</TableCell>
                <TableCell>{activityType}</TableCell> */}
                <TableCell>{updrs}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
