import {createSlice} from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from './store';


export interface MicrophoneState {
  micRecordings: MicRecording[];
}


const initialState: MicrophoneState = {
  micRecordings: [],
};


export const micSlice = createSlice({
  name: "mic",
  initialState: initialState,
  reducers: {
    addMicRecordings(state, action) {
      state.micRecordings = state.micRecordings.concat(action.payload)
    },
    resetMicRecordings(state) {
      state.micRecordings = [];
    }
  }
})

export type MicRecording = {
  p2p?: number;
  ff?: number;
  updrs: number;
  device_id?: string;
};

export const {addMicRecordings, resetMicRecordings} = micSlice.actions;

export const selectMicState = (state: RootState) => state.mic.micRecordings;

export default micSlice.reducer;
