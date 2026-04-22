// ============================================================
// FILE: src/components/AddExpense/AddExpense.jsx
// PURPOSE: "Add Expence" form — Name, Cost fields + Save button
//
// Props received from HomePage:
//   - onAddExpense: function to call when form is submitted
//                   HomePage handles saving to the backend
// ============================================================

import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS (moved from HomePage)
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// VALIDATION SCHEMA (moved from HomePage)
// ─────────────────────────────────────────────────────────────

const expenseValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  cost: Yup.number()
    .typeError("Cost must be a number")
    .positive("Cost must be greater than 0")
    .required("Cost is required"),
});

// ─────────────────────────────────────────────────────────────
// THE COMPONENT
// ─────────────────────────────────────────────────────────────

const AddExpense = ({ onAddExpense }) => {
  // Formik now lives INSIDE this component (not in HomePage)
  // When the form submits, it calls onAddExpense (passed from HomePage)
  const formik = useFormik({
    initialValues: { name: "", cost: "" },
    validationSchema: expenseValidationSchema,
    onSubmit: (values, { resetForm }) => {
      // Call the parent's function to handle saving
      onAddExpense(values.name.trim(), parseFloat(values.cost));
      resetForm();
    },
  });

  return (
    <AddExpenseSection>
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
            "@media (max-width: 600px)": { width: "100%" },
          }}
        >
          Save
        </Button>
      </Box>
    </AddExpenseSection>
  );
};

export default AddExpense;