"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, User, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
    useAppDispatch,
    useAppSelector,
    selectCartItemsWithDetails,
    selectCartTotal,
    selectCartSavings,
    selectUser,
    selectDefaultAddress,
    setPhone,
    setName,
    addAddress,
    createOrder,
    clearCart,
} from "@/store";

type CheckoutStep = 'details' | 'address' | 'confirm';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItemsWithDetails);
    const cartTotal = useAppSelector(selectCartTotal);
    const cartSavings = useAppSelector(selectCartSavings);
    const user = useAppSelector(selectUser);
    const defaultAddress = useAppSelector(selectDefaultAddress);

    const [step, setStep] = useState<CheckoutStep>('details');
    const [phone, setPhoneInput] = useState(user.phone || '');
    const [name, setNameInput] = useState(user.name || '');
    const [addressInput, setAddressInput] = useState({
        fullAddress: defaultAddress?.fullAddress || '',
        landmark: defaultAddress?.landmark || '',
        pincode: defaultAddress?.pincode || '',
        city: defaultAddress?.city || '',
    });
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const deliveryFee = cartTotal >= 500 ? 0 : 49;
    const finalTotal = cartTotal + deliveryFee;

    // Validate phone (10 digits)
    const isPhoneValid = /^[6-9]\d{9}$/.test(phone);
    const isNameValid = name.trim().length >= 2;
    const isAddressValid = addressInput.fullAddress.length > 5 && addressInput.pincode.length === 6;

    // Auto-fill logic
    const handlePhoneBlur = async () => {
        if (!isPhoneValid) return;

        setLookupLoading(true);
        try {
            const res = await fetch(`/api/customer/lookup?phone=${phone}`);
            const data = await res.json();

            if (data.found) {
                if (data.name) setNameInput(data.name);
                if (data.address) {
                    setAddressInput({
                        fullAddress: data.address.fullAddress || '',
                        landmark: '', // Not stored separately currently
                        pincode: data.address.pincode || '',
                        city: data.address.city || '',
                    });
                }
            }
        } catch (error) {
            console.error('Lookup failed', error);
        } finally {
            setLookupLoading(false);
        }
    };

    const handleContinue = () => {
        if (step === 'details' && isPhoneValid && isNameValid) {
            dispatch(setPhone(phone));
            dispatch(setName(name));
            setStep('address');
        } else if (step === 'address' && isAddressValid) {
            // Save address locally too
            dispatch(addAddress({
                label: 'Home',
                fullAddress: addressInput.fullAddress,
                landmark: addressInput.landmark,
                pincode: addressInput.pincode,
                city: addressInput.city,
                isDefault: true,
            }));
            setStep('confirm');
        }
    };
    const handlePayment = async () => {
        setIsProcessing(true);

        // 1. Load Razorpay SDK
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert("Failed to load payment gateway. Please check connection.");
            setIsProcessing(false);
            return;
        }

        // 2. Create Order in DB (PENDING)
        const orderPayload = {
            items: cartItems.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtOrder: item.product?.price || 0,
            })),
            subtotal: cartTotal,
            deliveryFee,
            total: finalTotal,
            phone,
            name,
            address: addressInput.fullAddress,
            city: addressInput.city,
            pincode: addressInput.pincode,
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const data = await res.json();

            if (!data.success) {
                alert('Order failed: ' + data.error);
                setIsProcessing(false);
                return;
            }

            const dbOrderId = data.orderId; // UUID

            // 3. Create Razorpay Order
            const paymentRes = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: dbOrderId }),
            });

            const paymentData = await paymentRes.json();

            if (!paymentData.id) {
                alert('Payment init failed');
                setIsProcessing(false);
                return;
            }

            // 4. Open Razorpay Modal
            const options = {
                key: paymentData.keyId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: "Ocean Fresh",
                description: "Premium Seafood Order",
                order_id: paymentData.id,
                handler: async function (response: any) {
                    // 5. Verify Payment
                    try {
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            handleOrderSuccess(data.orderNumber, verifyData.invoiceUrl);
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Verify error', error);
                        alert('Payment verification error');
                    }
                },
                prefill: {
                    name: name,
                    contact: phone,
                },
                theme: {
                    color: "#0284c7", // Sky blue
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        alert('Payment cancelled. You can try again.');
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Order process failed', error);
            alert('Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleOrderSuccess = (orderNumber: string, invoice?: string) => {
        // Clear Cart & Redux
        dispatch(createOrder({
            items: cartItems.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtOrder: item.product?.price || 0,
                title: item.product?.title || '',
            })),
            subtotal: cartTotal,
            deliveryFee,
            discount: cartSavings,
            total: finalTotal,
            addressId: 'addr_new',
            addressSnapshot: `${addressInput.fullAddress}, ${addressInput.city} - ${addressInput.pincode}`,
            phone,
            name,
        }));

        dispatch(clearCart());
        setIsOrderPlaced(true);
        setOrderId(orderNumber);
        if (invoice) setInvoiceUrl(invoice);
        setIsProcessing(false);
    };

    // Redirect if cart is empty (and order not just placed)
    if (cartItems.length === 0 && !isOrderPlaced) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32">
                <div className="container mx-auto px-4 max-w-lg text-center">
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                    <Link href="/category">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Order Success Screen
    if (isOrderPlaced) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32">
                <div className="container mx-auto px-4 max-w-lg">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-card rounded-3xl p-8 text-center shadow-sm border border-border"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h1>
                        <p className="text-slate-500 mb-6">
                            Your order #{orderId} has been confirmed.
                        </p>

                        {invoiceUrl && (
                            <div className="mb-6">
                                <a
                                    href={invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors font-medium text-sm"
                                >
                                    📄 Download Invoice
                                </a>
                            </div>
                        )}

                        <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-slate-500 mb-1">Delivering to</p>
                            <p className="font-medium text-slate-900">{name}</p>
                            <p className="text-sm text-slate-600">{addressInput.fullAddress}</p>
                            <p className="text-sm text-slate-600">{addressInput.city} - {addressInput.pincode}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/" className="flex-1">
                                <Button variant="outline" className="w-full">Home</Button>
                            </Link>
                            <Link href="/category" className="flex-1">
                                <Button className="w-full">Shop More</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-32 md:pb-16">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Back Button */}
                <Link href="/cart" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
                </Link>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {['details', 'address', 'confirm'].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-slate-900 text-white' :
                                ['details', 'address', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                {['details', 'address', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
                            </div>
                            {i < 2 && <div className="w-12 h-0.5 bg-slate-200 mx-2" />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Contact Details */}
                    {step === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                        Phone Number
                                    </Label>
                                    <div className="relative mt-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="10-digit mobile number"
                                            value={phone}
                                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            onBlur={handlePhoneBlur}
                                            disabled={lookupLoading}
                                            className="pl-10"
                                            maxLength={10}
                                        />
                                    </div>
                                    {lookupLoading && <p className="text-xs text-blue-600 mt-1">Checking for saved address...</p>}
                                    {phone.length === 10 && !isPhoneValid && (
                                        <p className="text-xs text-red-500 mt-1">Enter a valid mobile number</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                        Full Name
                                    </Label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleContinue}
                                disabled={!isPhoneValid || !isNameValid}
                                className="w-full mt-6 h-12 rounded-full font-bold"
                            >
                                Continue <ChevronRight className="ml-1 w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 2: Address */}
                    {step === 'address' && (
                        <motion.div
                            key="address"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Delivery Address</h2>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-slate-700">Full Address</Label>
                                    <Input
                                        placeholder="House/Flat No., Building, Street"
                                        value={addressInput.fullAddress}
                                        onChange={(e) => setAddressInput(prev => ({ ...prev, fullAddress: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-slate-700">Landmark (Optional)</Label>
                                    <Input
                                        placeholder="Near temple, opposite mall, etc."
                                        value={addressInput.landmark}
                                        onChange={(e) => setAddressInput(prev => ({ ...prev, landmark: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-slate-700">Pincode</Label>
                                        <Input
                                            placeholder="6 digits"
                                            value={addressInput.pincode}
                                            onChange={(e) => setAddressInput(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                                            className="mt-1"
                                            maxLength={6}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-slate-700">City</Label>
                                        <Input
                                            placeholder="City"
                                            value={addressInput.city}
                                            onChange={(e) => setAddressInput(prev => ({ ...prev, city: e.target.value }))}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                                    Back
                                </Button>
                                <Button
                                    onClick={handleContinue}
                                    disabled={!isAddressValid}
                                    className="flex-1 h-12 rounded-full font-bold"
                                >
                                    Continue <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Confirm & Pay */}
                    {step === 'confirm' && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {/* Order Summary */}
                            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>

                                <div className="space-y-3 text-sm border-b border-slate-100 pb-4 mb-4">
                                    {cartItems.map((item: any) => (
                                        <div key={item.productId} className="flex justify-between">
                                            <span className="text-slate-600">{item.product?.title} × {item.quantity}</span>
                                            <span className="font-medium">₹{item.lineTotal}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    {cartSavings > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Savings</span>
                                            <span>-₹{cartSavings}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Delivery</span>
                                        <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-100">
                                        <span>Total</span>
                                        <span>₹{finalTotal}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                                <h3 className="font-bold text-slate-900 mb-3">Delivering to</h3>
                                <p className="font-medium">{name}</p>
                                <p className="text-sm text-slate-600">{phone}</p>
                                <p className="text-sm text-slate-600 mt-2">{addressInput.fullAddress}</p>
                                <p className="text-sm text-slate-600">{addressInput.city} - {addressInput.pincode}</p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep('address')} className="flex-1">
                                    Back
                                </Button>
                                <Button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="flex-1 h-12 rounded-full font-bold text-lg bg-sky-600 hover:bg-sky-700"
                                >
                                    {isProcessing ? 'Processing...' : 'Pay Now'}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
