import {createSlice} from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from './store';


export interface EventState {
  events: IMUActivityEventRecording[];
}


const initialState: EventState = {
  events: [],
};


export const eventSlice = createSlice({
  name: "events",
  initialState: initialState,
  reducers: {
    addEvents(state, action) {
      state.events = state.events.concat(action.payload)
    },
    resetEvents(state) {
      state.events = [];
    }
  }
})

export type IMUActivityEventRecording = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
  activity_type?: string;
  device_id?: string;
};

export const {addEvents, resetEvents} = eventSlice.actions;

export const selectEventState = (state: RootState) => state.events.events;

export default eventSlice.reducer;
