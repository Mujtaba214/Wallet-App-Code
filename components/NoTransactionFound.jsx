import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../assets/styles/home.styles.js";
import { colors } from "../constants/color.js";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NoTransactionFound = () => {
  const router = useRouter();
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={60}
        style={styles.emptyStateIcon}
        color={colors.textLight}
      />
      <Text style={styles.emptyStateTitle}>No Transactions Yet.</Text>
      <Text style={styles.emptyStateText}>
        Start Tracking Your Finances by adding your first transaction
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add-circle" size={18} color={colors.white} />
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoTransactionFound;
