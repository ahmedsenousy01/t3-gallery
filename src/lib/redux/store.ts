import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postSlice from "./features/posts/postSlice";
import modalSlice from "./features/modals/modalSlice";

const rootReducer = combineReducers({
  posts: postSlice,
  modals: modalSlice,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
