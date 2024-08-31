import { type PostDetails } from "~/server/db/schema";

export function Post({}: PostDetails) {
  return (
    <div className="flex flex-col gap-4">
      {/* user and post info */}

      {/* post image */}

      {/* post controls (like, comment, share) */}

      {/* post caption */}

      {/* comments */}
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* user and post info */}
      <div className="h-[200px] w-full rounded-lg bg-gray-200" />
    </div>
  );
}

import { Skeleton } from "~/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      {/* profile */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      {/* image */}
      <Skeleton className="h-[550px] w-full max-w-[470px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
