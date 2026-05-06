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
import { fetchIncomeRequest, setIncomeRequest } from "../../store/slices/incomeSlice";
import { logout } from "../../store/slices/authSlice";


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


const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Redux state ---
  const { userId } = useSelector((state) => state.auth);
  const { items: expenses, loading: expensesLoading } = useSelector((state) => state.expenses);
  const { amount: income, loading: incomeLoading } = useSelector((state) => state.income);

  // --- Local UI-only state (not stored in Redux) ---
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // Fetch data on mount via sagas
  useEffect(() => {
    if (userId) {
      dispatch(fetchExpensesRequest(userId));
      dispatch(fetchIncomeRequest(userId));
    }
  }, [userId, dispatch]);


  // --- Derived values ---
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


  // --- Handlers ---
  const handleEditIncome = () => {
    setIncomeInput(income.toString());
    setIsEditingIncome(true);
  };

  const handleSaveIncome = () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      dispatch(setIncomeRequest({ userId, amount: newIncome }));
      setIsEditingIncome(false);
    }
  };

  const handleAddExpense = (name, cost) => {
    if (cost > remaining) {
      alert("Cannot add expense: cost exceeds remaining balance.");
      return;
    }
    dispatch(addExpenseRequest({ userId, name, cost }));
  };

  const handleDelete = (id, type) => {
    if (type === "income") {
      dispatch(setIncomeRequest({ userId, amount: 0 }));
      return;
    }
    dispatch(deleteExpenseRequest({ expenseId: id, userId }));
  };

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    dispatch(logout());
    navigate("/login");
  };


  // Show loading screen while either fetch saga is in flight
  if (expensesLoading || incomeLoading) {
    return (
      <PageWrapper>
        <Typography sx={{ textAlign: "center", marginTop: "40px" }}>
          Loading...
        </Typography>
      </PageWrapper>
    );
  }


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

      <AddExpense onAddExpense={handleAddExpense} remaining={remaining} />
    </PageWrapper>
  );
};

export default HomePage;