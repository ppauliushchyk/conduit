"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import { MdOutlineLogout, MdPersonOutline } from "react-icons/md";
import { twJoin, twMerge } from "tailwind-merge";

import { signOutAsync } from "@/app/actions/auth";
import { UIButton } from "@/components/ui/button";
import { UIDropdown } from "@/components/ui/dropdown";

import { UIThemeClasses } from "./ui/types";

export function Profile() {
  const { data: session } = useSession();

  const [, formAction, isPending] = useActionState(signOutAsync, undefined);

  if (!session?.user) {
    return <ProfileSkeleton />;
  }

  return (
    <UIDropdown.Wrapper>
      {session.user.image ? (
        <UIDropdown.Trigger asChild>
          <UIButton className="relative h-[42px] w-[42px] overflow-hidden p-0">
            <Image
              alt={`${session.user?.name}'s profile picture`}
              fill
              src={session.user.image}
            />
          </UIButton>
        </UIDropdown.Trigger>
      ) : (
        <UIDropdown.Trigger asChild>
          <UIButton Icon={MdPersonOutline} aria-label="View profile" />
        </UIDropdown.Trigger>
      )}

      <UIDropdown.Container className="w-full max-w-[280px]">
        <UIDropdown.Content className="flex flex-row items-center gap-1.5 p-4">
          <div className="grow">
            <div className="text-lg font-medium">
              {session.user?.name || "User"}
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {session.user?.email}
            </div>
          </div>

          <form action={formAction} noValidate>
            <UIButton
              Icon={MdOutlineLogout}
              aria-label="Select theme"
              disabled={isPending}
              type="submit"
              variant="zinc-inverted"
            />
          </form>
        </UIDropdown.Content>
      </UIDropdown.Container>
    </UIDropdown.Wrapper>
  );
}

const skeletonClasses: UIThemeClasses = {
  dark: twJoin("dark:border-zinc-500 dark:bg-zinc-800"),
  light: twJoin("border-zinc-500 bg-zinc-300"),
};

function ProfileSkeleton() {
  return (
    <div
      className={twMerge(
        "h-[42px] w-[42px] animate-pulse rounded-full",
        skeletonClasses.dark,
        skeletonClasses.light,
      )}
    />
  );
}
