import { useState } from "react";
import { X, MapPin, Activity } from "lucide-react";
import Button from "@/components/common/Button";
import { logCheckpoint } from "@/services/shipments";

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    shipmentId: string;
}

export default function UpdateStatusModal({ isOpen, onClose, onSuccess, shipmentId }: UpdateStatusModalProps) {
    const [formData, setFormData] = useState({
        status: "",
        location: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            await logCheckpoint(shipmentId, formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to log checkpoint", err);
            setError("Failed to update status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Log Checkpoint</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">ID: {shipmentId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg">{error}</div>}
                    
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Current Status</label>
                        <div className="relative">
                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select 
                                required
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 focus:border-[#039B81]/30 transition-all text-sm text-slate-700"
                            >
                                <option value="" disabled>Select Status...</option>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Picked Up">Picked Up</option>
                                <option value="Customs Clearance">Customs Clearance</option>
                                <option value="Departed Origin">Departed Origin</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Arrived at Port">Arrived at Port</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location Update</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 transition-all text-sm"
                                placeholder="E.g., Tema Port, Ghana"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="outline" onClick={onClose} className="w-1/2 py-3.5 text-xs font-black uppercase tracking-widest bg-white">Cancel</Button>
                        <Button type="submit" isLoading={isLoading} className="w-1/2 py-3.5 text-xs font-black uppercase tracking-widest shadow-lg shadow-[#039B81]/20">Save Update</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
