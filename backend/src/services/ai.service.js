/**
 * Mock AI Service for Image Verification
 * Simulates a complex ML model analysis using Computer Vision.
 */

export const analyzeImages = async (files) => {
    // Simulate processing delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // DEMO LOGIC: Always return success with high score
    // In production, this would call a Python Flask API or TensorFlow Serving endpoint

    // Generate a random score between 96.5 and 99.8 for "Real" feel
    const randomScore = (Math.random() * (99.8 - 96.5) + 96.5).toFixed(1);

    return {
        score: parseFloat(randomScore),
        summary: "The provided imagery strongly suggests a healthy, establishing mangrove ecosystem. Leaf density and root structure (pneumatophores) are consistent with Rhizophora species common to the reported region. No signs of illegal encroachment or deforestation detected.",
        pros: [
            "High Vegetation Index (NDVI > 0.7)",
            "Consistent with geo-location metadata",
            "Clear evidence of new growth (saplings visible)"
        ],
        cons: [
            "Some shadow obstruction in Image 2",
            "Water turbidity varies (likely accumulation of sediment)"
        ],
        verification: "Verified. The project data aligns with visual evidence.",
        verified: true
    };
};
