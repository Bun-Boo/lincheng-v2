'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated && pathname !== '/login') {
                router.push('/login');
            } else if (isAuthenticated && pathname === '/login') {
                router.push('/');
            }
        }
    }, [isAuthenticated, pathname, router, mounted]);

    // Don't render anything until we are mounted to avoid hydration mismatch 
    // and flashing content before redirect.
    if (!mounted) {
        return null;
    }

    // If not authenticated, we ONLY allow rendering if on the login page
    if (!isAuthenticated) {
        if (pathname === '/login') {
            return <>{children}</>;
        }
        return null; // Don't show protected content while redirecting
    }

    // If authenticated, we render the children (unless they are on /login, in which case the effect redirects them soon)
    return <>{children}</>;
}
