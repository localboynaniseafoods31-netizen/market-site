"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, MapPin, Loader2, Navigation, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAppSelector, selectCartItemCount, selectIsLoggedIn, selectUser } from "@/store";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Navbar() {
    const cartItemCount = useAppSelector(selectCartItemCount);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const user = useAppSelector(selectUser);
    const { resolvedTheme, setTheme } = useTheme();

    const [location, setLocation] = useState("Indiranagar, Bangalore");
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

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
                setTimeout(() => {
                    setLocation("HSR Layout, Sector 4");
                    setLoadingLocation(false);
                    setIsOpen(false);
                }, 1500);
            },
            (error) => {
                setErrorMsg("Unable to retrieve your location");
                setLoadingLocation(false);
            }
        );
    };

    return (
        <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary tracking-tight">Ocean Fresh</span>
                </Link>

                {/* Location Selector with Dialog */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                            <MapPin size={16} className="text-primary" />
                            <span className="max-w-[180px] truncate">{location}</span>
                            <span className="text-[10px]">▼</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Select Delivery Location</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search for area, street name..." className="pl-9" />
                            </div>

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

                            <div className="text-xs text-muted-foreground text-center py-2">
                                or select from saved addresses
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Spacer */}
                <div className="flex-1 mx-8"></div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <nav className="flex items-center gap-6 mr-4 text-sm font-medium text-muted-foreground">
                        <Link href="/category" className="hover:text-primary transition-colors">Categories</Link>
                        <Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1"
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        >
                            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>
                        {isLoggedIn && (
                            <Link href="/orders">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <User size={18} />
                                    <span className="max-w-[100px] truncate">{user.name || 'Account'}</span>
                                </Button>
                            </Link>
                        )}
                        <Link href="/cart">
                            <Button size="sm" className="gap-2 rounded-full px-5">
                                <ShoppingCart size={18} />
                                Cart {cartItemCount > 0 && `(${cartItemCount})`}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}


