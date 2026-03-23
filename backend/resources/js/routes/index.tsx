import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import GrainsList from '../pages/grains/GrainsList';
import PurchasesEntry from '../pages/purchases/PurchasesEntry';
import PurchaseSlipHistory from '../pages/purchases/PurchaseSlipHistory';
import SalesEntry from '../pages/sales/SalesEntry';
import Reports from '../pages/reports/Reports';
import ExpensesEntry from '../pages/expenses/ExpensesEntry';
import PaymentsEntry from '../pages/payments/PaymentsEntry';
import BillsList from '../pages/bills/BillsList';

import { RouteErrorBoundary } from '../components/layout/DashboardLayout';

export const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> },
    {
        path: '/',
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary><DashboardLayout /></RouteErrorBoundary>,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'grains', element: <GrainsList /> },
            { path: 'purchases', element: <PurchasesEntry /> },
            { path: 'purchase-slips', element: <PurchaseSlipHistory /> },
            { path: 'sales', element: <SalesEntry /> },
            { path: 'reports', element: <Reports /> },
            { path: 'expenses', element: <ExpensesEntry /> },
            { path: 'payments', element: <PaymentsEntry /> },
            { path: 'bills', element: <BillsList /> },
        ]
    },
    { path: '*', element: <Navigate to="/" replace /> }
]);
