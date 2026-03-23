import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../lib/axios';

const ResetPassword = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
        setValue('email', searchParams.get('email') || '');
        setValue('token', searchParams.get('token') || '');
    }, [searchParams, setValue]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setStatus('');
        setError('');
        try {
            const response = await api.post('/auth/reset-password', data);
            setStatus(response.data.message || 'Password reset successfully!');
            setTimeout(() => nav('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password.');
            if (err.response?.data?.errors) {
                const msgs = Object.values(err.response.data.errors).flat().join(' ');
                setError(msgs);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create New Password
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {status && (
                            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                                <p className="text-sm text-green-700">{status}</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        
                        <input type="hidden" {...register('token')} />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                {...register('email', { required: 'Email is required' })}
                                type="email" readOnly
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="mt-1 relative">
                                <input
                                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 chars' } })}
                                    type={showPassword ? 'text' : 'password'}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{String(errors.password.message)}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                {...register('password_confirmation', { 
                                    required: 'Please confirm password',
                                    validate: val => val === watch('password') || 'Passwords do not match'
                                })}
                                type="password"
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{String(errors.password_confirmation.message)}</p>}
                        </div>
                        <div>
                            <button disabled={loading} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
