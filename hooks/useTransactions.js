import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../lib/api.js";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH TRANSACTIONS
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/transactions/${userId}`
      );

      const rawText = await response.text();
      console.log("RAW TRANSACTIONS RESPONSE:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Backend did not return JSON");
      }

      if (!response.ok) {
        throw new Error(data?.msg || "Failed to fetch transactions");
      }

      setTransactions(data);
    } catch (error) {
      console.error("Error in fetching transactions:", error);
    }
  }, [userId]);

  // 🔹 FETCH SUMMARY
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/transactions/summary/${userId}`
      );

      const rawText = await response.text();
      console.log("RAW SUMMARY RESPONSE:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Backend did not return JSON");
      }

      if (!response.ok) {
        throw new Error(data?.msg || "Failed to fetch summary");
      }

      setSummary(data);
    } catch (error) {
      console.error("Error in fetching summary:", error);
    }
  }, [userId]);

  // 🔹 LOAD ALL DATA
  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error in loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  // 🔹 DELETE TRANSACTION
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/transactions/${id}`,
        { method: "DELETE" }
      );

      const rawText = await response.text();
      console.log("RAW DELETE RESPONSE:", rawText);

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error in deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return {
    transactions,
    summary,
    loading,
    loadData,
    deleteTransaction,
  };
};
