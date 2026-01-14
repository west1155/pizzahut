import React from 'react';
import { AuthProvider } from './auth-provider';
import { Toaster } from 'react-hot-toast';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
        </>
    );
};
