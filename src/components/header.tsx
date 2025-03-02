import { MdOutlineNotifications, MdSearch } from "react-icons/md";

import { UIButton } from "@/components/ui/button";
import { UIThemeSwitch } from "@/components/ui/theme";

import { Nav } from "./nav";
import { Profile } from "./profile";

export function Header() {
  return (
    <header className="flex flex-row gap-4">
      <Nav />
      <UIThemeSwitch />

      <div className="grid grid-cols-3 place-content-center place-items-start gap-2">
        <UIButton Icon={MdSearch} aria-label="Select theme" />
        <UIButton Icon={MdOutlineNotifications} aria-label="Select theme" />
        <Profile />
      </div>
    </header>
  );
}
