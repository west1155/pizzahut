"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    required?: boolean;
    className?: string;
}

export const FormInput: React.FC<Props> = ({ name, label, required, className, ...props }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const errorText = errors[name]?.message as string;

    return (
        <div className={className}>
            {label && (
                <p className="font-medium mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </p>
            )}

            <div className="relative">
                <Input
                    className={cn('h-12 text-md', errorText && 'border-red-500')}
                    {...register(name)}
                    {...props}
                />
            </div>

            {errorText && <p className="text-red-500 text-sm mt-2">{errorText}</p>}
        </div>
    );
};
