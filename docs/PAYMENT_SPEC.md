# Dummy Payment Gateway Spec

No real payment processor is used. This simulates realistic UX flows only.

## Supported methods
`card_credit`, `card_debit`, `upi`, `netbanking`, `wallet`, `cod`

## Flow
1. Client calls `POST /payments/initiate` with `{ orderId, method, details }`
   - card: `{ cardNumber, expiry, cvv, name }` (Luhn-checked client + server, never persisted raw — store only last4 + brand)
   - upi: `{ vpa }` (must match `^[\w.\-]{2,}@[a-zA-Z]{2,}$`)
   - netbanking: `{ bankCode }`
   - wallet: `{ walletProvider }`
   - cod: no details
2. Server creates a `Payment` doc, status `pending`, returns `{ paymentId, requiresOtp: true|false }`.
   - card/netbanking/wallet → `requiresOtp: true` (simulated 2FA, OTP is always `123456` in dev, shown on screen for demo)
   - upi → auto-approves after a 2s simulated delay (no OTP)
   - cod → auto-`success`, no charge
3. Client calls `POST /payments/verify { paymentId, otp }`.
   - Correct OTP (`123456`) or upi/cod → status `success`, order status → `confirmed`
   - Wrong OTP → status `failed`, one retry allowed, then order stays `payment_failed`
   - A deterministic 5% random-looking failure is NOT simulated by default (kept deterministic for demo reliability); an optional `?simulateFailure=true` query flag on initiate forces a `failed` result for QA/demo purposes.
4. On success: generate invoice (HTML → downloadable), fire "email simulation" (writes to `EmailLog` collection + logs to console, no real SMTP), emit order-confirmed toast trigger consumed by frontend polling/websocket-free refetch.

## Security notes
- Card numbers: only last4 + brand stored; full PAN never persisted or logged.
- CVV never stored.
- This is NOT PCI-DSS compliant and must never be used for real transactions — dummy/demo only.
