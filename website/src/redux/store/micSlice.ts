import {createSlice} from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from './store';


export interface MicrophoneState {
  updrsData: UPDRSData[];
  updrsValues: number[]
}


const initialState: MicrophoneState = {
  updrsData: [],
  updrsValues: []
};


export const micSlice = createSlice({
  name: "mic",
  initialState: initialState,
  reducers: {
    addMicRecordings(state, action) {
      state.updrsData = state.updrsData.concat(action.payload)
    },
    addUpdrsValues(state, action) {
      state.updrsValues = state.updrsValues.concat(action.payload)
    },
    resetMicRecordings(state) {
      state.updrsData = [];
    }
  }
})

export type UPDRSData = {
  // p2p?: number;
  // ff?: number;
  // updrs: number;
  // device_id?: string;
  jitterAbs: number;
  jitterDDP: number;
  jitterPPQ5: number;
  jitterRap: number;
  shimmerAPQ11: number;
  shimmerAPQ3: number;
  shimmerAPQ5: number;
  shimmerDDA: number;
  shimmerLocal: number;
  shimmerLocalDB: number;
  name?: string;
  severity?: number;
  updrs: number;
};

export const {addMicRecordings, resetMicRecordings, addUpdrsValues} = micSlice.actions;

export default micSlice.reducer;
