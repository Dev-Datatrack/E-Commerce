# RuralArtifacts E-Store (Enhanced Frontend Prototype)

A polished frontend prototype for the Rural Artifacts e-commerce portal specification.

## Included modules
- Premium storefront UI with responsive grid/list browsing
- Category chips + search/category/price/sort filters
- Product detail dialog with multi-image gallery and zoom-on-hover behavior
- LocalStorage-based cart drawer with totals
- **User onboarding with role separation**:
  - Shopper mode: browse items and use cart
  - Admin mode: authenticate with passcode to update catalogue
- Admin product studio with CRUD, featured/new tags, stock status, artisan info
- Multiple image upload with client-side compression and preview
- Embedded Google Maps location, contact details, and directions link

## Admin access (prototype)
- Passcode: `rural@admin`

## Run locally
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173`.
