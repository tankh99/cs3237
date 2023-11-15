import { Form, Formik } from 'formik'
import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import useEvents from '@/lib/utils/hooks/useEvents';
import { IMUActivityEventRecording } from '@/redux/store/eventSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export type ActivityMetadata = {
  name: string;
  activityType: string;
}

const initialValues: ActivityMetadata = {
  name: "",
  activityType: "relax"
}

type P = {
  // events: IMUActivityEventRecording[];
  uploadEvents: any;
}
export default function ActivityForm({uploadEvents}: P) {
  const onSubmit = async (values: any) => {
    console.log(values);
    await uploadEvents(values);
    try {
      const tremorDetected = await axios.get(`${process.env.NEXT_PUBLIC_AI_API_URL}/classify-tremor`)
      const activity = await  axios.get(`${process.env.NEXT_PUBLIC_AI_API_URL}/classify-activity`);
      if (tremorDetected.data) {
        alert(`Tremor detected while doing activity type: ${activity.data}`);
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  
  return (
    <Formik 
      onSubmit={onSubmit}
      initialValues={initialValues}>
        {({handleChange, handleBlur, setFieldValue, values}) => (
          <Form className='w-[400px] flex flex-col'>
            Name: <Input name="name" placeholder="Name" onChange={handleChange}/>
            Activity Type: <Select name="activityType" defaultValue='relax' onValueChange={(value) => {
            setFieldValue("activityType", value)
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relax">Relax</SelectItem>
                <SelectItem value="fine motor">Fine motor (Typing / writing)</SelectItem>
                <SelectItem value="eating">Eating</SelectItem>
                <SelectItem value="moving">Moving (Walking downstairs/upstairs fast/slow)</SelectItem>
              </SelectContent>
            </Select>
            <br/>
            <Button type="submit">Submit</Button>
          </Form>  
        )}
    </Formik>
  )
}
