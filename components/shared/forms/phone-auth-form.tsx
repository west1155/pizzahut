'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Title } from '../title';
import { FormInput } from '../form-input';
import { Button } from '@/components/ui';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

const phoneSchema = z.object({
    phone: z.string().min(10, { message: 'Enter a valid phone number with country code (e.g. +1...)' }),
});

const codeSchema = z.object({
    code: z.string().length(6, { message: 'Code must be 6 digits' }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;

interface Props {
    onSuccess?: () => void;
    onBack?: () => void;
}

export const PhoneAuthForm: React.FC<Props> = ({ onSuccess, onBack }) => {
    const [step, setStep] = React.useState<'phone' | 'code'>('phone');
    const [confirmationResult, setConfirmationResult] = React.useState<ConfirmationResult | null>(null);
    const [loading, setLoading] = React.useState(false);

    const phoneForm = useForm<PhoneFormValues>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: '' },
    });

    const codeForm = useForm<CodeFormValues>({
        resolver: zodResolver(codeSchema),
        defaultValues: { code: '' },
    });

    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
            });
        }
    };

    const onSendCode = async (data: PhoneFormValues) => {
        setLoading(true);
        try {
            setupRecaptcha();
            const appVerifier = (window as any).recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, data.phone, appVerifier);
            setConfirmationResult(result);
            setStep('code');
            toast.success('SMS code sent!');
        } catch (error) {
            console.error('SMS Error', error);
            toast.error('Failed to send SMS. Check phone format.');
        } finally {
            setLoading(false);
        }
    };

    const onVerifyCode = async (data: CodeFormValues) => {
        if (!confirmationResult) return;
        setLoading(true);
        try {
            await confirmationResult.confirm(data.code);
            toast.success('Login successful!');
            onSuccess?.();
        } catch (error) {
            console.error('Verify Error', error);
            toast.error('Invalid code. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <Title text="Phone Login" size="md" className="font-bold" />

            <div id="recaptcha-container"></div>

            {step === 'phone' ? (
                <FormProvider {...phoneForm}>
                    <form className="flex flex-col gap-5" onSubmit={phoneForm.handleSubmit(onSendCode)}>
                        <FormInput name="phone" label="Phone Number" placeholder="+1234567890" />
                        <Button loading={loading} className="h-12" type="submit">
                            Send Code
                        </Button>
                    </form>
                </FormProvider>
            ) : (
                <FormProvider {...codeForm}>
                    <form className="flex flex-col gap-5" onSubmit={codeForm.handleSubmit(onVerifyCode)}>
                        <FormInput name="code" label="Verification Code" placeholder="123456" />
                        <Button loading={loading} className="h-12" type="submit">
                            Verify Code
                        </Button>
                    </form>
                </FormProvider>
            )}

            <Button variant="outline" onClick={onBack} type="button" className="h-12">
                Back
            </Button>
        </div>
    );
};
