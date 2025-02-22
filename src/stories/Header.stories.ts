import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Header } from "./Header";

const meta = {
  args: {
    onCreateAccount: fn(),
    onLogin: fn(),
    onLogout: fn(),
  },
  component: Header,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Example/Header",
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: "Jane Doe",
    },
  },
};

export const LoggedOut: Story = {};
