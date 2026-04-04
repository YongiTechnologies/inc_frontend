import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import { createShipment } from "@/services/shipments";

interface CreateShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateShipmentModal({ isOpen, onClose, onSuccess }: CreateShipmentModalProps) {
    const [formData, setFormData] = useState({
        customer: "",
        vessel: "",
        origin: "",
        destination: "",
        eta: "",
        type: "sea",
        weight: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            await createShipment(formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to create shipment", err);
            setError("Failed to create shipment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in stretch-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">New Shipment</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg">{error}</div>}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Customer / Receiver</label>
                            <input 
                                required
                                value={formData.customer}
                                onChange={(e) => setFormData({...formData, customer: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 focus:border-[#039B81]/30 transition-all text-sm"
                                placeholder="E.g., John Doe"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Vessel / Flight</label>
                            <input 
                                required
                                value={formData.vessel}
                                onChange={(e) => setFormData({...formData, vessel: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="E.g., MSC LENI"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm text-slate-700"
                            >
                                <option value="sea">Sea Freight</option>
                                <option value="air">Air Freight</option>
                            </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Origin</label>
                            <input 
                                required
                                value={formData.origin}
                                onChange={(e) => setFormData({...formData, origin: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="Shenzhen, China"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Destination</label>
                            <input 
                                required
                                value={formData.destination}
                                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="Tema, Ghana"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ETA Date</label>
                            <input 
                                type="date"
                                required
                                value={formData.eta}
                                onChange={(e) => setFormData({...formData, eta: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm text-slate-700"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Weight / Volume</label>
                            <input 
                                value={formData.weight}
                                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="E.g., 14.5 kg"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <Button type="button" variant="outline" onClick={onClose} className="w-1/2 py-3.5 text-xs font-black uppercase tracking-widest bg-white">Cancel</Button>
                        <Button type="submit" isLoading={isLoading} className="w-1/2 py-3.5 text-xs font-black uppercase tracking-widest shadow-lg shadow-[#039B81]/20">Create Shipment</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
