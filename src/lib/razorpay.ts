import Razorpay from 'razorpay';

// Helper to get instance, ensuring env vars are present (or throwing meaningful error at runtime, not build time)
export const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn("Razorpay credentials missing");
        // Throwing error might crash if called unexpectedly, but safer than crashing build.
        // Return dummy or throw? If we throw, the API handler catches it.
        throw new Error("Razorpay credentials missing");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

export const CURRENCY = 'INR';
