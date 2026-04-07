// ============================================================
// FILE: src/pages/HomePage.jsx
// PURPOSE: Expense Tracker home page
// 
// FIX: History is now a TRANSACTION history (not just expenses)
//      Income appears in the list with a GREEN badge
//      When you edit income, the Income entry updates automatically
// ============================================================

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  padding: 24px 40px;

  @media (max-width: 768px) {
    padding: 16px 20px;
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
    align-items: flex-start;
  }
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background-color: ${(props) => props.bgColor || "#e0e0e0"};
  padding: 24px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const SummaryText = styled.span`
  color: #333333;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const HistorySection = styled.div`
  margin-bottom: 32px;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-bottom: none;

  &:last-child {
    border-bottom: 1px solid #e0e0e0;
  }

  &:hover {
    background-color: #f9f9f9;
  }

  @media (max-width: 600px) {
    padding: 10px 12px;
  }
`;

const ExpenseName = styled.span`
  font-size: 0.95rem;
  color: #333333;

  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

const AmountBadge = styled.span`
  background-color: ${(props) => props.badgeColor || "#ef5350"};
  color: #ffffff;
  padding: 4px 14px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 0.75rem;
    padding: 3px 10px;
  }
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddExpenseSection = styled.div`
  margin-top: 16px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 8px;

      fieldset {
        border-color: #cccccc;
      }

      &:hover fieldset {
        border-color: #1a8fb5;
      }

      &.Mui-focused fieldset {
        border-color: #1a8fb5;
        border-width: 2px;
      }
    }

    .MuiInputLabel-root {
      color: #333333;
    }

    .MuiInputLabel-root.Mui-focused {
      color: #333333;
    }
  }
