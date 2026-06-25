import { Slot } from "expo-router";

// This simply acts as an open gate, allowing our screens to render without complex tab layouts crashing in the background.
export default function Layout() {
  return <Slot />;
}
