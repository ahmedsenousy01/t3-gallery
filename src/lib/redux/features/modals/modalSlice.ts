import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: Record<
  string,
  {
    isOpen: boolean;
  }
> = {
  uploadImage: {
    isOpen: false,
  },
  addImageToAlbum: {
    isOpen: false,
  },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state[action.payload]!.isOpen = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state[action.payload]!.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
