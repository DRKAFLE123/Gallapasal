import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import api from '../../lib/axios';

interface Expense {
    id: number;
    date_bs: string;
    date_ad: string;
    category: string;
    description: string;
    amount: number;
}

const EXPENSE_CATEGORIES = [
    'Transport / Freight',
    'Labor / Loading',
    'Rent',
    'Electricity / Water',
    'Salary',
    'Maintenance',
    'Commission',
    'Miscellaneous'
];

const ExpensesEntry = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [summary, setSummary] = useState<{ total_expenses: number, by_category: any[] }>({ total_expenses: 0, by_category: [] });
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState('');

    const loadData = async () => {
        try {
            const [expensesRes, summaryRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/expenses/summary')
            ]);
            setExpenses(expensesRes.data.data || expensesRes.data || []);
            setSummary(summaryRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadData();
        const now = new Date();
        setValue('date_ad', now.toISOString().split('T')[0]);
        // Fast save bind
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSubmit(onSubmit)();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setValue, handleSubmit]);

    const onSubmit = async (data: any) => {
        setErrorMsg('');
        try {
            await api.post('/expenses', data);
            await loadData();
            reset({
                ...data, // Keep dates
                category: '',
                description: '',
                amount: ''
            });
            document.getElementById('expense_category')?.focus();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Failed to save expense.');
        }
    };

    const columns = useMemo<ColumnDef<Expense>[]>(() => [
        { header: 'Date (AD)', accessorKey: 'date_ad' },
        { header: 'Date (BS)', accessorKey: 'date_bs' },
        { header: 'Category', accessorKey: 'category' },
        { header: 'Description', accessorKey: 'description' },
        { header: 'Amount (Rs)', accessorKey: 'amount' },
    ], []);

    const table = useReactTable({
        data: expenses,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] relative space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                    <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">Rs. {summary.total_expenses}</p>
                </div>
                {/* Dynamically list top 3 categories if they exist */}
                {summary.by_category?.slice(0, 3).map((cat, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
                        <p className="text-sm font-medium text-gray-500">{cat.category}</p>
                        <p className="text-xl font-bold text-gray-900">Rs. {cat.total}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 shadow rounded-lg shrink-0 border-t-4 border-red-400">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    Record Daily Expense
                    {errorMsg && <span className="ml-4 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md">{errorMsg}</span>}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (AD)</label>
                            <input type="date" {...register('date_ad', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (BS)</label>
                            <input type="text" placeholder="YYYY-MM-DD" {...register('date_bs', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Category</label>
                            <select id="expense_category" {...register('category', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3 bg-white">
                                <option value="">Select...</option>
                                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Amount (Rs)</label>
                            <input type="number" step="0.01" {...register('amount', { required: true, min: 0.01 })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Save (Ctrl+S)
                            </button>
                        </div>
                        <div className="md:col-span-5">
                            <label className="block text-xs font-medium text-gray-700">Description (Optional)</label>
                            <input type="text" {...register('description')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3" />
                        </div>

                    </div>
                </form>
            </div>

            <div className="flex-1 bg-white shadow rounded-lg overflow-hidden flex flex-col">
                <div className="overflow-x-auto overflow-y-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200 border-b relative">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {expenses?.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                                        No expenses recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6 shrink-0">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
                                <span className="font-medium">{table.getPageCount() || 1}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpensesEntry;
