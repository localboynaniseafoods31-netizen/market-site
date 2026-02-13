"use client";

import { useAppSelector, selectLocation } from "@/store";
import { AlertTriangle } from "lucide-react";

export default function UnserviceableBanner() {
    const locationState = useAppSelector(selectLocation);

    // Show only if location is set AND NOT serviceable
    if (!locationState || locationState.isServiceable) return null;

    return (
        <div className="bg-amber-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 relative z-40">
            <AlertTriangle size={16} className="fill-white text-amber-600" />
            <span>
                We are not serving your location yet. Coming soon!
            </span>
        </div>
    );
}
