import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    ColumnDef,
    getSortedRowModel,
} from '@tanstack/react-table';
import api from '../../lib/axios';
import { FileText, Download, CheckSquare, Receipt, User } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Sale {
    id: number;
    date_bs: string;
    customer_name: string;
    grain: { name: string };
    quantity: number;
    rate: number;
    total_amount: number;
    is_billed: boolean;
}

interface Bill {
    id: number;
    bill_number: string;
    customer_name: string;
    date_bs: string;
    total_amount: number;
    is_paid: boolean;
    user: { name: string };
}

const BillsList = () => {
    const [activeTab, setActiveTab] = useState<'UNBILLED' | 'HISTORY'>('UNBILLED');
    const [unbilledSales, setUnbilledSales] = useState<Sale[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            customer_name: '',
            customer_address: '',
            customer_phone: '',
            date_ad: '',
            date_bs: '',
            is_paid_in_full: false,
        }
    });

    useEffect(() => {
        const now = new Date();
        setValue('date_ad', now.toISOString().split('T')[0]);
    }, [setValue]);

    useEffect(() => {
        if (activeTab === 'UNBILLED') {
            loadUnbilledSales();
        } else {
            loadBills();
        }
    }, [activeTab]);

    const loadUnbilledSales = async () => {
        try {
            const res = await api.get('/sales?is_billed=0&per_page=200');
            setUnbilledSales(res.data.data || res.data || []);
            setRowSelection({});
        } catch (e) {
            console.error(e);
        }
    };

    const loadBills = async () => {
        try {
            const res = await api.get('/bills?per_page=100');
            setBills(res.data.data || res.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleGenerateBill = async (formData: any) => {
        const selectedIds = Object.keys(rowSelection)
            .filter(key => rowSelection[key as keyof typeof rowSelection])
            .map(idx => unbilledSales[parseInt(idx)].id);

        if (selectedIds.length === 0) {
            alert('Please select at least one sale to generate an invoice.');
            return;
        }
        if (!formData.customer_name.trim()) {
            alert('Customer name is required.');
            return;
        }
        if (!formData.date_bs) {
            alert('Please enter the Nepali date (BS).');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/bills/generate', {
                sale_ids: selectedIds,
                customer_name: formData.customer_name,
                customer_address: formData.customer_address || null,
                customer_phone: formData.customer_phone || null,
                date_bs: formData.date_bs,
                date_ad: formData.date_ad,
                is_paid_in_full: formData.is_paid_in_full,
            });
            const bill = res.data;
            const confirmed = confirm(`✅ Invoice ${bill.bill_number} generated!\n\nDownload PDF now?`);
            if (confirmed) {
                downloadPdf(bill.id, bill.bill_number);
            }
            reset({ date_ad: new Date().toISOString().split('T')[0], date_bs: '', customer_name: '', customer_address: '', customer_phone: '', is_paid_in_full: false });
            loadUnbilledSales();
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || 'Failed to generate invoice.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadPdf = (billId: number, billNumber: string) => {
        api.get(`/bills/${billId}/pdf`, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Invoice-${billNumber}.pdf`;
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            })
            .catch(e => {
                console.error(e);
                alert('Failed to download PDF.');
            });
    };

    const unbilledColumns = useMemo<ColumnDef<Sale>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        },
        { header: 'Date (BS)', accessorKey: 'date_bs' },
        { header: 'Customer', accessorKey: 'customer_name' },
        { header: 'Grain', accessorFn: row => row.grain?.name ?? '—', id: 'grain_name' },
        { header: 'Qty', accessorKey: 'quantity' },
        { header: 'Rate (Rs)', accessorKey: 'rate' },
        { header: 'Total (Rs)', accessorKey: 'total_amount', cell: ({ row }) => `Rs. ${Number(row.original.total_amount).toLocaleString()}` },
    ], []);

    const tableUnbilled = useReactTable({
        data: unbilledSales,
        columns: unbilledColumns,
        state: { rowSelection },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const historyColumns = useMemo<ColumnDef<Bill>[]>(() => [
        { header: 'Invoice No.', accessorKey: 'bill_number' },
        { header: 'Customer', accessorKey: 'customer_name' },
        { header: 'Date (BS)', accessorKey: 'date_bs' },
        { header: 'Total (Rs)', accessorKey: 'total_amount', cell: ({ row }) => `Rs. ${Number(row.original.total_amount).toLocaleString()}` },
        {
            header: 'Status',
            accessorKey: 'is_paid',
            cell: ({ row }) => row.original.is_paid
                ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">✓ Paid</span>
                : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">⚠ Unpaid</span>
        },
        { header: 'Generated By', accessorFn: row => row.user?.name ?? '—', id: 'user_name' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <button onClick={() => downloadPdf(row.original.id, row.original.bill_number)}
                    className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 px-3 py-1 rounded-md text-sm">
                    <Download className="w-4 h-4 mr-1" /> PDF
                </button>
            )
        }
    ], []);

    const tableHistory = useReactTable({
        data: bills,
        columns: historyColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;
    const selectedTotal = Object.keys(rowSelection)
        .filter(k => rowSelection[k as keyof typeof rowSelection])
        .reduce((sum, idx) => sum + Number(unbilledSales[parseInt(idx)]?.total_amount ?? 0), 0);

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] relative space-y-4">
            {/* Header Tabs */}
            <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg shrink-0">
                <div className="flex space-x-3">
                    <button onClick={() => setActiveTab('UNBILLED')}
                        className={`px-4 py-2 font-medium rounded-md flex items-center text-sm ${activeTab === 'UNBILLED' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <CheckSquare className="w-4 h-4 mr-2" /> Generate Invoice
                    </button>
                    <button onClick={() => setActiveTab('HISTORY')}
                        className={`px-4 py-2 font-medium rounded-md flex items-center text-sm ${activeTab === 'HISTORY' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <FileText className="w-4 h-4 mr-2" /> Invoice History
                    </button>
                </div>
                {selectedCount > 0 && activeTab === 'UNBILLED' && (
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                        <strong>{selectedCount}</strong> sales selected · Total: <strong>Rs. {selectedTotal.toLocaleString()}</strong>
                    </div>
                )}
            </div>

            {activeTab === 'UNBILLED' && (
                <div className="flex flex-col flex-1 space-y-4 overflow-hidden">
                    {/* Customer Invoice Form */}
                    <form onSubmit={handleSubmit(handleGenerateBill)}
                        className="bg-white p-5 shadow rounded-lg shrink-0 border-t-4 border-blue-500">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2 text-blue-500" /> Customer & Invoice Details
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-700">Customer Name *</label>
                                <input type="text" placeholder="e.g. Ram Bahadur KC"
                                    {...register('customer_name', { required: true })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border py-2 px-3" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Address (Optional)</label>
                                <input type="text" placeholder="e.g. Kathmandu"
                                    {...register('customer_address')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border py-2 px-3" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Phone (Optional)</label>
                                <input type="text" placeholder="98xxxxxxxx"
                                    {...register('customer_phone')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border py-2 px-3" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Invoice Date (AD)</label>
                                <input type="date" {...register('date_ad')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border py-2 px-3" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Invoice Date (BS) *</label>
                                <input type="text" placeholder="2081-11-19"
                                    {...register('date_bs', { required: true })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border py-2 px-3" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <label className="flex items-center cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                <input type="checkbox" {...register('is_paid_in_full')}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="ml-2 text-sm text-gray-700 font-medium">Mark as Paid in Cash (settles Customer balance immediately)</span>
                            </label>
                            <button type="submit" disabled={isSubmitting}
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 py-2 px-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 h-[38px]">
                                <Receipt className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Generating...' : 'Generate Invoice & PDF'}
                            </button>
                        </div>
                    </form>

                    {/* Unbilled Sales Table */}
                    <div className="flex-1 bg-white shadow rounded-lg flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                            <h3 className="text-base font-semibold text-gray-900">Unbilled Sales — Select to Invoice</h3>
                            <span className="text-xs text-gray-500">{unbilledSales.length} row(s)</span>
                        </div>
                        <div className="overflow-x-auto overflow-y-auto flex-1 relative">
                            <table className="min-w-full divide-y divide-gray-200 border-b">
                                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                    {tableUnbilled.getHeaderGroups().map(headerGroup => (
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
                                    {tableUnbilled.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => row.toggleSelected()}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900" onClick={e => cell.column.id === 'select' && e.stopPropagation()}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {unbilledSales.length === 0 && (
                                        <tr>
                                            <td colSpan={unbilledColumns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                                                No unbilled sales entries. Go to Sales to add new entries.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'HISTORY' && (
                <div className="flex-1 bg-white shadow rounded-lg flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                        <h3 className="text-base font-semibold text-gray-900">Generated Invoices History</h3>
                        <span className="text-xs text-gray-500">{bills.length} invoice(s)</span>
                    </div>
                    <div className="overflow-x-auto overflow-y-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-200 border-b">
                            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                {tableHistory.getHeaderGroups().map(headerGroup => (
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
                                {tableHistory.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {bills.length === 0 && (
                                    <tr>
                                        <td colSpan={historyColumns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                                            No invoices generated yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillsList;