`;

const SearchField = styled(TextField)`
  && {
    margin-bottom: 16px;

    .MuiOutlinedInput-root {
      border-radius: 8px;

      fieldset {
        border-color: #cccccc;
      }

      &:hover fieldset {
        border-color: #999999;
      }

      &.Mui-focused fieldset {
        border-color: #333333;
        border-width: 2px;
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────
// VALIDATION SCHEMA
// ─────────────────────────────────────────────────────────────

const expenseValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required"),

  cost: Yup.number()
    .typeError("Cost must be a number")
    .positive("Cost must be greater than 0")
    .required("Cost is required"),
});

// ─────────────────────────────────────────────────────────────
// THE HOME PAGE COMPONENT
//
// HOW THE TRANSACTION HISTORY WORKS NOW:
//
// We store ONE list called "transactions" which has TWO types:
//   - type: "expense"  → red badge (Shopping, Holiday, etc.)
//   - type: "income"   → green badge (Income)
//
// When you edit income:
//   1. The Income card updates
//   2. The Income entry in History updates automatically
//
// Spent = sum of only "expense" type transactions
// Remaining = Income - Spent
// ─────────────────────────────────────────────────────────────

const HomePage = () => {
  const navigate = useNavigate();

  // ── STATE ──

  // Income value (shown in the Income card)
  const [income, setIncome] = useState(0);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");

  // Transaction history: contains BOTH expenses AND income
  // Each item has a "type" field: "expense" or "income"
  //
  // NEW CONCEPT: The "type" field
  // By adding a type to each item, we can tell them apart:
  //   - "expense" items get a RED badge and count toward "Spent"
  //   - "income" items get a GREEN badge and DON'T count toward "Spent"
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Shopping", cost: 500.0, type: "expense" },
    { id: 2, name: "Holiday", cost: 500.0, type: "expense" },
    { id: 3, name: "Transportation", cost: 500.0, type: "expense" },
    { id: 4, name: "Fuel", cost: 500.0, type: "expense" },
    { id: 5, name: "Income", cost: 0, type: "income" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // ── CALCULATIONS ──

  // Spent = sum of ONLY expense-type transactions
  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.cost, 0);

  // Remaining = Income - Spent
  const remaining = income - totalSpent;

  // Filtered transactions for search
  const filteredTransactions = transactions.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── HANDLERS ──

  const handleDelete = (id) => {
    // Find the transaction to check its type
    const transaction = transactions.find((t) => t.id === id);

    // If deleting the income entry, reset income to 0
    if (transaction && transaction.type === "income") {
      setIncome(0);
    }

    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleEditIncome = () => {
    setIncomeInput(income.toString());
    setIsEditingIncome(true);
  };

  const handleSaveIncome = () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      // Update the income value
      setIncome(newIncome);
      setIsEditingIncome(false);

      // FIX: Update or create the Income entry in transactions
      // Check if an Income entry already exists
      const incomeExists = transactions.some((t) => t.type === "income");

      if (incomeExists) {
        // Update existing Income entry
        // .map() creates a new array where the income item has the new cost
        setTransactions(
          transactions.map((t) =>
            t.type === "income" ? { ...t, cost: newIncome } : t
          )
        );
        // ↑ { ...t, cost: newIncome } means:
        //   "copy everything from t, but replace cost with newIncome"
        //   This is called the "spread operator" for objects.
      } else {
        // Add new Income entry if it was previously deleted
        setTransactions([
          ...transactions,
          { id: Date.now(), name: "Income", cost: newIncome, type: "income" },
        ]);
      }
    }
  };

  // ── FORMIK for Add Expense ──
  const formik = useFormik({
    initialValues: {
      name: "",
      cost: "",
    },
    validationSchema: expenseValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const newTransaction = {
        id: Date.now(),
        name: values.name.trim(),
        cost: parseFloat(values.cost),
        type: "expense", // New items from the form are always expenses
      };

      setTransactions([...transactions, newTransaction]);
      resetForm();
    },
  });

  // ── JSX ──
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
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: "#ef5350",
            color: "#ffffff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "20px",
            padding: "8px 24px",
            "&:hover": { backgroundColor: "#d32f2f" },
          }}
        >
          Sign Out
        </Button>
      </Header>

      {/* ═══ SUMMARY CARDS ═══ */}
      <CardsRow>
        {/* Income Card */}
        <SummaryCard bgColor="#c8e6c9">
          <SummaryText>Income: RS {income.toFixed(2)}</SummaryText>

          {isEditingIncome ? (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                size="small"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                sx={{
                  width: "120px",
                  backgroundColor: "#ffffff",
                  borderRadius: "4px",
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveIncome}
                sx={{
                  backgroundColor: "#4caf50",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
              >
                Save
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={handleEditIncome}
              sx={{
                backgroundColor: "#3f51b5",
                color: "#ffffff",
                textTransform: "none",
                borderRadius: "4px",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#303f9f" },
              }}
            >
              Edit
            </Button>
          )}
        </SummaryCard>

        {/* Remaining Card */}
        <SummaryCard bgColor="#c8e6c9">
          <SummaryText>Remaining: RS {remaining.toFixed(2)}</SummaryText>
        </SummaryCard>

        {/* Spent Card */}
        <SummaryCard bgColor="#81d4fa">
          <SummaryText>Spent: RS {totalSpent.toFixed(2)}</SummaryText>
        </SummaryCard>
      </CardsRow>

      {/* ═══ HISTORY SECTION ═══ */}
      <HistorySection>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, color: "#1a1a1a", marginBottom: "16px" }}
        >
          History
        </Typography>

        <SearchField
          fullWidth
          placeholder="Type to search ..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#999999" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <ExpenseItem key={transaction.id}>
                <ExpenseName>{transaction.name}</ExpenseName>

                <ItemRight>
                  {/* 
                    Badge color depends on type:
                    - "income" → green (#4caf50)
                    - "expense" → red (#ef5350)
                  */}
                  <AmountBadge
                    badgeColor={
                      transaction.type === "income" ? "#4caf50" : "#ef5350"
                    }
                  >
                    Rs. {transaction.cost.toFixed(2)}
                  </AmountBadge>

                  <IconButton
                    size="small"
                    onClick={() => handleDelete(transaction.id)}
                    sx={{
                      color: "#666666",
                      "&:hover": { color: "#d32f2f" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ItemRight>
              </ExpenseItem>
            ))
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                color: "#999999",
                padding: "24px",
              }}
            >
              No transactions found
            </Typography>
          )}
        </Box>
      </HistorySection>

      {/* ═══ ADD EXPENSE SECTION ═══ */}
      <AddExpenseSection>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, color: "#1a1a1a", marginBottom: "16px" }}
        >
          Add Expence
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <FormRow>
            <StyledTextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              size="small"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <StyledTextField
              fullWidth
              id="cost"
              name="cost"
              label="Cost"
              variant="outlined"
              size="small"
              value={formik.values.cost}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cost && Boolean(formik.errors.cost)}
              helperText={formik.touched.cost && formik.errors.cost}
            />
          </FormRow>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1a8fb5",
              color: "#ffffff",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              padding: "8px 32px",
              "&:hover": { backgroundColor: "#0d6d8a" },
            }}
          >
            Save
          </Button>
        </Box>
      </AddExpenseSection>
    </PageWrapper>
  );
};

export default HomePage;