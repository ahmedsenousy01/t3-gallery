"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Refresh() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");

  useEffect(() => {
    console.log(destination);
    router.push(destination ?? "/");
  }, [destination, router]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-center text-4xl font-bold">Refreshing...</h1>
    </div>
  );
}
