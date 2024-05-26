import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type Image as ImageType } from "~/server/db/schema";

interface ImageState {
  currentImages: Record<
    string,
    {
      selectedImageIds: string[];
      isAllImagesSelected: boolean;
      images: ImageType[];
    }
  >;
  selectionModeOn: boolean;
  activeImageContainer: string;
}

const initialState: ImageState = {
  currentImages: {
    mainFeed: {
      selectedImageIds: [],
      isAllImagesSelected: false,
      images: [],
    },
  },
  selectionModeOn: false,
  activeImageContainer: "mainFeed",
};

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    initCurrentImages: (state, action: PayloadAction<ImageType[]>) => {
      const container = state.activeImageContainer;
      state.currentImages[container] = {
        selectedImageIds: [],
        isAllImagesSelected: false,
        images: action.payload,
      };
    },
    addImages: (state, action: PayloadAction<ImageType[]>) => {
      const container = state.activeImageContainer;
      if (!state.currentImages[container]) {
        state.currentImages[container] = {
          selectedImageIds: [],
          isAllImagesSelected: false,
          images: [],
        };
      }
      state.currentImages[container]!.images = [
        ...state.currentImages[container]!.images,
        ...action.payload,
      ];
    },
    selectImage: (state, action: PayloadAction<string>) => {
      const container = state.activeImageContainer;
      if (
        !state.currentImages[container]!.selectedImageIds.includes(
          action.payload
        )
      ) {
        state.currentImages[container]!.selectedImageIds.push(action.payload);
      }
    },
    unselectImage: (state, action: PayloadAction<string>) => {
      const container = state.activeImageContainer;
      state.currentImages[container]!.selectedImageIds = state.currentImages[
        container
      ]!.selectedImageIds.filter((id) => id !== action.payload);
    },
    toggleSelectionMode: (state) => {
      state.selectionModeOn = !state.selectionModeOn;
    },
    selectAllImages: (state) => {
      const container = state.activeImageContainer;
      state.currentImages[container]!.selectedImageIds = state.currentImages[
        container
      ]!.images.map((img) => img.id);
    },
    unselectAllImages: (state) => {
      const container = state.activeImageContainer;
      state.currentImages[container]!.selectedImageIds = [];
    },
    deleteSelectedImages: (state) => {
      const container = state.activeImageContainer;
      state.currentImages[container]!.images = state.currentImages[
        container
      ]!.images.filter(
        (img) =>
          !state.currentImages[container]!.selectedImageIds.includes(img.id)
      );
      state.currentImages[container]!.selectedImageIds = [];
    },
    checkIsAllImagesSelected: (state) => {
      const container = state.activeImageContainer;
      state.currentImages[container]!.isAllImagesSelected =
        state.currentImages[container]!.selectedImageIds.length ===
        state.currentImages[container]!.images.length;
    },
    setActiveImageContainer: (state, action: PayloadAction<string>) => {
      state.activeImageContainer = action.payload;
    },
  },
});

export const {
  initCurrentImages,
  addImages,
  selectImage,
  unselectImage,
  toggleSelectionMode,
  selectAllImages,
  unselectAllImages,
  deleteSelectedImages,
  checkIsAllImagesSelected,
  setActiveImageContainer,
} = imageSlice.actions;

export default imageSlice.reducer;
