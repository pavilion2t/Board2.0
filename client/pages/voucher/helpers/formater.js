import { EXPIRATION_TYPE, REVENUE } from '../components/overviewForm';

const perDaySecons = 86400;

function formatVoucher(voucher) {
  const REVENUE_RECOGNITION = {
    [REVENUE.REDEMPTION]: "REDEMPTION",
    [REVENUE.SALES]: "SALES",
  };


  switch (voucher.expiration_setting.type) {
    case EXPIRATION_TYPE.DATE: {
      voucher.expiration_setting_text = 'Expire on ' + voucher.expiration_setting.value;

      break;
    }

    case EXPIRATION_TYPE.DURATION: {
      voucher.expiration_setting_text = 'Expire on ' + parseInt(voucher.expiration_setting.value) / perDaySecons + ' days after activation';

      break;
    }

    case EXPIRATION_TYPE.NEVER: {
      voucher.expiration_setting_text = 'Never Expires';

      break;
    }
  }
  voucher.revenue_recognition_text = REVENUE_RECOGNITION[voucher.revenue_recognition];

  return voucher;
}

function formatUpdateVoucher(voucherData, store_id) {
  let expiration_setting = {
    "type": voucherData.expiration_type
  };

  if (voucherData.expiration_type === "date") {
    expiration_setting.value = voucherData.expiration_date;

  } else if (voucherData.expiration_type === "duration") {
    expiration_setting.value = String(Number(voucherData.expiration_duration) * perDaySecons);
  }

  let date_ranges = voucherData.date_ranges.slice();
  date_ranges.forEach(range => {
    range.exclude = true;
  });

  let voucher = {
    "store_id": store_id,
    "name": voucherData.name,
    "notes": voucherData.notes,
    "price": voucherData.price,
    "amount": voucherData.amount,
    "revenue_recognition": voucherData.revenue_recognition,
    "expiration_setting": expiration_setting,
    "date_ranges": date_ranges
  };

  return voucher;
}

export { formatVoucher, formatUpdateVoucher };
