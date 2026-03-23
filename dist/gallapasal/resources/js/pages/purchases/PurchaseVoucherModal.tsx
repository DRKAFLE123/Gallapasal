import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import api from '../../lib/axios';
import { convertAdToBs, convertBsToAd, getTodayAdDateStr, getTodayNepaliDateStr } from '../../lib/nepaliDate';

interface PurchaseVoucherModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPurchases: any[];
    onSuccess: () => void;
}

const PurchaseVoucherModal: React.FC<PurchaseVoucherModalProps> = ({ isOpen, onClose, selectedPurchases, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill from the first selected purchase if available
    const initialVendorName = selectedPurchases.length > 0 ? selectedPurchases[0].vendor_name : 'Farmer';
    const now = new Date();

    const [formData, setFormData] = useState({
        vendor_name: initialVendorName,
        vendor_address: '',
        vendor_type: 'farmer',
        date_ad: getTodayAdDateStr(),
        date_bs: getTodayNepaliDateStr(),
        is_paid_in_full: false
    });

    if (!isOpen) return null;

    const totalAmount = selectedPurchases.reduce((sum, p) => sum + parseFloat(p.total_amount), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.date_bs) {
            alert("Date (BS) is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                purchase_ids: selectedPurchases.map(p => p.id),
                vendor_name: formData.vendor_name,
                vendor_address: formData.vendor_address,
                vendor_type: formData.vendor_type,
                date_ad: formData.date_ad,
                date_bs: formData.date_bs,
                is_paid_in_full: formData.is_paid_in_full
            };

            const res = await api.post('/vouchers/generate', payload);
            const voucher = res.data;

            // Trigger PDF Download
            const pdfRes = await api.get(`/vouchers/${voucher.id}/pdf`, { responseType: 'blob' });
            const blob = new Blob([pdfRes.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Purchase-Voucher-${voucher.voucher_number}.pdf`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 1000);

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to generate voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 p-4 sm:p-0">
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600" />
                            Generate Purchase Voucher
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-100">
                        <p className="text-sm text-blue-800">
                            You are about to generate an Internal Purchase Memo for <strong>{selectedPurchases.length}</strong> selected items.
                        </p>
                        <p className="text-lg font-bold text-blue-900 mt-1">
                            Total Value: Rs. {totalAmount.toFixed(2)}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Farmer / Vendor Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.vendor_name}
                                onChange={e => setFormData({ ...formData, vendor_name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vendor Type</label>
                                <select
                                    value={formData.vendor_type}
                                    onChange={e => setFormData({ ...formData, vendor_type: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3 bg-white"
                                >
                                    <option value="farmer">Farmer (Default)</option>
                                    <option value="trader">Trader</option>
                                    <option value="vat_vendor">VAT Registered Vendor</option>
                                    <option value="unregistered_vendor">Unregistered Vendor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Kathmandu, Nepal"
                                    value={formData.vendor_address}
                                    onChange={e => setFormData({ ...formData, vendor_address: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date (BS) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    placeholder="YYYY-MM-DD"
                                    value={formData.date_bs}
                                    onChange={e => {
                                        const bs = e.target.value;
                                        const ad = convertBsToAd(bs) || formData.date_ad;
                                        setFormData({ ...formData, date_bs: bs, date_ad: ad });
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date (AD) <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date_ad}
                                    onChange={e => {
                                        const ad = e.target.value;
                                        const bs = convertAdToBs(ad) || formData.date_bs;
                                        setFormData({ ...formData, date_ad: ad, date_bs: bs });
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <input
                                id="paid_in_full"
                                type="checkbox"
                                checked={formData.is_paid_in_full}
                                onChange={e => setFormData({ ...formData, is_paid_in_full: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="paid_in_full" className="ml-3 block text-sm font-medium text-gray-900 leading-tight">
                                Mark as completely Paid in Cash
                                <p className="text-xs text-gray-500 font-normal">Automatically logs a zero-balance payment for this ledger.</p>
                            </label>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none sm:col-start-2 sm:text-sm disabled:opacity-50"
                            >
                                {isSubmitting ? 'Generating...' : 'Generate & Download PDF'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:col-start-1 sm:mt-0 sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PurchaseVoucherModal;
