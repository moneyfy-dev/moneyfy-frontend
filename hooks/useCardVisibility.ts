import { useState, useCallback } from 'react';

export function useCardVisibility() {
    const [isVisible, setIsVisible] = useState(false);

    const showCard = useCallback(() => {
        setIsVisible(true);
    }, []);

    const hideCard = useCallback(() => {
        setIsVisible(false);
    }, []);

    return { isVisible, showCard, hideCard };
}