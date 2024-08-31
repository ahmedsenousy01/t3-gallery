import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { PostDetails } from "~/server/db/schema";

interface PostState {
  currentPosts: Record<
    string,
    {
      selectedPostIds: string[];
      isAllPostsSelected: boolean;
      posts: PostDetails[];
    }
  >;
  selectionModeOn: boolean;
  activePostContainer: string;
}

const initialState: PostState = {
  currentPosts: {
    mainFeed: {
      selectedPostIds: [],
      isAllPostsSelected: false,
      posts: [],
    },
  },
  selectionModeOn: false,
  activePostContainer: "mainFeed",
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    initCurrentPosts: (state, action: PayloadAction<PostDetails[]>) => {
      const container = state.activePostContainer;
      state.currentPosts[container] = {
        selectedPostIds: [],
        isAllPostsSelected: false,
        posts: action.payload,
      };
    },
    addPosts: (state, action: PayloadAction<PostDetails[]>) => {
      const container = state.activePostContainer;
      if (!state.currentPosts[container]) {
        state.currentPosts[container] = {
          selectedPostIds: [],
          isAllPostsSelected: false,
          posts: [],
        };
      }
      state.currentPosts[container]!.posts = [
        ...state.currentPosts[container]!.posts,
        ...action.payload,
      ];
    },
    selectPost: (state, action: PayloadAction<string>) => {
      const container = state.activePostContainer;
      if (
        !state.currentPosts[container]!.selectedPostIds.includes(action.payload)
      ) {
        state.currentPosts[container]!.selectedPostIds.push(action.payload);
      }
    },
    unselectPost: (state, action: PayloadAction<string>) => {
      const container = state.activePostContainer;
      state.currentPosts[container]!.selectedPostIds = state.currentPosts[
        container
      ]!.selectedPostIds.filter((id) => id !== action.payload);
    },
    toggleSelectionMode: (state) => {
      state.selectionModeOn = !state.selectionModeOn;
    },
    selectAllPosts: (state) => {
      const container = state.activePostContainer;
      state.currentPosts[container]!.selectedPostIds = state.currentPosts[
        container
      ]!.posts.map((img) => img.id);
    },
    unselectAllPosts: (state) => {
      const container = state.activePostContainer;
      state.currentPosts[container]!.selectedPostIds = [];
    },
    deleteSelectedPosts: (state) => {
      const container = state.activePostContainer;
      state.currentPosts[container]!.posts = state.currentPosts[
        container
      ]!.posts.filter(
        (img) =>
          !state.currentPosts[container]!.selectedPostIds.includes(img.id)
      );
      state.currentPosts[container]!.selectedPostIds = [];
    },
    checkIsAllPostsSelected: (state) => {
      const container = state.activePostContainer;
      state.currentPosts[container]!.isAllPostsSelected =
        state.currentPosts[container]!.selectedPostIds.length ===
        state.currentPosts[container]!.posts.length;
    },
    setActivePostContainer: (state, action: PayloadAction<string>) => {
      state.activePostContainer = action.payload;
    },
  },
});

export const {
  initCurrentPosts,
  addPosts,
  selectPost,
  unselectPost,
  toggleSelectionMode,
  selectAllPosts,
  unselectAllPosts,
  deleteSelectedPosts,
  checkIsAllPostsSelected,
  setActivePostContainer,
} = postSlice.actions;

export default postSlice.reducer;
