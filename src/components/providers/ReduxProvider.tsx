"use client";

import { Provider } from 'react-redux';
import { store, hydrateStore, setupPersistence } from '@/store';
import { useEffect, useState } from 'react';

interface ReduxProviderProps {
    children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Hydrate store from localStorage on client mount
        hydrateStore();
        // Setup persistence subscription
        setupPersistence();
        setIsHydrated(true);
    }, []);

    // Render children even before hydration to avoid layout shift
    // The store will update once hydrated
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
