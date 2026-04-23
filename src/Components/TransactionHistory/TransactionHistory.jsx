import React from "react";
import { Box, Typography, TextField, IconButton, InputAdornment } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";


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


const TransactionHistory = ({
  transactions,
  searchTerm,
  setSearchTerm,
  handleDelete,
}) => {
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
              <ExpenseName>{transaction.name}</ExpenseName>
              <ItemRight>
                <AmountBadge
                  badgeColor={
                    transaction.type === "income" ? "#4caf50" : "#ef5350"
                  }
                >
                  Rs. {transaction.cost.toFixed(2)}
                </AmountBadge>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(transaction.id, transaction.type)}
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