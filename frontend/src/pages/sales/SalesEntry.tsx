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

interface Grain {
    id: number;
    name: string;
    unit_type: string;
}

interface Sale {
    id: number;
    date_bs: string;
    date_ad: string;
    customer_name: string;
    grain: Grain;
    quantity: number;
    rate: number;
    total_amount: number;
    is_billed: boolean;
}

const SalesEntry = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [grains, setGrains] = useState<Grain[]>([]);
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
    const quantity = watch('quantity', 0);
    const rate = watch('rate', 0);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setValue('total_amount', (quantity * rate).toFixed(2));
    }, [quantity, rate, setValue]);

    const loadData = async () => {
        try {
            const [salesRes, grainsRes] = await Promise.all([
                api.get('/sales'),
                api.get('/grains?is_active=1') // In a real app, only fetch grains that have stock > 0 if required
            ]);
            setSales(salesRes.data.data);
            setGrains(grainsRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadData();
        const now = new Date();
        setValue('date_ad', now.toISOString().split('T')[0]);
        setValue('time', now.toTimeString().split(' ')[0].substring(0, 5));
        // BS Date could be integrated here with a library later

        // Add keyboard shortcut for Save
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
            await api.post('/sales', data);
            await loadData();
            reset({
                ...data,
                grain_id: '',
                quantity: '',
                rate: '',
                remarks: ''
            });
            // Focus back on grain input for rapid entry
            document.getElementById('sales_grain_select')?.focus();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Failed to save sale entry.');
        }
    };

    const columns = useMemo<ColumnDef<Sale>[]>(() => [
        { header: 'Date (BS)', accessorKey: 'date_bs' },
        { header: 'Customer', accessorKey: 'customer_name' },
        { header: 'Grain', accessorFn: row => row.grain?.name ?? '—' },
        { header: 'Qty', accessorKey: 'quantity' },
        { header: 'Rate (Rs)', accessorKey: 'rate' },
        { header: 'Total (Rs)', accessorKey: 'total_amount', cell: ({ row }) => `Rs. ${Number(row.original.total_amount).toLocaleString()}` },
        {
            header: 'Invoice Status',
            cell: ({ row }) => row.original.is_billed
                ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Billed</span>
                : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">○ Unbilled</span>
        },
    ], []);

    const table = useReactTable({
        data: sales,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] relative">
            <div className="bg-white p-6 shadow rounded-lg mb-6 shrink-0 border-t-4 border-green-500">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    Fast Sales Entry
                    {errorMsg && <span className="ml-4 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md">{errorMsg}</span>}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (AD)</label>
                            <input type="date" {...register('date_ad', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (BS)</label>
                            <input type="text" placeholder="YYYY-MM-DD" {...register('date_bs', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Time</label>
                            <input type="time" {...register('time', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-xs font-medium text-gray-700">Customer</label>
                            <input type="text" {...register('customer_name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Grain</label>
                            <select id="sales_grain_select" {...register('grain_id', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3 bg-white">
                                <option value="">Select...</option>
                                {grains.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Qty</label>
                            <input type="number" step="0.01" {...register('quantity', { required: true, min: 0.01 })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Rate</label>
                            <input type="number" step="0.01" {...register('rate', { required: true, min: 0 })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">Remarks</label>
                            <input type="text" {...register('remarks')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-between">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Total Calculation</label>
                                <input type="text" disabled {...register('total_amount')} className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 shadow-sm sm:text-sm py-2 px-3 text-gray-500 cursor-not-allowed font-semibold text-right" />
                            </div>
                            <button type="submit" className="ml-4 mt-5 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shrink-0">
                                Save Sale (Ctrl+S)
                            </button>
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
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                                        No sales entries found.
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
                                <span className="font-medium">{table.getPageCount()}</span>
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

export default SalesEntry;
