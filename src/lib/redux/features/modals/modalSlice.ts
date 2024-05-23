import { createSlice } from "@reduxjs/toolkit"

const initialState: {
    uploadImageModal: {
        isOpen: boolean,
    },
    addImageToAlbumModal: {
        isOpen: boolean,
    },
} = {
    uploadImageModal: {
        isOpen: false,
    },
    addImageToAlbumModal: {
        isOpen: false,
    },
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
        },
        openAddImageToAlbumModal: (state) => {
            state.addImageToAlbumModal.isOpen = true;
        },
        closeAddImageToAlbumModal: (state) => {
            state.addImageToAlbumModal.isOpen = false;
        },
    }
})

export const { openUploadImageModal, closeUploadImageModal, openAddImageToAlbumModal, closeAddImageToAlbumModal } = modalSlice.actions;
export default modalSlice.reducer;