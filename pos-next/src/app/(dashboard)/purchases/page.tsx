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
import { Download, Eye, CreditCard, X } from 'lucide-react';
import api from '../../../lib/axios';
import PurchaseVoucherModal from '../../../components/purchases/PurchaseVoucherModal';
import { convertAdToBs, convertBsToAd, getTodayAdDateStr, getTodayNepaliDateStr } from '../../../lib/nepaliDate';
import { useLanguageStore } from '../../../store/languageStore';

interface Grain { id: number; name: string; unit_type: string; }

interface Purchase {
    id: number;
    date_bs: string;
    date_ad: string;
    vendor_name: string;
    grain: Grain;
    quantity: number;
    rate: number;
    total_amount: number;
    paid_amount: number;
    payment_method: string;
    is_billed: boolean;
}

const getPaymentStatus = (p: Purchase) => {
    const paid = Number(p.paid_amount ?? 0);
    const total = Number(p.total_amount ?? 0);
    if (paid <= 0) return 'unpaid';
    if (paid >= total) return 'fully_paid';
    return 'partially_paid';
};

const PaymentBadge = ({ purchase, language }: { purchase: Purchase; language: string }) => {
    const status = getPaymentStatus(purchase);
    const paid = Number(purchase.paid_amount ?? 0);
    const total = Number(purchase.total_amount ?? 0);
    const remaining = total - paid;
    if (status === 'fully_paid') return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {language === 'np' ? '✓ पूर्ण भुक्तानी' : '✓ Fully Paid'}
        </span>
    );
    if (status === 'partially_paid') return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800" title={`Remaining: Rs. ${remaining.toLocaleString()}`}>
            {language === 'np' ? `◑ आंशिक (रु. ${paid.toLocaleString()})` : `◑ Partial (Rs. ${paid.toLocaleString()})`}
        </span>
    );
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {language === 'np' ? '○ बाँकी' : '○ Unpaid'}
        </span>
    );
};

