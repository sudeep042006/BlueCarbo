/**
 * Simplified MRV Calculation
 * 1 Carbon Credit = 1 Metric Ton of CO2
 */
const calculateCredits = (projectType, unitCount) => {
    let factor = 0;

    switch (projectType) {
        case 'plantation':
            factor = 0.5; 
            break;
        case 'mangrove':
            factor = 1.0;
            break;
        case 'forest_protection':
            factor = 2.0;
            break;
        default:
            factor = 0.1;
    }

    return unitCount * factor;
};

export { calculateCredits };