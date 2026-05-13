// ============================================================
// FILE: src/pages/HomePage/HomePage.jsx
// UPDATED: displayName now uses email prefix (before @) as fallback
//          "user1@gmail.com" → displays "user1"
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
  updateExpenseRequest,
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

  const { userId, userEmail, username, role } = useSelector(
    (state) => state.auth
  );
  const { items: expenses, loading: expensesLoading } = useSelector(
    (state) => state.expenses
  );
  const { amount: income, loading: incomeLoading } = useSelector(
    (state) => state.income
  );

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

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

  const handleSaveIncome = () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      dispatch(setIncomeRequest({ amount: newIncome }));
      setIsEditingIncome(false);
    }
  };

  const handleAddExpense = (name, cost) => {
    if (cost > remaining) {
      alert("Cannot add expense: cost exceeds remaining balance.");
      return;
    }
    dispatch(addExpenseRequest({ name, cost }));
  };

  const handleEdit = (expenseId, name, cost) => {
    dispatch(updateExpenseRequest({ expenseId, name, cost }));
  };

  const handleDelete = (id, type) => {
    if (type === "income") {
      dispatch(setIncomeRequest({ amount: 0 }));
      return;
    }
    dispatch(deleteExpenseRequest({ expenseId: id }));
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      dispatch(logout());
      navigate("/login");
    }
  };

  // ── LOADING ──
  if (expensesLoading || incomeLoading) {
    return (
      <PageWrapper>
        <Typography sx={{ textAlign: "center", marginTop: "40px" }}>
          Loading...
        </Typography>
      </PageWrapper>
    );
  }

  // CHANGED: Display name logic
  // Priority: username → email prefix → "User"
  // "user1@gmail.com" → "user1"
  // "himandhiow191@gmail.com" → "himandhiow191"
  const emailPrefix = userEmail ? userEmail.split("@")[0] : null;
  const displayName = username && username.trim() !== ""
    ? username
    : emailPrefix || "User";

  // Avatar: first letter of display name
  const avatarLetter = displayName.charAt(0).toUpperCase();

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

        <HeaderRight>
          <UserProfile>
            <UserAvatar>{avatarLetter}</UserAvatar>
            <UserName>{displayName}</UserName>
          </UserProfile>

          {/* Admin Panel button — only for admin users */}
          {role === "admin" && (
            <Button
              variant="outlined"
              onClick={() => navigate("/admin")}
              sx={{
                borderColor: "#2563eb",
                color: "#2563eb",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                "&:hover": {
                  backgroundColor: "#eff6ff",
                  borderColor: "#1d4ed8",
                },
                "@media (max-width: 600px)": {
                  width: "100%",
                  borderRadius: "8px",
                },
              }}
            >
              Admin Panel
            </Button>
          )}

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
        handleEdit={handleEdit}
        remaining={remaining}
      />

      <AddExpense onAddExpense={handleAddExpense} remaining={remaining} />
    </PageWrapper>
  );
};

export default HomePage;