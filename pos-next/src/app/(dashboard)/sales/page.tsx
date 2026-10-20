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

export default function SalesPage() {
    const { t, language } = useLanguageStore();
    const [sales, setSales] = useState<Sale[]>([]);
    const [grains, setGrains] = useState<Grain[]>([]);
    const { register, handleSubmit, getValues, setValue, reset } = useForm();
    const [errorMsg, setErrorMsg] = useState('');

    const loadData = async () => {
        try {
            const [salesRes, grainsRes] = await Promise.all([
                api.get('/sales'),
                api.get('/grains?is_active=1')
            ]);
            setSales(salesRes.data.data);
            setGrains(grainsRes.data);
        } catch (e) {
            console.error('Failed to load sales', e);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Setup initial dates
    useEffect(() => {
        const now = new Date();
        setValue('date_ad', getTodayAdDateStr());
        setValue('date_bs', getTodayNepaliDateStr());
        setValue('time', now.toTimeString().split(' ')[0].substring(0, 5));
    }, [setValue]);

    // Keyboard shortcut for Save
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSubmit(onSubmit)();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSubmit]);

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
            document.getElementById('sales_grain_select')?.focus();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || (language === 'np' ? 'बिक्री प्रविष्टि सुरक्षित गर्न सकिएन।' : 'Failed to save sale entry.'));
        }
    };

    const columns = useMemo<ColumnDef<Sale>[]>(() => [
        { 
            header: language === 'np' ? 'मिति (वि.सं.)' : 'Date (BS)', 
            accessorKey: 'date_bs' 
        },
        { 
            header: language === 'np' ? 'ग्राहक' : 'Customer', 
            accessorKey: 'customer_name' 
        },
        { 
            header: language === 'np' ? 'अन्न' : 'Grain', 
            accessorFn: row => row.grain?.name ?? '—' 
        },
        { 
            header: language === 'np' ? 'मात्रा' : 'Qty', 
            accessorKey: 'quantity' 
        },
        { 
            header: language === 'np' ? 'दर (रु)' : 'Rate (Rs)', 
            accessorKey: 'rate' 
        },
        { 
            header: language === 'np' ? 'कुल रकम (रु)' : 'Total (Rs)', 
            accessorKey: 'total_amount', 
            cell: ({ row }) => `Rs. ${Number(row.original.total_amount).toLocaleString()}` 
        },
        {
            header: language === 'np' ? 'बिल स्थिति' : 'Invoice Status',
            cell: ({ row }) => row.original.is_billed
                ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{language === 'np' ? '✓ बिल भएको' : '✓ Billed'}</span>
                : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">{language === 'np' ? '○ बाँकी' : '○ Unbilled'}</span>
        },
    ], [language]);

    const table = useReactTable({
        data: sales,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)] relative pb-10">
            {/* Sales Entry Card */}
            <div className="bg-white p-4 sm:p-6 shadow rounded-lg mb-6 shrink-0 border-t-4 border-green-500">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                    <span>{language === 'np' ? 'द्रुत बिक्री प्रविष्टि (Fast Sales Entry)' : 'Fast Sales Entry'}</span>
                    {errorMsg && <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md">{errorMsg}</span>}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (AD)</label>
                            <input type="date" {...register('date_ad', {
                                required: true, onChange: (e) => {
                                    const bs = convertAdToBs(e.target.value);
                                    if (bs) setValue('date_bs', bs);
                                }
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (BS)</label>
                            <input type="text" placeholder="YYYY-MM-DD" {...register('date_bs', {
                                required: true, onChange: (e) => {
                                    const ad = convertBsToAd(e.target.value);
                                    if (ad) setValue('date_ad', ad);
                                }
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'समय' : 'Time'}</label>
                            <input type="time" {...register('time', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'ग्राहकको नाम' : 'Customer'}</label>
                            <input type="text" {...register('customer_name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'अन्न' : 'Grain'}</label>
                            <select id="sales_grain_select" {...register('grain_id', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3 bg-white">
                                <option value="">{language === 'np' ? 'छान्नुहोस्...' : 'Select...'}</option>
                                {grains.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'मात्रा' : 'Qty'}</label>
                            <input type="number" step="0.01" {...register('quantity', { 
                                required: true, 
                                min: 0.01,
                                onChange: (e) => {
                                    const qty = parseFloat(e.target.value) || 0;
                                    const currentRate = parseFloat(getValues('rate')) || 0;
                                    setValue('total_amount', (qty * currentRate).toFixed(2));
                                }
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'दर' : 'Rate'}</label>
                            <input type="number" step="0.01" {...register('rate', { 
                                required: true, 
                                min: 0,
                                onChange: (e) => {
                                    const rate = parseFloat(e.target.value) || 0;
                                    const currentQty = parseFloat(getValues('quantity')) || 0;
                                    setValue('total_amount', (currentQty * rate).toFixed(2));
                                }
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'कैफियत (Remarks)' : 'Remarks'}</label>
                            <input type="text" {...register('remarks')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-between">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'कुल हिसाब' : 'Total Calculation'}</label>
                                <input type="text" disabled {...register('total_amount')} className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 shadow-sm sm:text-sm py-2 px-3 text-gray-500 cursor-not-allowed font-semibold text-right" />
                            </div>
                            <button type="submit" className="ml-4 mt-5 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none transition shrink-0">
                                {language === 'np' ? 'बिक्री सुरक्षित (Ctrl+S)' : 'Save Sale (Ctrl+S)'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Sales Table */}
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
                            {table.getRowModel().rows.slice(0, table.getState().pagination.pageSize || 10).map(row => (
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
                                        {language === 'np' ? 'कुनै बिक्री प्रविष्टि भेटिएन।' : 'No sales entries found.'}
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
