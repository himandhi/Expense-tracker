// ============================================================
// FILE: src/pages/HomePage/HomePage.jsx
// UPDATED: Passes remaining balance to AddExpense
//          Prevents negative remaining balance
// ============================================================

import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import SummaryCards from "../../components/SummaryCards/SummaryCards";
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory";
import AddExpense from "../../components/AddExpense/AddExpense";

import {
  getExpenses,
  addExpense,
  deleteExpense,
  getIncome,
  setIncome as setIncomeAPI,
} from "../../services/api";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS
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
  const userId = localStorage.getItem("userId");

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
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
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

  // CHANGED: Remaining can never go below 0 in the display
  const remaining = Math.max(0, income - totalSpent);

  // ── BUILD TRANSACTION LIST ──
  const transactions = [
    ...expenses.map((e) => ({
      id: e.id,
      name: e.name,
      cost: Number(e.cost),
      type: "expense",
    })),
    { id: "income", name: "Income", cost: income, type: "income" },
  ];

  const filteredTransactions = transactions.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── HANDLERS ──

  const handleEditIncome = () => {
    setIncomeInput(income.toString());
    setIsEditingIncome(true);
  };

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

  // CHANGED: Check remaining balance before adding expense
  const handleAddExpense = async (name, cost) => {
    if (cost > remaining) {
      alert("Cannot add expense: cost exceeds remaining balance.");
      return;
    }

    try {
      const response = await addExpense(userId, name, cost);
      setExpenses([...expenses, response.data]);
    } catch (error) {
      console.error("Error adding expense:", error);
      // Show backend error message if available
      const message = error.response?.data?.message || "Failed to add expense.";
      alert(message);
    }
  };

  const handleDelete = async (id, type) => {
    if (type === "income") {
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

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  if (loading) {
    return (
      <PageWrapper>
        <Typography sx={{ textAlign: "center", marginTop: "40px" }}>
          Loading...
        </Typography>
      </PageWrapper>
    );
  }

  // ── JSX ──
  return (
    <PageWrapper>
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

      <TransactionHistory
        transactions={filteredTransactions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleDelete={handleDelete}
      />

      {/* CHANGED: Now passes remaining balance to AddExpense */}
      <AddExpense onAddExpense={handleAddExpense} remaining={remaining} />
    </PageWrapper>
  );
};

export default HomePage;