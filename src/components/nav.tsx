"use client";

import { MdOutlineDashboard, MdOutlineLight } from "react-icons/md";

import { UINav } from "@/components/ui/nav";

export function Nav() {
  return (
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
  );
}
