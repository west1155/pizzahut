'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui';
import { Title } from '../title';
import { LoginForm } from '../forms/login-form';
import { RegisterForm } from '../forms/register-form';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
    const [type, setType] = React.useState<'login' | 'register' | 'success'>('login');
    const [userName, setUserName] = React.useState('');

    const handleClose = () => {
        onClose();
        setType('login');
    };

    const onSuccess = (name: string) => {
        setUserName(name);
        setType('success');
        setTimeout(() => {
            handleClose();
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[450px] bg-white p-10 outline-none">
                {type === 'login' && (
                    <LoginForm
                        onSuccess={onSuccess}
                        onSwitchToRegister={() => setType('register')}
                    />
                )}
                {type === 'register' && (
                    <RegisterForm
                        onSuccess={onSuccess}
                        onSwitchToLogin={() => setType('login')}
                    />
                )}
                {type === 'success' && (
                    <div className="flex flex-col items-center gap-4 py-10 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">👋</span>
                        </div>
                        <div>
                            <Title text={`Welcome, ${userName}!`} size="md" className="font-bold" />
                            <p className="text-gray-400">Successfully logged in</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
