import { useState, useEffect } from 'react';
import { Account } from '@/types/useAccounts';
import { getAccounts } from '@/services/accountService';

export const useAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            const fetchedAccounts = await getAccounts();
            setAccounts(fetchedAccounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { accounts, isLoading, refetch: fetchAccounts };
};