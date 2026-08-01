import { useState, useEffect, useRef } from 'react';

// Custom hook 2: Tracks the previous state value
export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};