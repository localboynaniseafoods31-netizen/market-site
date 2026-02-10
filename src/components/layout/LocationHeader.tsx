"use client";

import Link from "next/link";
import { MapPin, ShoppingBag, User, Loader2, Navigation, Moon, Sun, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector, selectCartItemCount } from "@/store";
import { useTheme } from "@/components/providers/ThemeProvider";
import { checkDeliveryAvailability } from "@/data/deliveryZones";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";

interface LocationState {
    pincode: string;
    locality: string;
    isServiceable: boolean;
    eta: string;
    minOrder: number;
    message: string;
}

const STORAGE_KEY = 'localboynaniseafoods_location';

export default function LocationHeader() {
    const pathname = usePathname();
    const cartItemCount = useAppSelector(selectCartItemCount);
    const [isScrolled, setIsScrolled] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    const [locationState, setLocationState] = useState<LocationState | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [manualPincode, setManualPincode] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Load saved location on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setLocationState(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load saved location', e);
        }
    }, []);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const saveLocation = useCallback((state: LocationState) => {
        setLocationState(state);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save location', e);
        }
    }, []);

    const detectLocation = useCallback(async () => {
        setLoadingLocation(true);
        setErrorMsg(null);

        if (!navigator.geolocation) {
            setErrorMsg("Geolocation is not supported by your browser");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Call our geocoding API
                    const res = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
                    const data = await res.json();

                    if (!res.ok || data.error) {
                        setErrorMsg(data.error || 'Unable to detect location');
                        setLoadingLocation(false);
                        return;
                    }

                    const { pincode, locality, city } = data;

                    if (!pincode) {
                        setErrorMsg('Could not determine your pincode. Please enter manually.');
                        setLoadingLocation(false);
                        return;
                    }

                    // Check delivery availability
                    const deliveryCheck = checkDeliveryAvailability(pincode);

                    const newState: LocationState = {
                        pincode,
                        locality: locality || city || 'Unknown',
                        isServiceable: deliveryCheck.available,
                        eta: deliveryCheck.zone?.eta || '',
                        minOrder: deliveryCheck.zone?.minOrder || 0,
                        message: deliveryCheck.message,
                    };

                    saveLocation(newState);
                    setIsDrawerOpen(false);

                } catch (error) {
                    console.error('Geocoding failed:', error);
                    setErrorMsg('Failed to detect location. Please enter pincode manually.');
                }

                setLoadingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                if (error.code === error.PERMISSION_DENIED) {
                    setErrorMsg("Location access denied. Please enter your pincode manually.");
                } else {
                    setErrorMsg("Unable to retrieve your location. Please enter pincode manually.");
                }
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [saveLocation]);

    const checkManualPincode = useCallback(() => {
        if (manualPincode.length !== 6) return;

        const deliveryCheck = checkDeliveryAvailability(manualPincode);

        const newState: LocationState = {
            pincode: manualPincode,
            locality: deliveryCheck.zone?.locality || 'Your Location',
            isServiceable: deliveryCheck.available,
            eta: deliveryCheck.zone?.eta || '',
            minOrder: deliveryCheck.zone?.minOrder || 0,
            message: deliveryCheck.message,
        };

        saveLocation(newState);
        setManualPincode('');
        setIsDrawerOpen(false);
    }, [manualPincode, saveLocation]);

    // EARLY RETURN MUST BE AFTER ALL HOOKS
    if (pathname?.startsWith('/admin')) return null;

    const getLocationDisplay = () => {
        if (!locationState) return 'Select Location';
        return locationState.locality.length > 20
            ? locationState.locality.slice(0, 18) + '...'
            : locationState.locality;
    };

    const getStatusColor = () => {
        if (!locationState) return 'text-muted-foreground';
        return locationState.isServiceable ? 'text-green-600' : 'text-amber-600';
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border/50",
                isScrolled ? "shadow-sm py-2" : "py-3"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-3">

                    <div className="flex flex-col gap-0.5 max-w-[70%]">
                        <Link href="/">
                            <span className="text-lg font-extrabold text-primary tracking-tight leading-none">
                                Localboynaniseafoods
                            </span>
                        </Link>

                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer active:opacity-70 transition-opacity">
                                    <MapPin size={12} className={getStatusColor()} />
                                    <span className={cn(
                                        "text-xs font-medium truncate flex items-center gap-0.5 max-w-[200px]",
                                        getStatusColor()
                                    )}>
                                        {getLocationDisplay()}
                                        <ChevronDown size={10} className="opacity-70" />
                                    </span>
                                    {locationState?.isServiceable && (
                                        <CheckCircle size={10} className="text-green-600" />
                                    )}
                                    {locationState && !locationState.isServiceable && (
                                        <AlertCircle size={10} className="text-amber-600" />
                                    )}
                                </div>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="mx-auto w-full max-w-sm">
                                    <DrawerHeader>
                                        <DrawerTitle>Select Delivery Location</DrawerTitle>
                                    </DrawerHeader>
                                    <div className="p-4 pb-0 space-y-4">

                                        {/* Current Status */}
                                        {locationState && (
                                            <div className={cn(
                                                "p-3 rounded-xl text-sm",
                                                locationState.isServiceable
                                                    ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                                                    : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                                            )}>
                                                <div className="flex items-center gap-2 font-semibold mb-1">
                                                    {locationState.isServiceable ? (
                                                        <CheckCircle size={16} />
                                                    ) : (
                                                        <AlertCircle size={16} />
                                                    )}
                                                    {locationState.locality} ({locationState.pincode})
                                                </div>
                                                <div className="text-xs opacity-80">
                                                    {locationState.message}
                                                </div>
                                            </div>
                                        )}

                                        {/* GPS Button */}
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 h-12 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                                            onClick={detectLocation}
                                            disabled={loadingLocation}
                                        >
                                            {loadingLocation ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Navigation className="h-5 w-5 fill-current" />
                                            )}
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="font-bold">Detect My Location</span>
                                                <span className="text-[10px] font-normal opacity-80 mt-1">Using GPS</span>
                                            </div>
                                        </Button>

                                        {errorMsg && (
                                            <p className="text-xs text-destructive text-center bg-destructive/10 p-2 rounded-lg">{errorMsg}</p>
                                        )}

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-background px-2 text-muted-foreground">
                                                    or enter pincode
                                                </span>
                                            </div>
                                        </div>

                                        {/* Manual Pincode Entry */}
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter 6-digit pincode"
                                                value={manualPincode}
                                                onChange={(e) => setManualPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                maxLength={6}
                                                className="text-center text-lg font-mono tracking-widest"
                                            />
                                            <Button
                                                onClick={checkManualPincode}
                                                disabled={manualPincode.length !== 6}
                                                className="shrink-0"
                                            >
                                                Check
                                            </Button>
                                        </div>

                                        <p className="text-[10px] text-muted-foreground text-center">
                                            We deliver to AP, Telangana, Karnataka, Orissa & Chennai
                                        </p>
                                    </div>
                                    <DrawerFooter>
                                        <DrawerClose asChild>
                                            <Button variant="ghost">Cancel</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/orders">
                            <Button variant="ghost" size="icon" className="text-foreground relative hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 rounded-full w-10 h-10">
                                <User size={22} strokeWidth={2} />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 rounded-full w-10 h-10"
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        >
                            {resolvedTheme === 'dark' ? <Sun size={22} strokeWidth={2} /> : <Moon size={22} strokeWidth={2} />}
                        </Button>
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="text-foreground relative hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 rounded-full w-10 h-10">
                                <ShoppingBag size={22} strokeWidth={2} />
                                {cartItemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-sky-600 text-white text-[10px] shadow-sm">
                                        {cartItemCount > 9 ? '9+' : cartItemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </header>
    );
}
