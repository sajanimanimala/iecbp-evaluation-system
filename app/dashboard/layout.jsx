"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthUser, redirectPathForRole, fetchSession, setAuthUser, clearAuthUser } from '../../components/auth/auth';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;
        async function validate() {
            // Require server-side session validation. Do not trust localStorage alone.
            const serverUser = await fetchSession();

            if (!serverUser) {
                try { clearAuthUser(); } catch (e) { }
                router.replace('/login');
                return;
            }

            // ensure localStorage has fresh copy
            try { setAuthUser(serverUser); } catch (e) { }

            if (pathname.startsWith('/dashboard/admin') && serverUser.role !== 'ADMIN') {
                router.replace(redirectPathForRole(serverUser.role));
                return;
            }

            if (pathname.startsWith('/dashboard/evaluator') && serverUser.role !== 'EVALUATOR') {
                router.replace(redirectPathForRole(serverUser.role));
                return;
            }

            if (pathname.startsWith('/dashboard/candidate') && serverUser.role !== 'CANDIDATE') {
                router.replace(redirectPathForRole(serverUser.role));
                return;
            }
        }
        if (mounted) validate();
        return () => { mounted = false; };
    }, [pathname]);

    return <>{children}</>;
}
