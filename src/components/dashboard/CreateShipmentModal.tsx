import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import Button from "@/components/common/Button";
import { createShipment, searchCustomers } from "@/services/shipments";

interface CreateShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateShipmentModal({ isOpen, onClose, onSuccess }: CreateShipmentModalProps) {
    const [formData, setFormData] = useState({
        waybillNo: "",
        customerId: "",
        customerSearch: "",
        description: "",
        packageType: "parcel" as "document" | "parcel" | "pallet" | "container",
        originAddress: "",
        originCity: "",
        originCountry: "",
        destAddress: "",
        destCity: "",
        destCountry: "",
        estimatedDelivery: "",
        weight: "",
        quantity: "",
        declaredValue: "",
        requiresCustoms: false,
        isFragile: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [customerResults, setCustomerResults] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [searchingCustomers, setSearchingCustomers] = useState(false);
    useEffect(() => {
        const query = formData.customerSearch.trim();
        if (query.length < 2) {
            setCustomerResults([]);
            return;
        }

        const timer = window.setTimeout(async () => {
            setSearchingCustomers(true);
            try {
                const results = await searchCustomers(query);
                setCustomerResults(results);
            } catch (err) {
                setCustomerResults([]);
            } finally {
                setSearchingCustomers(false);
            }
        }, 250);

        return () => window.clearTimeout(timer);
    }, [formData.customerSearch]);

    if (!isOpen) return null;

    const handleCustomerSearch = (query: string) => {
        setSelectedCustomer(null);
        setFormData(prev => ({...prev, customerId: "", customerSearch: query}));
    };

    const selectCustomer = (customer: any) => {
        setSelectedCustomer(customer);
        setFormData(prev => ({
            ...prev, 
            customerId: customer._id || customer.id,
            customerSearch: customer.name
        }));
        setCustomerResults([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        if (!formData.customerId) {
            setError("Please search and select a customer.");
            setIsLoading(false);
            return;
        }

        try {
            await createShipment({
                waybillNo: formData.waybillNo,
                customerId: formData.customerId,
                origin: {
                    address: formData.originAddress,
                    city: formData.originCity,
                    country: formData.originCountry,
                },
                destination: {
                    address: formData.destAddress,
                    city: formData.destCity,
                    country: formData.destCountry,
                },
                description: formData.description,
                packageType: formData.packageType,
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
                quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
                declaredValue: formData.declaredValue ? parseFloat(formData.declaredValue) : undefined,
                estimatedDelivery: formData.estimatedDelivery || undefined,
                requiresCustoms: formData.requiresCustoms,
                isFragile: formData.isFragile,
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Failed to create shipment.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">New Shipment</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg">{error}</div>}
                    <div className="text-xs text-slate-500">
                        Fields marked with <span className="text-red-500">*</span> are required.
                    </div>
                    
                    {/* Tracking & Customer */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Waybill / Job Number <span className="text-red-500">*</span></label>
                            <input required value={formData.waybillNo} onChange={(e) => setFormData({...formData, waybillNo: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="GH-INC-001" minLength={3} maxLength={50} />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Customer <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input required value={formData.customerSearch} onChange={(e) => handleCustomerSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                    placeholder="Search by name or email..." />
                            </div>
                            {(customerResults.length > 0 || (searchingCustomers && formData.customerSearch.trim().length >= 2)) && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                                    {searchingCustomers ? (
                                        <div className="px-4 py-3 text-sm text-slate-500">Searching customers...</div>
                                    ) : customerResults.length > 0 ? (
                                        customerResults.map((c: any) => (
                                            <button key={c._id || c.id} type="button" onClick={() => selectCustomer(c)}
                                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-0">
                                                <span className="font-semibold text-slate-700">{c.name}</span>
                                                <span className="text-slate-400 ml-2 text-xs">{c.email}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-slate-500">No customers found.</div>
                                    )}
                                </div>
                            )}
                            {selectedCustomer && (
                                <p className="text-xs text-green-600 font-medium mt-1">✓ {selectedCustomer.name} ({selectedCustomer.email})</p>
                            )}
                        </div>
                    </div>

                    {/* Description & Package Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Description <span className="text-red-500">*</span></label>
                            <input required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="Mixed Clothing & Accessories" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Package Type <span className="text-red-500">*</span></label>
                            <select required value={formData.packageType} onChange={(e) => setFormData({...formData, packageType: e.target.value as any})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm text-slate-700">
                                <option value="document">Document</option>
                                <option value="parcel">Parcel</option>
                                <option value="pallet">Pallet</option>
                                <option value="container">Container</option>
                            </select>
                        </div>
                    </div>

                    {/* Origin */}
                    <div>
                        <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Origin <span className="text-red-500">*</span></h3>
                        <div className="grid grid-cols-3 gap-3">
                            <input required value={formData.originAddress} onChange={(e) => setFormData({...formData, originAddress: e.target.value})}
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="Address" />
                            <input required value={formData.originCity} onChange={(e) => setFormData({...formData, originCity: e.target.value})}
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="City" />
                            <input required value={formData.originCountry} onChange={(e) => setFormData({...formData, originCountry: e.target.value})}
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="Country" />
                        </div>
                    </div>

                    {/* Destination */}
                    <div>
                        <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Destination <span className="text-red-500">*</span></h3>
                        <div className="grid grid-cols-3 gap-3">
                            <input required value={formData.destAddress} onChange={(e) => setFormData({...formData, destAddress: e.target.value})}
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="Address" />
                            <input required value={formData.destCity} onChange={(e) => setFormData({...formData, destCity: e.target.value})}
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="City" />
                            <input required value={formData.destCountry} onChange={(e) => setFormData({...formData, destCountry: e.target.value})}
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="Country" />
                        </div>
                    </div>

                    {/* Details row */}
                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Weight (kg)</label>
                            <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="420" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Qty</label>
                            <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="8" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Value (USD)</label>
                            <input type="number" step="0.01" value={formData.declaredValue} onChange={(e) => setFormData({...formData, declaredValue: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="5000" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ETA</label>
                            <input type="date" value={formData.estimatedDelivery} onChange={(e) => setFormData({...formData, estimatedDelivery: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm text-slate-700" />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.requiresCustoms} onChange={(e) => setFormData({...formData, requiresCustoms: e.target.checked})}
                                className="w-4 h-4 rounded border-slate-300 text-[#039B81] focus:ring-[#039B81]/20" />
                            <span className="text-sm text-slate-600 font-medium">Requires Customs</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isFragile} onChange={(e) => setFormData({...formData, isFragile: e.target.checked})}
                                className="w-4 h-4 rounded border-slate-300 text-[#039B81] focus:ring-[#039B81]/20" />
                            <span className="text-sm text-slate-600 font-medium">Fragile</span>
                        </label>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="outline" onClick={onClose} className="w-1/2 py-3.5 text-xs font-black uppercase tracking-widest bg-white">Cancel</Button>
                        <Button type="submit" isLoading={isLoading} className="w-1/2 py-3.5 text-xs font-black uppercase tracking-widest shadow-lg shadow-[#039B81]/20">Create Shipment</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
