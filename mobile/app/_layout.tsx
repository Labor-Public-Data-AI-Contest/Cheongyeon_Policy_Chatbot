import { Stack } from "expo-router";
import { ToastProvider } from "../context/ToastContext";

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ToastProvider>
  );
}