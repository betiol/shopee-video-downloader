# Setup Instructions for Payment & Auth

## 1. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# Firebase Client (Get these from Firebase Console -> Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Get these from Firebase Console -> Project Settings -> Service Accounts -> Generate New Private Key)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Stripe (Get these from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (Get this after setting up the webhook)
STRIPE_PRICE_ID=price_... (Create a product "Unlimited Plan" for R$20 and get the Price ID)
```

## 2. Firebase Setup
1. Go to Firebase Console.
2. Enable **Authentication** and set up **Google Sign-In**.
3. Enable **Realtime Database**.
   - Set Rules to:
     ```json
     {
       "rules": {
         "users": {
           "$uid": {
             ".read": "$uid === auth.uid",
             ".write": false // Only admin can write (via API)
           }
         }
       }
     }
     ```

## 3. Stripe Setup
1. Create a Product in Stripe named "Unlimited Plan" with a price of R$20.
   - **Crucial:** After creating the product, scroll down to the **Pricing** section.
   - Look for the **API ID** next to the price. It starts with `price_` (e.g., `price_1Pxyz...`).
   - **Do NOT use the Product ID** (which starts with `prod_`).
   - Copy the `price_...` ID to `STRIPE_PRICE_ID` in `.env.local`.
2. Install the Stripe CLI to test webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` secret to `.env.local`.
3. In Production, add the webhook endpoint `https://your-domain.com/api/stripe/webhook` in Stripe Dashboard.

## 4. Deploy
Deploy your app and ensure environment variables are set in Vercel/Netlify.
