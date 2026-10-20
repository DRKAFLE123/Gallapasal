'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    useReactTable, getCoreRowModel, flexRender,
    ColumnDef, getPaginationRowModel, getSortedRowModel,
} from '@tanstack/react-table';
import { Download, Eye, Filter, BarChart2, RefreshCw, Printer } from 'lucide-react';
import api from '../../../lib/axios';
import { useLanguageStore } from '../../../store/languageStore';

interface Voucher {
    id: number;
    voucher_number: string;
    vendor_name: string;
    vendor_address?: string;
    vendor_type: string;
    date_bs: string;
    date_ad: string;
    total_amount: number;
    is_paid: boolean;
    user?: { name: string };
}

interface VendorSummary {
    vendor_name: string;
    vendor_type: string;
    total_purchased: number;
    slip_count: number;
}

const vendorTypeLabelEn: Record<string, string> = {
    farmer: '🌾 Farmer',
    trader: '🤝 Trader',
    vat_vendor: '🏢 VAT Vendor',
    unregistered_vendor: '📋 Unregistered',
};

const vendorTypeLabelNp: Record<string, string> = {
    farmer: '🌾 कृषक (किसान)',
    trader: '🤝 व्यापारी',
    vat_vendor: '🏢 भ्याट दर्ता विक्रेता',
    unregistered_vendor: '📋 दर्ता नभएको',
};

