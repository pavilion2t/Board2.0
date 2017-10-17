export const DEFAULT_STATE = {
  deliveryOrder:     'created',
  order:             'created',
  inventoryVariance: 'new',
};

export const deliveryOrderLabel = (status) => {
  return {
    created: 'Created',
    pending: 'Pending',
    sent: 'Delivered',
    partially_sent: 'Partially Delivered',
    canceled: 'Cancelled',
  }[status];
};

export const orderColor = (state) => {
  const colorMap = {
    'created': '#ffc91e',
    'approved': '#8cd678',
    'fulfilled': '#49bbeb',
    'canceled': '#aaaaaa',
    'fulfilling': '#ff7700'
  };
  return colorMap[state];
};

export const orderLabel = (state) => {
  const labelMap = {
    'created': 'Created',
    'approved': 'Approved',
    'fulfilled': 'Finished',
    'canceled': 'Cancalled',
    'fulfilling': 'Processing'
  };
  return labelMap[state];
};

export const inventoryVarianceLabel = (state) => {
  const labelMap = {
    submitting:           'Submitting',
    pending_for_approval: 'Pending For Approval',
    processing:           'Processing',
    opened:               'Open',
    completed:            'Completed',
    voided:               'Voided',
    new:                  'New',
  };
  return labelMap[state] || labelMap[DEFAULT_STATE.inventoryVariance];
};

export const inventoryVarianceColor = (state) => {
  const colorMap = {
    submitting:           '#ca5ce0',
    pending_for_approval: '#ff7d09',
    processing:           '#3cd5e8',
    opened:               '#ffc91e',
    completed:            '#8cd678',
    voided:               '#d0d0d0',
    new:                  '',
  };
  return colorMap[state] || colorMap[DEFAULT_STATE.inventoryVariance];
};
