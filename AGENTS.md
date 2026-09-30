# Project Architecture

- Keep payment-provider artwork as dedicated imported assets in the landing-page feature data so new providers can be added without changing card layout.
- Render LIVRA branding through the shared image-logo component so every brand placement stays visually consistent.
- Keep payment-link serialization and Relworx bank-transfer requests in shared modules so Receive and public payment flows remain consistent.
- Keep payroll and payment-history exports browser-printable so staff can print them or save standard PDFs without an external document service.