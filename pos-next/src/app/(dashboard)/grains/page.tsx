'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../lib/axios';
import { useLanguageStore } from '../../../store/languageStore';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

interface Grain {
    id: number;
    name: string;
    unit_type: 'kg' | 'quintal' | 'ton';
    is_active: boolean;
}

export default function GrainsPage() {
    const [grains, setGrains] = useState<Grain[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrain, setEditingGrain] = useState<Grain | null>(null);
    const { t, language } = useLanguageStore();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Grain>();

    const fetchGrains = async () => {
        try {
            const { data } = await api.get('/grains');
            setGrains(data);
        } catch (e) {
            console.error('Failed to fetch grains', e);
        }
    };

    useEffect(() => {
        fetchGrains();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                is_active: data.is_active === true || data.is_active === 'true'
            };

            if (editingGrain) {
                await api.put(`/grains/${editingGrain.id}`, payload);
            } else {
                await api.post('/grains', payload);
            }
            setIsModalOpen(false);
            reset();
            setEditingGrain(null);
            fetchGrains();
        } catch (err: any) {
            console.error(err.response?.data || err);
            alert(err.response?.data?.message || 'Failed to save grain. Check console for details.');
        }
    };

    const handleEdit = (grain: Grain) => {
        setEditingGrain(grain);
        reset(grain);
        setIsModalOpen(true);
    };

    const toggleStatus = async (grain: Grain) => {
        if (window.confirm(`Are you sure you want to ${grain.is_active ? 'deactivate' : 'activate'} ${grain.name}?`)) {
            await api.delete(`/grains/${grain.id}`);
            fetchGrains();
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.grains}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {language === 'np' ? 'प्रणालीमा दर्ता भएका सबै खाद्यान्न, एकाइ र स्थिति' : 'A list of all grains in your system including their unit types and statuses.'}
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:flex-none">
                    <button
                        onClick={() => { reset({ is_active: true, unit_type: 'kg' }); setEditingGrain(null); setIsModalOpen(true); }}
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'np' ? 'नयाँ अन्न थप्नुहोस्' : 'Add Grain'}
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-xs ring-1 ring-black/5 rounded-xl bg-white border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sm:pl-6">{t.grainName}</th>
                                        <th className="px-3 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unit Type</th>
                                        <th className="px-3 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            {t.actions}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {grains.map((grain) => (
                                        <tr key={grain.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">{grain.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 uppercase font-mono">{grain.unit_type}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${grain.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                    {grain.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                <button onClick={() => handleEdit(grain)} className="text-blue-600 hover:text-blue-800 p-1">
                                                    <Edit2 className="h-4 w-4 inline" />
                                                </button>
                                                <button onClick={() => toggleStatus(grain)} className={grain.is_active ? 'text-red-600 hover:text-red-800 p-1' : 'text-emerald-600 hover:text-emerald-800 p-1'}>
                                                    {grain.is_active ? <Trash2 className="h-4 w-4 inline" /> : <span className="text-xs font-bold">Activate</span>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {grains.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-sm text-gray-500">No grains registered yet. Click &quot;Add Grain&quot; to begin.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="relative z-50 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="bg-white px-6 pt-6 pb-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        {editingGrain ? (language === 'np' ? 'अन्न सम्पादन गर्नुहोस्' : 'Edit Grain') : (language === 'np' ? 'नयाँ अन्न थप्नुहोस्' : 'Add New Grain')}
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">{t.grainName}</label>
                                            <input
                                                {...register('name', { required: true })}
                                                className="block w-full border border-gray-300 rounded-lg shadow-2xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                                placeholder="e.g. Masuli Rice / मसुली चामल"
                                            />
                                            {errors.name && <span className="text-red-500 text-xs mt-1 block">This field is required</span>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Unit Type</label>
                                            <select
                                                {...register('unit_type')}
                                                className="block w-full bg-white border border-gray-300 rounded-lg shadow-2xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="kg">Kg</option>
                                                <option value="quintal">Quintal</option>
                                                <option value="ton">Ton</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center pt-1">
                                            <input
                                                {...register('is_active')}
                                                type="checkbox"
                                                defaultChecked={true}
                                                id="grain-is-active"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="grain-is-active" className="ml-2 block text-sm font-medium text-gray-900">Active Status</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-2 border-t border-gray-100">
                                    <button type="submit" className="inline-flex justify-center rounded-lg border border-transparent shadow-xs px-4 py-2 bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {t.save}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="inline-flex justify-center rounded-lg border border-gray-300 shadow-xs px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                        {t.cancel}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
