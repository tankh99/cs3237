import { Form, Formik } from 'formik'
import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import useEvents from '@/lib/utils/hooks/useEvents';
import { IMUActivityEventRecording } from '@/redux/store/eventSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UPDRSData } from '@/redux/store/micSlice';

export type UPDRSMetadata = {
  name: string;
  severity: number;
}

const initialValues: UPDRSMetadata = {
  name: "",
  severity: 1
}

type P = {
  // events: IMUActivityEventRecording[];
  uploadRecordings: any;
}
export default function UPDRSForm({uploadRecordings}: P) {
  const onSubmit = async (values: UPDRSMetadata) => {
    values.severity = parseInt(values.severity.toString());
    console.log(values);
    try {
      const res = await uploadRecordings(values);
    } catch (ex) {
      console.error(ex);
    }
    // try {
    //   const tremorDetected = await axios.get(`${process.env.NEXT_PUBLIC_AI_API_URL}/classify-tremor`)
    //   const activity = await  axios.get(`${process.env.NEXT_PUBLIC_AI_API_URL}/classify-activity`);
    //   if (tremorDetected.data) {
    //     alert(`Tremor detected while doing activity type: ${activity.data}`);
    //   }
    // } catch (ex) {
    //   console.error(ex);
    // }
  }
  
  return (
    <Formik 
      onSubmit={onSubmit}
      initialValues={initialValues}>
        {({handleChange, handleBlur, setFieldValue, values}) => (
          <Form className='w-[400px] flex flex-col mx-auto mb-8'>
            Session Name:
            <Input name="name" onChange={handleChange}/>
            <br/>
            Severity Level: <Select name="severity" defaultValue='1' onValueChange={(value) => {
            setFieldValue("severity", value)
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Mild</SelectItem>
                <SelectItem value="2">Moderate</SelectItem>
                <SelectItem value="3">Severe</SelectItem>
              </SelectContent>
            </Select>
            <br/>
            <Button type="submit">Submit</Button>
          </Form>  
        )}
    </Formik>
  )
}
