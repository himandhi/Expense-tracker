// ============================================================
// FILE: src/components/SummaryCards/SummaryCards.jsx
// PURPOSE: The 3 colored cards (Income, Remaining, Spent)
//
// NEW CONCEPT: Props
// This component receives data from HomePage via "props".
// Props are like function arguments — the parent passes data DOWN
// to the child component.
//
// Think of it like:
//   HomePage says: "Hey SummaryCards, here's the income value: 5000"
//   SummaryCards says: "Got it, I'll display Income: RS 5000.00"
//
// Props received from HomePage:
//   - income: the income amount (number)
//   - remaining: income minus spent (number)
//   - totalSpent: sum of all expenses (number)
//   - isEditingIncome: whether edit mode is on (boolean)
//   - incomeInput: the value in the edit text field (string)
//   - setIncomeInput: function to update incomeInput
//   - handleEditIncome: function to start editing
//   - handleSaveIncome: function to save the new income
// ============================================================

import React from "react";
import { Box, TextField, Button } from "@mui/material";
import styled from "styled-components";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS (moved from HomePage)
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// THE COMPONENT
// ─────────────────────────────────────────────────────────────

// We "destructure" props inside the function parameter.
// Instead of writing props.income, props.remaining, etc.,
// we write { income, remaining, ... } to extract them directly.
const SummaryCards = ({
  income,
  remaining,
  totalSpent,
  isEditingIncome,
  incomeInput,
  setIncomeInput,
  handleEditIncome,
  handleSaveIncome,
}) => {
  return (
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
  );
};

export default SummaryCards;