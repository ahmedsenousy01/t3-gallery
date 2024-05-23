import { createSlice } from "@reduxjs/toolkit"

const initialState: {
    uploadImageModal: {
        isOpen: boolean,
    }
} = {
    uploadImageModal: {
        isOpen: false,
    }
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openUploadImageModal: (state) => {
            state.uploadImageModal.isOpen = true;
        },
        closeUploadImageModal: (state) => {
            state.uploadImageModal.isOpen = false;
        }
    }
})

export const { openUploadImageModal, closeUploadImageModal } = modalSlice.actions;
export default modalSlice.reducer;