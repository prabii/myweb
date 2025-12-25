# Razorpay Payment Integration Setup

## Quick Setup

1. **Get Your Razorpay Key ID**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Go to Settings → API Keys
   - Copy your **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)

2. **Configure the Key ID**
   - Open `src/utils/razorpay.js`
   - Replace `YOUR_RAZORPAY_KEY_ID` with your actual Key ID:
   ```javascript
   export const RAZORPAY_KEY_ID = 'rzp_test_your_key_id_here'
   ```

## Test Mode vs Live Mode

- **Test Mode**: Use `rzp_test_` keys for testing. Use test card numbers from Razorpay docs.
- **Live Mode**: Use `rzp_live_` keys for production. Requires account verification.

## Test Card Numbers (Test Mode Only)

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Production Setup (Recommended)

For production, you need a backend server to:
1. Create orders securely (using Secret Key)
2. Verify payment signatures
3. Handle webhooks

### Backend API Endpoints Needed:

1. **Create Order** (`POST /api/create-order`)
   ```javascript
   // Backend should create order using Razorpay SDK
   // Return order_id to frontend
   ```

2. **Verify Payment** (`POST /api/verify-payment`)
   ```javascript
   // Verify payment signature
   // Update order status in database
   ```

## Current Implementation

The current implementation works for testing but uses frontend-only order creation. For production:

1. Create a backend API endpoint to create Razorpay orders
2. Update `src/utils/razorpay.js` to call your backend API
3. Add payment verification on your backend

## Cash on Delivery (COD)

COD is fully functional and doesn't require any external setup. Orders are saved to localStorage and can be processed manually.

## Security Notes

- Never expose your Razorpay Secret Key in frontend code
- Always verify payment signatures on your backend
- Use HTTPS in production
- Implement proper error handling and logging

## Support

For Razorpay integration help, visit:
- [Razorpay Docs](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

