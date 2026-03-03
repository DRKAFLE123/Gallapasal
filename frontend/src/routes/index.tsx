import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import Login from '../pages/auth/Login';
import GrainsList from '../pages/grains/GrainsList';
import PurchasesEntry from '../pages/purchases/PurchasesEntry';
import PurchaseSlipHistory from '../pages/purchases/PurchaseSlipHistory';
import SalesEntry from '../pages/sales/SalesEntry';
import Reports from '../pages/reports/Reports';
import ExpensesEntry from '../pages/expenses/ExpensesEntry';
import PaymentsEntry from '../pages/payments/PaymentsEntry';
import BillsList from '../pages/bills/BillsList';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="grains" element={<GrainsList />} />
                <Route path="purchases" element={<PurchasesEntry />} />
                <Route path="purchase-slips" element={<PurchaseSlipHistory />} />
                <Route path="sales" element={<SalesEntry />} />
                <Route path="reports" element={<Reports />} />
                <Route path="expenses" element={<ExpensesEntry />} />
                <Route path="payments" element={<PaymentsEntry />} />
                <Route path="bills" element={<BillsList />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
