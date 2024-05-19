import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Image as ImageType } from '~/server/db/schema';

const initialState: { currentImages: ImageType[], selectedImageIds: string[], selectionModeOn: boolean } = {
    currentImages: [],
    selectedImageIds: [],
    selectionModeOn: false,
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        initCurrentImages: (state, action: PayloadAction<ImageType[]>) => {
            state.currentImages = action.payload;
        },
        addImages: (state, action: PayloadAction<ImageType[]>) => {
            state.currentImages = [...state.currentImages, ...action.payload];
        },
        selectImage: (state, action: PayloadAction<string>) => {
            state.selectedImageIds.push(action.payload);
        },
        unselectImage: (state, action: PayloadAction<string>) => {
            state.selectedImageIds = state.selectedImageIds.filter(id => id !== action.payload);
        },
        toggleSelectionMode: (state) => {
            state.selectionModeOn = !state.selectionModeOn;
        },
        selectAllImages: (state) => {
            state.selectedImageIds = [...state.currentImages.map(img => img.id)];
        },
        unselectAllImages: (state) => {
            state.selectedImageIds = [];
        },
        deleteSelectedImages: (state) => {
            state.currentImages = state.currentImages.filter(img => !state.selectedImageIds.includes(img.id));
        }
    }
});

export const { initCurrentImages, addImages, selectImage, unselectImage, toggleSelectionMode, selectAllImages, unselectAllImages, deleteSelectedImages } = imageSlice.actions;

export default imageSlice.reducer;