export default function PurchaseSlipHistoryPage() {
    const { t, language } = useLanguageStore();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [summary, setSummary] = useState<VendorSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(true);

    // Filters
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [vendorName, setVendorName] = useState('');
    const [vendorType, setVendorType] = useState('');
    const [isPaid, setIsPaid] = useState('');

    const buildParams = () => {
        const p: Record<string, string> = { per_page: '200' };
        if (fromDate) p.from_date = fromDate;
        if (toDate) p.to_date = toDate;
        if (vendorName) p.vendor_name = vendorName;
        if (vendorType) p.vendor_type = vendorType;
        if (isPaid !== '') p.is_paid = isPaid;
        return p;
    };

    const loadVouchers = useCallback(async () => {
        setLoading(true);
        try {
            const params = buildParams();
            const [vRes, sRes] = await Promise.all([
                api.get('/vouchers', { params }),
                api.get('/vouchers/summary', { params: fromDate || toDate ? { from_date: fromDate, to_date: toDate } : {} }),
            ]);
            setVouchers(vRes.data.data || vRes.data || []);
            setSummary(sRes.data || []);
        } catch (e) { 
            console.error(e); 
        } finally { 
            setLoading(false); 
        }
    }, [fromDate, toDate, vendorName, vendorType, isPaid]);

    useEffect(() => { 
        loadVouchers(); 
    }, [loadVouchers]);

    const downloadPdf = (id: number, voucherNumber: string) => {
        api.get(`/vouchers/${id}/pdf`, { responseType: 'blob' })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Slip-${voucherNumber}.pdf`;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                }, 1000);
            })
            .catch(() => alert(language === 'np' ? 'PDF डाउनलोड गर्न असफल भयो।' : 'Failed to download PDF.'));
    };

    const previewPdf = (id: number) => {
        api.get(`/vouchers/${id}/pdf`, { responseType: 'blob' })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            })
            .catch(() => alert(language === 'np' ? 'PDF पूर्वावलोकन गर्न असफल भयो।' : 'Failed to preview PDF.'));
    };

    const printPdf = (id: number) => {
        api.get(`/vouchers/${id}/pdf`, { responseType: 'blob' })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                iframe.onload = () => { iframe.contentWindow?.print(); };
            })
            .catch(() => alert(language === 'np' ? 'प्रिन्ट गर्न असफल भयो।' : 'Failed to print PDF.'));
    };

    const typeLabels = language === 'np' ? vendorTypeLabelNp : vendorTypeLabelEn;

    const columns = useMemo<ColumnDef<Voucher>[]>(() => [
        { 
            header: language === 'np' ? 'भौचर नं.' : 'Voucher #', 
            accessorKey: 'voucher_number', 
            cell: ({ row }) => <span className="font-mono text-blue-600 font-medium">{row.original.voucher_number}</span> 
        },
        { 
            header: language === 'np' ? 'विक्रेता' : 'Vendor', 
            accessorKey: 'vendor_name' 
        },
        { 
            header: language === 'np' ? 'प्रकार' : 'Type', 
            accessorKey: 'vendor_type', 
            cell: ({ row }) => <span className="text-xs">{typeLabels[row.original.vendor_type] ?? row.original.vendor_type}</span> 
        },
        { 
            header: language === 'np' ? 'मिति (वि.सं.)' : 'Date (BS)', 
            accessorKey: 'date_bs' 
        },
        { 
            header: language === 'np' ? 'मिति (ई.सं.)' : 'Date (AD)', 
            accessorKey: 'date_ad' 
        },
        {
            header: language === 'np' ? 'कुल रकम' : 'Total (Rs)', 
            accessorKey: 'total_amount',
            cell: ({ row }) => <span className="font-semibold">Rs. {Number(row.original.total_amount).toLocaleString()}</span>
        },
        {
            header: language === 'np' ? 'स्थिति' : 'Status', 
            accessorKey: 'is_paid',
            cell: ({ row }) => row.original.is_paid
                ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{language === 'np' ? '✓ भुक्तानी भएको' : '✓ Paid'}</span>
                : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{language === 'np' ? '⚠ बाँकी' : '⚠ Unpaid'}</span>
        },
        {
            id: 'actions', 
            header: language === 'np' ? 'कार्य' : 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1">
                    <button onClick={() => previewPdf(row.original.id)} title={language === 'np' ? 'ब्राउजरमा हेर्नुहोस्' : 'Preview in browser'}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => printPdf(row.original.id)} title={language === 'np' ? 'प्रिन्ट गर्नुहोस्' : 'Print'}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        <Printer className="w-4 h-4" />
                    </button>
                    <button onClick={() => downloadPdf(row.original.id, row.original.voucher_number)} title={language === 'np' ? 'PDF डाउनलोड' : 'Download PDF'}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            )
        },
    ], [language, typeLabels]);

    const table = useReactTable({
        data: vouchers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const grandTotal = vouchers.reduce((s, v) => s + Number(v.total_amount || 0), 0);

    return (
        <div className="flex flex-col space-y-4 pb-10">
            {/* Filter Bar */}
            <div className="bg-white p-4 shadow rounded-lg border-t-4 border-orange-500">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center">
                        <Filter className="w-4 h-4 mr-2 text-orange-500" />
                        {language === 'np' ? 'खरिद पर्ची फिल्टर गर्नुहोस्' : 'Filter Purchase Slips'}
                    </h2>
                    <button onClick={loadVouchers} disabled={loading}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? (language === 'np' ? 'लोड हुँदैछ...' : 'Loading...') : (language === 'np' ? 'ताजा गर्नुहोस्' : 'Refresh')}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600">From Date (AD)</label>
                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                            className="mt-1 w-full rounded border-gray-300 text-sm py-1.5 px-2 border focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600">To Date (AD)</label>
                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                            className="mt-1 w-full rounded border-gray-300 text-sm py-1.5 px-2 border focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600">{language === 'np' ? 'विक्रेताको नाम' : 'Vendor Name'}</label>
                        <input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder={language === 'np' ? 'खोज्नुहोस्...' : 'Search vendor...'}
                            className="mt-1 w-full rounded border-gray-300 text-sm py-1.5 px-2 border focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600">{language === 'np' ? 'विक्रेता प्रकार' : 'Vendor Type'}</label>
                        <select value={vendorType} onChange={e => setVendorType(e.target.value)}
                            className="mt-1 w-full rounded border-gray-300 text-sm py-1.5 px-2 border bg-white focus:ring-orange-500 focus:border-orange-500">
                            <option value="">{language === 'np' ? 'सबै प्रकार' : 'All Types'}</option>
                            <option value="farmer">🌾 {language === 'np' ? 'कृषक (किसान)' : 'Farmer'}</option>
                            <option value="trader">🤝 {language === 'np' ? 'व्यापारी' : 'Trader'}</option>
                            <option value="vat_vendor">🏢 {language === 'np' ? 'भ्याट दर्ता' : 'VAT Vendor'}</option>
                            <option value="unregistered_vendor">📋 {language === 'np' ? 'दर्ता नभएको' : 'Unregistered'}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600">{language === 'np' ? 'भुक्तानी स्थिति' : 'Payment Status'}</label>
                        <select value={isPaid} onChange={e => setIsPaid(e.target.value)}
                            className="mt-1 w-full rounded border-gray-300 text-sm py-1.5 px-2 border bg-white focus:ring-orange-500 focus:border-orange-500">
                            <option value="">{language === 'np' ? 'सबै' : 'All'}</option>
                            <option value="1">{language === 'np' ? 'भुक्तानी भएको' : 'Paid'}</option>
                            <option value="0">{language === 'np' ? 'बाँकी' : 'Unpaid'}</option>
                        </select>
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button onClick={loadVouchers}
                        className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 shadow-sm transition">
                        <Filter className="w-4 h-4 mr-2" /> {language === 'np' ? 'फिल्टर लागू गर्नुहोस्' : 'Apply Filters'}
                    </button>
                </div>
            </div>

            {/* Vendor Summary Panel */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                        <BarChart2 className="w-4 h-4 mr-2 text-indigo-500" />
                        {language === 'np' ? 'विक्रेता खरिद सारांश' : 'Vendor Purchase Summary'}
                    </h3>
                    <button onClick={() => setShowSummary(s => !s)} className="text-xs text-gray-500 hover:text-gray-800">
                        {showSummary ? (language === 'np' ? '▲ लुकाउनुहोस्' : '▲ Hide') : (language === 'np' ? '▼ देखाउनुहोस्' : '▼ Show')}
                    </button>
                </div>
                {showSummary && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-indigo-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-700 uppercase">{language === 'np' ? 'विक्रेता' : 'Vendor'}</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-700 uppercase">{language === 'np' ? 'प्रकार' : 'Type'}</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-indigo-700 uppercase">{language === 'np' ? 'पर्ची संख्या' : 'Slips'}</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-indigo-700 uppercase">{language === 'np' ? 'कुल खरिद रकम' : 'Total Purchased'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {summary.map((s, i) => (
                                    <tr key={i} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-4 py-2 font-medium text-gray-900">{s.vendor_name}</td>
                                        <td className="px-4 py-2 text-gray-500">{typeLabels[s.vendor_type] ?? s.vendor_type}</td>
                                        <td className="px-4 py-2 text-right text-gray-700">{s.slip_count}</td>
                                        <td className="px-4 py-2 text-right font-semibold text-gray-900">Rs. {Number(s.total_purchased).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {summary.length === 0 && (
                                    <tr><td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-400">{language === 'np' ? 'कुनै विवरण छैन।' : 'No data yet.'}</td></tr>
                                )}
                                {summary.length > 0 && (
                                    <tr className="bg-indigo-100 font-bold">
                                        <td className="px-4 py-2 text-indigo-900" colSpan={2}>{language === 'np' ? 'कुल जम्मा' : 'Grand Total'}</td>
                                        <td className="px-4 py-2 text-right text-indigo-900">{summary.reduce((s, v) => s + v.slip_count, 0)} {language === 'np' ? 'पर्ची' : 'slips'}</td>
                                        <td className="px-4 py-2 text-right text-indigo-900">Rs. {summary.reduce((s, v) => s + Number(v.total_purchased || 0), 0).toLocaleString()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slip History Table */}
            <div className="bg-white shadow rounded-lg flex flex-col overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">
                        {language === 'np' ? 'खरिद पर्ची इतिहास' : 'Purchase Slip History'}
                        <span className="ml-2 text-xs text-gray-400">
                            {vouchers.length} {language === 'np' ? 'पर्ची' : 'slip(s)'} · {language === 'np' ? 'कुल जम्मा:' : 'Grand Total:'} Rs. {grandTotal.toLocaleString()}
                        </span>
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            {table.getHeaderGroups().map(hg => (
                                <tr key={hg.id}>
                                    {hg.headers.map(h => (
                                        <th key={h.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                                            {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.slice(0, table.getState().pagination.pageSize || 10).map(row => (
                                <tr key={row.id} className="hover:bg-orange-50 transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {vouchers.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-400">
                                        {language === 'np' ? 'कुनै खरिद पर्ची फेला परेन। खरिद पृष्ठबाट पर्ची सिर्जना गर्नुहोस्।' : 'No purchase slips found. Generate slips from the Purchases page.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between shrink-0">
                    <p className="text-sm text-gray-600">
                        {language === 'np' ? 'पृष्ठ ' : 'Page '} 
                        {table.getState().pagination.pageIndex + 1} 
                        {language === 'np' ? ' / ' : ' of '} 
                        {table.getPageCount() || 1}
                    </p>
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1.5 rounded-l-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                            {language === 'np' ? 'अघिल्लो' : 'Prev'}
                        </button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                            className="px-3 py-1.5 rounded-r-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                            {language === 'np' ? 'अर्को' : 'Next'}
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
