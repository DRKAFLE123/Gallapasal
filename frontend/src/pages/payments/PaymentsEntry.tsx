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
import { Download } from 'lucide-react';

interface Payment {
    id: number;
    date_bs: string;
    date_ad: string;
    type: 'PAYABLE' | 'RECEIVABLE';
    party_name: string;
    amount: number;
    payment_mode: string;
    reference_no: string;
    remarks: string;
}

const PAYMENT_MODES = ['CASH', 'CHEQUE', 'ONLINE'];

const PaymentsEntry = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [summary, setSummary] = useState<{ total_payables: number, total_receivables: number, net_flow: number }>({
        total_payables: 0,
        total_receivables: 0,
        net_flow: 0
    });
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState('');

    const loadData = async () => {
        try {
            const [paymentsRes, summaryRes] = await Promise.all([
                api.get('/payments'),
                api.get('/payments/summary')
            ]);
            setPayments(paymentsRes.data.data || paymentsRes.data || []);
            setSummary(summaryRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleExport = () => {
        const url = `${(import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api/v1'}/exports/payments`;
        window.open(url, '_blank');
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
            await api.post('/payments', data);
            await loadData();
            // Reset fields but keep date and type for fast entry of same type
            reset({
                ...data,
                party_name: '',
                amount: '',
                reference_no: '',
                remarks: ''
            });
            document.getElementById('payment_party_name')?.focus();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Failed to save payment.');
        }
    };

    const columns = useMemo<ColumnDef<Payment>[]>(() => [
        { header: 'Date (BS)', accessorKey: 'date_bs' },
        {
            header: 'Type',
            accessorKey: 'type',
            cell: info => {
                const type = info.getValue() as string;
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${type === 'RECEIVABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {type === 'RECEIVABLE' ? 'In (Customer)' : 'Out (Vendor)'}
                    </span>
                );
            }
        },
        { header: 'Party Name', accessorKey: 'party_name' },
        { header: 'Mode', accessorKey: 'payment_mode' },
        { header: 'Amount (Rs)', accessorKey: 'amount' },
        { header: 'Reference', accessorKey: 'reference_no' },
    ], []);

    const table = useReactTable({
        data: payments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] relative space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <p className="text-sm font-medium text-gray-500">Total Receivables (Customers Data)</p>
                    <p className="text-2xl font-bold text-green-600">Rs. {summary.total_receivables}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                    <p className="text-sm font-medium text-gray-500">Total Payables (Vendors Data)</p>
                    <p className="text-2xl font-bold text-red-600">Rs. {summary.total_payables}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-500">Net Cashflow Position</p>
                    <p className={`text-2xl font-bold ${summary.net_flow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        Rs. {summary.net_flow}
                    </p>
                </div>
            </div>

            {/* Fast Entry Form */}
            <div className="bg-white p-6 shadow rounded-lg shrink-0 border-t-4 border-blue-400">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        Payment & Settlement Entry
                        {errorMsg && <span className="ml-4 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md">{errorMsg}</span>}
                    </h2>
                    <button
                        onClick={handleExport}
                        title="Download Payments Excel Export"
                        className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 text-sm font-medium flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">

                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (AD)</label>
                            <input type="date" {...register('date_ad', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (BS)</label>
                            <input type="text" placeholder="YYYY-MM-DD" {...register('date_bs', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Type</label>
                            <select {...register('type', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3 bg-white font-semibold">
                                <option value="RECEIVABLE">Receivable (Customer)</option>
                                <option value="PAYABLE">Payable (Vendor)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700">Party Name (Customer/Vendor)</label>
                            <input id="payment_party_name" type="text" {...register('party_name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Amount (Rs)</label>
                            <input type="number" step="0.01" {...register('amount', { required: true, min: 0.01 })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3 focus:bg-yellow-50" />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Payment Mode</label>
                            <select {...register('payment_mode', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3 bg-white">
                                {PAYMENT_MODES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Ref / Cheque No</label>
                            <input type="text" {...register('reference_no')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">Remarks</label>
                            <input type="text" {...register('remarks')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Save (Ctrl+S)
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* List Table */}
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
                            {payments?.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                                        No payments recorded yet.
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

export default PaymentsEntry;