// ─── Record Payment Mini Modal ─────────────────────────────────────────────
const PaymentModal = ({ purchase, onClose, onSuccess }: { purchase: Purchase; onClose: () => void; onSuccess: () => void }) => {
    const { language } = useLanguageStore();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'cash' | 'bank' | 'cheque'>('cash');
    const [dateBs, setDateBs] = useState(getTodayNepaliDateStr());
    const [dateAd, setDateAd] = useState(getTodayAdDateStr());
    const [loading, setLoading] = useState(false);
    const remaining = Number(purchase.total_amount) - Number(purchase.paid_amount);

    const handlePay = async () => {
        if (!amount || Number(amount) <= 0 || !dateBs) { 
            alert(language === 'np' ? 'कृपया मान्य रकम र मिति प्रविष्ट गर्नुहोस्।' : 'Enter valid amount and date (BS).'); 
            return; 
        }
        setLoading(true);
        try {
            await api.post(`/purchases/${purchase.id}/record-payment`, {
                amount: Number(amount),
                payment_method: method,
                date_bs: dateBs,
                date_ad: dateAd,
            });
            onSuccess();
            onClose();
        } catch (e: any) {
            alert(e.response?.data?.message || (language === 'np' ? 'भुक्तानी असफल भयो।' : 'Payment failed.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        {language === 'np' ? 'भुक्तानी प्रविष्टि' : 'Record Payment'}
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
                </div>
                <div className="space-y-1 mb-4 bg-gray-50 rounded-lg p-3 text-sm">
                    <p><span className="font-medium text-gray-600">{language === 'np' ? 'विक्रेता / कृषक:' : 'Vendor:'}</span> {purchase.vendor_name}</p>
                    <p><span className="font-medium text-gray-600">{language === 'np' ? 'कुल रकम:' : 'Total:'}</span> Rs. {Number(purchase.total_amount).toLocaleString()}</p>
                    <p><span className="font-medium text-gray-600">{language === 'np' ? 'हालसम्म भुक्तानी:' : 'Already Paid:'}</span> Rs. {Number(purchase.paid_amount).toLocaleString()}</p>
                    <p className="text-red-600 font-semibold"><span className="font-medium">{language === 'np' ? 'बाँकी रकम:' : 'Remaining:'}</span> Rs. {remaining.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700">
                            {language === 'np' ? 'भुक्तानी रकम (रु) *' : 'Payment Amount (Rs) *'}
                        </label>
                        <input type="number" step="0.01" max={remaining} value={amount} onChange={e => setAmount(e.target.value)}
                            placeholder={`Max: ${remaining}`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border py-2 px-3" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                {language === 'np' ? 'मिति (वि.सं.) *' : 'Date (BS) *'}
                            </label>
                            <input type="text" placeholder="2081-11-19" value={dateBs} onChange={e => {
                                setDateBs(e.target.value);
                                const ad = convertBsToAd(e.target.value);
                                if (ad) setDateAd(ad);
                            }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm border py-2 px-3" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                {language === 'np' ? 'मिति (ई.सं.)' : 'Date (AD)'}
                            </label>
                            <input type="date" value={dateAd} onChange={e => {
                                setDateAd(e.target.value);
                                const bs = convertAdToBs(e.target.value);
                                if (bs) setDateBs(bs);
                            }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm border py-2 px-3" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">
                            {language === 'np' ? 'भुक्तानी विधि' : 'Payment Method'}
                        </label>
                        <select value={method} onChange={e => setMethod(e.target.value as any)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm border py-2 px-3 bg-white">
                            <option value="cash">💵 {language === 'np' ? 'नगद (Cash)' : 'Cash'}</option>
                            <option value="bank">🏦 {language === 'np' ? 'बैंक ट्रान्सफर (Bank)' : 'Bank Transfer'}</option>
                            <option value="cheque">📄 {language === 'np' ? 'चेक (Cheque)' : 'Cheque'}</option>
                        </select>
                    </div>
                    <div className="flex space-x-3 pt-2">
                        <button onClick={handlePay} disabled={loading}
                            className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                            {loading ? (language === 'np' ? 'प्रक्रिया हुँदैछ...' : 'Processing...') : (language === 'np' ? '✓ भुक्तानी पुष्टि गर्नुहोस्' : '✓ Confirm Payment')}
                        </button>
                        <button onClick={onClose} className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
                            {language === 'np' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function PurchasesPage() {
    const { t, language } = useLanguageStore();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [grains, setGrains] = useState<Grain[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [payingPurchase, setPayingPurchase] = useState<Purchase | null>(null);

    // Filters
    const [filterFromDate, setFilterFromDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');
    const [filterGrainId, setFilterGrainId] = useState('');

    const { register, handleSubmit, getValues, setValue, reset } = useForm();

    const loadData = async () => {
        try {
            const params = new URLSearchParams({ per_page: '500' });
            if (filterFromDate) params.append('from_date', filterFromDate);
            if (filterToDate) params.append('to_date', filterToDate);
            if (filterGrainId) params.append('grain_id', filterGrainId);

            const [purchasesRes, grainsRes] = await Promise.all([
                api.get(`/purchases?${params.toString()}`),
                api.get('/grains?is_active=1')
            ]);
            setPurchases(purchasesRes.data.data);
            setGrains(grainsRes.data);
        } catch (e) {
            console.error('Failed to load purchases', e);
        }
    };

    // Calculate dynamic weighted average rate
    const { totalFilteredQty, avgRate } = useMemo(() => {
        const totalQty = purchases.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
        const totalValue = purchases.reduce((sum, p) => sum + Number(p.total_amount || 0), 0);
        const avg = totalQty > 0 ? (totalValue / totalQty).toFixed(2) : '0.00';
        return { totalFilteredQty: totalQty, avgRate: avg };
    }, [purchases]);

    useEffect(() => {
        loadData();
    }, []);

    // Setup initial form values
    useEffect(() => {
        const now = new Date();
        setValue('date_ad', getTodayAdDateStr());
        setValue('date_bs', getTodayNepaliDateStr());
        setValue('time', now.toTimeString().split(' ')[0].substring(0, 5));
        setValue('vendor_name', 'Farmer');
    }, [setValue]);

    // Shortcut listener
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
        try {
            await api.post('/purchases', data);
            await loadData();
            reset({ ...data, grain_id: '', quantity: '', rate: '', remarks: '' });
            document.getElementById('grain_select')?.focus();
        } catch (err) {
            console.error(err);
            alert(language === 'np' ? 'खरिद प्रविष्टि सुरक्षित गर्न असफल भयो।' : 'Failed to save purchase entry.');
        }
    };

    const columns = useMemo<ColumnDef<Purchase>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect() || row.original.is_billed}
                        onChange={row.getToggleSelectedHandler()}
                    />
                </div>
            ),
        },
        { 
            header: language === 'np' ? 'मिति (वि.सं.)' : 'Date (BS)', 
            accessorKey: 'date_bs' 
        },
        { 
            header: language === 'np' ? 'विक्रेता / कृषक' : 'Vendor', 
            accessorKey: 'vendor_name' 
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
            header: language === 'np' ? 'भुक्तानी स्थिति' : 'Payment Status',
            cell: ({ row }) => <PaymentBadge purchase={row.original} language={language} />
        },
        {
            header: language === 'np' ? 'पर्ची' : 'Slip',
            cell: ({ row }) => row.original.is_billed
                ? <span title="Purchase slip generated" className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 cursor-help"><Eye className="w-4 h-4" /></span>
                : <span className="text-gray-300 text-xs">—</span>
        },
        {
            id: 'actions',
            header: language === 'np' ? 'भुक्तानी' : 'Pay',
            cell: ({ row }) => {
                const status = getPaymentStatus(row.original);
                if (status === 'fully_paid') return <span className="text-green-500 text-xs font-medium">✓ Settled</span>;
                return (
                    <button onClick={() => setPayingPurchase(row.original)}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition">
                        <CreditCard className="w-3.5 h-3.5 mr-1" /> {language === 'np' ? 'तिर्नुहोस्' : 'Pay'}
                    </button>
                );
            }
        },
    ], [language]);

    const table = useReactTable({
        data: purchases.length ? purchases : [],
        columns,
        enableRowSelection: row => !row.original.is_billed,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const selectedRows = table.getSelectedRowModel?.()?.flatRows?.map(r => r.original) || [];

    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)] relative pb-10">
            {/* Entry Form */}
            <div className="bg-white p-4 sm:p-6 shadow rounded-lg mb-4 shrink-0 border-t-4 border-blue-500">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {language === 'np' ? 'द्रुत खरिद प्रविष्टि (Fast Purchase Entry)' : 'Fast Purchase Entry'}
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
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">Date (BS)</label>
                            <input type="text" placeholder="YYYY-MM-DD" {...register('date_bs', {
                                required: true, onChange: (e) => {
                                    const ad = convertBsToAd(e.target.value);
                                    if (ad) setValue('date_ad', ad);
                                }
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'समय' : 'Time'}</label>
                            <input type="time" {...register('time', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'विक्रेता' : 'Vendor'}</label>
                            <input type="text" {...register('vendor_name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'अन्न' : 'Grain'}</label>
                            <select id="grain_select" {...register('grain_id', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3 bg-white">
                                <option value="">{language === 'np' ? 'छान्नुहोस्...' : 'Select...'}</option>
                                {grains.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
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
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
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
                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'जम्मा' : 'Total'}</label>
                            <input type="text" disabled {...register('total_amount')} className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 shadow-sm sm:text-sm py-2 px-3 text-gray-500 cursor-not-allowed font-semibold" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition">
                            {language === 'np' ? 'सुरक्षित गर्नुहोस् (Ctrl+S)' : 'Save Entry (Ctrl+S)'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Filter & Summary Bar */}
            <div className="bg-white p-4 shadow rounded-lg mb-4 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-wrap items-end gap-3 flex-1">
                    <div>
                        <label className="block text-xs font-medium text-gray-700">From Date (AD)</label>
                        <input type="date" value={filterFromDate} onChange={e => setFilterFromDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-1.5 px-2 border" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">To Date (AD)</label>
                        <input type="date" value={filterToDate} onChange={e => setFilterToDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-1.5 px-2 border" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">{language === 'np' ? 'अन्न फिल्टर' : 'Filter Grain'}</label>
                        <select value={filterGrainId} onChange={e => setFilterGrainId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-1.5 px-2 border bg-white">
                            <option value="">{language === 'np' ? 'सबै अन्न' : 'All Grains'}</option>
                            {grains.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <button onClick={loadData} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition">
                            {language === 'np' ? 'फिल्टर लागू गर्नुहोस्' : 'Apply Filter'}
                        </button>
                    </div>
                </div>

                {/* Weighted Average Summary Panel */}
                <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 flex items-center justify-between min-w-[250px]">
                    <div>
                        <p className="text-xs text-indigo-700 font-medium">{language === 'np' ? 'फिल्टर गरिएको मात्रा' : 'Filtered Qty'}</p>
                        <p className="text-lg font-bold text-indigo-900">{totalFilteredQty.toLocaleString()} <span className="text-xs font-normal">units</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-indigo-700 font-medium">{language === 'np' ? 'भारित औसत दर' : 'Weighted Avg Rate'}</p>
                        <p className="text-lg font-bold text-indigo-900">Rs. {avgRate}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 bg-white shadow rounded-lg overflow-hidden flex flex-col">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="text-sm font-medium text-gray-900">
                        {language === 'np' ? 'खरिद प्रविष्टिहरू' : 'Purchase Entries'}
                        <span className="ml-2 text-xs text-gray-400">
                            {language === 'np' ? '(👁 आँखा = पर्ची सिर्जना भइसकेको · 💳 भुक्तानी = रकम बुझाउनुहोस्)' : '(👁 eye = slip generated · 💳 Pay = record payment)'}
                        </span>
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={selectedRows.length === 0}
                        className="inline-flex items-center justify-center rounded-md bg-green-600 py-1.5 px-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 transition">
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'np' ? `खरिद पर्ची बनाउनुहोस् (${selectedRows.length})` : `Generate Purchase Slip (${selectedRows.length})`}
                    </button>
                </div>
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
                            {purchases.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                                        {language === 'np' ? 'कुनै खरिद प्रविष्टि फेला परेन।' : 'No purchase entries found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between shrink-0">
                    <p className="text-sm text-gray-700">
                        {language === 'np' ? 'पृष्ठ ' : 'Page '} 
                        <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> 
                        {language === 'np' ? ' / ' : ' of '} 
                        <span className="font-medium">{table.getPageCount() || 1}</span>
                    </p>
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                            {language === 'np' ? 'अघिल्लो' : 'Previous'}
                        </button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                            {language === 'np' ? 'अर्को' : 'Next'}
                        </button>
                    </nav>
                </div>
            </div>

            <PurchaseVoucherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPurchases={selectedRows}
                onSuccess={() => { table.resetRowSelection(); loadData(); }}
            />

            {payingPurchase && (
                <PaymentModal
                    purchase={payingPurchase}
                    onClose={() => setPayingPurchase(null)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
}
