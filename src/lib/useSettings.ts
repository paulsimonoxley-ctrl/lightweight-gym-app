import { useState } from 'react';

export type WeightUnit = 'lbs' | 'kg';

export function useSettings() {
    const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => {
        const stored = localStorage.getItem('lw_weight_unit') as WeightUnit;
        return stored || 'kg';
    });

    const updateWeightUnit = (unit: WeightUnit) => {
        setWeightUnit(unit);
        localStorage.setItem('lw_weight_unit', unit);
    };

    return {
        weightUnit,
        updateWeightUnit
    };
}
