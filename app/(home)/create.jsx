import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { styles } from "../../assets/styles/create.styles.js";
import { colors } from "../../constants/color.js";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const API_URL = "http://localhost:3000/api";

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    //validations

    if (!title.trim())
      return Alert.alert("Error,", "Please enter a transaction title");
    if (!amount || isNan(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error,", "Please enter a valid amount");
      return;
    }
    if (!selectedCategory)
      return Alert.alert("Error,", "Please select a category");

    setIsLoading(true);
    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : +Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error, "Failed to create transaction");
      }
      Alert.alert("Success", "Transaction created successfully");
    } catch (error) {
      Alert.alert("Error", error.message, "Failed to create Transaction");
      console.error("Error creating transaction", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add new Transaction</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
          {!isLoading && (
            <Ionicons name="checkmark" size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.typeSelector}>
          {/* Expense */}
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name="arrow-down-circle"
              size={20}
              color={isExpense ? colors.white : colors.expense}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                isExpense && styles.typeButtonTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          {/* Income */}
          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={20}
              color={!isExpense ? colors.white : colors.income}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                !isExpense && styles.typeButtonTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>
        {/* Amount COntainer */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={colors.textLight}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
        {/* Input COntainer */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={20}
            style={styles.inputIcon}
            color={colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Categpry title */}

        <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={18} color={colors.text} />
          Category
        </Text>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name &&
                  styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                style={styles.categoryIcon}
                color={
                  selectedCategory === category.name
                    ? colors.white
                    : colors.text
                }
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.name &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

export default CreateScreen;
