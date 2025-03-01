"use client";

import {
  MdOutlineDashboard,
  MdOutlineLight,
  MdOutlineNotifications,
  MdPersonOutline,
  MdSearch,
} from "react-icons/md";

import { UIButton } from "@/components/ui/button";
import { UINav } from "@/components/ui/nav";

import { UIThemeSwitch } from "./ui/theme";

export function Header() {
  return (
    <header className="flex flex-row gap-4">
      <UINav.Wrapper className="grow">
        <UINav.Item IconLeft={MdOutlineDashboard} href="/">
          {"Overview"}
        </UINav.Item>

        <UINav.Item IconRight={MdOutlineLight} href="/insights">
          {"Insights"}
        </UINav.Item>

        <UINav.Item href="/analytics">{"Analytics"}</UINav.Item>
        <UINav.Item href="/audience">{"Audience"}</UINav.Item>
        <UINav.Item href="/reports">{"Reports"}</UINav.Item>
      </UINav.Wrapper>

      <UIThemeSwitch />

      <div className="grid grid-cols-3 place-content-center place-items-start gap-2">
        <UIButton Icon={MdSearch} aria-label="Select theme" />
        <UIButton Icon={MdOutlineNotifications} aria-label="Select theme" />
        <UIButton Icon={MdPersonOutline} aria-label="Select theme" />
      </div>
    </header>
  );
}
