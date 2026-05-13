// ============================================================
// FILE: src/components/TransactionHistory/TransactionHistory.jsx
// FIXED: Removed unused 'costDifference' variable (ESLint error)
// ============================================================

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────

const HistorySection = styled.div`
  margin-bottom: 32px;
`;

const ExpenseItem = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-bottom: none;

  &:last-child {
    border-bottom: 1px solid #e0e0e0;
  }

  &:hover {
    background-color: #f9f9f9;
  }
`;

const ExpenseRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;

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
  gap: 4px;
`;

const EditForm = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 16px 12px 16px;
  background-color: #f5f9fc;
  border-top: 1px solid #e0e0e0;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 8px 12px 12px 12px;
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

const EditTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 6px;
      background-color: #ffffff;

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
  }
`;

// ─────────────────────────────────────────────────────────────
// THE COMPONENT
// ─────────────────────────────────────────────────────────────

const TransactionHistory = ({
  transactions,
  searchTerm,
  setSearchTerm,
  handleDelete,
  handleEdit,
  remaining,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editError, setEditError] = useState("");

  const openEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditName(transaction.name);
    setEditCost(transaction.cost.toString());
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCost("");
    setEditError("");
  };

  const saveEdit = (id) => {
    if (!editName.trim()) {
      setEditError("Name is required");
      return;
    }

    const costNum = parseFloat(editCost);
    if (isNaN(costNum) || costNum <= 0) {
      setEditError("Cost must be a positive number");
      return;
    }

    // Find the original expense to calculate max allowed cost
    const original = transactions.find((t) => t.id === id);

    // FIXED: Removed unused 'costDifference' variable.
    // The max allowed cost = original cost + remaining balance.
    // e.g. if original cost is 500 and remaining is 200,
    // the user can set the cost up to 700 (500 + 200).
    if (costNum > original.cost + remaining) {
      setEditError(
        `Cost exceeds available balance. Max allowed: Rs. ${(
          original.cost + remaining
        ).toFixed(2)}`
      );
      return;
    }

    handleEdit(id, editName.trim(), costNum);
    cancelEdit();
  };

  return (
    <HistorySection>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: "16px",
          "@media (max-width: 600px)": { textAlign: "center" },
        }}
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
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <ExpenseItem key={transaction.id}>
              {/* ── Main Row ── */}
              <ExpenseRow>
                <ExpenseName>{transaction.name}</ExpenseName>

                <ItemRight>
                  <AmountBadge
                    badgeColor={
                      transaction.type === "income" ? "#4caf50" : "#ef5350"
                    }
                  >
                    Rs. {transaction.cost.toFixed(2)}
                  </AmountBadge>

                  {/* Edit button — only for expenses, not income */}
                  {transaction.type === "expense" && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        editingId === transaction.id
                          ? cancelEdit()
                          : openEdit(transaction)
                      }
                      sx={{
                        color:
                          editingId === transaction.id
                            ? "#1a8fb5"
                            : "#666666",
                        "&:hover": { color: "#1a8fb5" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}

                  <IconButton
                    size="small"
                    onClick={() =>
                      handleDelete(transaction.id, transaction.type)
                    }
                    sx={{
                      color: "#666666",
                      "&:hover": { color: "#d32f2f" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ItemRight>
              </ExpenseRow>

              {/* ── Inline Edit Form ── */}
              {editingId === transaction.id && (
                <EditForm>
                  <EditTextField
                    size="small"
                    label="Name"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      setEditError("");
                    }}
                    sx={{ flex: 1, minWidth: "120px" }}
                  />

                  <EditTextField
                    size="small"
                    label="Cost"
                    value={editCost}
                    onChange={(e) => {
                      setEditCost(e.target.value);
                      setEditError("");
                    }}
                    error={Boolean(editError)}
                    helperText={editError}
                    sx={{ flex: 1, minWidth: "100px" }}
                  />

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => saveEdit(transaction.id)}
                    startIcon={<CheckIcon />}
                    sx={{
                      backgroundColor: "#4caf50",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#388e3c" },
                      alignSelf: "flex-start",
                      marginTop: "2px",
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={cancelEdit}
                    startIcon={<CloseIcon />}
                    sx={{
                      borderColor: "#cccccc",
                      color: "#666666",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#999999",
                        backgroundColor: "#f5f5f5",
                      },
                      alignSelf: "flex-start",
                      marginTop: "2px",
                    }}
                  >
                    Cancel
                  </Button>
                </EditForm>
              )}
            </ExpenseItem>
          ))
        ) : (
          <Typography
            sx={{ textAlign: "center", color: "#999999", padding: "24px" }}
          >
            No transactions found
          </Typography>
        )}
      </Box>
    </HistorySection>
  );
};

export default TransactionHistory;