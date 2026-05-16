# E-commerce Data Architecture

## Model Decisions

`Product` is a catalog template. It owns the title, slug, description, brand/category placement, visibility flags, product images, tags, and denormalized review totals. It does not own price, SKU, stock, color, or size.

`ProductVariant` is the sellable unit. It owns SKU, barcode, price, compare-at price, cost, weight, active status, variant images, and inventory tracking. A product can have one default variant or unlimited option-driven variants.

`ProductOption`, `ProductOptionValue`, and `VariantOptionSelection` replace hardcoded color/size relationships. A merchant can define Color, Size, Material, Storage, RAM, Edition, or any future option without schema changes.

`VariantInventory` keeps current stock state per variant. `availableQuantity` is calculated in application code as `stockQuantity - reservedQuantity`. `InventoryTransaction` is the audit log for every stock or reservation change.

`OrderItem` references `ProductVariant` and stores immutable snapshots for product title, variant title, SKU, selected options, image, unit price, and totals. Historical orders stay readable even after catalog edits.

`Review` supports moderation, verified purchase flags, helpful counts, images, admin replies, and one review per user per product. `Product.averageRating` and `Product.reviewsCount` are denormalized read optimizations.

## Migration Strategy

1. Add the new schema and generate Prisma Client.
2. For each old product, create a `Product` using the old name as `title` and a generated slug.
3. Convert old product images into `ProductImage`.
4. Create `ProductOption` rows for existing Color and Size only when values exist.
5. Create one `ProductVariant` per old product using the old price, generated SKU, and a title such as `Red / Small` or `Default`.
6. Create `VariantOptionSelection` rows that connect the new variant to its option values.
7. Create `VariantInventory` with current stock defaults, then create an initial `InventoryTransaction`.
8. Convert old order items from `productId` to the matching `variantId` and backfill snapshot fields.
9. Recalculate `subtotal`, `taxAmount`, `shippingFee`, and `total` for old orders.
10. Deploy reads first, verify parity, then remove any legacy color/size UI once the new option builder is complete.

## Inventory Workflow

On checkout start, validate the requested variants, check `stockQuantity - reservedQuantity`, then increment `reservedQuantity` and write a `RESERVATION` transaction. On successful payment, decrement `stockQuantity`, release the reserved quantity, and write a `SALE` transaction. If checkout expires or is cancelled, decrement `reservedQuantity` and write `RESERVATION_RELEASE` or `CANCELLATION`.

Backorders bypass available-stock blocking only when `allowBackorders` is true. Warehouse expansion can be added by replacing the one-to-one `VariantInventory` with inventory rows keyed by `variantId + locationId` while keeping the transaction log pattern.

## Variant Creation Workflow

1. Create product template fields.
2. Add option groups such as Color, Size, Material.
3. Add option values under each group.
4. Generate combinations or let the admin create selected combinations.
5. For each variant, assign SKU, price, optional barcode, images, and inventory policy.
6. Store `VariantOptionSelection` rows for each selected option value.
7. Create `VariantInventory` and log the initial stock transaction.

## Suggested API Structure

- `server/api/admin/products`: product template CRUD.
- `server/api/admin/products/[productId]/options`: option and value management.
- `server/api/admin/products/[productId]/variants`: variant CRUD and bulk generation.
- `server/api/admin/variants/[variantId]/inventory`: inventory adjustment endpoint.
- `server/api/products`: public catalog reads.
- `server/api/products/[slug]`: public product detail with variants/options.
- `server/api/checkout`: reservation and payment-session creation.
- `server/api/webhook`: payment confirmation, reservation release, and sale finalization.
- `server/api/reviews`: review creation, moderation, and helpful votes.

## Suggested Module Layout

- `server/services/catalog`: product, option, and variant orchestration.
- `server/services/inventory`: availability checks, reservations, adjustments, transaction logging.
- `server/services/orders`: order totals, snapshots, status transitions.
- `server/services/reviews`: review moderation and aggregate recalculation.
- `server/repositories`: Prisma read/write helpers for complex queries.
- `app/components/admin/product`: product template UI.
- `app/components/admin/variant`: option builder, variant matrix, inventory controls.

## Prisma + MongoDB Best Practices

- Use `String @id @default(auto()) @map("_id") @db.ObjectId` for Mongo document ids.
- Keep relations explicit and index relation scalar fields.
- Use denormalized fields only for read performance or immutable history.
- Keep money calculations centralized and avoid deriving order totals from mutable product data.
- Use application-level computed fields for available stock.
- Prefer small service functions around multi-step writes because MongoDB and Prisma do not behave like relational migrations.
- Run `prisma db push` and a scripted backfill for MongoDB instead of expecting SQL-style migrations.

## Future Scalability

- Add `InventoryLocation` and per-location stock when warehouses are needed.
- Add `PriceList` or `MarketPrice` for currencies, regions, B2B pricing, and sales.
- Add `ProductCollection` for merchandising.
- Add `Promotion`, `Coupon`, and `DiscountAllocation` for reliable discount history.
- Add search indexing using MongoDB Atlas Search, Meilisearch, or Elasticsearch.
- Add outbox/events for inventory, order, and review analytics.

## Common Pitfalls

- Do not store stock or SKU on `Product`.
- Do not delete variants that are referenced by orders; deactivate them instead.
- Do not calculate paid order totals from current variant prices.
- Do not trust client-side stock checks.
- Do not update inventory without writing an `InventoryTransaction`.
- Do not hardcode Color and Size into product relations; treat them as option names.
