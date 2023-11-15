import {createSlice} from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from './store';


export interface ActivityClassificationState {
  classifications: ActivityClassification[];
}


const initialState: ActivityClassificationState = {
  classifications: [],
};


export const activityClassificationSlice = createSlice({
  name: "classifications",
  initialState: initialState,
  reducers: {
    addClassifications(state, action) {
      console.log("payload", action.payload)
      state.classifications = state.classifications.concat(action.payload)
    },
    resetClassifications(state) {
      state.classifications = [];
    }
  }
})


export const {addClassifications, resetClassifications} = activityClassificationSlice.actions;

// export const selectActivity = (state: RootState) => state.events.events;

export default activityClassificationSlice.reducer;

export type ActivityClassification = {
  timestamp: number;
  name?: string;
  device_id?: string;
  activityType: string;
  medicationStatus: boolean;
};

