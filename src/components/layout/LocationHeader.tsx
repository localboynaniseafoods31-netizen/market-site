"use client";

import Link from "next/link";
import { MapPin, ShoppingBag, User, Loader2, Navigation, Moon, Sun, CheckCircle, AlertCircle, ChevronDown, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector, selectCartItemCount, useAppDispatch, selectLocation } from "@/store";
import { setLocation } from "@/store/slices/locationSlice";
import { useTheme } from "@/components/providers/ThemeProvider";
import { checkDeliveryAvailability } from "@/data/deliveryZones";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";
import { LocationState } from "@/store/slices/locationSlice";

interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    address: any;
}

interface SearchContentProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    isSearching: boolean;
    searchResults: SearchResult[];
    searchError: string | null;
    handleSelectLocation: (lat: string, lon: string) => void;
    locationState: LocationState | null;
    detectLocation: () => void;
    loadingLocation: boolean;
    manualPincode: string;
    setManualPincode: (p: string) => void;
    checkManualPincode: () => void;
    errorMsg: string | null;
    isDesktop: boolean;
}

const SearchLocationContent = ({
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    searchError,
    handleSelectLocation,
    locationState,
    detectLocation,
    loadingLocation,
    manualPincode,
    setManualPincode,
    checkManualPincode,
    errorMsg,
    isDesktop
}: SearchContentProps) => {
    return (
        <div className="w-full max-w-sm mx-auto p-4 pb-0 space-y-4">
            <div className="relative">
                <Input
                    placeholder="e.g. Bhubaneswar, Bangalore..."
                    className="pl-10 bg-muted/50 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus={isDesktop}
                />
                <div className="absolute left-3 top-[20px] -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                    <Search size={16} />
                </div>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1">Searches in India. Type at least 3 characters.</p>
            </div>

            {isSearching && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
                </div>
            )}

            {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
                    {searchResults.map((result) => (
                        <button
                            key={result.place_id}
                            className="w-full text-left p-3 text-sm hover:bg-muted transition-colors flex items-start gap-2"
                            onClick={() => handleSelectLocation(result.lat, result.lon)}
                        >
                            <MapPin size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                            <span className="line-clamp-2">{result.display_name}</span>
                        </button>
                    ))}
                </div>
            )}

            {searchError && (
                <p className="text-center text-sm text-destructive bg-destructive/10 py-2 px-3 rounded-lg">{searchError}</p>
            )}

            {searchQuery.length >= 3 && !isSearching && !searchError && searchResults.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-2">No areas found. Try city or area name (e.g. Bhubaneswar, Bangalore).</p>
            )}

            {!searchQuery && (
                <>
                    {locationState && (
                        <div className={cn(
                            "p-3 rounded-xl text-sm",
                            locationState.isServiceable
                                ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                                : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                        )}>
                            <div className="flex items-center gap-2 font-semibold mb-1">
                                {locationState.isServiceable ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                {locationState.locality} ({locationState.pincode})
                            </div>
                            <div className="text-xs font-medium opacity-90 mb-0.5">
                                {locationState.isServiceable ? 'We deliver here' : 'We don\'t deliver to this area yet'}
                            </div>
                            <div className="text-xs opacity-80">{locationState.message}</div>
                        </div>
                    )}

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

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or enter pincode</span></div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter 6-digit pincode"
                            value={manualPincode}
                            onChange={(e) => setManualPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="text-center text-lg font-mono tracking-widest"
                        />
                        <Button onClick={checkManualPincode} disabled={manualPincode.length !== 6} className="shrink-0">Check</Button>
                    </div>
                </>
            )}

            {errorMsg && (
                <p className="text-xs text-destructive text-center bg-destructive/10 p-2 rounded-lg">{errorMsg}</p>
            )}
        </div>
    );
};

const STORAGE_KEY = 'localboynaniseafoods_location';

