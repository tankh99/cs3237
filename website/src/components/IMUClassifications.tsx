'use client'

import useAnalytics from '@/lib/utils/hooks/useAnalytics'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function IMUClassifications() {
  const [activityClassifications] = useAnalytics();
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Medication ON/OFF</TableHead>
            <TableHead>Activity Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {activityClassifications.map((activity, index) => {
            const {timestamp, medicationStatus, activityType} = activity;
            return (
              <TableRow key={index}>
                <TableCell>{new Date(timestamp).toTimeString()}</TableCell>
                <TableCell>{medicationStatus ? "ON" : "OFF"}</TableCell>
                <TableCell>{activityType}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
