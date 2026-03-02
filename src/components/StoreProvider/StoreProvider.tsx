'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const syncFirestore = useStore(state => state.syncFirestore);
    const seedMockData = useStore(state => state.seedMockData);
    const isSyncing = useRef(false);

    useEffect(() => {
        if (isSyncing.current) return;
        isSyncing.current = true;

        // Optional: Seed mock data if collections are empty (for initial run)
        seedMockData();

        // Start Realtime sync
        const unsubscribe = syncFirestore();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            isSyncing.current = false;
        };
    }, [syncFirestore, seedMockData]);

    return <>{children}</>;
}