export default function LocationHeader() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const cartItemCount = useAppSelector(selectCartItemCount);
    const locationState = useAppSelector(selectLocation); // Use Redux state
    const [isScrolled, setIsScrolled] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [manualPincode, setManualPincode] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Clean up search on close
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            setErrorMsg(null);
            setSearchError(null);
        }
    }, [isOpen]);

    const saveLocation = useCallback((state: LocationState) => {
        dispatch(setLocation(state));
    }, [dispatch]);

    // Track current search for race-condition safety
    const searchQueryRef = useRef(searchQuery);

    // Handle Search Input with Debounce
    useEffect(() => {
        searchQueryRef.current = searchQuery;
        if (searchQuery.length < 3) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setIsSearching(true);
            setSearchError(null);
            const q = searchQuery.trim();
            try {
                const res = await fetch(`/api/location/search?q=${encodeURIComponent(q)}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                if (searchQueryRef.current !== q) return;
                if (data.error) {
                    setSearchResults([]);
                    setSearchError(res.ok ? null : (data.error || 'Search failed'));
                    return;
                }
                if (Array.isArray(data.results)) {
                    setSearchResults(data.results);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                if ((error as Error).name === 'AbortError') return;
                if (searchQueryRef.current === q) {
                    setSearchResults([]);
                    setSearchError('Search failed. Try again.');
                }
            } finally {
                if (searchQueryRef.current === q) setIsSearching(false);
            }
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchQuery]);

    const handleSelectLocation = useCallback(async (lat: string, lng: string) => {
        setLoadingLocation(true);
        setErrorMsg(null);
        try {
            // Call our geocoding API with selected coords to standardise logic
            const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || 'Geocoding failed');
            }

            const { pincode, locality, city } = data;

            if (!pincode) {
                throw new Error('Could not determine pincode for this location.');
            }

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
            setIsOpen(false);
        } catch (error: any) {
            console.error('Selection failed', error);
            setErrorMsg(error.message || 'Failed to set location');
        } finally {
            setLoadingLocation(false);
        }
    }, [saveLocation]);

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
                const { latitude, longitude } = position.coords;
                await handleSelectLocation(latitude.toString(), longitude.toString());
            },
            (error) => {
                console.error('Geolocation error:', error);
                setErrorMsg("Unable to retrieve your location. Please check browser permissions.");
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [handleSelectLocation]);

    const checkManualPincode = useCallback(() => {
        if (manualPincode.length !== 6) return;

        const deliveryCheck = checkDeliveryAvailability(manualPincode);

        const newState: LocationState = {
            pincode: manualPincode,
            locality: deliveryCheck.zone?.locality || 'Pincode Area',
            isServiceable: deliveryCheck.available,
            eta: deliveryCheck.zone?.eta || '',
            minOrder: deliveryCheck.zone?.minOrder || 0,
            message: deliveryCheck.message,
        };

        saveLocation(newState);
        setManualPincode('');
        setIsOpen(false);
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

    const TriggerContent = (
        <div className="flex items-center gap-1.5 cursor-pointer active:opacity-70 transition-opacity" title={locationState ? (locationState.isServiceable ? 'We deliver here' : 'Not in delivery area') : undefined}>
            <MapPin size={12} className={getStatusColor()} />
            <span className={cn(
                "text-xs font-medium truncate flex items-center gap-0.5 max-w-[200px]",
                getStatusColor()
            )}>
                {getLocationDisplay()}
                <ChevronDown size={10} className="opacity-70" />
            </span>
            {locationState?.isServiceable && (
                <CheckCircle size={10} className="text-green-600 shrink-0" />
            )}
            {locationState && !locationState.isServiceable && (
                <AlertCircle size={10} className="text-amber-600 shrink-0" />
            )}
        </div>
    );

    const searchProps = {
        searchQuery,
        setSearchQuery,
        isSearching,
        searchResults,
        searchError,
        handleSelectLocation,
        locationState,
        detectLocation,
        loadingLocation,
        manualPincode,
        setManualPincode,
        checkManualPincode,
        errorMsg,
        isDesktop
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border/50",
                isScrolled ? "shadow-sm py-2" : "py-3",
                isDesktop && "py-2"
            )}
        >
            <div className="container mx-auto px-4">
                <div className={cn(
                    "flex items-center justify-between",
                    isDesktop ? "flex-row gap-4 h-12" : "flex-row mb-3"
                )}>
                    <div className={cn(
                        "flex min-w-0 max-w-[70%] md:max-w-none",
                        isDesktop ? "flex-row flex-1 items-center gap-3" : "flex-col gap-0.5 items-start"
                    )}>
                        <Link href="/" className={cn("shrink-0", isDesktop && "flex items-center gap-2")}>
                            {isDesktop && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20 shrink-0">
                                    <img src="/logo.jpeg" alt="" className="object-cover w-full h-full" />
                                </div>
                            )}
                            <span className={cn(
                                "font-extrabold text-primary tracking-tight leading-none",
                                isDesktop ? "text-base xl:text-lg" : "text-lg"
                            )}>
                                Localboynaniseafoods
                            </span>
                        </Link>

                        {isMounted && isDesktop ? (
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>{TriggerContent}</DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Select Delivery Location</DialogTitle>
                                    </DialogHeader>
                                    <SearchLocationContent {...searchProps} />
                                </DialogContent>
                            </Dialog>
                        ) : isMounted ? (
                            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                                <DrawerTrigger asChild>{TriggerContent}</DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader className="text-left">
                                        <DrawerTitle>Select Delivery Location</DrawerTitle>
                                    </DrawerHeader>
                                    <SearchLocationContent {...searchProps} />
                                    <DrawerFooter>
                                        <DrawerClose asChild>
                                            <Button variant="ghost">Cancel</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        ) : (
                            // Server/Initial Render Fallback (Prevents layout shift if matched)
                            <div className="flex items-center gap-1 cursor-pointer opacity-50">
                                <MapPin size={12} className="text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Loading...</span>
                            </div>
                        )}
                    </div>

                    {isDesktop && (
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground shrink-0">
                            <Link href="/category" className="hover:text-primary transition-colors">Categories</Link>
                            <Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link>
                        </nav>
                    )}

                    <div className="flex items-center gap-1 sm:gap-3 shrink-0">
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
