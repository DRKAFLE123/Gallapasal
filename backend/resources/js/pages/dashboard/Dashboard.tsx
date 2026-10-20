import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

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

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const [stats, setStats] = useState<DashboardStats>({
        today_purchases: 0,
        today_sales: 0,
        total_stock: 0,
        today_profit: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        loadStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Today's Purchases Card - Clickable to New Purchase Entry */}
                <Link
                    to="/purchases"
                    className="bg-white overflow-hidden shadow rounded-lg border border-transparent hover:border-blue-400 hover:shadow-md transition-all duration-200 block group cursor-pointer"
                    title="Click to create a new purchase entry"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 transition-all duration-200 shadow-sm">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Today's Purchases</dt>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded group-hover:bg-blue-100 transition-colors">
                                            + Entry
                                        </span>
                                    </div>
                                    <dd className="text-lg font-semibold text-gray-900 mt-1">Rs. {Number(stats.today_purchases).toLocaleString()}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 2. Today's Sales Card - Clickable to New Sales Entry */}
                <Link
                    to="/sales"
                    className="bg-white overflow-hidden shadow rounded-lg border border-transparent hover:border-green-400 hover:shadow-md transition-all duration-200 block group cursor-pointer"
                    title="Click to create a new sale entry"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-2.5 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white group-hover:scale-105 transition-all duration-200 shadow-sm">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Today's Sales</dt>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded group-hover:bg-green-100 transition-colors">
                                            + Entry
                                        </span>
                                    </div>
                                    <dd className="text-lg font-semibold text-gray-900 mt-1">Rs. {Number(stats.today_sales).toLocaleString()}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 3. Total Stock Card - Clickable to Grains Inventory */}
                <Link
                    to="/grains"
                    className="bg-white overflow-hidden shadow rounded-lg border border-transparent hover:border-orange-400 hover:shadow-md transition-all duration-200 block group cursor-pointer"
                    title="Click to view grains stock and inventory"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-105 transition-all duration-200 shadow-sm">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Stock</dt>
                                    <dd className="text-lg font-semibold text-gray-900 mt-1">{Number(stats.total_stock).toLocaleString()} kg</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 4. Today's Profit Card - Clickable to Reports */}
                <Link
                    to="/reports"
                    className="bg-white overflow-hidden shadow rounded-lg border border-transparent hover:border-purple-400 hover:shadow-md transition-all duration-200 block group cursor-pointer"
                    title="Click to view financial reports"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-105 transition-all duration-200 shadow-sm">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Today's Profit</dt>
                                    <dd className="text-lg font-semibold text-green-600 mt-1">Rs. {Number(stats.today_profit).toLocaleString()}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Stock Breakdown Section */}
            {stats.stock_by_grain && stats.stock_by_grain.length > 0 && (
                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden max-w-2xl">
                    <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Live Stock Breakdown by Grain</h3>
                        <Link to="/grains" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                            Manage Grains &rarr;
                        </Link>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {stats.stock_by_grain.map((item, index) => (
                            <li key={index} className="px-5 py-4 hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-600 font-bold uppercase">{item.grain_name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{item.grain_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
};

export default Dashboard;
