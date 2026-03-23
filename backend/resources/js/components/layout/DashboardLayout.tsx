import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ProfileModal from '../ProfileModal';
import { Home, ShoppingCart, Activity, FileText, LogOut, Package, Database, Menu, X, User, ChevronDown, AlertTriangle } from 'lucide-react';
import api from '../../lib/axios';

export class RouteErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
    constructor(props: {children: React.ReactNode}) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
    componentDidCatch(error: Error, info: any) { console.error("Router Boundary Caught:", error, info); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-200 mt-10 max-w-4xl mx-auto">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">The application encountered a fatal error while trying to render this page.</p>
                    <div className="bg-red-50 p-4 rounded text-left text-sm text-red-800 font-mono overflow-x-auto whitespace-pre-wrap">
                        {this.state.error?.toString()}
                        <br/><br/>
                        {this.state.error?.stack}
                    </div>
                    <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Hard Reload Page</button>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="mt-6 ml-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">Clear Cache & Logout</button>
                </div>
            );
        }
        return this.props.children;
    }
}

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Grains', href: '/grains', icon: Package },
    { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
    { name: 'Purchase Slips', href: '/purchase-slips', icon: FileText },
    { name: 'Sales', href: '/sales', icon: Activity },
    { name: 'Payments', href: '/payments', icon: Activity },
    { name: 'Billing', href: '/bills', icon: FileText },
    { name: 'Expenses', href: '/expenses', icon: FileText },
    { name: 'Reports', href: '/reports', icon: FileText },
];

const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    const base = (import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return `${base}/storage/${logoPath}`;
};

const DashboardLayout = () => {
    const { user, logout, isAuthenticated, isLoading } = useAuthStore();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const avatarRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
                setIsAvatarDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const handleBackup = () => {
        const url = `${(import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api/v1'}/system/backup`;
        window.open(url, '_blank');
    };

    const handleLogout = async () => {
        setIsAvatarDropdownOpen(false);
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error(e);
        } finally {
            logout();
        }
    };

    const shopName = user?.shop_name || 'GallaPasal';
    const logoUrl = getLogoUrl(user?.logo_path);

    // Sidebar Logo Brand Component
    const SidebarBrand = () => (
        <div className="flex items-center px-4 mb-5">
            <div className="flex items-center space-x-2">
                {logoUrl ? (
                    <img src={logoUrl} alt={shopName} className="h-9 w-9 rounded-lg object-cover border border-gray-200 shadow-sm" />
                ) : (
                    <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm">{getInitials(shopName)}</span>
                    </div>
                )}
                <span className="text-base font-bold tracking-tight text-blue-700 leading-tight">{shopName}</span>
            </div>
        </div>
    );

    // Profile Avatar Button
    const ProfileAvatar = () => (
        <div className="relative" ref={avatarRef}>
            <button
                onClick={() => setIsAvatarDropdownOpen(prev => !prev)}
                className="flex items-center space-x-1.5 rounded-full focus:outline-none group"
                title={user?.name}
            >
                <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-all shadow-sm">
                    {logoUrl ? (
                        <img src={logoUrl} alt={user?.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{getInitials(user?.name)}</span>
                        </div>
                    )}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-semibold text-gray-800 leading-none">{user?.name}</span>
                    <span className="text-xs text-gray-400 leading-none mt-0.5 capitalize">{user?.role}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isAvatarDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{shopName}</p>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={() => { setIsProfileOpen(true); setIsAvatarDropdownOpen(false); }}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                            <User className="h-4 w-4 mr-3 text-gray-400" />
                            Edit Profile & Shop
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <SidebarBrand />
                        <div className="mt-2 h-0 flex-1 overflow-y-auto">
                            <nav className="space-y-1 px-2">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                                    return (
                                        <a key={item.name} href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                        >
                                            <item.icon className={`mr-4 h-6 w-6 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                            {item.name}
                                        </a>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                    <div className="w-14 flex-shrink-0" />
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
                    <SidebarBrand />
                    <div className="mt-3 flex-grow flex flex-col">
                        <nav className="flex-1 px-2 space-y-1 bg-white">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                                return (
                                    <a key={item.name} href={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                        {item.name}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="bg-white shadow-sm z-10 flex-shrink-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                        {/* Mobile Menu Trigger */}
                        <div className="flex items-center md:hidden">
                            <button
                                className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="block h-6 w-6" />
                            </button>
                            <span className="ml-2 font-bold text-blue-700 text-sm">{shopName}</span>
                        </div>

                        {/* Right Side Header Actions */}
                        <div className="flex items-center space-x-3 ml-auto">
                            {user?.role === 'admin' && (
                                <button
                                    onClick={handleBackup}
                                    title="Backup System Database"
                                    className="p-1.5 px-2 sm:px-3 text-white bg-blue-600 hover:bg-blue-700 flex items-center text-xs sm:text-sm font-medium rounded-md shadow-sm"
                                >
                                    <Database className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Backup DB</span>
                                </button>
                            )}
                            <ProfileAvatar />
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
                    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                        <RouteErrorBoundary>
                            <Outlet />
                        </RouteErrorBoundary>
                    </div>
                </main>
            </div>

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default DashboardLayout;
