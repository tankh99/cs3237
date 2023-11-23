import {createSlice} from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from './store';


export interface EventState {
  events: IMURecording[];
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

export type IMURecording = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
  sessionName?: string;
}

export type IMUActivityEventRecording = IMURecording & {
  activityType?: string;
};

export type IMUTremorRecording = IMURecording & {
  medicationStatus?: boolean;
};

export const {addEvents, resetEvents} = eventSlice.actions;

export const selectEventState = (state: RootState) => state.events.events;

export default eventSlice.reducer;
