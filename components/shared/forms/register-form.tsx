'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Title } from '../title';
import { FormInput } from '../form-input';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

const registerSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email' }),
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirmation must match password' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof registerSchema>;

interface Props {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSuccess, onSwitchToLogin }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            fullName: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            // In a real app, you would call a server action or API to register the user
            console.log('Registering user:', data);

            // Artificial delay
            await new Promise(r => setTimeout(r, 1000));

            toast.success('Registration successful! Please log in.', { icon: '✅' });
            onSwitchToLogin?.();
        } catch (error) {
            console.error('Error [REGISTER]', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <FormProvider {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                <Title text="Registration" size="md" className="font-bold" />

                <FormInput name="email" label="E-Mail" required />
                <FormInput name="fullName" label="Full Name" required />
                <FormInput name="password" label="Password" type="password" required />
                <FormInput name="confirmPassword" label="Confirm Password" type="password" required />

                <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
                    Register
                </Button>

                <Button variant="outline" onClick={onSwitchToLogin} type="button" className="h-12">
                    Back to Login
                </Button>
            </form>
        </FormProvider>
    );
};
