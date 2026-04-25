import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
                <p className="text-slate-500">This page is being updated. Please contact us for details.</p>
            </main>
            <Footer />
        </>
    );
}
