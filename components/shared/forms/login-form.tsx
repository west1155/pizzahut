'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Title } from '../title';
import { FormInput } from '../form-input';
import { Button } from '@/components/ui';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof loginSchema>;

interface Props {
    onSuccess?: (name: string) => void;
    onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<Props> = ({ onSuccess, onSwitchToRegister }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const resp = await signIn('credentials', {
                ...data,
                redirect: false,
            });

            if (!resp?.ok) {
                throw Error();
            }

            toast.success('Successfully logged in!', { icon: '🔑' });
            onSuccess?.(data.email.split('@')[0]);
        } catch (error: any) {
            console.error('Error [LOGIN]', error);
            toast.error('Invalid email or password');
        }
    };

    const onGoogleSignIn = async () => {
        try {
            await signIn('google', { callbackUrl: '/', redirect: true });
        } catch (error) {
            console.error('Error [GOOGLE_LOGIN]', error);
            toast.error('Google sign-in failed');
        }
    };

    return (
        <FormProvider {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <div className="mr-2">
                        <Title text="Login to account" size="md" className="font-bold" />
                        <p className="text-gray-400">Enter your email to sign in</p>
                    </div>
                </div>

                <FormInput name="email" label="E-Mail" required />
                <FormInput name="password" label="Password" type="password" required />

                <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
                    Sign In
                </Button>

                <div className="flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        onClick={onGoogleSignIn}
                        type="button"
                        className="gap-2 h-12 w-full"
                    >
                        <img className="w-6 h-6" src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" />
                        Google
                    </Button>

                </div>

                <Button variant="ghost" onClick={onSwitchToRegister} type="button" className="h-12">
                    Register
                </Button>
            </form>
        </FormProvider>
    );
};
