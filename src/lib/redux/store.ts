import { combineReducers, configureStore } from '@reduxjs/toolkit'
import imageSlice from './features/images/imageSlice'
import modalSlice from './features/modals/modalSlice'

const rootReducer = combineReducers({
   images: imageSlice,
   modals: modalSlice,
})

export const makeStore = () => {
   return configureStore({
      reducer: rootReducer
   })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']