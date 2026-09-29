# Receive and payment method expansion

## Goal
Let a dashboard user create a payment request in their selected main currency, then let the payer choose Mobile Money or Bank Transfer on the public payment page. Card will be shown but clearly unavailable until Fincra is connected.

## Changes

### Receive page
- Add **Bank Transfer** and **Card** alongside QR Code, Payment Link, and Mobile Money.
- Bank Transfer will load only Relworx products in the `BANK_TRANSFERS` category.
- Reuse the real Relworx sequence: select bank product, enter the API-required fields, validate, review, then purchase using the `validation_reference`.
- Card will display a polished unavailable state instead of collecting card details or pretending to process a payment.
- Keep the rounded gradient QR frame and moving scan line.

### Generated payment links and QR codes
- Include the dashboard user’s saved main currency code in the generated payment data.
- Use one shared payment-link generator so the link button and QR code always encode the same amount, description, request ID, and currency.
- Preserve compatibility with older links that do not contain currency by defaulting them to UGX.

### Public payment page
- Display the exact currency embedded by the payment creator, including when the payer is not logged in.
- Add a payment-method selector for **Mobile Money**, **Bank Transfer**, and **Card**.
- Mobile Money will continue using the real deposit endpoint and status polling.
- Bank Transfer will use the real Relworx `BANK_TRANSFERS` product, validation, and purchase flow.
- Card will remain selectable only to explain that it is temporarily unavailable; no sensitive card fields will be shown.
- Show clear processing, success, failure, and retry states for each live method.

## Technical details
- Create shared typed helpers for payment-link encoding/decoding and Relworx bank-product requests instead of duplicating logic across pages.
- Validate decoded payment-link fields before displaying or submitting them.
- Treat Relworx amounts as UGX at the backend boundary while preserving the creator’s selected currency in the request presentation; do not silently claim currency conversion.
- Keep all styling within the existing liquid-glass design tokens and existing controls.

## Verification
- Test a generated payment link and QR from a non-UGX dashboard currency and confirm the public page retains it.
- Test the Mobile Money request through processing/polling states without submitting an unintended real payment.
- Verify only `BANK_TRANSFERS` products appear in both Receive and public payment views.
- Verify Card is visibly unavailable and cannot submit.
- Check desktop and mobile layouts, runtime errors, and the final build.
