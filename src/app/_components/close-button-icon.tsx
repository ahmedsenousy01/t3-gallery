"use client";

import {
  toggleSelectionMode,
  unselectAllImages,
} from "~/lib/redux/features/images/imageSlice";
import { useAppDispatch } from "~/lib/redux/hooks";

export function CloseButtonIcon() {
  const dispatch = useAppDispatch();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 cursor-pointer"
      onClick={() => {
        dispatch(toggleSelectionMode());
        dispatch(unselectAllImages());
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}
