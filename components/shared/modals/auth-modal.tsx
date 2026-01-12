'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui';
import { LoginForm } from '../forms/login-form';
import { RegisterForm } from '../forms/register-form';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
    const [type, setType] = React.useState<'login' | 'register'>('login');

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[450px] bg-white p-10 outline-none">
                {type === 'login' ? (
                    <LoginForm onSuccess={handleClose} onSwitchToRegister={() => setType('register')} />
                ) : (
                    <RegisterForm onSuccess={handleClose} onSwitchToLogin={() => setType('login')} />
                )}
            </DialogContent>
        </Dialog>
    );
};
