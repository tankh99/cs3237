import { configureStore } from "@reduxjs/toolkit"
import {eventSlice} from "./eventSlice"
import { createWrapper } from "next-redux-wrapper";
import {activityClassificationSlice} from "./activityClassificationSlice";


export const store = configureStore({
  reducer: {
    [eventSlice.name]: eventSlice.reducer,
    [activityClassificationSlice.name]: activityClassificationSlice.reducer
  }
})


export type RootState = ReturnType<typeof store.getState>;

// export const wrapper = createWrapper<AppStore>(makeStore);
export type AppDispatch = typeof store.dispatch;