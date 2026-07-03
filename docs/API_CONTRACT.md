# Sed_Ecomm API Contract (v1)

Base URL (local): `http://localhost:5000/api/v1`
Auth: `Authorization: Bearer <accessToken>` header. JWT access token (15m) + refresh token (7d, httpOnly cookie).
All responses: `{ success: boolean, data?: any, message?: string, errors?: any[] }`
Pagination query: `?page=1&limit=20` → response includes `{ data, pagination: { page, limit, total, totalPages } }`

## Auth — /auth
- POST /auth/register { name, email, password } → user + tokens
- POST /auth/login { email, password } → user + tokens
- POST /auth/logout
- POST /auth/refresh-token (reads refresh cookie) → new access token
- POST /auth/forgot-password { email } → simulated email w/ reset token
- POST /auth/reset-password/:token { password }
- GET  /auth/me (protected)

## Users — /users (protected)
- GET /users/me
- PATCH /users/me { name, phone, avatar }
- GET/POST/PATCH/DELETE /users/addresses ...

## Categories — /categories
- GET /categories
- GET /categories/:slug
- Admin: POST/PATCH/DELETE /categories/:id

## Products — /products
- GET /products ?category=&minPrice=&maxPrice=&rating=&brand=&size=&color=&sort=price_asc|price_desc|newest|popular|rating&search=&page=&limit=
- GET /products/:slug
- GET /products/:id/related
- GET /products/search/suggest?q= (live suggestions)
- Admin: POST/PATCH/DELETE /products/:id, POST /products/:id/images

## Reviews — /products/:id/reviews
- GET /products/:id/reviews
- POST /products/:id/reviews (protected) { rating, comment, images[] }
- POST /reviews/:id/like (protected)

## Cart — /cart (protected)
- GET /cart
- POST /cart/items { productId, variant, qty }
- PATCH /cart/items/:itemId { qty }
- DELETE /cart/items/:itemId
- POST /cart/items/:itemId/save-for-later
- POST /cart/apply-coupon { code }

## Wishlist — /wishlist (protected)
- GET /wishlist
- POST /wishlist/:productId
- DELETE /wishlist/:productId

## Coupons — /coupons
- GET /coupons/validate/:code
- Admin: GET/POST/PATCH/DELETE /coupons

## Orders — /orders (protected)
- POST /orders (checkout) { addressId, items, couponCode, paymentMethod }
- GET /orders (my orders)
- GET /orders/:id
- POST /orders/:id/cancel
- POST /orders/:id/return
- GET /orders/:id/invoice (PDF-ready HTML/json)
- GET /orders/:id/track (dummy tracking timeline)

## Payments — /payments (protected, dummy gateway — see PAYMENT_SPEC.md)
- POST /payments/initiate { orderId, method }
- POST /payments/verify { paymentId, otp? } → simulated success/failure
- GET /payments/:id

## Admin — /admin (protected, role=admin)
- GET /admin/dashboard/summary (totalSales, dailySales, monthlySales, revenue, userGrowth)
- GET /admin/dashboard/best-sellers
- CRUD /admin/products, /admin/categories, /admin/orders, /admin/customers, /admin/coupons

## Misc
- GET /meta/currency-rates (proxied ExchangeRate-API, cached 1h)
- GET /meta/countries (proxied REST Countries, cached 24h)

## Conventions
- All list endpoints return `pagination`.
- Slugs used in product/category URLs; Mongo `_id` used elsewhere.
- Money stored in smallest unit-agnostic decimal (USD base), converted client-side via currency rate.
- Error codes: 400 validation, 401 unauth, 403 forbidden, 404 not found, 409 conflict, 429 rate-limited, 500 server.
