import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constants/color";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;
