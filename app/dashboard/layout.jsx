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
            console.log('[TRACE] dashboard layout validate', { pathname });
            // Require server-side session validation. Do not trust localStorage alone.
            const serverUser = await fetchSession();
            console.log('[TRACE] dashboard layout fetchSession result', serverUser);

            if (!serverUser) {
                console.log('[TRACE] dashboard layout redirect -> /login', { from: pathname, reason: 'fetchSession returned null' });
                try { clearAuthUser(); } catch (e) { }
                router.replace('/login');
                return;
            }

            // ensure localStorage has fresh copy
            try { setAuthUser(serverUser); } catch (e) { }

            if (pathname.startsWith('/dashboard/admin') && serverUser.role !== 'ADMIN') {
                const target = redirectPathForRole(serverUser.role);
                console.log('[TRACE] dashboard layout redirect', { from: pathname, to: target, reason: 'admin-role-mismatch' });
                router.replace(target);
                return;
            }

            if (pathname.startsWith('/dashboard/evaluator') && serverUser.role !== 'EVALUATOR') {
                const target = redirectPathForRole(serverUser.role);
                console.log('[TRACE] dashboard layout redirect', { from: pathname, to: target, reason: 'evaluator-role-mismatch' });
                router.replace(target);
                return;
            }

            if (pathname.startsWith('/dashboard/candidate') && serverUser.role !== 'CANDIDATE') {
                const target = redirectPathForRole(serverUser.role);
                console.log('[TRACE] dashboard layout redirect', { from: pathname, to: target, reason: 'candidate-role-mismatch' });
                router.replace(target);
                return;
            }

            console.log('[TRACE] dashboard layout access allowed', { pathname, role: serverUser.role });
        }
        if (mounted) validate();
        return () => { mounted = false; };
    }, [pathname]);

    return <>{children}</>;
}
