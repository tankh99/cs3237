import { Form, Formik } from 'formik'
import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import useEvents from '@/lib/utils/hooks/useEvents';
import { IMUActivityEventRecording } from '@/redux/store/eventSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

export type TremorMetadata = {
  name: string;
  medicationString: string; // String at first, then convert to boolen based on on/off string values
  medicationStatus: boolean;
}

const initialValues: TremorMetadata = {
  name: "",
  medicationString: "", // False means have tremor
  medicationStatus: false
}

type P = {
  // events: IMUActivityEventRecording[];
  uploadTremorClassifications: any;
}
export default function TremorForm({uploadTremorClassifications}: P) {
  const onSubmit = async (values: TremorMetadata) => {
    // await uploadEvents(values);
    if (values.medicationString === 'on') {
      values.medicationStatus = true;
    } else {
      values.medicationStatus = false;
    }

    try {
      const res = await uploadTremorClassifications(values);
      console.log(res);
    } catch (ex) {
      console.error(ex);
    }
    
  }
  
  return (
    <Formik 
      onSubmit={onSubmit}
      initialValues={initialValues}>
        {({handleChange, handleBlur, setFieldValue, values}) => (
          <Form className='mx-auto flex flex-col'>
            Name: <Input name="name" placeholder="Name" onChange={handleChange}/>
            <br/>
            Medication Status
            <RadioGroup name="medicationString" defaultValue="on" className='mb-6' onChange={handleChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on" id="option-one" />
                <Label htmlFor="option-one">On (Tremor not detected)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="off" id="option-two" />
                <Label htmlFor="option-two">Off (Tremor detected)</Label>
              </div>
            </RadioGroup>
            <Button type="submit">Submit</Button>
          </Form>  
        )}
    </Formik>
  )
}
