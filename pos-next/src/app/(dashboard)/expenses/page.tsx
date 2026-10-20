'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import api from '../../../lib/axios';
import { convertAdToBs, convertBsToAd, getTodayAdDateStr, getTodayNepaliDateStr } from '../../../lib/nepaliDate';
import { useLanguageStore } from '../../../store/languageStore';

interface Expense {
    id: number;
    date_bs: string;
    date_ad: string;
    category: string;
    description: string;
    amount: number;
}

const EXPENSE_CATEGORIES_EN = [
    'Transport / Freight',
    'Labor / Loading',
    'Rent',
    'Electricity / Water',
    'Salary',
    'Maintenance',
    'Commission',
    'Miscellaneous'
];

const EXPENSE_CATEGORIES_NP: Record<string, string> = {
    'Transport / Freight': 'ढुवानी तथा भाडा (Transport / Freight)',
    'Labor / Loading': 'ज्याला तथा लोड-अनलोड (Labor / Loading)',
    'Rent': 'भाडा (Rent)',
    'Electricity / Water': 'विद्युत तथा खानेपानी (Electricity / Water)',
    'Salary': 'तलब तथा पारिश्रमिक (Salary)',
    'Maintenance': 'मर्मत सम्भार (Maintenance)',
    'Commission': 'कमिशन (Commission)',
    'Miscellaneous': 'विविध खर्च (Miscellaneous)'
};

export default function ExpensesPage() {
    const { t, language } = useLanguageStore();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [summary, setSummary] = useState<{ total_expenses: number, by_category: any[] }>({ total_expenses: 0, by_category: [] });
    const { register, handleSubmit, setValue, reset } = useForm();
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
        setValue('date_ad', getTodayAdDateStr());
        setValue('date_bs', getTodayNepaliDateStr());

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
                ...data,
                category: '',
                description: '',
                amount: ''
            });
            document.getElementById('expense_category')?.focus();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || (language === 'np' ? 'खर्च सुरक्षित गर्न सकिएन।' : 'Failed to save expense.'));
        }
    };

    const columns = useMemo<ColumnDef<Expense>[]>(() => [
        { 
            header: language === 'np' ? 'मिति (ई.सं.)' : 'Date (AD)', 
            accessorKey: 'date_ad' 
        },
        { 
            header: language === 'np' ? 'मिति (वि.सं.)' : 'Date (BS)', 
            accessorKey: 'date_bs' 
        },
        { 
            header: language === 'np' ? 'श्रेणी' : 'Category', 
            accessorKey: 'category',
            cell: ({ row }) => {
                const cat = row.original.category;
                return language === 'np' ? (EXPENSE_CATEGORIES_NP[cat] || cat) : cat;
            }
        },
        { 
            header: language === 'np' ? 'विवरण' : 'Description', 
            accessorKey: 'description' 
        },
        { 
            header: language === 'np' ? 'रकम (रु)' : 'Amount (Rs)', 
            accessorKey: 'amount',
            cell: ({ row }) => `Rs. ${Number(row.original.amount).toLocaleString()}`
        },
    ], [language]);

    const table = useReactTable({
        data: expenses,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)] relative space-y-6 pb-10">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                    <p className="text-sm font-medium text-gray-500">
                        {language === 'np' ? 'कुल दैनिक खर्च' : 'Total Expenses'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">Rs. {Number(summary.total_expenses).toLocaleString()}</p>
                </div>
                {/* Dynamically list top 3 categories if they exist */}
                {summary.by_category?.slice(0, 3).map((cat, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
                        <p className="text-sm font-medium text-gray-500">
                            {language === 'np' ? (EXPENSE_CATEGORIES_NP[cat.category] || cat.category) : cat.category}
                        </p>
                        <p className="text-xl font-bold text-gray-900">Rs. {Number(cat.total).toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 sm:p-6 shadow rounded-lg shrink-0 border-t-4 border-red-400">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                    <span>{language === 'np' ? 'दैनिक खर्च प्रविष्टि (Record Daily Expense)' : 'Record Daily Expense'}</span>
                    {errorMsg && <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md">{errorMsg}</span>}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (AD)</label>
                            <input type="date" {...register('date_ad', {
                                required: true, onChange: (e) => {
                                    const bs = convertAdToBs(e.target.value);
                                    if (bs) setValue('date_bs', bs);
                                }
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (BS)</label>
                            <input type="text" placeholder="YYYY-MM-DD" {...register('date_bs', {
                                required: true, onChange: (e) => {
                                    const ad = convertBsToAd(e.target.value);
                                    if (ad) setValue('date_ad', ad);
                                }
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'श्रेणी' : 'Category'}</label>
                            <select id="expense_category" {...register('category', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3 bg-white">
                                <option value="">{language === 'np' ? 'छान्नुहोस्...' : 'Select...'}</option>
                                {EXPENSE_CATEGORIES_EN.map(c => (
                                    <option key={c} value={c}>
                                        {language === 'np' ? EXPENSE_CATEGORIES_NP[c] : c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'रकम (रु)' : 'Amount (Rs)'}</label>
                            <input type="number" step="0.01" {...register('amount', { required: true, min: 0.01 })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none transition">
                                {language === 'np' ? 'खर्च सुरक्षित (Ctrl+S)' : 'Save (Ctrl+S)'}
                            </button>
                        </div>
                        <div className="md:col-span-5">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'विवरण (ऐच्छिक)' : 'Description (Optional)'}</label>
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
                                        {language === 'np' ? 'कुनै खर्च प्रविष्टि फेला परेन।' : 'No expenses recorded yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6 shrink-0">
                    <div>
                        <p className="text-sm text-gray-700">
                            {language === 'np' ? 'पृष्ठ ' : 'Showing page '} 
                            <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> 
                            {language === 'np' ? ' / ' : ' of '} 
                            <span className="font-medium">{table.getPageCount() || 1}</span>
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center px-3 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                            >
                                {language === 'np' ? 'अघिल्लो' : 'Previous'}
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                            >
                                {language === 'np' ? 'अर्को' : 'Next'}
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
