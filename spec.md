# Maison Arbor

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full luxury e-commerce website for Maison Arbor furniture brand
- Homepage with 7 editorial sections: hero, brand manifesto, category gallery, featured products, craftsmanship, lookbook, footer
- 8 Product Category pages: Centre Tables, Coffee Tables, Teapoys, Sofa Siders, TV Unit Bottoms, Bar Tables, Garden Sets, Designer Shoe Racks
- Product Detail pages with large imagery, materials, pricing in INR
- Shopping Cart with item management
- Checkout flow with Razorpay payment integration
- About / Our Story page
- Contact page
- Custom Creations page ("You Dream It, We Make It") with design upload form
- Admin view for custom creation requests (protected by authorization)
- AI-generated brand imagery throughout

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Product data model: id, name, category, material, price (INR), description, imageUrl, inStock
- Order data model: id, items, total, customerInfo, status, razorpayOrderId
- CustomRequest data model: id, customerName, email, phone, description, imageFileId, submittedAt, status
- Cart operations: addToCart, removeFromCart, getCart (session-based or user-based)
- Product queries: getProducts, getProductsByCategory, getProductById
- Order management: createOrder, getOrder, updateOrderStatus
- Razorpay integration: createRazorpayOrder via HTTP outcall, verifyPayment
- Custom creations: submitCustomRequest, getCustomRequests (admin only)
- Blob storage for custom design uploads
- Authorization for admin routes

### Frontend
- Design system: Warm Ivory #F3EFEA background, Deep Charcoal #1B1B1B text, Walnut Brown #6A4E3B accent, Muted Bronze #B89A6A highlight, Stone Grey #D6D2CC cards
- Typography: Playfair Display (serif headings) + Inter (body)
- Smooth scroll, fade-in on scroll, hover zoom on images
- Transparent nav → solid on scroll
- Pages: Home, Category (x8), ProductDetail, Cart, Checkout, Confirmation, About, Contact, CustomCreations, AdminDashboard
- Razorpay JS SDK integration on checkout page
- Lazy-loaded images throughout
