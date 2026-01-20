import React from 'react';
import { Container } from './container';
import { Button } from '../ui';
import { UserSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

export const MysteryShopperBanner: React.FC<Props> = ({ className }) => {
    return (
        <section className={cn('bg-orange-500 py-4', className)}>
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                    <div className="flex items-center gap-4 text-white">
                        <div className="bg-white/20 p-2 rounded-full">
                            <UserSearch size={28} className="text-white" />
                        </div>
                        <p className="font-bold text-lg md:text-xl leading-tight text-center md:text-left">
                            Become a mystery shopper and get rewarded — earn enough points for two free pizzas!
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        className="bg-white text-orange-500 hover:bg-orange-50 font-bold px-8 py-6 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-900/10"
                    >
                        Fill out form
                    </Button>
                </div>
            </Container>
        </section>
    );
};
