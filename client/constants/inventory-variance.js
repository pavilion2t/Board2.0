const TYPE = {
  OPENING:          1,
  ACTUAL_QTY_ADJ:   2,
  VARIANCE_QTY_ADJ: 3,
  COST_ADJ:         4,
};

const TYPE_LABEL = {
  [TYPE.OPENING]:          'Opening',
  [TYPE.ACTUAL_QTY_ADJ]:   'Adjustment by Actual Qty',
  [TYPE.VARIANCE_QTY_ADJ]: 'Adjustment by Variance Qty',
  [TYPE.COST_ADJ]:         'Cost Adjustment',
};

const MODE = {
  VIEW: 'view',
  EDIT: 'edit',
  NEW:  'new',
};

const TAB = {
  OVERVIEW: 'overview',
};

const STATUS = {
  OPENED:               'opened',
  SUBMITTING:           'submitting',
  PENDING_FOR_APPROVAL: 'pending_for_approval',
  PROCESSING:           'PROCESSING',
  COMPLETED:            'completed',
  VOID:                 'voided',
};

const INVENTORY_VARIANCE = {
  TYPE,
  TYPE_LABEL,
  MODE,
  TAB,
  STATUS,
};

export default INVENTORY_VARIANCE;
