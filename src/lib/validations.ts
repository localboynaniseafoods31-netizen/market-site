import { z } from 'zod';

// ==================== User Schemas ====================

export const phoneSchema = z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number');

export const userSchema = z.object({
    phone: phoneSchema,
    email: z.string().email().optional(),
    name: z.string().min(2).max(100).optional(),
});

// ==================== Order Schemas ====================

export const orderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1).max(20),
    deliveryName: z.string().min(2).max(100),
    deliveryPhone: phoneSchema,
    deliveryAddress: z.string().min(10).max(500),
    deliveryCity: z.string().min(2).max(50),
    deliveryPincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
    idempotencyKey: z.string().uuid().optional(),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

// ==================== Product Schemas ====================

export const createProductSchema = z.object({
    name: z.string().min(2).max(200),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().max(2000).optional(),
    image: z.string().min(1),
    images: z.array(z.string()).default([]),
    grossWeight: z.string().min(1),
    netWeight: z.string().min(1),
    price: z.number().int().min(100), // Minimum ₹1 (100 paisa)
    originalPrice: z.number().int().optional(),
    stock: z.number().int().min(0).default(0),
    pieces: z.string().optional(),
    serves: z.string().optional(),
    sourcing: z.string().optional(),
    cutType: z.string().optional(),
    texture: z.string().optional(),
    deliveryTime: z.string().optional(),
    categoryId: z.string().uuid(),
});

export const updateProductSchema = createProductSchema.partial();

// ==================== Category Schemas ====================

export const createCategorySchema = z.object({
    name: z.string().min(2).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional(),
    icon: z.string().optional(),
});

// ==================== Type Exports ====================

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
