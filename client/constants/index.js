export { default as ROUTE } from './routes';
export { default as INVENTORY_VARIANCE } from './inventory-variance';
export { default as PROMO_CODE } from './promo-code.js';

export const DECIMAL_POINTS_ZERO_DP = 0;
export const DECIMAL_POINTS_ONE_DP = 1;
export const DECIMAL_POINTS_TWO_DP = 2;

export const ROUNDING_TYPE_NORMAL = 0;
export const ROUNDING_TYPE_ROUND_DOWN = 2;
export const ROUNDING_TYPE_ROUND_UP = 1;
export const ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE = 3;

export const QUANTITY_ALLOW_DECIMAL_NO = 0;
export const QUANTITY_ALLOW_DECIMAL_ALLOW_PARTIALLY = 1;
export const QUANTITY_ALLOW_DECIMAL_ALLOW_ALL = 2;

export const QUANTITY_DECIMAL_POINTS_ZERO_DP = 0;
export const QUANTITY_DECIMAL_POINTS_ONE_DP = 1;
export const QUANTITY_DECIMAL_POINTS_TWO_DP = 2;
export const QUANTITY_DECIMAL_POINTS_THREE_DP = 3;
export const QUANTITY_DECIMAL_POINTS_FOUR_DP = 4;

export const PURCHASABLE_TYPE_LISTING = "Listing";
export const PURCHASABLE_TYPE_VOUCHER_DISCOUNT = "VoucherDiscount";
export const PURCHASABLE_TYPE_TAX = "Tax";
export const PURCHASABLE_TYPE_DELIVERY = "Delivery";
export const PURCHASABLE_TYPE_CHARGE = "Charge";
export const PURCHASABLE_TYPE_STORE_CREDIT = "StoreCredit";
export const PURCHASABLE_TYPE_LOYALTY_REDEEM = "LoyaltyRedeem";
export const PURCHASABLE_TYPE_GIFT_CARD = "GiftCard";
export const PURCHASABLE_TYPE_OCTOPUS = "OctopusValue";
export const PURCHASABLE_TYPE_SERVICE_FEE = "ServiceFee";
export const PURCHASABLE_TYPE_TIPS = "Tips";
export const PURCHASABLE_TYPE_ROUNDING = "Rounding";
export const PURCHASABLE_TYPE_DEPOSIT = "Deposit";
export const PURCHASABLE_TYPE_DEPOSIT_REDEEM = "DepositRedeem";
export const PURCHASABLE_TYPE_DEPOSIT_FORFEIT = "DepositForfeit";

export const PAYMENT_METHOD_CASH         = 1;
export const PAYMENT_METHOD_CHECK        = 2;
export const PAYMENT_METHOD_OCTOPUS      = 3;
export const PAYMENT_METHOD_CP           = 4;
export const PAYMENT_METHOD_CNP          = 8;

export const PAYMENT_METHOD_STORE_CREDIT = 16;
