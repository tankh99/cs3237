import { Form, Formik } from 'formik'
import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import useEvents, { IMUActivityEventRecording } from '@/lib/utils/hooks/useEvents';
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
    uploadEvents(values);
  }
  
  return (
    <Formik 
      onSubmit={onSubmit}
      initialValues={initialValues}>
        {({handleChange, handleBlur, setFieldValue, values}) => (
          <Form className='w-[400px]'>
            <Input name="name" placeholder="Name" onChange={handleChange}/>
            <Select name="activityType" defaultValue='relax' onValueChange={(value) => {
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
            <Button type="submit">Submit</Button>
          </Form>  
        )}
    </Formik>
  )
}
