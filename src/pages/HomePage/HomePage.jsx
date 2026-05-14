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
    try {
      if (!userId) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    try {
      if (userId) {
        dispatch(fetchExpensesRequest());
        dispatch(fetchIncomeRequest());
      }
    } catch (error) {
      console.error("Error dispatching fetch actions:", error);
    }
  }, [userId, dispatch]);

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


  const handleEditIncome = () => {
    try {
      setIncomeInput(income.toString());
      setIsEditingIncome(true);
    } catch (error) {
      console.error("Error opening income edit:", error);
    }
  };

  const handleSaveIncome = () => {
    try {
      const newIncome = parseFloat(incomeInput);

      if (isNaN(newIncome)) {
        throw new Error("Income value is not a valid number");
      }

      if (newIncome < 0) {
        throw new Error("Income cannot be negative");
      }

      dispatch(setIncomeRequest({ amount: newIncome }));
      setIsEditingIncome(false);
    } catch (error) {
      console.error("Error saving income:", error.message);
      alert(error.message || "Failed to save income. Please try again.");
    }
  };

  const handleAddExpense = (name, cost) => {
    try {
      if (!name || name.trim() === "") {
        throw new Error("Expense name is required");
      }

      if (isNaN(cost) || cost <= 0) {
        throw new Error("Expense cost must be a positive number");
      }

      if (cost > remaining) {
        throw new Error("Cannot add expense: cost exceeds remaining balance");
      }

      dispatch(addExpenseRequest({ name, cost }));
    } catch (error) {
      console.error("Error adding expense:", error.message);
      alert(error.message || "Failed to add expense. Please try again.");
    }
  };

  const handleEdit = (expenseId, name, cost) => {
    try {
      if (!expenseId) {
        throw new Error("Invalid expense ID");
      }

      if (!name || name.trim() === "") {
        throw new Error("Expense name cannot be empty");
      }

      if (isNaN(cost) || cost <= 0) {
        throw new Error("Expense cost must be a positive number");
      }

      dispatch(updateExpenseRequest({ expenseId, name, cost }));
    } catch (error) {
      console.error("Error updating expense:", error.message);
      alert(error.message || "Failed to update expense. Please try again.");
    }
  };

  const handleDelete = (id, type) => {
    try {
      if (!id) {
        throw new Error("Invalid item ID");
      }

      if (type === "income") {
        dispatch(setIncomeRequest({ amount: 0 }));
        return;
      }

      dispatch(deleteExpenseRequest({ expenseId: id }));
    } catch (error) {
      console.error("Error deleting item:", error.message);
      alert(error.message || "Failed to delete item. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      try {
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        dispatch(logout());
        navigate("/login");
      } catch (cleanupError) {
        console.error("Error during logout cleanup:", cleanupError);
        navigate("/login");
      }
    }
  };

  const handleSearch = (term) => {
    try {
      setSearchTerm(term);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  if (expensesLoading || incomeLoading) {
    return (
      <PageWrapper>
        <Typography sx={{ textAlign: "center", marginTop: "40px" }}>
          Loading...
        </Typography>
      </PageWrapper>
    );
  }

  const emailPrefix = userEmail ? userEmail.split("@")[0] : null;
  const displayName =
    username && username.trim() !== "" ? username : emailPrefix || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

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
        setSearchTerm={handleSearch}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        remaining={remaining}
      />

      <AddExpense onAddExpense={handleAddExpense} remaining={remaining} />
    </PageWrapper>
  );
};

export default HomePage;