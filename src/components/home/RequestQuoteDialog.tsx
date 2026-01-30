"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MoveRight, Loader2, CheckCircle2 } from "lucide-react";

export function RequestQuoteDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            // Reset after showing success
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
            }, 2000);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-2xl rounded-2xl overflow-hidden p-0 gap-0">

                {/* Visual Header */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-white text-center">
                    <h2 className="text-xl font-bold mb-1">Get a Custom Quote</h2>
                    <p className="text-orange-50 text-xs text-opacity-90">Best prices for bulk orders & events</p>
                </div>

                {success ? (
                    <div className="p-12 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Request Sent!</h3>
                        <p className="text-slate-500 text-sm">Our expert will call you within 30 mins.</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase">Name</Label>
                                    <Input id="name" required placeholder="Arun Kumar" className="bg-slate-50 border-slate-200 focus-visible:ring-orange-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile" className="text-xs font-bold text-slate-500 uppercase">Phone</Label>
                                    <Input id="mobile" required type="tel" placeholder="98765 43210" className="bg-slate-50 border-slate-200 focus-visible:ring-orange-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-xs font-bold text-slate-500 uppercase">Event Type</Label>
                                <Input id="type" placeholder="Wedding, Party, Festival..." className="bg-slate-50 border-slate-200 focus-visible:ring-orange-500" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="details" className="text-xs font-bold text-slate-500 uppercase">Requirement</Label>
                                <Textarea id="details" placeholder="E.g. 50kg Seer Fish, 20kg Prawns..." className="bg-slate-50 border-slate-200 focus-visible:ring-orange-500 min-h-[80px]" />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl mt-2">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <>Send Request <MoveRight className="ml-2 w-4 h-4" /></>}
                            </Button>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
