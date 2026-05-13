// ============================================================
// FILE: src/pages/AdminPage/AdminPage.jsx
// UPDATED:
// 1. $ → Rs in stat cards and expense amounts
// 2. Settings shows only Admin Account section
// 3. Username displays email prefix (part before @)
// ============================================================

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  adminGetOverview,
  adminGetUsers,
  adminGetExpenses,
  adminDeleteUser,
  adminDeleteExpense,
  adminUpdateUser,
  updateProfile,
} from "../../services/api";
import styled from "styled-components";

// ─────────────────────────────────────────────────────────────
// HELPER: Get display name from email or username
// "user1@gmail.com" → "user1"
// ─────────────────────────────────────────────────────────────
const getDisplayName = (username, email) => {
  if (username && username.trim() !== "") return username;
  if (email) return email.split("@")[0];
  return "—";
};

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────

const AdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fb;
  font-family: "Segoe UI", "Helvetica Neue", sans-serif;
`;

const Sidebar = styled.div`
  width: 260px;
  min-height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e8eaed;
  padding: 24px 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SidebarBrand = styled.div`
  padding: 0 24px 28px 24px;
  border-bottom: 1px solid #e8eaed;
  margin-bottom: 16px;
`;

const BrandIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const BrandTitle = styled.h1`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 2px 0;
`;

const BrandSub = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 24px;
  border: none;
  background: ${(props) => (props.active ? "#eff6ff" : "transparent")};
  color: ${(props) => (props.active ? "#2563eb" : "#4b5563")};
  font-size: 0.95rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  text-align: left;
  border-left: 3px solid
    ${(props) => (props.active ? "#2563eb" : "transparent")};
  transition: all 0.15s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #2563eb;
  }
`;

const MainContent = styled.div`
  margin-left: 260px;
  flex: 1;
  padding: 40px 48px;

  @media (max-width: 768px) {
    margin-left: 200px;
    padding: 24px 20px;
  }
`;

const PageTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
`;

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 32px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e8eaed;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
`;

const StatIcon = styled.span`
  font-size: 1.1rem;
  color: #9ca3af;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const StatNote = styled.div`
  font-size: 0.78rem;
  color: #6b7280;
`;

const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e8eaed;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
`;

const SectionSub = styled.p`
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0 0 20px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e8eaed;
`;

const Td = styled.td`
  padding: 14px 12px;
  font-size: 0.88rem;
  color: ${(props) => (props.muted ? "#9ca3af" : "#374151")};
  border-bottom: 1px solid #f3f4f6;
`;

const StatusBadge = styled.span`
  background-color: ${(props) => (props.active ? "#111827" : "#f3f4f6")};
  color: ${(props) => (props.active ? "#ffffff" : "#6b7280")};
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 500;
`;

