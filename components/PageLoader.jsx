import { View, Text, ActivityIndicator } from "react-native";
import {colors} from "../constants/color";
import { styles } from "@/assets/styles/auth.styles";

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default PageLoader;
