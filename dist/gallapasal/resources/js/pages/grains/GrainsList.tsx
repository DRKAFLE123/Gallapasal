import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Grain {
    id: number;
    name: string;
    unit_type: 'kg' | 'quintal' | 'ton';
    is_active: boolean;
}

const GrainsList = () => {
    const [grains, setGrains] = useState<Grain[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrain, setEditingGrain] = useState<Grain | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Grain>();

    const fetchGrains = async () => {
        const { data } = await api.get('/grains');
        setGrains(data);
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
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Grains Master</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all grains in your system including their unit types and statuses.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => { reset({ is_active: true, unit_type: 'kg' }); setEditingGrain(null); setIsModalOpen(true); }}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Grain
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit Type</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {grains.map((grain) => (
                                        <tr key={grain.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{grain.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 uppercase">{grain.unit_type}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${grain.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {grain.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button onClick={() => handleEdit(grain)} className="text-blue-600 hover:text-blue-900 mr-4">
                                                    <Edit2 className="h-4 w-4 inline" />
                                                </button>
                                                <button onClick={() => toggleStatus(grain)} className={grain.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}>
                                                    {grain.is_active ? <Trash2 className="h-4 w-4 inline" /> : <span className="text-sm">Activate</span>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {grains.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-4 text-center text-sm text-gray-500">No grains registered yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 9999 }} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                        {editingGrain ? 'Edit Grain' : 'Add New Grain'}
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Grain Name</label>
                                            <input
                                                {...register('name', { required: true })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="e.g. Masuli Rice"
                                            />
                                            {errors.name && <span className="text-red-500 text-xs text-left">This field is required</span>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Unit Type</label>
                                            <select
                                                {...register('unit_type')}
                                                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="kg">Kg</option>
                                                <option value="quintal">Quintal</option>
                                                <option value="ton">Ton</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                {...register('is_active')}
                                                type="checkbox"
                                                defaultChecked={true}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">Active Status</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GrainsList;
