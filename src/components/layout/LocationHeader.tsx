"use client";

import Link from "next/link";
import { MapPin, Search, ShoppingBag, User, Loader2, Navigation, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector, selectCartItemCount } from "@/store";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";

export default function LocationHeader() {
    const pathname = usePathname();
    const cartItemCount = useAppSelector(selectCartItemCount);
    const [isScrolled, setIsScrolled] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const [location, setLocation] = useState<string>("Select Location");
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Check if we're on a category page
    const isCategoryPage = pathname?.startsWith('/category/') && pathname !== '/category';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname?.startsWith('/admin')) return null;

    const detectLocation = () => {
        setLoadingLocation(true);
        setErrorMsg(null);

        if (!navigator.geolocation) {
            setErrorMsg("Geolocation is not supported by your browser");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app, you'd reverse geocode here using Google Maps API or similar
                // For now, we simulate a successful detection with a mock address based on coords
                setTimeout(() => {
                    setLocation("HSR Layout, Sector 4"); // Mock detected location
                    setLoadingLocation(false);
                    // Close drawer programmatically if we had a ref, or rely on user to close
                }, 1500);
            },
            (error) => {
                setErrorMsg("Unable to retrieve your location");
                setLoadingLocation(false);
            }
        );
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border/50",
                isScrolled ? "shadow-sm py-2" : "py-3"
            )}
        >
            <div className="container mx-auto px-4">
                {/* Top Row: Location & Actions */}


                <div className="flex items-center justify-between mb-3">

                    <div className="flex flex-col gap-0.5 max-w-[70%]">
                        <Link href="/">
                            <span className="text-lg font-extrabold text-primary tracking-tight leading-none">
                                Ocean Fresh
                            </span>
                        </Link>

                        <Drawer>
                            <DrawerTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer active:opacity-70 transition-opacity">
                                    <MapPin size={12} className="text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground truncate flex items-center gap-0.5 max-w-[200px]">
                                        {location}
                                        <span className="text-[10px] opacity-70">▼</span>
                                    </span>
                                </div>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="mx-auto w-full max-w-sm">
                                    <DrawerHeader>
                                        <DrawerTitle>Select Delivery Location</DrawerTitle>
                                    </DrawerHeader>
                                    <div className="p-4 pb-0 space-y-4">


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
                                                <span className="font-bold">Use Current Location</span>
                                                <span className="text-[10px] font-normal opacity-80 mt-1">Using GPS</span>
                                            </div>
                                        </Button>

                                        {errorMsg && <p className="text-xs text-destructive text-center">{errorMsg}</p>}

                                        <div className="text-xs text-muted-foreground text-center py-4">
                                            or select from saved addresses
                                        </div>
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
                        {/* Profile Icon */}
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

                {/* Search Bar - Only on Category Pages */}

            </div>
        </header>
    );
}
