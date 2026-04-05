"use client";

import { useState, useEffect } from "react";
import { X, Activity, Cpu, Settings, RefreshCw, ShieldCheck, Globe, Mail } from "lucide-react";
import DataTable from "./DataTable";
import Button from "@/components/common/Button";
import { getAuditLogs, getGpsDevices } from "@/services/admin";

interface SystemSettingsModalProps {
    onClose: () => void;
}

type TabType = 'logs' | 'devices' | 'config';

export default function SystemSettingsModal({ onClose }: SystemSettingsModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('logs');
    const [logs, setLogs] = useState<any[]>([]);
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'logs') {
                const data = await getAuditLogs();
                setLogs(data?.logs || (Array.isArray(data) ? data : []));
            } else if (activeTab === 'devices') {
                const data = await getGpsDevices();
                setDevices(data?.devices || (Array.isArray(data) ? data : []));
            }
        } catch (error) {
            console.error(`Failed to fetch ${activeTab}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab !== 'config') {
            fetchData();
        }
    }, [activeTab]);

    const logColumns = [
        { 
            header: "Action", 
            accessor: "action",
            render: (item: any) => (
                <span className="font-bold text-slate-700 capitalize">{item.action.replace(/_/g, ' ')}</span>
            )
        },
        { header: "User", accessor: "userId", render: (item: any) => item.userEmail || item.userId || 'System' },
        { header: "Details", accessor: "details" },
        { 
            header: "Timestamp", 
            accessor: "createdAt",
            render: (item: any) => (
                <span className="text-slate-400 text-xs tabular-nums">
                    {new Date(item.createdAt).toLocaleString()}
                </span>
            )
        }
    ];

    const deviceColumns = [
        { header: "Serial Number", accessor: "serialNumber" },
        { 
            header: "Status", 
            accessor: "status",
            render: (item: any) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}>
                    {item.status}
                </span>
            )
        },
        { 
            header: "Battery", 
            accessor: "batteryLevel",
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${
                            item.batteryLevel > 20 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} style={{ width: `${item.batteryLevel}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{item.batteryLevel}%</span>
                </div>
            )
        },
        { header: "Last Used", accessor: "lastUsed", render: (item: any) => item.lastUsed ? new Date(item.lastUsed).toLocaleDateString() : 'Never' }
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#039B81]/10 rounded-xl flex items-center justify-center">
                            <Settings className="text-[#039B81]" size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">System Settings</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Platform Administration</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex px-6 border-b border-slate-100 bg-white">
                    <TabButton 
                        active={activeTab === 'logs'} 
                        onClick={() => setActiveTab('logs')}
                        icon={Activity}
                        label="Audit Logs"
                    />
                    <TabButton 
                        active={activeTab === 'devices'} 
                        onClick={() => setActiveTab('devices')}
                        icon={Cpu}
                        label="GPS Hardware"
                    />
                    <TabButton 
                        active={activeTab === 'config'} 
                        onClick={() => setActiveTab('config')}
                        icon={ShieldCheck}
                        label="Platform Config"
                    />
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto p-6 bg-slate-50/30">
                    {loading ? (
                        <div className="h-full flex items-center justify-center flex-col gap-4">
                            <RefreshCw className="text-[#039B81] animate-spin" size={32} />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing System Data...</span>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === 'logs' && (
                                <DataTable 
                                    columns={logColumns}
                                    data={logs}
                                />
                            )}
                            {activeTab === 'devices' && (
                                <DataTable 
                                    columns={deviceColumns}
                                    data={devices}
                                />
                            )}
                            {activeTab === 'config' && (
                                <PlatformConfigView />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <Button variant="outline" onClick={fetchData} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest">
                        <RefreshCw size={14} className="mr-2" />
                        Refresh Data
                    </Button>
                    <Button onClick={onClose} className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#039B81]/20">
                        Close Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                active 
                ? 'border-[#039B81] text-[#039B81]' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
            }`}
        >
            <Icon size={18} />
            <span className="text-sm font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
        </button>
    );
}

function PlatformConfigView() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Globe size={16} className="text-blue-500" />
                    Branding & Global Info
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 text-sm font-medium" defaultValue="I&C Shipping" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Support Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 text-sm font-medium" defaultValue="support@icshipping.com" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Security & Maintenance
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Maintenance Mode</p>
                            <p className="text-[10px] text-slate-400">Offline status for customers</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Two-Factor Force</p>
                            <p className="text-[10px] text-slate-400">Mandatory 2FA for all employees</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="md:col-span-2 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <Settings className="animate-spin" size={20} />
                </div>
                <div>
                    <p className="font-black text-xs uppercase tracking-widest">Platform Sync Notice</p>
                    <p className="text-xs opacity-80 mt-1">Updates to branding and global info are saved to local persistent cache. Official API synchronization for platform configuration is currently in read-only mode.</p>
                </div>
            </div>
        </div>
    );
}
