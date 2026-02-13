"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector, selectLocation } from "@/store";
import { setLocation, LocationState } from "@/store/slices/locationSlice";
import { checkDeliveryAvailability } from "@/data/deliveryZones";

export default function LocationInitializer() {
    const dispatch = useAppDispatch();
    const locationState = useAppSelector(selectLocation);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        // Only run if no location is set
        if (locationState) {
            setIsInitializing(false);
            return;
        }

        if (!navigator.geolocation) {
            console.log("Geolocation not supported");
            setIsInitializing(false);
            return;
        }

        const detect = async () => {
            try {
                // Request location
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;

                        try {
                            // Reverse geocode
                            const res = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
                            const data = await res.json();

                            if (res.ok && data.pincode) {
                                const { pincode, locality, city } = data;
                                const deliveryCheck = checkDeliveryAvailability(pincode);

                                const newState: LocationState = {
                                    pincode,
                                    locality: locality || city || 'Current Location',
                                    isServiceable: deliveryCheck.available,
                                    eta: deliveryCheck.zone?.eta || '',
                                    minOrder: deliveryCheck.zone?.minOrder || 0,
                                    message: deliveryCheck.message,
                                };

                                dispatch(setLocation(newState));
                            }
                        } catch (err) {
                            console.error("Failed to resolve location", err);
                        } finally {
                            setIsInitializing(false);
                        }
                    },
                    (error) => {
                        console.log("Location permission denied or error", error);
                        setIsInitializing(false);
                    },
                    { timeout: 10000, maximumAge: 60000 }
                );
            } catch (e) {
                setIsInitializing(false);
            }
        };

        detect();
    }, [dispatch, locationState]);

    return null; // Invisible component
}
