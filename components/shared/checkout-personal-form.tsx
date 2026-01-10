"use client";

import React from 'react';
import { WhiteBlock } from './white-block';
import { FormInput } from './form-input';

interface Props {
    className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock title="2. Personal Information" className={className}>
            <div className="grid grid-cols-2 gap-5">
                <FormInput name="firstName" label="First Name" className="text-base" placeholder="First Name" />
                <FormInput name="lastName" label="Last Name" className="text-base" placeholder="Last Name" />
                <FormInput name="email" label="E-Mail" className="text-base" placeholder="E-Mail" />
                <FormInput name="phone" label="Phone" className="text-base" placeholder="Phone" />
            </div>
        </WhiteBlock>
    );
};
