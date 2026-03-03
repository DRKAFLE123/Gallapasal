import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { X, Upload, Store } from 'lucide-react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.name || '',
            shop_name: user?.shop_name || '',
            shop_address: user?.shop_address || '',
            pan_number: user?.pan_number || '',
            registration_number: user?.registration_number || '',
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        user?.logo_path ? `${(import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${user.logo_path}` : null
    );

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('shop_name', data.shop_name);
            formData.append('shop_address', data.shop_address || '');
            formData.append('pan_number', data.pan_number);
            formData.append('registration_number', data.registration_number);

            if (logoFile) {
                formData.append('logo', logoFile);
            }

            const res = await api.post('/auth/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update global auth store state
            if (res.data.user) {
                setUser(res.data.user);
            }
            alert('Profile updated successfully! Next generated bills will include these details.');
            onClose();
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 p-4 sm:p-0">
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b flex-shrink-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                            <Store className="w-5 h-5 mr-2 text-blue-600" />
                            Shop Profile Settings
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Logo Upload Section */}
                        <div className="flex flex-col items-center justify-center space-y-3 mb-6">
                            <div className="h-24 w-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Shop Logo" className="h-full w-full object-cover" />
                                ) : (
                                    <Store className="h-8 w-8 text-gray-400" />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="h-6 w-6 text-white" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    title="Upload Logo"
                                />
                            </div>
                            <span className="text-xs text-gray-500">Click to upload shop logo (Max 2MB)</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                            <input type="text" {...register('name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Shop / Business Name</label>
                            <input type="text" {...register('shop_name')} placeholder="e.g GallaPasal Trading" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                            <p className="text-xs text-gray-500 mt-1">Appears as the heading in generated bills.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Shop Address</label>
                            <input type="text" {...register('shop_address')} placeholder="e.g. Kalimati, Kathmandu" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">PAN / VAT No.</label>
                                <input type="text" {...register('pan_number')} placeholder="Optional" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registration No.</label>
                                <input type="text" {...register('registration_number')} placeholder="Optional" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3" />
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none sm:col-start-2 sm:text-sm disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Profile Details'}
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

export default ProfileModal;
