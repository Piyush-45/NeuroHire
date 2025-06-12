'use client';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth.actions';
import { useRouter } from 'next/navigation';
import React from 'react';

const LogoutPage = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();          // Clears session cookie
        router.push('/sign-in');  // Redirect to sign-in page
    };

    return (
        <div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default LogoutPage;
