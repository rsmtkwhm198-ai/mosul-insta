"use client";

import { useOptimistic, useTransition } from "react";
import { toggleFollow } from "@/app/actions";
import { Button } from "@/components/ui";

type Props = { targetId: string; username: string; isFollowing: boolean };

export function FollowButton({ targetId, username, isFollowing }: Props) {
  const [, startTransition] = useTransition();
  const [following, setFollowing] = useOptimistic(isFollowing);

  return (
    <Button
      variant={following ? "outline" : "primary"}
      className="min-w-28"
      onClick={() =>
        startTransition(async () => {
          setFollowing(!following);
          await toggleFollow(targetId, !following, username);
        })
      }
    >
      {following ? "إلغاء المتابعة" : "متابعة"}
    </Button>
  );
}
