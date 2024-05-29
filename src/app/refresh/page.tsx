"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
/**
 * This page is used when going from a route to another under the same layout while wanting to rerender the layout.
 * It is used to refresh the layout mainly after a sign in or sign out.
 */
export default function Refresh() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    router.push(callbackUrl ?? "/");
  }, [callbackUrl, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
