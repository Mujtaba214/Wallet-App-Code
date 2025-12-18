import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig.extra.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
