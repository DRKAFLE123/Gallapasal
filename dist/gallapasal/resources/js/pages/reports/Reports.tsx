import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Download } from 'lucide-react';

interface ReportData {
    summary: any;
    data: any[];
}

const Reports = () => {
    const [activeTab, setActiveTab] = useState('stock');
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [grains, setGrains] = useState<any[]>([]);

    // Filters
    const [filters, setFilters] = useState({
        from_date: '',
        to_date: '',
        grain_id: ''
    });

    useEffect(() => {
        // Load grains for filter dropdown
        api.get('/grains').then(res => setGrains(res.data));
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            let endpoint = `/reports/${activeTab}`;
            const params = new URLSearchParams();
            if (filters.from_date) params.append('from_date', filters.from_date);
            if (filters.to_date) params.append('to_date', filters.to_date);
            if (filters.grain_id) params.append('grain_id', filters.grain_id);

            const { data } = await api.get(`${endpoint}?${params.toString()}`);
            setReportData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!['purchases', 'sales'].includes(activeTab)) return;
        const params = new URLSearchParams();
        if (filters.from_date) params.append('from_date', filters.from_date);
        if (filters.to_date) params.append('to_date', filters.to_date);
        const url = `${(import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api/v1'}/exports/${activeTab}?${params.toString()}`;
        window.open(url, '_blank');
    };

    useEffect(() => {
        fetchReport();
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 rounded-xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Generate and view real-time data insights.</p>
            </div>

            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                {['stock', 'purchases', 'sales', 'pnl'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setReportData(null); }}
                        className={`pb-3 px-1 text-sm font-medium capitalize border-b-2 transition-colors duration-200 ${activeTab === tab
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {tab === 'pnl' ? 'Profit & Loss' : tab.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex space-x-4 items-end">
                {activeTab !== 'stock' && (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">From Date (AD)</label>
                            <input
                                type="date"
                                className="border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                                value={filters.from_date}
                                onChange={e => setFilters({ ...filters, from_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">To Date (AD)</label>
                            <input
                                type="date"
                                className="border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                                value={filters.to_date}
                                onChange={e => setFilters({ ...filters, to_date: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Grain Filter</label>
                    <select
                        className="border-gray-300 rounded-md shadow-sm text-sm p-2 border bg-white min-w-[150px]"
                        value={filters.grain_id}
                        onChange={e => setFilters({ ...filters, grain_id: e.target.value })}
                    >
                        <option value="">All Grains</option>
                        {grains.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={fetchReport}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 text-sm font-medium"
                >
                    Apply Filters
                </button>
                {['purchases', 'sales'].includes(activeTab) && (
                    <button
                        onClick={handleExport}
                        title="Download Excel Export"
                        className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 text-sm font-medium flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm">
                    {activeTab === 'stock' && reportData && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grain</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchased</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sold</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider text-blue-600">Current Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Purchase Rate</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider text-green-600">Stock Value</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.map((row: any) => (
                                    <tr key={row.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.grain?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{row.total_purchase_qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{row.total_sales_qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 text-right">{row.current_stock} {row.grain?.unit_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">Rs. {row.avg_purchase_rate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">Rs. {row.stock_value}</td>
                                    </tr>
                                ))}
                                {reportData.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-500 text-sm">No stock data available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {(activeTab === 'purchases' || activeTab === 'sales') && reportData && (
                        <div>
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                                <div className="bg-white p-3 rounded shadow-sm">
                                    <div className="text-xs text-gray-500 uppercase">Total Transactions</div>
                                    <div className="text-xl font-bold text-gray-900">{reportData.summary?.count}</div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm">
                                    <div className="text-xs text-gray-500 uppercase">Total Quantity</div>
                                    <div className="text-xl font-bold text-gray-900">{reportData.summary?.total_quantity}</div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm">
                                    <div className="text-xs text-gray-500 uppercase">Total Amount</div>
                                    <div className="text-xl font-bold text-blue-600">Rs. {reportData.summary?.total_amount}</div>
                                </div>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date (AD)</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grain</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.data?.map((row: any) => (
                                        <tr key={row.id}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{new Date(row.date_ad).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{activeTab === 'purchases' ? row.vendor_name : row.customer_name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.grain?.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{row.quantity}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">Rs. {row.rate}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Rs. {row.total_amount}</td>
                                        </tr>
                                    ))}
                                    {reportData.data?.length === 0 && (
                                        <tr><td colSpan={6} className="text-center py-8 text-gray-500 text-sm">No data found for the selected period.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'pnl' && reportData && (
                        <div>
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                                <div className="bg-white p-3 rounded shadow-sm border-l-4 border-blue-500">
                                    <div className="text-xs text-gray-500 uppercase">Total Sales Revenue</div>
                                    <div className="text-xl font-bold text-gray-900">Rs. {reportData.summary?.total_revenue}</div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm border-l-4 border-orange-500">
                                    <div className="text-xs text-gray-500 uppercase">Total Cost of Goods Sold</div>
                                    <div className="text-xl font-bold text-gray-900">Rs. {reportData.summary?.total_cost}</div>
                                </div>
                                <div className={`bg-white p-3 rounded shadow-sm border-l-4 ${reportData.summary?.net_profit >= 0 ? 'border-green-500' : 'border-red-500'}`}>
                                    <div className="text-xs text-gray-500 uppercase">Net Profit / Loss</div>
                                    <div className={`text-xl font-bold ${reportData.summary?.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        Rs. {reportData.summary?.net_profit}
                                    </div>
                                </div>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grain</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty Sold</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Cost (Rs)</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sale Rate (Rs)</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase text-green-600">Profit (Rs)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.data?.map((row: any) => (
                                        <tr key={row.id}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.date_ad}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.grain_name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{row.quantity}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{row.avg_cost_rate}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{row.sale_rate}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {row.profit}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default Reports;
