'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useLanguageStore } from '../../../store/languageStore';
import api from '../../../lib/axios';
import { ShoppingCart, TrendingUp, Package, DollarSign, Layers } from 'lucide-react';

interface DashboardStats {
    today_purchases: number;
    today_sales: number;
    total_stock: number;
    today_profit: number;
    stock_by_grain?: {
        grain_name: string;
        unit_type: string;
        current_stock: number;
    }[];
}

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const { t, language } = useLanguageStore();
    const [stats, setStats] = useState<DashboardStats>({
        today_purchases: 0,
        today_sales: 0,
        total_stock: 0,
        today_profit: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.dashboard}</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {language === 'np' ? 'दैनिक कारोबार तथा मौज्दात सारांश' : 'Live daily overview & stock inventory status'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Purchases Card */}
                <div className="bg-white overflow-hidden shadow-xs rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                <ShoppingCart className="h-6 w-6" />
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                                        {language === 'np' ? 'आजको खरिद' : "Today's Purchases"}
                                    </dt>
                                    <dd className="text-xl font-bold text-gray-900 mt-1">
                                        Rs. {Number(stats.today_purchases).toLocaleString()}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Card */}
                <div className="bg-white overflow-hidden shadow-xs rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                                        {language === 'np' ? 'आजको बिक्री' : "Today's Sales"}
                                    </dt>
                                    <dd className="text-xl font-bold text-gray-900 mt-1">
                                        Rs. {Number(stats.today_sales).toLocaleString()}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Stock */}
                <div className="bg-white overflow-hidden shadow-xs rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                                <Package className="h-6 w-6" />
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                                        {language === 'np' ? 'कुल मौज्दात (स्टक)' : 'Total Stock'}
                                    </dt>
                                    <dd className="text-xl font-bold text-gray-900 mt-1">
                                        {Number(stats.total_stock).toLocaleString()} kg
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profit Card */}
                <div className="bg-white overflow-hidden shadow-xs rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                                        {language === 'np' ? 'आजको खुद नाफा' : "Today's Profit"}
                                    </dt>
                                    <dd className="text-xl font-bold text-emerald-600 mt-1">
                                        Rs. {Number(stats.today_profit).toLocaleString()}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Breakdown Section */}
            {stats.stock_by_grain && stats.stock_by_grain.length > 0 && (
                <div className="mt-8 bg-white shadow-xs rounded-xl border border-gray-200/80 overflow-hidden max-w-2xl">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-900 flex items-center">
                            <Layers className="w-4 h-4 mr-2 text-blue-600" />
                            {language === 'np' ? 'अन्न अनुसार मौज्दात विवरण' : 'Live Stock Breakdown by Grain'}
                        </h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {stats.stock_by_grain.map((item, index) => (
                            <li key={index} className="px-5 py-3.5 hover:bg-gray-50/80 flex items-center justify-between transition-colors">
                                <div className="flex items-center">
                                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                                        {item.grain_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-gray-900">{item.grain_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        {Number(item.current_stock).toLocaleString()} {item.unit_type}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
