// ============================================================
// FILE: src/pages/HomePage/HomePage.jsx
// PURPOSE: Home page — NOW slim! Uses components + backend APIs
//
// WHAT CHANGED:
// 1. SummaryCards, TransactionHistory, AddExpense are now
//    separate components imported from src/components/
// 2. Data comes from the backend API (not hardcoded useState)
// 3. useEffect fetches data when the page loads
//
// NEW CONCEPTS:
// - useEffect: Runs code when the component first appears
// - API calls: Fetching/sending data to the backend
// - localStorage: Stores userId so we know who's logged in
// ============================================================

import React, { useState, useEffect } from "react";
// ↑ useEffect: A React hook that runs code AFTER the component
//   renders. We use it to fetch data from the backend when
//   the page first loads.

import { Typography, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ── Import our 3 components ──
import SummaryCards from "../../components/SummaryCards/SummaryCards";
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory";
import AddExpense from "../../components/AddExpense/AddExpense";

// ── Import API functions ──
import {
  getExpenses,
  addExpense,
  deleteExpense,
  getIncome,
  setIncome as setIncomeAPI,
} from "../../services/api";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS (only the ones HomePage needs directly)
// ─────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  padding: 24px 40px;

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    text-align: center;
  }
`;

// ─────────────────────────────────────────────────────────────
// THE HOME PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

const HomePage = () => {
  const navigate = useNavigate();

  // ── Get userId from localStorage ──
  // When the user logs in, we store their userId in localStorage.
  // localStorage persists even when the page refreshes.
  const userId = localStorage.getItem("userId");

  // If no userId, user isn't logged in — redirect to login
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // ── STATE ──
  const [income, setIncome] = useState(0);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ── FETCH DATA ON PAGE LOAD ──
  // useEffect with [] runs ONCE when the component first appears.
  // It calls the backend to get expenses and income.
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // Call both APIs at the same time using Promise.all
        // This is faster than calling them one after another
        const [expensesRes, incomeRes] = await Promise.all([
          getExpenses(userId),
          getIncome(userId),
        ]);

        setExpenses(expensesRes.data);

        if (incomeRes.data) {
          setIncome(Number(incomeRes.data.amount));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ── CALCULATIONS ──
  const totalSpent = expenses.reduce(
    (sum, expense) => sum + Number(expense.cost),
    0
  );
  const remaining = income - totalSpent;

  // ── BUILD TRANSACTION LIST (expenses + income for history) ──
  const transactions = [
    ...expenses.map((e) => ({
      id: e.id,
      name: e.name,
      cost: Number(e.cost),
      type: "expense",
    })),
    { id: "income", name: "Income", cost: income, type: "income" },
  ];

  // Filter transactions by search term
  const filteredTransactions = transactions.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── HANDLERS ──

  // Handle income edit
  const handleEditIncome = () => {
    setIncomeInput(income.toString());
    setIsEditingIncome(true);
  };

  // Handle income save — calls backend API
  const handleSaveIncome = async () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      try {
        await setIncomeAPI(userId, newIncome);
        setIncome(newIncome);
        setIsEditingIncome(false);
      } catch (error) {
        console.error("Error saving income:", error);
      }
    }
  };

  // Handle add expense — calls backend API
  const handleAddExpense = async (name, cost) => {
    try {
      const response = await addExpense(userId, name, cost);
      // Add the new expense returned from the backend to our list
      setExpenses([...expenses, response.data]);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Handle delete — calls backend API
  const handleDelete = async (id, type) => {
    if (type === "income") {
      // Reset income to 0
      try {
        await setIncomeAPI(userId, 0);
        setIncome(0);
      } catch (error) {
        console.error("Error resetting income:", error);
      }
      return;
    }

    try {
      await deleteExpense(id, userId);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // Show loading while fetching data
  if (loading) {
    return (
      <PageWrapper>
        <Typography sx={{ textAlign: "center", marginTop: "40px" }}>
          Loading...
        </Typography>
      </PageWrapper>
    );
  }

  // ── JSX — Notice how clean this is now! ──
  return (
    <PageWrapper>
      {/* ═══ HEADER ═══ */}
      <Header>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: "#1a1a1a" }}
        >
          Expense Tracker
        </Typography>

        <Button
          variant="contained"
          onClick={handleSignOut}
          sx={{
            backgroundColor: "#ef5350",
            color: "#ffffff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "20px",
            padding: "8px 24px",
            "&:hover": { backgroundColor: "#d32f2f" },
            "@media (max-width: 600px)": {
              width: "100%",
              borderRadius: "8px",
            },
          }}
        >
          Sign Out
        </Button>
      </Header>

      {/* ═══ SUMMARY CARDS (Component) ═══ */}
      <SummaryCards
        income={income}
        remaining={remaining}
        totalSpent={totalSpent}
        isEditingIncome={isEditingIncome}
        incomeInput={incomeInput}
        setIncomeInput={setIncomeInput}
        handleEditIncome={handleEditIncome}
        handleSaveIncome={handleSaveIncome}
      />

      {/* ═══ TRANSACTION HISTORY (Component) ═══ */}
      <TransactionHistory
        transactions={filteredTransactions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleDelete={handleDelete}
      />

      {/* ═══ ADD EXPENSE (Component) ═══ */}
      <AddExpense onAddExpense={handleAddExpense} />
    </PageWrapper>
  );
};

export default HomePage;