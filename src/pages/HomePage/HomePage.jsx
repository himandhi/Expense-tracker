// ============================================================
// FILE: src/pages/HomePage/HomePage.jsx
// UPDATED: 
// 1. Removed userId from all dispatch calls (JWT handles it)
// 2. Added username display in header (Task 1)
// 3. Updated sign out to call backend logout API
// ============================================================

import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SummaryCards from "../../components/SummaryCards/SummaryCards";
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory";
import AddExpense from "../../components/AddExpense/AddExpense";

import {
  fetchExpensesRequest,
  addExpenseRequest,
  deleteExpenseRequest,
} from "../../store/slices/expenseSlice";
import {
  fetchIncomeRequest,
  setIncomeRequest,
} from "../../store/slices/incomeSlice";
import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../services/api";

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

// NEW: Right side of header — username + sign out button
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }
`;

// NEW: User profile display
const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  padding: 6px 14px;
  border-radius: 20px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1a8fb5;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333333;
`;

// ─────────────────────────────────────────────────────────────
// THE HOME PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // CHANGED: Also read username and role from Redux auth state
  const { userId, userEmail, username } = useSelector((state) => state.auth);
  const { items: expenses, loading: expensesLoading } = useSelector(
    (state) => state.expenses
  );
  const { amount: income, loading: incomeLoading } = useSelector(
    (state) => state.income
  );

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // CHANGED: Removed userId from dispatch calls
  // Before: dispatch(fetchExpensesRequest(userId))
  // After:  dispatch(fetchExpensesRequest())
  // The saga calls getExpenses() with no userId — cookie handles it
  useEffect(() => {
    if (userId) {
      dispatch(fetchExpensesRequest());
      dispatch(fetchIncomeRequest());
    }
  }, [userId, dispatch]);

  // ── CALCULATIONS ──
  const totalSpent = expenses.reduce(
    (sum, expense) => sum + Number(expense.cost),
    0
  );

  const remaining = Math.max(0, income - totalSpent);

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

  // CHANGED: Removed userId from dispatch payload
  // Before: dispatch(setIncomeRequest({ userId, amount: newIncome }))
  // After:  dispatch(setIncomeRequest({ amount: newIncome }))
  const handleSaveIncome = () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      dispatch(setIncomeRequest({ amount: newIncome }));
      setIsEditingIncome(false);
    }
  };

  // CHANGED: Removed userId from dispatch payload
  // Before: dispatch(addExpenseRequest({ userId, name, cost }))
  // After:  dispatch(addExpenseRequest({ name, cost }))
  const handleAddExpense = (name, cost) => {
    if (cost > remaining) {
      alert("Cannot add expense: cost exceeds remaining balance.");
      return;
    }
    dispatch(addExpenseRequest({ name, cost }));
  };

  // CHANGED: Removed userId from both dispatch calls
  // Before: dispatch(setIncomeRequest({ userId, amount: 0 }))
  //         dispatch(deleteExpenseRequest({ expenseId: id, userId }))
  // After:  dispatch(setIncomeRequest({ amount: 0 }))
  //         dispatch(deleteExpenseRequest({ expenseId: id }))
  const handleDelete = (id, type) => {
    if (type === "income") {
      dispatch(setIncomeRequest({ amount: 0 }));
      return;
    }
    dispatch(deleteExpenseRequest({ expenseId: id }));
  };

  // CHANGED: Now calls backend logout API to clear cookies
  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Even if API call fails, still clear local state
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("username");
      dispatch(logout());
      navigate("/login");
    }
  };

  // ── LOADING STATE ──
  if (expensesLoading || incomeLoading) {
    return (
      <PageWrapper>
        <Typography sx={{ textAlign: "center", marginTop: "40px" }}>
          Loading...
        </Typography>
      </PageWrapper>
    );
  }

  // Get first letter of username for avatar
  // If username is "John", avatar shows "J"
  // Falls back to first letter of email if no username
  const avatarLetter =
    username?.charAt(0) || userEmail?.charAt(0) || "U";

  // Display name: username if available, otherwise email
  const displayName = username || userEmail || "User";

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

        {/* NEW: Header right side — user profile + sign out */}
        <HeaderRight>
          {/* NEW: User profile with avatar and username (Task 1) */}
          <UserProfile>
            <UserAvatar>{avatarLetter}</UserAvatar>
            <UserName>{displayName}</UserName>
          </UserProfile>

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
        </HeaderRight>
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

      <AddExpense onAddExpense={handleAddExpense} remaining={remaining} />
    </PageWrapper>
  );
};

export default HomePage;