const CategoryBadge = styled.span`
  background-color: #f3f4f6;
  color: #374151;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 1rem;
  transition: background 0.15s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const DeleteBtn = styled(ActionBtn)`
  color: #ef4444;
  &:hover {
    background-color: #fef2f2;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 400px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  font-size: 0.88rem;
  color: #374151;
  background-color: #f9fafb;
  outline: none;
  margin-bottom: 20px;

  &:focus {
    border-color: #2563eb;
    background-color: #ffffff;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  font-size: 0.88rem;
  color: #374151;
  outline: none;
  margin-bottom: 16px;
  box-sizing: border-box;
  background-color: #f9fafb;

  &:focus {
    border-color: #2563eb;
    background-color: #ffffff;
  }
`;

const SaveBtn = styled.button`
  padding: 10px 24px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 0.95rem;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 20px;
  color: #ef4444;
  font-size: 0.88rem;
  background: #fef2f2;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const SuccessText = styled.div`
  text-align: center;
  padding: 12px;
  color: #16a34a;
  font-size: 0.88rem;
  background: #f0fdf4;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const AccessDenied = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 24px;
`;

const FieldLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 6px;
`;

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const AdminPage = () => {
  const navigate = useNavigate();
  const { role, userId, userEmail } = useSelector(
    (state) => state.auth
  );

  const [activeSection, setActiveSection] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");

  // Settings form state
  const [adminPassword, setAdminPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (role !== "admin") {
      navigate("/home");
    }
  }, [role, userId, navigate]);

  // Fetch all data
  useEffect(() => {
    if (role !== "admin") return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        const [overviewRes, usersRes, expensesRes] = await Promise.all([
          adminGetOverview(),
          adminGetUsers(),
          adminGetExpenses(),
        ]);

        setOverview(overviewRes.data);
        setUsers(usersRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        setError(
          "Failed to load admin data. Make sure the backend is running."
        );
        console.error("Admin data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [role]);

  // ── Handlers ──

  const handleDeleteUser = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user and all their data?"
      )
    )
      return;
    try {
      await adminDeleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      setExpenses(expenses.filter((e) => e.user?.id !== id));
    } catch {
      alert("Failed to delete user.");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await adminDeleteExpense(expenseId);
      setExpenses(expenses.filter((e) => e.id !== expenseId));
    } catch {
      alert("Failed to delete expense.");
    }
  };

  const handleUpdateUserRole = async (id, newRole) => {
    try {
      await adminUpdateUser(id, { role: newRole });
      setUsers(
        users.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch {
      alert("Failed to update user role.");
    }
  };

  const handleSaveAdminAccount = async () => {
    try {
      setSettingsError("");
      setSettingsSuccess("");

      if (!adminPassword || adminPassword.length < 6) {
        setSettingsError("Password must be at least 6 characters.");
        return;
      }

      await updateProfile({ password: adminPassword });
      setSettingsSuccess("Password updated successfully!");
      setAdminPassword("");
    } catch {
      setSettingsError("Failed to update password. Please try again.");
    }
  };

  // ── Filtered data ──
  const filteredUsers = users.filter(
    (u) =>
      getDisplayName(u.username, u.email)
        .toLowerCase()
        .includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredExpenses = expenses.filter(
    (e) =>
      e.name?.toLowerCase().includes(expenseSearch.toLowerCase()) ||
      getDisplayName(e.user?.username, e.user?.email)
        .toLowerCase()
        .includes(expenseSearch.toLowerCase())
  );

  // ── Stats ──
  const totalExpenseAmount = expenses.reduce(
    (sum, e) => sum + Number(e.cost),
    0
  );
  const avgPerUser = users.length > 0 ? totalExpenseAmount / users.length : 0;
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Access denied
  if (!role || role !== "admin") {
    return (
      <AccessDenied>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🚫</div>
        <h2 style={{ color: "#111827", marginBottom: "8px" }}>Access Denied</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 24px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Go to Home
        </button>
      </AccessDenied>
    );
  }

  // ─────────────────────────────────────────────────────────
  // RENDER SECTIONS
  // ─────────────────────────────────────────────────────────

  const renderOverview = () => (
    <>
      <PageTitle>Dashboard Overview</PageTitle>
      <PageSubtitle>Monitor and manage your expense tracker system</PageSubtitle>

      {error && <ErrorText>{error}</ErrorText>}

      {loading ? (
        <LoadingText>Loading overview...</LoadingText>
      ) : (
        <>
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatLabel>Total Users</StatLabel>
                <StatIcon>👥</StatIcon>
              </StatHeader>
              <StatValue>{users.length}</StatValue>
              <StatNote>{users.length} registered</StatNote>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatLabel>Active Users</StatLabel>
                <StatIcon>〰</StatIcon>
              </StatHeader>
              <StatValue>{overview?.totalUsers || users.length}</StatValue>
              <StatNote>
                {users.length > 0 ? "100% of total" : "No users"}
              </StatNote>
            </StatCard>

            {/* CHANGED: $ → Rs */}
            <StatCard>
              <StatHeader>
                <StatLabel>Total Expenses</StatLabel>
                <StatIcon>Rs</StatIcon>
              </StatHeader>
              <StatValue>Rs. {totalExpenseAmount.toFixed(2)}</StatValue>
              <StatNote>{expenses.length} transactions</StatNote>
            </StatCard>

            {/* CHANGED: $ → Rs */}
            <StatCard>
              <StatHeader>
                <StatLabel>Avg per User</StatLabel>
                <StatIcon>↗</StatIcon>
              </StatHeader>
              <StatValue>Rs. {avgPerUser.toFixed(2)}</StatValue>
              <StatNote>Average spending</StatNote>
            </StatCard>
          </StatsGrid>

          <SectionCard>
            <SectionTitle>Recent Expenses</SectionTitle>
            <SectionSub>Latest expense entries in the system</SectionSub>

            <Table>
              <thead>
                <tr>
                  <Th>User</Th>
                  {/* CHANGED: $ Amount → Rs Amount */}
                  <Th>Amount (Rs)</Th>
                  <Th>Name</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((exp) => (
                    <tr key={exp.id}>
                      {/* CHANGED: Use getDisplayName helper */}
                      <Td>
                        {getDisplayName(
                          exp.user?.username,
                          exp.user?.email
                        )}
                      </Td>
                      {/* CHANGED: $ → Rs */}
                      <Td>Rs. {Number(exp.cost).toFixed(2)}</Td>
                      <Td>
                        <CategoryBadge>{exp.name}</CategoryBadge>
                      </Td>
                      <Td muted>
                        {new Date(exp.created_at).toLocaleDateString()}
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <Td
                      colSpan={4}
                      style={{ textAlign: "center", color: "#9ca3af" }}
                    >
                      No expenses found
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </SectionCard>
        </>
      )}
    </>
  );

  const renderUsers = () => (
    <>
      <PageTitle>User Management</PageTitle>
      <PageSubtitle>View, edit, and delete user accounts</PageSubtitle>

      {error && <ErrorText>{error}</ErrorText>}

      <SearchWrapper>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          placeholder="Search users by name or email..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </SearchWrapper>

      {loading ? (
        <LoadingText>Loading users...</LoadingText>
      ) : (
        <SectionCard>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Joined</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    {/* CHANGED: Use getDisplayName to show email prefix as name */}
                    <Td style={{ fontWeight: 600 }}>
                      {getDisplayName(user.username, user.email)}
                    </Td>
                    <Td muted>{user.email}</Td>
                    <Td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleUpdateUserRole(user.id, e.target.value)
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid #e8eaed",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </Td>
                    <Td muted>
                      {new Date(user.created_at).toLocaleDateString()}
                    </Td>
                    <Td>
                      <StatusBadge active={true}>active</StatusBadge>
                    </Td>
                    <Td>
                      <DeleteBtn
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        🗑
                      </DeleteBtn>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td
                    colSpan={6}
                    style={{ textAlign: "center", color: "#9ca3af" }}
                  >
                    No users found
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </SectionCard>
      )}
    </>
  );

  const renderExpenses = () => (
    <>
      <PageTitle>Expense Management</PageTitle>
      <PageSubtitle>Review and manage all expense records</PageSubtitle>

      {error && <ErrorText>{error}</ErrorText>}

      <SearchWrapper>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          placeholder="Search expenses..."
          value={expenseSearch}
          onChange={(e) => setExpenseSearch(e.target.value)}
        />
      </SearchWrapper>

      {loading ? (
        <LoadingText>Loading expenses...</LoadingText>
      ) : (
        <SectionCard>
          <SectionTitle>All Expense Records</SectionTitle>
          <SectionSub>
            Complete list of expense transactions across all users
          </SectionSub>

          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>User</Th>
                {/* CHANGED: Amount ($) → Amount (Rs) */}
                <Th>Amount (Rs)</Th>
                <Th>Name</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <Td muted>#{exp.id}</Td>
                    {/* CHANGED: Use getDisplayName */}
                    <Td style={{ fontWeight: 600 }}>
                      {getDisplayName(exp.user?.username, exp.user?.email)}
                    </Td>
                    {/* CHANGED: $ → Rs */}
                    <Td>Rs. {Number(exp.cost).toFixed(2)}</Td>
                    <Td>
                      <CategoryBadge>{exp.name}</CategoryBadge>
                    </Td>
                    <Td muted>
                      {new Date(exp.created_at).toLocaleDateString()}
                    </Td>
                    <Td>
                      <DeleteBtn
                        onClick={() => handleDeleteExpense(exp.id)}
                        title="Delete expense"
                      >
                        🗑
                      </DeleteBtn>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td
                    colSpan={6}
                    style={{ textAlign: "center", color: "#9ca3af" }}
                  >
                    No expenses found
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </SectionCard>
      )}
    </>
  );

  // CHANGED: Settings now shows ONLY the Admin Account section
  const renderSettings = () => (
    <>
      <PageTitle>System Settings</PageTitle>
      <PageSubtitle>Configure system settings and preferences</PageSubtitle>

      <SectionCard>
        <SectionTitle>Admin Account</SectionTitle>
        <SectionSub>Manage your admin credentials</SectionSub>

        {settingsError && <ErrorText>{settingsError}</ErrorText>}
        {settingsSuccess && <SuccessText>{settingsSuccess}</SuccessText>}

        <div style={{ marginTop: "16px" }}>
          <FieldLabel>Admin Email</FieldLabel>
          {/* Show the current admin email (read-only display) */}
          <FormInput
            type="email"
            value={userEmail || ""}
            readOnly
            style={{ cursor: "not-allowed", opacity: 0.7 }}
          />

          <FieldLabel>Change Password</FieldLabel>
          <FormInput
            type="password"
            placeholder="Enter new password (min 6 characters)"
            value={adminPassword}
            onChange={(e) => {
              setAdminPassword(e.target.value);
              setSettingsError("");
              setSettingsSuccess("");
            }}
          />

          <SaveBtn onClick={handleSaveAdminAccount}>Save Changes</SaveBtn>
        </div>
      </SectionCard>
    </>
  );

  // ─────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      {/* ── SIDEBAR ── */}
      <Sidebar>
        <SidebarBrand>
          <BrandIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7L12 12L21 7L12 2Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M3 17L12 22L21 17"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M3 12L12 17L21 12"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </BrandIcon>
          <BrandTitle>Admin Panel</BrandTitle>
          <BrandSub>Expense Tracker</BrandSub>
        </SidebarBrand>

        <nav>
          <NavItem
            active={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
          >
            〰 Overview
          </NavItem>
          <NavItem
            active={activeSection === "users"}
            onClick={() => setActiveSection("users")}
          >
            👥 Users
          </NavItem>
          <NavItem
            active={activeSection === "expenses"}
            onClick={() => setActiveSection("expenses")}
          >
            Rs Expenses
          </NavItem>
          <NavItem
            active={activeSection === "settings"}
            onClick={() => setActiveSection("settings")}
          >
            ⚙ Settings
          </NavItem>
        </nav>

        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "0",
            width: "100%",
            padding: "0 24px",
          }}
        >
          <button
            onClick={() => navigate("/home")}
            style={{
              width: "100%",
              padding: "10px",
              background: "none",
              border: "1px solid #e8eaed",
              borderRadius: "8px",
              fontSize: "0.85rem",
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            ← Back to App
          </button>
        </div>
      </Sidebar>

      {/* ── MAIN CONTENT ── */}
      <MainContent>
        {activeSection === "overview" && renderOverview()}
        {activeSection === "users" && renderUsers()}
        {activeSection === "expenses" && renderExpenses()}
        {activeSection === "settings" && renderSettings()}
      </MainContent>
    </AdminLayout>
  );
};

export default AdminPage;