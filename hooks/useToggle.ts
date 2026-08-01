import { useState } from 'react';

// Custom hook 1: Toggles a boolean value
export const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
    const [value, setValue] = useState<boolean>(initialValue);
    
    const toggle = (): void => {
        setValue((prev) => !prev);
    };

    return [value, toggle];
};