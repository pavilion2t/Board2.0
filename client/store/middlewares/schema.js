import { Schema, arrayOf } from 'normalizr';

const ListingSchema = new Schema('listings');

const PrivateListingSchema = new Schema('privateListings', {idAttribute: 'listing_id'});

const SupplierSchema = new Schema('suppliers');

const DepartmentSchema = new Schema('departments');

const TaxOptionSchema = new Schema('taxOptions');

const InvoiceSchema = new Schema('invoices');

const OrderCorrespondenceSchema = new Schema('orderCorrespondences');

const DeliveryOrderSchema = new Schema('deliveryOrders');

const DeliveryOrderLogsSchema = new Schema('deliveryOrderHistories');

const PaymentSchema = new Schema('payment_instruments');

const UnitSchema = new Schema('units');

const UnitGroupSchema = new Schema('unitGroups');

const inventoryVarianceSchema = new Schema('inventoryVariance');

inventoryVarianceSchema.define({
    items: arrayOf(PrivateListingSchema),
});

UnitGroupSchema.define({
    units: arrayOf(UnitSchema),
});

export {
    ListingSchema,
    SupplierSchema,
    DepartmentSchema,
    TaxOptionSchema,
    InvoiceSchema,
    OrderCorrespondenceSchema,
    DeliveryOrderSchema,
    DeliveryOrderLogsSchema,
    PaymentSchema,
    UnitSchema,
    UnitGroupSchema,
    inventoryVarianceSchema,
    PrivateListingSchema
};
