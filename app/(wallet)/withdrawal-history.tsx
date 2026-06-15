import React from 'react';
import { PaymentHistory, ThemedListLayout } from '@/shared/components';

export default function WithdrawalHistory() {
    return (
        <ThemedListLayout padding={[0, 0]}>
            <PaymentHistory />
        </ThemedListLayout>
    );
}
