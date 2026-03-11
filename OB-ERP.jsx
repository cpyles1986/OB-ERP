import { useState, useCallback, useEffect, createContext, useContext } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────────
const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

// ── Data ───────────────────────────────────────────────────────────────────────
const initialSuppliers = [
  { id: 'sup-zinc',   name: 'Zinc Supplier',              shortName: 'Zinc',       address: '123 Metal Ave',  city: 'Shenzhen',  country: 'China',  email: 'sales@zincsupplier.cn',   phone: '+86-755-1234', preferredPaymentMethod: 'Wire Transfer', paymentTerms: 'Net-30' },
  { id: 'sup-alum',   name: 'Aluminum Handle Supplier',   shortName: 'Alum Handle',address: '456 Forge Rd',   city: 'Dongguan',  country: 'China',  email: 'orders@alumhandle.cn',    phone: '+86-769-5678', preferredPaymentMethod: 'Wire Transfer', paymentTerms: '50% deposit, balance Net-30' },
  { id: 'sup-anod',   name: 'Anodizer',                   shortName: 'Anodizer',   address: '789 Finish Blvd',city: 'Dongguan',  country: 'China',  email: 'info@anodizer.cn',        phone: '+86-769-9012', preferredPaymentMethod: 'Wire Transfer', paymentTerms: 'Net-30' },
  { id: 'sup-spring', name: 'Spring Supplier',            shortName: 'Spring',     address: '321 Coil St',    city: 'Taichung',  country: 'Taiwan', email: 'springs@springco.tw',     phone: '+886-4-2345',  preferredPaymentMethod: 'Wire Transfer', paymentTerms: 'Net-60' },
  { id: 'sup-dowel',  name: 'Dowel Pin Supplier',         shortName: 'Dowel Pin',  address: '654 Pin Lane',   city: 'Taichung',  country: 'Taiwan', email: 'sales@dowelpin.tw',       phone: '+886-4-6789',  preferredPaymentMethod: 'Wire Transfer', paymentTerms: 'Net-60' },
  { id: 'sup-pkg',    name: 'Packaging Supplier',         shortName: 'Packaging',  address: '987 Box Way',    city: 'Shenzhen',  country: 'China',  email: 'packaging@pkgsupplier.cn',phone: '+86-755-3456', preferredPaymentMethod: 'Wire Transfer', paymentTerms: 'Net-30' },
];

const initialParts = [
  { id: 'part1', name: 'Zinc Razor Head',                    sku: 'ZINC-HEAD-01',  unitCost: 2.00, freightCost: 0.15, supplierId: 'sup-zinc',   type: 'component' },
  { id: 'part2', name: 'Forged CNC Aluminum Handle (raw)',   sku: 'ALUM-HDL-RAW',  unitCost: 3.00, freightCost: 0.25, supplierId: 'sup-alum',   type: 'component', notes: 'Not yet anodized' },
  { id: 'part3', name: 'Anodized Logo-Etched Handle (Black)',sku: 'ALUM-HDL-BLK',  unitCost: 1.00, freightCost: 0.10, supplierId: 'sup-anod',   type: 'component', notes: 'Converted from part2, paid at FG order' },
  { id: 'part4', name: 'Spring',                             sku: 'SPRING-01',     unitCost: 0.05, freightCost: 0.01, supplierId: 'sup-spring', type: 'component' },
  { id: 'part5', name: 'Dowel Pin',                          sku: 'DOWEL-01',      unitCost: 0.02, freightCost: 0.01, supplierId: 'sup-dowel',  type: 'component' },
  { id: 'pkg1',  name: 'Blank White Box',                    sku: 'PKG-BOX-WHT',   unitCost: 0.50, freightCost: 0.05, supplierId: 'sup-pkg',    type: 'packaging' },
  { id: 'pkg2',  name: 'Printed Box Sleeve (Black)',         sku: 'PKG-SLV-BLK',   unitCost: 0.20, freightCost: 0.03, supplierId: 'sup-pkg',    type: 'packaging' },
  { id: 'pkg3',  name: 'Inserts',                            sku: 'PKG-INS-01',    unitCost: 0.15, freightCost: 0.02, supplierId: 'sup-pkg',    type: 'packaging' },
];

const initialFinishedGoods = [{
  id: 'fg-element-b', sku: 'ELEMENT-B_10BLD', name: 'OneBlade Element Razor, Black',
  assemblyCost: 7.00, retailPrice: 49.00,
  bom: [
    { partId: 'part1', qty: 1 }, { partId: 'part3', qty: 1 }, { partId: 'part4', qty: 1 },
    { partId: 'part5', qty: 1 }, { partId: 'pkg1',  qty: 1 }, { partId: 'pkg2',  qty: 1 }, { partId: 'pkg3', qty: 1 },
  ],
}];

const initialInventory = [
  { id: 'inv-1',  partId: 'part1', location: 'Assembly Factory',          qty: 500,  paidFor: true,  dateReceived: '2025-12-01' },
  { id: 'inv-2',  partId: 'part1', location: 'Zinc Supplier',             qty: 1000, paidFor: true,  dateReceived: '2026-01-15' },
  { id: 'inv-3',  partId: 'part2', location: 'Aluminum Handle Supplier',  qty: 800,  paidFor: true,  dateReceived: '2025-11-20' },
  { id: 'inv-4',  partId: 'part2', location: 'Anodizer',                  qty: 300,  paidFor: true,  dateReceived: '2026-01-10' },
  { id: 'inv-5',  partId: 'part3', location: 'Assembly Factory',          qty: 200,  paidFor: true,  dateReceived: '2026-02-01' },
  { id: 'inv-6',  partId: 'part4', location: 'Assembly Factory',          qty: 2000, paidFor: true,  dateReceived: '2025-10-01' },
  { id: 'inv-7',  partId: 'part5', location: 'Assembly Factory',          qty: 2000, paidFor: true,  dateReceived: '2025-10-01' },
  { id: 'inv-8',  partId: 'pkg1',  location: 'Assembly Factory',          qty: 1500, paidFor: true,  dateReceived: '2025-09-15' },
  { id: 'inv-9',  partId: 'pkg2',  location: 'Assembly Factory',          qty: 1000, paidFor: true,  dateReceived: '2025-11-01' },
  { id: 'inv-10', partId: 'pkg3',  location: 'Assembly Factory',          qty: 1500, paidFor: true,  dateReceived: '2025-09-15' },
  { id: 'inv-11', partId: 'part1', location: 'In Transit',                qty: 500,  paidFor: true,  dateReceived: '2026-03-05' },
];

const initialPOs = [
  { id:'po-1', poNumber:'PO-2026-001', supplierId:'sup-zinc',   orderStatus:'submitted', paymentStatus:'paid',         shippingStatus:'delivered', dateOrdered:'2025-11-01', dateReceived:'2025-12-01', items:[{partId:'part1',qty:500, unitCost:2.00}], totalCost:1000,  carrier:'DHL',   trackingNumber:'DHL123456789', shipDate:'2025-11-15', eta:'2025-12-01' },
  { id:'po-2', poNumber:'PO-2026-002', supplierId:'sup-zinc',   orderStatus:'submitted', paymentStatus:'paid',         shippingStatus:'delivered', dateOrdered:'2025-12-15', dateReceived:'2026-01-15', items:[{partId:'part1',qty:1000,unitCost:2.00}], totalCost:2000,  carrier:'FedEx', trackingNumber:'FX987654321',  shipDate:'2025-12-28', eta:'2026-01-15' },
  { id:'po-3', poNumber:'PO-2026-003', supplierId:'sup-zinc',   orderStatus:'submitted', paymentStatus:'deposit-paid', shippingStatus:'shipped',   dateOrdered:'2026-02-20', items:[{partId:'part1',qty:500, unitCost:2.00}], totalCost:1000,  depositAmount:500,  carrier:'DHL',   trackingNumber:'DHL555666777', shipDate:'2026-03-01', eta:'2026-03-15' },
  { id:'po-4', poNumber:'PO-2026-004', supplierId:'sup-alum',   orderStatus:'submitted', paymentStatus:'paid',         shippingStatus:'delivered', dateOrdered:'2025-10-01', dateReceived:'2025-11-20', items:[{partId:'part2',qty:800, unitCost:3.00}], totalCost:2400 },
  { id:'po-5', poNumber:'PO-2026-005', supplierId:'sup-alum',   orderStatus:'submitted', paymentStatus:'deposit-paid', shippingStatus:'unshipped', dateOrdered:'2025-12-01', items:[{partId:'part2',qty:500, unitCost:3.00}], totalCost:1500,  depositAmount:750 },
  { id:'po-6', poNumber:'PO-2026-006', supplierId:'sup-spring', orderStatus:'submitted', paymentStatus:'paid',         shippingStatus:'delivered', dateOrdered:'2025-09-01', dateReceived:'2025-10-01', items:[{partId:'part4',qty:2000,unitCost:0.05}], totalCost:100 },
  { id:'po-7', poNumber:'PO-2026-007', supplierId:'sup-dowel',  orderStatus:'submitted', paymentStatus:'paid',         shippingStatus:'delivered', dateOrdered:'2025-09-01', dateReceived:'2025-10-01', items:[{partId:'part5',qty:2000,unitCost:0.02}], totalCost:40 },
  { id:'po-8', poNumber:'PO-2026-008', supplierId:'sup-pkg',    orderStatus:'submitted', paymentStatus:'paid',         shippingStatus:'delivered', dateOrdered:'2025-08-15', dateReceived:'2025-09-15', items:[{partId:'pkg1',qty:1500,unitCost:0.50},{partId:'pkg3',qty:1500,unitCost:0.15}], totalCost:975 },
  { id:'po-9', poNumber:'PO-2026-009', supplierId:'sup-pkg',    orderStatus:'submitted', paymentStatus:'paid',         shippingStatus:'delivered', dateOrdered:'2025-10-01', dateReceived:'2025-11-01', items:[{partId:'pkg2',qty:1000,unitCost:0.20}], totalCost:200 },
];

const initialFGOs = [
  { id:'fgo-1', orderNumber:'FGO-2026-001', sku:'ELEMENT-B_10BLD', qty:200, unitCost:13.92, status:'received',     dateOrdered:'2026-01-15', dateReceived:'2026-02-15', qtySold:150, salePrice:49.00 },
  { id:'fgo-2', orderNumber:'FGO-2026-002', sku:'ELEMENT-B_10BLD', qty:300, unitCost:13.92, status:'in-production',dateOrdered:'2026-02-20', qtySold:0,   salePrice:49.00 },
  { id:'fgo-3', orderNumber:'FGO-2026-003', sku:'ELEMENT-B_10BLD', qty:500, unitCost:13.92, status:'on-order',     dateOrdered:'2026-03-05', qtySold:0,   salePrice:49.00 },
];

// ── Chart of Accounts ──────────────────────────────────────────────────────────
const initialAccounts = [
  { id:'acct-1010', number:'1010', name:'Cash / Bank',                  type:'asset',     normal:'debit'  },
  { id:'acct-1200', number:'1200', name:'Accounts Receivable',          type:'asset',     normal:'debit'  },
  { id:'acct-1300', number:'1300', name:'Inventory — Components',       type:'asset',     normal:'debit'  },
  { id:'acct-1310', number:'1310', name:'Inventory — Finished Goods',   type:'asset',     normal:'debit'  },
  { id:'acct-1320', number:'1320', name:'Inventory — In Transit',       type:'asset',     normal:'debit'  },
  { id:'acct-1400', number:'1400', name:'Prepaid / Deposits Paid',      type:'asset',     normal:'debit'  },
  { id:'acct-2100', number:'2100', name:'Accounts Payable',             type:'liability', normal:'credit' },
  { id:'acct-3000', number:'3000', name:'Retained Earnings',            type:'equity',    normal:'credit' },
  { id:'acct-4000', number:'4000', name:'Sales Revenue',                type:'revenue',   normal:'credit' },
  { id:'acct-5000', number:'5000', name:'COGS — Components Consumed',   type:'cogs',      normal:'debit'  },
  { id:'acct-5010', number:'5010', name:'COGS — Finished Goods Sold',   type:'cogs',      normal:'debit'  },
];

// Seed journal entries to reflect the existing PO history in initialPOs
// Each fully-paid+delivered PO gets: Inventory DR / Cash CR
// deposit-paid POs get: Prepaid DR / Cash CR for deposit, Inventory DR / AP CR for full amount
const initialJournal = [
  // PO-2026-001: paid in full + delivered → Inventory DR 1000 / Cash CR 1000
  { id:'je-1', date:'2025-11-01', memo:'PO-2026-001 — Zinc Razor Head 500 units', source:'po', sourceId:'po-1', lines:[
    { accountId:'acct-1300', debit:1000,  credit:0    },
    { accountId:'acct-1010', debit:0,     credit:1000 },
  ]},
  // PO-2026-002: paid in full + delivered
  { id:'je-2', date:'2025-12-15', memo:'PO-2026-002 — Zinc Razor Head 1000 units', source:'po', sourceId:'po-2', lines:[
    { accountId:'acct-1300', debit:2000,  credit:0    },
    { accountId:'acct-1010', debit:0,     credit:2000 },
  ]},
  // PO-2026-003: deposit paid → Prepaid DR / Cash CR; outstanding on AP
  { id:'je-3', date:'2026-02-20', memo:'PO-2026-003 — Deposit paid (50%)', source:'po', sourceId:'po-3', lines:[
    { accountId:'acct-1400', debit:500,   credit:0   },
    { accountId:'acct-1010', debit:0,     credit:500 },
  ]},
  { id:'je-4', date:'2026-02-20', memo:'PO-2026-003 — Invoice received, AP recorded', source:'po', sourceId:'po-3', lines:[
    { accountId:'acct-1320', debit:1000,  credit:0    },
    { accountId:'acct-2100', debit:0,     credit:1000 },
  ]},
  // PO-2026-004: paid + delivered
  { id:'je-5', date:'2025-10-01', memo:'PO-2026-004 — Aluminum Handle 800 units', source:'po', sourceId:'po-4', lines:[
    { accountId:'acct-1300', debit:2400,  credit:0    },
    { accountId:'acct-1010', debit:0,     credit:2400 },
  ]},
  // PO-2026-005: deposit paid
  { id:'je-6', date:'2025-12-01', memo:'PO-2026-005 — Deposit paid (50%)', source:'po', sourceId:'po-5', lines:[
    { accountId:'acct-1400', debit:750,   credit:0   },
    { accountId:'acct-1010', debit:0,     credit:750 },
  ]},
  { id:'je-7', date:'2025-12-01', memo:'PO-2026-005 — Invoice received, AP recorded', source:'po', sourceId:'po-5', lines:[
    { accountId:'acct-1300', debit:1500,  credit:0    },
    { accountId:'acct-2100', debit:0,     credit:1500 },
  ]},
  // PO-2026-006,007,008,009: all paid + delivered
  { id:'je-8', date:'2025-09-01', memo:'PO-2026-006 — Springs 2000 units', source:'po', sourceId:'po-6', lines:[
    { accountId:'acct-1300', debit:100, credit:0   },
    { accountId:'acct-1010', debit:0,   credit:100 },
  ]},
  { id:'je-9', date:'2025-09-01', memo:'PO-2026-007 — Dowel Pins 2000 units', source:'po', sourceId:'po-7', lines:[
    { accountId:'acct-1300', debit:40, credit:0  },
    { accountId:'acct-1010', debit:0,  credit:40 },
  ]},
  { id:'je-10', date:'2025-08-15', memo:'PO-2026-008 — Packaging (Box+Inserts)', source:'po', sourceId:'po-8', lines:[
    { accountId:'acct-1300', debit:975, credit:0   },
    { accountId:'acct-1010', debit:0,   credit:975 },
  ]},
  { id:'je-11', date:'2025-10-01', memo:'PO-2026-009 — Box Sleeves 1000 units', source:'po', sourceId:'po-9', lines:[
    { accountId:'acct-1300', debit:200, credit:0   },
    { accountId:'acct-1010', debit:0,   credit:200 },
  ]},
  // FGO-2026-001 received: Inventory FG DR / Components CR (COGS capitalized)
  { id:'je-12', date:'2026-02-15', memo:'FGO-2026-001 — 200 units received into FG inventory', source:'fgo', sourceId:'fgo-1', lines:[
    { accountId:'acct-1310', debit:2784, credit:0    },
    { accountId:'acct-1300', debit:0,    credit:2784 },
  ]},
  // FGO-2026-001: 150 units sold (sales summary)
  { id:'je-13', date:'2026-02-28', memo:'Sales Summary Feb 2026 — 150 units ELEMENT-B_10BLD', source:'sales', sourceId:'sales-feb-2026', lines:[
    { accountId:'acct-1010', debit:7350, credit:0    },
    { accountId:'acct-4000', debit:0,    credit:7350 },
    { accountId:'acct-5010', debit:2088, credit:0    },
    { accountId:'acct-1310', debit:0,    credit:2088 },
  ]},
];


// ── Persistence ────────────────────────────────────────────────────────────────
const STORE_KEY = 'oneblade_erp_v2';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveStore(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}

// ── Context ────────────────────────────────────────────────────────────────────
const DataContext = createContext(null);

// ID counter — seed from stored max id so we never collide after reload
let _id = 200;
function seedIdCounter(allRecords) {
  const nums = allRecords
    .map(r => parseInt((r.id || '').split('-').pop()))
    .filter(n => !isNaN(n));
  if (nums.length) _id = Math.max(_id, ...nums);
}
const nid = (p) => `${p}-${++_id}`;

function DataProvider({ children }) {
  const saved = loadStore();

  const [suppliers, setSuppliers]        = useState(saved?.suppliers         || initialSuppliers);
  const [parts, setParts]                = useState(saved?.parts              || initialParts);
  const [finishedGoods, setFGs]          = useState(saved?.finishedGoods      || initialFinishedGoods);
  const [inventoryRecords, setInventory] = useState(saved?.inventoryRecords   || initialInventory);
  const [purchaseOrders, setPOs]         = useState(saved?.purchaseOrders     || initialPOs);
  const [finishedGoodOrders, setFGOs]    = useState(saved?.finishedGoodOrders || initialFGOs);
  const [accounts, setAccounts]          = useState(saved?.accounts           || initialAccounts);
  const [journal, setJournal]            = useState(saved?.journal            || initialJournal);

  // Seed the ID counter from whatever is in storage
  useEffect(() => {
    seedIdCounter([...suppliers, ...parts, ...finishedGoods, ...inventoryRecords, ...purchaseOrders, ...finishedGoodOrders, ...journal]);
  }, []); // eslint-disable-line

  // Persist on every change
  useEffect(() => {
    saveStore({ suppliers, parts, finishedGoods, inventoryRecords, purchaseOrders, finishedGoodOrders, accounts, journal });
  }, [suppliers, parts, finishedGoods, inventoryRecords, purchaseOrders, finishedGoodOrders, accounts, journal]);

  // ── Journal engine ──────────────────────────────────────────────────────────
  const postEntry = useCallback((entry) => {
    setJournal(j => [...j, { ...entry, id: nid('je'), postedAt: new Date().toISOString() }]);
  }, []);

  // Reverse an existing entry (creates equal+opposite lines)
  const reverseEntry = useCallback((jeId) => {
    setJournal(j => {
      const orig = j.find(e => e.id === jeId);
      if (!orig) return j;
      return [...j, {
        id: nid('je'), date: today(), postedAt: new Date().toISOString(),
        memo: `Reversal of ${orig.memo}`, source: 'reversal', sourceId: jeId,
        lines: orig.lines.map(l => ({ accountId: l.accountId, debit: l.credit, credit: l.debit })),
      }];
    });
  }, []);

  const addAccount = useCallback(a => setAccounts(p => [...p, { ...a, id: nid('acct') }]), []);

  // ── Auto-posting: PO payment status changes ─────────────────────────────────
  // Called from updatePurchaseOrder when paymentStatus changes
  const postPOPaymentEntry = useCallback((po, newPaymentStatus, prevPaymentStatus, amount) => {
    const sup = suppliers.find(s => s.id === po.supplierId);
    const supName = sup?.name || po.supplierId;

    if (prevPaymentStatus === 'unpaid' && newPaymentStatus === 'deposit-paid') {
      // Deposit paid: Prepaid DR / Cash CR
      postEntry({ date: today(), memo: `${po.poNumber} — Deposit paid to ${supName}`, source:'po', sourceId: po.id, lines:[
        { accountId:'acct-1400', debit: amount, credit: 0 },
        { accountId:'acct-1010', debit: 0, credit: amount },
      ]});
      // AP for full amount: Inventory DR / AP CR
      postEntry({ date: today(), memo: `${po.poNumber} — Invoice recorded (AP)`, source:'po', sourceId: po.id, lines:[
        { accountId:'acct-1300', debit: po.totalCost, credit: 0 },
        { accountId:'acct-2100', debit: 0, credit: po.totalCost },
      ]});
    } else if (prevPaymentStatus === 'unpaid' && newPaymentStatus === 'paid') {
      // Paid in full from unpaid: Inventory DR / Cash CR
      postEntry({ date: today(), memo: `${po.poNumber} — Paid in full to ${supName}`, source:'po', sourceId: po.id, lines:[
        { accountId:'acct-1300', debit: po.totalCost, credit: 0 },
        { accountId:'acct-1010', debit: 0, credit: po.totalCost },
      ]});
    } else if (prevPaymentStatus === 'deposit-paid' && newPaymentStatus === 'paid') {
      // Balance payment: clear AP + clear Prepaid, pay remainder from Cash
      const deposit = po.depositAmount || 0;
      const balance = po.totalCost - deposit;
      postEntry({ date: today(), memo: `${po.poNumber} — Balance paid to ${supName}`, source:'po', sourceId: po.id, lines:[
        { accountId:'acct-2100', debit: po.totalCost, credit: 0      },  // clear AP
        { accountId:'acct-1400', debit: 0,            credit: deposit },  // clear prepaid
        { accountId:'acct-1010', debit: 0,            credit: balance },  // cash out
      ]});
    }
  }, [suppliers, postEntry]);

  // Auto-posting: shipping received — move In Transit → Inventory Components
  const postPOReceivedEntry = useCallback((po) => {
    const sup = suppliers.find(s => s.id === po.supplierId);
    postEntry({ date: today(), memo: `${po.poNumber} — Shipment received from ${sup?.name}`, source:'po', sourceId: po.id, lines:[
      { accountId:'acct-1300', debit: po.totalCost, credit: 0           },
      { accountId:'acct-1320', debit: 0,            credit: po.totalCost },
    ]});
  }, [suppliers, postEntry]);

  // Auto-posting: FG order received — capitalize into FG Inventory
  const postFGReceivedEntry = useCallback((fgo, fgs) => {
    const fg = fgs.find(f => f.sku === fgo.sku);
    const cost = fgo.qty * fgo.unitCost;
    postEntry({ date: today(), memo: `${fgo.orderNumber} — ${fgo.qty} units ${fg?.name || fgo.sku} received into FG inventory`, source:'fgo', sourceId: fgo.id, lines:[
      { accountId:'acct-1310', debit: cost, credit: 0    },
      { accountId:'acct-1300', debit: 0,    credit: cost },
    ]});
  }, [postEntry]);

  const addSupplier         = useCallback(s  => setSuppliers(p => [...p, { ...s,  id: nid('sup')  }]), []);
  const addPart             = useCallback(pt => setParts(p     => [...p, { ...pt, id: nid('part') }]), []);
  const addFinishedGood     = useCallback(fg => setFGs(p       => [...p, { ...fg, id: nid('fg')   }]), []);
  const addPurchaseOrder    = useCallback(po => setPOs(p       => [...p, { ...po, id: nid('po')   }]), []);

  const updatePurchaseOrder = useCallback((poId, updates) => {
    setPOs(prev => {
      const po = prev.find(p => p.id === poId);
      if (!po) return prev;
      // Auto-post journal entry if payment status changed
      if (updates.paymentStatus && updates.paymentStatus !== po.paymentStatus) {
        postPOPaymentEntry(po, updates.paymentStatus, po.paymentStatus, updates.depositAmount || po.depositAmount || 0);
      }
      // Auto-post if shipping changed to delivered and payment was already tracked via AP
      if (updates.shippingStatus === 'delivered' && po.shippingStatus !== 'delivered' && po.paymentStatus === 'deposit-paid') {
        postPOReceivedEntry({ ...po, ...updates });
      }
      return prev.map(p => p.id === poId ? { ...p, ...updates } : p);
    });
  }, [postPOPaymentEntry, postPOReceivedEntry]);

  const updateFinishedGoodOrder = useCallback((fgoId, updates) => {
    setFGOs(prev => {
      const fgo = prev.find(f => f.id === fgoId);
      if (!fgo) return prev;
      if (updates.status === 'received' && fgo.status !== 'received') {
        postFGReceivedEntry({ ...fgo, ...updates }, finishedGoods);
      }
      return prev.map(f => f.id === fgoId ? { ...f, ...updates } : f);
    });
  }, [postFGReceivedEntry, finishedGoods]);

  const updateBOM           = useCallback((fgId, bom)     => setFGs(p => p.map(fg => fg.id === fgId ? { ...fg, bom } : fg)), []);
  const updateFinishedGood  = useCallback((fgId, updates) => setFGs(p => p.map(fg => fg.id === fgId ? { ...fg, ...updates } : fg)), []);
  const addInventoryRecord    = useCallback(r  => setInventory(p => [...p, { ...r, id: nid('inv') }]), []);
  const updateInventoryRecord = useCallback((id, updates) => setInventory(p => p.map(r => r.id === id ? { ...r, ...updates } : r)), []);
  const deleteInventoryRecord = useCallback(id => setInventory(p => p.filter(r => r.id !== id)), []);
  const getPartById      = useCallback(id => parts.find(p => p.id === id), [parts]);
  const getSupplierById  = useCallback(id => suppliers.find(s => s.id === id), [suppliers]);

  // Manual sales summary entry
  const postSalesSummary = useCallback(({ date, memo, revenue, cogs, units }) => {
    postEntry({ date, memo, source: 'sales', sourceId: nid('sales'), lines: [
      { accountId: 'acct-1010', debit: revenue, credit: 0      },
      { accountId: 'acct-4000', debit: 0,       credit: revenue },
      { accountId: 'acct-5010', debit: cogs,    credit: 0      },
      { accountId: 'acct-1310', debit: 0,       credit: cogs   },
    ]});
  }, [postEntry]);

  // Dev helper — reset to seed data (accessible from console: window.__resetERP())
  useEffect(() => {
    window.__resetERP = () => {
      localStorage.removeItem(STORE_KEY);
      window.location.reload();
    };
  }, []);

  return (
    <DataContext.Provider value={{
      suppliers, parts, finishedGoods, inventoryRecords, purchaseOrders, finishedGoodOrders,
      addSupplier, addPart, addFinishedGood, addPurchaseOrder, updatePurchaseOrder,
      updateBOM, updateFinishedGood, updateFinishedGoodOrder, getPartById, getSupplierById,
      addInventoryRecord, updateInventoryRecord, deleteInventoryRecord,
      accounts, journal, addAccount, postEntry, reverseEntry, postSalesSummary,
    }}>
      {children}
    </DataContext.Provider>
  );
}
const useData = () => useContext(DataContext);

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
const today = () => new Date().toISOString().split('T')[0];

// ── Design tokens ──────────────────────────────────────────────────────────────
const css = `
  @import url('${FONT_LINK}');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: hsl(220,20%,97%); color: hsl(220,25%,10%); }
  .mono { font-family: 'JetBrains Mono', monospace; }
  button { cursor: pointer; font-family: inherit; }
  input, select, textarea { font-family: inherit; }
  table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; }
`;

// Status badge colors
const orderStatusCls  = { draft:'badge-muted', submitted:'badge-primary' };
const paymentCls      = { unpaid:'badge-red', 'deposit-paid':'badge-yellow', paid:'badge-green' };
const shippingCls     = { unshipped:'badge-muted', shipped:'badge-yellow', delivered:'badge-green' };
const fgStatusCls     = { 'on-order':'badge-yellow', 'in-production':'badge-primary', shipped:'badge-green', received:'badge-green', sold:'badge-muted' };

const badgeStyle = {
  'badge-primary': { background:'hsl(220,70%,93%)', color:'hsl(220,70%,40%)', border:'1px solid hsl(220,70%,80%)' },
  'badge-green':   { background:'hsl(160,50%,90%)', color:'hsl(160,60%,30%)', border:'1px solid hsl(160,50%,70%)' },
  'badge-yellow':  { background:'hsl(38,92%,92%)',  color:'hsl(38,80%,35%)',  border:'1px solid hsl(38,80%,75%)' },
  'badge-red':     { background:'hsl(0,72%,93%)',   color:'hsl(0,72%,40%)',   border:'1px solid hsl(0,72%,75%)' },
  'badge-muted':   { background:'hsl(220,15%,92%)', color:'hsl(220,10%,46%)', border:'1px solid hsl(220,15%,82%)' },
};

// ── UI Atoms ───────────────────────────────────────────────────────────────────
const Badge = ({ cls, children }) => (
  <span style={{ ...badgeStyle[cls]||badgeStyle['badge-muted'], padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600, whiteSpace:'nowrap', display:'inline-block' }}>{children}</span>
);

const Card = ({ children, style: sx }) => (
  <div style={{ background:'white', border:'1px solid hsl(220,15%,90%)', borderRadius:8, ...sx }}>{children}</div>
);

const CardHeader = ({ children }) => <div style={{ padding:'16px 20px 8px' }}>{children}</div>;
const CardTitle  = ({ children, style: sx }) => <div style={{ fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:6, ...sx }}>{children}</div>;
const CardContent = ({ children, style: sx }) => <div style={{ padding:'0 20px 20px', ...sx }}>{children}</div>;

const Btn = ({ children, onClick, variant='default', size='md', disabled, type='button', style: sx }) => {
  const base = { border:'none', borderRadius:6, fontWeight:500, display:'inline-flex', alignItems:'center', gap:4, transition:'opacity .15s', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' };
  const variants = {
    default: { background:'hsl(220,70%,45%)', color:'white', padding: size==='sm' ? '5px 12px' : '8px 16px', fontSize: size==='sm' ? 12 : 14 },
    outline: { background:'white', color:'hsl(220,25%,15%)', border:'1px solid hsl(220,15%,85%)', padding: size==='sm' ? '5px 12px' : '8px 16px', fontSize: size==='sm' ? 12 : 14 },
    ghost:   { background:'transparent', color:'hsl(220,10%,46%)', padding: size==='sm' ? '4px 8px' : '6px 12px', fontSize: size==='sm' ? 12 : 14 },
    destructive: { background:'hsl(0,72%,51%)', color:'white', padding: size==='sm' ? '5px 12px' : '8px 16px', fontSize: size==='sm' ? 12 : 14 },
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant]||variants.default, ...sx }}>{children}</button>;
};

const Input = ({ value, onChange, placeholder, type='text', style: sx, className, min, step, rows, autoFocus }) => {
  const base = { width:'100%', padding:'7px 10px', fontSize:13, border:'1px solid hsl(220,15%,85%)', borderRadius:6, background:'white', outline:'none', fontFamily:'inherit' };
  if (type === 'textarea') return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows||3} style={{ ...base, resize:'vertical', ...sx }} />;
  return <input type={type} value={value||''} onChange={onChange} placeholder={placeholder} min={min} step={step} autoFocus={autoFocus} style={{ ...base, ...(className==='mono'?{fontFamily:'JetBrains Mono, monospace'}:{}), ...sx }} />;
};

const Label = ({ children }) => <div style={{ fontSize:12, fontWeight:500, color:'hsl(220,25%,25%)', marginBottom:4 }}>{children}</div>;
const Field = ({ label, children, style: sx }) => <div style={{ ...sx }}><Label>{label}</Label>{children}</div>;

const Select = ({ value, onChange, children, placeholder }) => (
  <select value={value||''} onChange={e=>onChange(e.target.value)}
    style={{ width:'100%', padding:'7px 10px', fontSize:13, border:'1px solid hsl(220,15%,85%)', borderRadius:6, background:'white', fontFamily:'inherit' }}>
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
);

const Separator = () => <hr style={{ border:'none', borderTop:'1px solid hsl(220,15%,90%)', margin:'12px 0' }} />;

// ── Table helpers ──────────────────────────────────────────────────────────────
const TH = ({ children, right }) => (
  <th style={{ padding:'10px 14px', fontSize:12, fontWeight:500, color:'hsl(220,10%,46%)', borderBottom:'1px solid hsl(220,15%,90%)', textAlign: right ? 'right' : 'left' }}>{children}</th>
);
const TD = ({ children, right, mono, muted, bold }) => (
  <td style={{ padding:'10px 14px', fontSize:13, borderBottom:'1px solid hsl(220,15%,92%)', textAlign: right ? 'right' : 'left', fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', color: muted ? 'hsl(220,10%,56%)' : 'inherit', fontWeight: bold ? 600 : 'normal' }}>{children}</td>
);

// ── Modal ──────────────────────────────────────────────────────────────────────
const Modal = ({ title, open, onClose, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'white', borderRadius:10, width:'100%', maxWidth: wide ? 680 : 540, maxHeight:'88vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid hsl(220,15%,90%)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:16, fontWeight:600 }}>{title}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, color:'hsl(220,10%,56%)', lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
};

// ── StatCard ───────────────────────────────────────────────────────────────────
const variantColor = { default:'hsl(220,25%,10%)', primary:'hsl(220,70%,45%)', success:'hsl(160,60%,35%)', warning:'hsl(38,80%,40%)' };
function StatCard({ title, value, subtitle, icon: Icon, variant='default' }) {
  return (
    <Card>
      <CardContent style={{ padding:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:6 }}>{title}</div>
            <div className="mono" style={{ fontSize:24, fontWeight:700, color: variantColor[variant]||variantColor.default }}>{value}</div>
            {subtitle && <div style={{ fontSize:12, color:'hsl(220,10%,56%)', marginTop:4 }}>{subtitle}</div>}
          </div>
          {Icon && (
            <div style={{ background:'hsl(220,15%,92%)', borderRadius:8, padding:10 }}>
              <Icon size={16} color="hsl(220,10%,56%)" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Icons (inline SVG) ────────────────────────────────────────────────────────
const Icon = ({ d, size=16, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const Icons = {
  Dashboard:  ({ size=16, color }) => <Icon size={size} color={color} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />,
  Package:    ({ size=16, color }) => <Icon size={size} color={color} d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />,
  Clipboard:  ({ size=16, color }) => <Icon size={size} color={color} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
  Layers:     ({ size=16, color }) => <Icon size={size} color={color} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  Truck:      ({ size=16, color }) => <Icon size={size} color={color} d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
  Dollar:     ({ size=16, color }) => <Icon size={size} color={color} d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  Plus:       ({ size=14, color }) => <Icon size={size} color={color} d="M12 5v14M5 12h14" />,
  Trash:      ({ size=14, color }) => <Icon size={size} color={color} d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />,
  Check:      ({ size=14, color }) => <Icon size={size} color={color} d="M20 6L9 17l-5-5" />,
  Ship:       ({ size=14, color }) => <Icon size={size} color={color} d="M2 21c.6.5 1.2 1 2.5 1C7 22 7 20 9.5 20c2.6 0 2.5 2 5 2 2.6 0 2.5-2 5-2M3 3v3l18 12M18.5 3L20 7H9" />,
  Credit:     ({ size=14, color }) => <Icon size={size} color={color} d="M1 4h22v16H1zM1 10h22" />,
  File:       ({ size=14, color }) => <Icon size={size} color={color} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6" />,
  MapPin:     ({ size=14, color }) => <Icon size={size} color={color} d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 100-6 3 3 0 000 6z" />,
  Mail:       ({ size=14, color }) => <Icon size={size} color={color} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />,
  Phone:      ({ size=14, color }) => <Icon size={size} color={color} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.16 1.18C.45.48 1.16 0 1.92 0h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 14.92z" />,
  Shopping:   ({ size=16, color }) => <Icon size={size} color={color} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />,
  Menu:       ({ size=18, color }) => <Icon size={size} color={color} d="M3 12h18M3 6h18M3 18h18" />,
  Users:      ({ size=16, color }) => <Icon size={size} color={color} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
  Search:     ({ size=16, color }) => <Icon size={size} color={color} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />,
};

// ── Toast (simple) ─────────────────────────────────────────────────────────────
let _toast = null;
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  _toast = (msg, type='success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  return (
    <>
      {children}
      <div style={{ position:'fixed', bottom:20, right:20, zIndex:999, display:'flex', flexDirection:'column', gap:8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: t.type==='error' ? '#fee2e2' : '#dcfce7', border:`1px solid ${t.type==='error'?'#fca5a5':'#86efac'}`, color: t.type==='error'?'#991b1b':'#166534', padding:'10px 16px', borderRadius:8, fontSize:13, fontWeight:500, boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
const toast = { success: msg => _toast?.(msg,'success'), error: msg => _toast?.(msg,'error') };

// ── Add Supplier Dialog ────────────────────────────────────────────────────────
function AddSupplierDialog() {
  const { addSupplier } = useData();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({});
  const fld = k => ({ value: f[k]||'', onChange: e => setF(p=>({...p,[k]:e.target.value})) });
  const reset = () => setF({});
  const submit = e => {
    e.preventDefault();
    if (!f.name?.trim()) return;
    addSupplier({ name:f.name.trim(), shortName:f.shortName||f.name.trim(), address:f.address, city:f.city, state:f.state, zip:f.zip, country:f.country, email:f.email, phone:f.phone, preferredPaymentMethod:f.payMethod, paymentTerms:f.payTerms });
    toast.success(`Supplier "${f.name.trim()}" added`);
    reset(); setOpen(false);
  };
  return (
    <>
      <Btn variant="outline" size="sm" onClick={() => setOpen(true)}><Icons.Plus /> Supplier</Btn>
      <Modal title="Add Supplier" open={open} onClose={() => { setOpen(false); reset(); }}>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Supplier Name *"><Input {...fld('name')} placeholder="e.g. Zinc Supplier" autoFocus /></Field>
            <Field label="Short Name"><Input {...fld('shortName')} placeholder="e.g. Zinc" /></Field>
          </div>
          <Field label="Address"><Input {...fld('address')} placeholder="Street address" /></Field>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8 }}>
            <Field label="City"><Input {...fld('city')} /></Field>
            <Field label="State"><Input {...fld('state')} /></Field>
            <Field label="ZIP"><Input {...fld('zip')} /></Field>
            <Field label="Country"><Input {...fld('country')} /></Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Email"><Input type="email" {...fld('email')} placeholder="sales@supplier.com" /></Field>
            <Field label="Phone"><Input {...fld('phone')} placeholder="+1-555-0000" /></Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Payment Method"><Input {...fld('payMethod')} placeholder="e.g. Wire Transfer" /></Field>
            <Field label="Payment Terms"><Input {...fld('payTerms')} placeholder="e.g. Net-30" /></Field>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:4 }}>
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" disabled={!f.name?.trim()}>Add Supplier</Btn>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ── Add Part Dialog ────────────────────────────────────────────────────────────
function AddPartDialog() {
  const { addPart, suppliers } = useData();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ type:'component' });
  const fld = k => ({ value: f[k]||'', onChange: e => setF(p=>({...p,[k]:e.target.value})) });
  const reset = () => setF({ type:'component' });
  const valid = f.name?.trim() && f.sku?.trim() && f.unitCost && f.supplierId;
  const submit = e => {
    e.preventDefault();
    if (!valid) return;
    addPart({ name:f.name.trim(), sku:f.sku.trim(), unitCost:parseFloat(f.unitCost), freightCost:parseFloat(f.freightCost)||0, supplierId:f.supplierId, type:f.type||'component', notes:f.notes||undefined });
    toast.success(`Part "${f.name.trim()}" added`);
    reset(); setOpen(false);
  };
  return (
    <>
      <Btn variant="outline" size="sm" onClick={() => setOpen(true)}><Icons.Plus /> Part</Btn>
      <Modal title="Add Part / Component" open={open} onClose={() => { setOpen(false); reset(); }}>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Part Name"><Input {...fld('name')} placeholder="e.g. Zinc Razor Head" autoFocus /></Field>
            <Field label="SKU / Part No."><Input {...fld('sku')} placeholder="e.g. ZINC-HEAD-01" className="mono" /></Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
            <Field label="Unit Cost ($)"><Input type="number" step="0.01" min="0" {...fld('unitCost')} placeholder="0.00" className="mono" /></Field>
            <Field label="Freight ($)"><Input type="number" step="0.01" min="0" {...fld('freightCost')} placeholder="0.00" className="mono" /></Field>
            <Field label="Supplier">
              <Select value={f.supplierId||''} onChange={v => setF(p=>({...p,supplierId:v}))} placeholder="Select...">
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
              </Select>
            </Field>
            <Field label="Type">
              <Select value={f.type||'component'} onChange={v => setF(p=>({...p,type:v}))}>
                <option value="component">Component</option>
                <option value="packaging">Packaging</option>
              </Select>
            </Field>
          </div>
          <Field label="Notes (optional)"><Input {...fld('notes')} placeholder="Any additional notes..." /></Field>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" disabled={!valid}>Add Part</Btn>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ── Add Finished Good Dialog ───────────────────────────────────────────────────
function AddFinishedGoodDialog() {
  const { addFinishedGood } = useData();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({});
  const fld = k => ({ value: f[k]||'', onChange: e => setF(p=>({...p,[k]:e.target.value})) });
  const reset = () => setF({});
  const valid = f.name?.trim() && f.sku?.trim() && f.assemblyCost && f.retailPrice;
  const submit = e => {
    e.preventDefault();
    if (!valid) return;
    addFinishedGood({ name:f.name.trim(), sku:f.sku.trim(), assemblyCost:parseFloat(f.assemblyCost), retailPrice:parseFloat(f.retailPrice), bom:[] });
    toast.success(`Finished good "${f.sku.trim()}" created — add parts via BOM editor`);
    reset(); setOpen(false);
  };
  return (
    <>
      <Btn variant="outline" size="sm" onClick={() => setOpen(true)}><Icons.Plus /> Finished Good</Btn>
      <Modal title="Add Finished Good SKU" open={open} onClose={() => { setOpen(false); reset(); }}>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Product Name"><Input {...fld('name')} placeholder="e.g. OneBlade Element Razor, Black" autoFocus /></Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <Field label="SKU"><Input {...fld('sku')} placeholder="ELEMENT-B_10BLD" className="mono" /></Field>
            <Field label="Assembly Cost ($)"><Input type="number" step="0.01" min="0" {...fld('assemblyCost')} placeholder="0.00" className="mono" /></Field>
            <Field label="Retail Price ($)"><Input type="number" step="0.01" min="0" {...fld('retailPrice')} placeholder="0.00" className="mono" /></Field>
          </div>
          <p style={{ fontSize:12, color:'hsl(220,10%,56%)' }}>Add BOM parts after creating via the BOM & COGS page.</p>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" disabled={!valid}>Create</Btn>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ── Create PO Dialog ───────────────────────────────────────────────────────────
function CreatePODialog() {
  const { suppliers, parts, addPurchaseOrder, purchaseOrders } = useData();
  const [open, setOpen] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [orderStatus, setOrderStatus]   = useState('draft');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [shippingStatus, setShippingStatus] = useState('unshipped');
  const [items, setItems] = useState([{ partId:'', qty:0, unitCost:0 }]);
  const [notes, setNotes] = useState('');
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [shipDate, setShipDate] = useState('');
  const [eta, setEta] = useState('');
  const [deposit, setDeposit] = useState('');

  const supplierParts = supplierId ? parts.filter(p => p.supplierId === supplierId) : parts;
  const totalCost = items.reduce((s, i) => s + (i.qty||0) * (i.unitCost||0), 0);
  const nextNum = `PO-2026-${String(purchaseOrders.length + 1).padStart(3,'0')}`;

  const addItem = () => setItems(p => [...p, { partId:'', qty:0, unitCost:0 }]);
  const removeItem = idx => setItems(p => p.filter((_,i) => i!==idx));
  const updateItem = (idx, updates) => setItems(p => p.map((item,i) => i===idx ? {...item,...updates} : item));
  const handlePartSelect = (idx, partId) => {
    const part = parts.find(p => p.id === partId);
    updateItem(idx, { partId, unitCost: part?.unitCost || 0 });
  };

  const reset = () => {
    setSupplierId(''); setOrderStatus('draft'); setPaymentStatus('unpaid'); setShippingStatus('unshipped');
    setItems([{ partId:'', qty:0, unitCost:0 }]); setNotes(''); setCarrier(''); setTracking(''); setShipDate(''); setEta(''); setDeposit('');
  };

  const submit = e => {
    e.preventDefault();
    if (!supplierId || items.some(i => !i.partId || i.qty <= 0)) { toast.error('Please fill in supplier and at least one valid line item'); return; }
    addPurchaseOrder({
      poNumber:nextNum, supplierId, items:items.filter(i=>i.partId&&i.qty>0),
      orderStatus, paymentStatus, shippingStatus, dateOrdered:today(), totalCost,
      notes:notes||undefined, carrier:carrier||undefined, trackingNumber:tracking||undefined,
      shipDate:shipDate||undefined, eta:eta||undefined, depositAmount:deposit?parseFloat(deposit):undefined,
    });
    toast.success(`${nextNum} created`);
    reset(); setOpen(false);
  };

  const showShipping = shippingStatus==='shipped'||shippingStatus==='delivered';

  return (
    <>
      <Btn size="sm" onClick={() => setOpen(true)}><Icons.Plus /> New PO</Btn>
      <Modal title={`Create Purchase Order — ${nextNum}`} open={open} onClose={() => { setOpen(false); reset(); }} wide>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Field label="Supplier">
            <Select value={supplierId} onChange={setSupplierId} placeholder="Select supplier">
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <Field label="Order Status">
              <Select value={orderStatus} onChange={setOrderStatus}>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
              </Select>
            </Field>
            <Field label="Payment Status">
              <Select value={paymentStatus} onChange={setPaymentStatus}>
                <option value="unpaid">Unpaid</option>
                <option value="deposit-paid">Deposit Paid</option>
                <option value="paid">Paid</option>
              </Select>
            </Field>
            <Field label="Shipping">
              <Select value={shippingStatus} onChange={setShippingStatus}>
                <option value="unshipped">Unshipped</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </Select>
            </Field>
          </div>

          {paymentStatus==='deposit-paid' && (
            <Field label="Deposit Amount ($)"><Input type="number" step="0.01" min="0" value={deposit} onChange={e=>setDeposit(e.target.value)} placeholder="0.00" /></Field>
          )}

          <div>
            <Label>Line Items</Label>
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display:'grid', gridTemplateColumns:'1fr 80px 100px 36px', gap:6, alignItems:'flex-end' }}>
                  {idx===0 && <div style={{fontSize:11,color:'hsl(220,10%,56%)',marginBottom:2}}>Part</div>}
                  {idx===0 && <div style={{fontSize:11,color:'hsl(220,10%,56%)',marginBottom:2}}>Qty</div>}
                  {idx===0 && <div style={{fontSize:11,color:'hsl(220,10%,56%)',marginBottom:2}}>Unit Cost</div>}
                  {idx===0 && <div/>}
                  <Select value={item.partId} onChange={v => handlePartSelect(idx, v)} placeholder="Select part">
                    {supplierParts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                  </Select>
                  <Input type="number" min="0" value={item.qty||''} onChange={e => updateItem(idx, { qty: parseInt(e.target.value)||0 })} />
                  <Input type="number" step="0.01" min="0" value={item.unitCost||''} onChange={e => updateItem(idx, { unitCost: parseFloat(e.target.value)||0 })} />
                  <Btn variant="ghost" size="sm" onClick={() => removeItem(idx)} disabled={items.length===1}><Icons.Trash /></Btn>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
              <Btn variant="outline" size="sm" onClick={addItem}><Icons.Plus /> Add Line</Btn>
              {totalCost>0 && <span className="mono" style={{ fontSize:13, fontWeight:600 }}>Total: {fmt(totalCost)}</span>}
            </div>
          </div>

          {showShipping && (
            <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:12 }}>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:10 }}>Shipping Info</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <Field label="Carrier"><Input value={carrier} onChange={e=>setCarrier(e.target.value)} placeholder="e.g. DHL" /></Field>
                <Field label="Tracking #"><Input value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. DHL123456" /></Field>
                <Field label="Ship Date"><Input type="date" value={shipDate} onChange={e=>setShipDate(e.target.value)} /></Field>
                <Field label="ETA"><Input type="date" value={eta} onChange={e=>setEta(e.target.value)} /></Field>
              </div>
            </div>
          )}

          <Field label="Notes (optional)">
            <Input type="textarea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any notes for this PO..." rows={2} />
          </Field>

          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit">Create PO</Btn>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ── PO Detail Modal ────────────────────────────────────────────────────────────
// onBack: optional callback — when set, shows a back arrow instead of just closing
function PODetail({ po, open, onClose, onBack }) {
  const { getSupplierById, getPartById } = useData();
  if (!po) return null;
  const supplier = getSupplierById(po.supplierId);

  // Clickable info tile
  const InfoTile = ({ label, value, href, mono }) => (
    <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:12 }}>
      <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:4 }}>{label}</div>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:13, fontWeight:500, color:'hsl(220,70%,45%)', textDecoration:'none', display:'block' }}
            onMouseEnter={e=>e.target.style.textDecoration='underline'}
            onMouseLeave={e=>e.target.style.textDecoration='none'}>
            {value}
          </a>
        : <div style={{ fontSize:13, fontWeight:500, fontFamily: mono ? 'JetBrains Mono,monospace' : 'inherit' }}>{value||'—'}</div>
      }
    </div>
  );

  return (
    <Modal title="" open={open} onClose={onClose} wide>
      <div style={{ fontFamily:'DM Sans, system-ui, sans-serif' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
            {onBack && (
              <button onClick={onBack} style={{
                background:'none', border:'none', cursor:'pointer', padding:'2px 0', marginTop:3,
                color:'hsl(220,10%,56%)', display:'flex', alignItems:'center', gap:4, fontSize:13,
                fontFamily:'inherit', fontWeight:500,
              }}
              onMouseEnter={e=>e.currentTarget.style.color='hsl(220,25%,10%)'}
              onMouseLeave={e=>e.currentTarget.style.color='hsl(220,10%,56%)'}>
                ← Back
              </button>
            )}
            <div>
              <div style={{ fontSize:20, fontWeight:700, letterSpacing:'-0.5px' }}>PURCHASE ORDER</div>
              <div className="mono" style={{ fontSize:16, fontWeight:600, color:'hsl(220,70%,45%)', marginTop:4 }}>{po.poNumber}</div>
            </div>
          </div>
          <div style={{ textAlign:'right', fontSize:13, color:'hsl(220,10%,56%)' }}>
            <div>Date: <strong style={{ color:'hsl(220,25%,10%)' }}>{po.dateOrdered}</strong></div>
            {po.dateReceived && <div>Received: <strong style={{ color:'hsl(220,25%,10%)' }}>{po.dateReceived}</strong></div>}
          </div>
        </div>

        <Separator />

        {/* Status badges */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          <Badge cls={orderStatusCls[po.orderStatus]}>{po.orderStatus==='submitted'?'Submitted to Supplier':'Draft'}</Badge>
          <Badge cls={paymentCls[po.paymentStatus]}>{{ unpaid:'Unpaid','deposit-paid':'Deposit Paid',paid:'Paid in Full' }[po.paymentStatus]}</Badge>
          <Badge cls={shippingCls[po.shippingStatus]}>{{ unshipped:'Unshipped',shipped:'Shipped',delivered:'Delivered' }[po.shippingStatus]}</Badge>
        </div>

        {/* Supplier */}
        {supplier && (
          <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:14, marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:6 }}>Supplier</div>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>{supplier.name}</div>
            {(supplier.address||supplier.city||supplier.country) && (
              <div style={{ fontSize:13, color:'hsl(220,10%,56%)', display:'flex', alignItems:'flex-start', gap:4, marginBottom:6 }}>
                <Icons.MapPin color="hsl(220,10%,56%)" />
                {[supplier.address,supplier.city,supplier.state,supplier.zip,supplier.country].filter(Boolean).join(', ')}
              </div>
            )}
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {supplier.email && (
                <a href={`mailto:${supplier.email}`} style={{ fontSize:13, color:'hsl(220,70%,45%)', display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                  <Icons.Mail color="hsl(220,70%,45%)" />{supplier.email}
                </a>
              )}
              {supplier.phone && (
                <a href={`tel:${supplier.phone}`} style={{ fontSize:13, color:'hsl(220,70%,45%)', display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                  <Icons.Phone color="hsl(220,70%,45%)" />{supplier.phone}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Payment info */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:po.depositAmount?12:16 }}>
          <InfoTile label="Payment Method" value={supplier?.preferredPaymentMethod} />
          <InfoTile label="Payment Terms"  value={supplier?.paymentTerms} />
        </div>

        {po.depositAmount>0 && (
          <div style={{ background:'hsl(38,92%,96%)', border:'1px solid hsl(38,80%,80%)', borderRadius:8, padding:12, fontSize:13, marginBottom:16 }}>
            Deposit paid: <strong className="mono">{fmt(po.depositAmount)}</strong> of {fmt(po.totalCost)} total
          </div>
        )}

        <Separator />

        {/* Line items */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:10 }}>Line Items</div>
          <table>
            <thead>
              <tr>
                <TH>Part</TH><TH>SKU</TH><TH right>Qty</TH><TH right>Unit Cost</TH><TH right>Line Total</TH>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, i) => {
                const part = getPartById(item.partId);
                return (
                  <tr key={i}>
                    <TD><span style={{ fontWeight:500 }}>{part?.name||'—'}</span></TD>
                    <TD><span className="mono" style={{ fontSize:12, color:'hsl(220,70%,45%)', fontWeight:500 }}>{part?.sku||'—'}</span></TD>
                    <TD right mono>{item.qty.toLocaleString()}</TD>
                    <TD right mono>{fmt(item.unitCost)}</TD>
                    <TD right mono bold>{fmt(item.qty*item.unitCost)}</TD>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ padding:'10px 14px', textAlign:'right', fontWeight:600, borderTop:'2px solid hsl(220,15%,85%)' }}>Total</td>
                <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontWeight:700, fontSize:16, borderTop:'2px solid hsl(220,15%,85%)' }}>{fmt(po.totalCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Shipping */}
        {(po.shippingStatus==='shipped'||po.shippingStatus==='delivered')&&(po.carrier||po.trackingNumber)&&(
          <>
            <Separator />
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                <Icons.Truck size={13} color="hsl(220,10%,56%)" /> Shipping & Tracking
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <InfoTile label="Carrier" value={po.carrier} />
                <InfoTile label="Tracking #" value={po.trackingNumber}
                  href={po.carrier && po.trackingNumber ? (
                    po.carrier.toLowerCase().includes('dhl')   ? `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${po.trackingNumber}` :
                    po.carrier.toLowerCase().includes('fedex') ? `https://www.fedex.com/fedextrack/?trknbr=${po.trackingNumber}` :
                    po.carrier.toLowerCase().includes('ups')   ? `https://www.ups.com/track?tracknum=${po.trackingNumber}` :
                    po.carrier.toLowerCase().includes('usps')  ? `https://tools.usps.com/go/TrackConfirmAction?tLabels=${po.trackingNumber}` :
                    null
                  ) : null}
                  mono
                />
                <InfoTile label="Ship Date" value={po.shipDate} />
                <InfoTile label="ETA" value={po.eta} />
              </div>
            </div>
          </>
        )}

        {po.notes&&(
          <>
            <Separator />
            <div>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:6 }}>Notes</div>
              <div style={{ fontSize:13, color:'hsl(220,10%,56%)', whiteSpace:'pre-wrap' }}>{po.notes}</div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// ── BOM Editor ─────────────────────────────────────────────────────────────────
function BOMEditor({ fgId, bom }) {
  const { parts, updateBOM, getPartById } = useData();
  const [lines, setLines] = useState(bom);
  const [dirty, setDirty] = useState(false);

  const usedIds = lines.map(l => l.partId);
  const available = parts.filter(p => !usedIds.includes(p.id));

  const addLine = partId => { setLines(p => [...p, { partId, qty:1 }]); setDirty(true); };
  const updateQty = (partId, qty) => { setLines(p => p.map(l => l.partId===partId ? {...l, qty:Math.max(1,qty)} : l)); setDirty(true); };
  const removeLine = partId => { setLines(p => p.filter(l => l.partId!==partId)); setDirty(true); };
  const save = () => { updateBOM(fgId, lines); setDirty(false); toast.success('BOM updated'); };

  const totalComp = lines.reduce((s,l) => { const p=getPartById(l.partId); return s+(p?p.unitCost*l.qty:0); }, 0);
  const totalFreight = lines.reduce((s,l) => { const p=getPartById(l.partId); return s+(p?p.freightCost*l.qty:0); }, 0);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8, padding:'4px 12px', fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)' }}>
        <span>Part</span>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ width:48, textAlign:'right' }}>Qty</span>
          <span style={{ width:64, textAlign:'right' }}>Unit</span>
          <span style={{ width:64, textAlign:'right' }}>Freight</span>
          <span style={{ width:64, textAlign:'right' }}>Landed</span>
          <span style={{ width:28 }}/>
        </div>
      </div>

      {lines.map(line => {
        const part = getPartById(line.partId);
        if (!part) return null;
        const landed = (part.unitCost + part.freightCost) * line.qty;
        return (
          <div key={line.partId} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:6, background:'hsl(220,15%,96%)', marginBottom:4 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{part.name}</div>
              <div className="mono" style={{ fontSize:11, color:'hsl(220,10%,56%)' }}>{part.sku}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <input type="number" min={1} value={line.qty}
                onChange={e => updateQty(line.partId, parseInt(e.target.value)||1)}
                style={{ width:48, height:28, textAlign:'center', fontFamily:'JetBrains Mono,monospace', fontSize:12, border:'1px solid hsl(220,15%,85%)', borderRadius:4, padding:'0 4px' }} />
              <span className="mono" style={{ fontSize:12, width:64, textAlign:'right' }}>{fmt(part.unitCost)}</span>
              <span className="mono" style={{ fontSize:12, width:64, textAlign:'right', color:'hsl(220,10%,56%)' }}>{fmt(part.freightCost)}</span>
              <span className="mono" style={{ fontSize:12, width:64, textAlign:'right', fontWeight:600 }}>{fmt(landed)}</span>
              <button onClick={() => removeLine(line.partId)} style={{ width:28, height:28, border:'none', background:'none', color:'hsl(0,60%,60%)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.Trash /></button>
            </div>
          </div>
        );
      })}

      {available.length > 0 && (
        <select onChange={e => { if(e.target.value) addLine(e.target.value); e.target.value=''; }}
          style={{ width:'100%', padding:'7px 10px', fontSize:12, border:'1px solid hsl(220,15%,85%)', borderRadius:6, background:'white', marginTop:4, color:'hsl(220,10%,56%)' }}>
          <option value="">+ Add a part to this BOM...</option>
          {available.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku}) — {fmt(p.unitCost)} + {fmt(p.freightCost)} freight</option>)}
        </select>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10, paddingTop:10, borderTop:'1px solid hsl(220,15%,90%)' }}>
        <div style={{ fontSize:12, color:'hsl(220,10%,56%)' }}>
          Components: <strong className="mono">{fmt(totalComp)}</strong>
          &nbsp;&nbsp;Freight: <strong className="mono">{fmt(totalFreight)}</strong>
        </div>
        {dirty && <Btn size="sm" onClick={save}><Icons.Check /> Save BOM</Btn>}
      </div>
    </div>
  );
}

// ── Pages ──────────────────────────────────────────────────────────────────────
function Dashboard({ setPage }) {
  const { parts, inventoryRecords, purchaseOrders, finishedGoodOrders, finishedGoods, getPartById, getSupplierById } = useData();

  const totalPartsSpend = purchaseOrders.reduce((s,po) => s+po.totalCost, 0);
  const totalFGOnOrder  = finishedGoodOrders.filter(o=>o.status!=='received').reduce((s,o) => s+o.qty, 0);
  const totalFGReceived = finishedGoodOrders.filter(o=>o.status==='received').reduce((s,o) => s+o.qty, 0);

  const fg = finishedGoods[0];
  const totalUnitCost = fg ? fg.bom.reduce((s,l) => { const p=getPartById(l.partId); return s+(p?p.unitCost*l.qty:0); }, 0) + fg.assemblyCost : 0;

  const inventorySummary = parts.map(part => {
    const records = inventoryRecords.filter(r => r.partId===part.id);
    const totalQty = records.reduce((s,r) => s+r.qty, 0);
    const locations = records.map(r => `${r.location}: ${r.qty}`);
    return { part, totalQty, locations };
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <div style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.5px' }}>Dashboard</div>
        <div style={{ fontSize:13, color:'hsl(220,10%,56%)', marginTop:4 }}>
          Snapshot as of {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ cursor:'pointer' }} onClick={() => setPage('pos')}>
          <StatCard title="Parts Spend (Total)" value={fmt(totalPartsSpend)} subtitle="All POs to date" icon={Icons.Dollar} variant="primary" />
        </div>
        <div style={{ cursor:'pointer' }} onClick={() => setPage('fg')}>
          <StatCard title="FG On Order" value={`${totalFGOnOrder} units`} subtitle={`${totalFGReceived} received`} icon={Icons.Truck} variant="warning" />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <Card>
          <CardHeader><CardTitle><Icons.Package size={15} /> Current Inventory by Part</CardTitle></CardHeader>
          <CardContent>
            {inventorySummary.map(({ part, totalQty, locations }) => (
              <div key={part.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid hsl(220,15%,92%)' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500 }}>{part.name}</div>
                  <div style={{ fontSize:12, color:'hsl(220,10%,56%)', marginTop:2 }}>{locations.join(' · ')}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="mono" style={{ fontSize:13, fontWeight:700 }}>{totalQty.toLocaleString()}</div>
                  <div style={{ fontSize:11, color:'hsl(220,10%,56%)' }}>{fmt(part.unitCost)}/ea</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle><Icons.Truck size={15} /> Finished Good Orders</CardTitle></CardHeader>
          <CardContent>
            {finishedGoodOrders.map(order => (
              <div key={order.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid hsl(220,15%,92%)' }}>
                <div>
                  <div className="mono" style={{ fontSize:13, fontWeight:500 }}>{order.orderNumber}</div>
                  <div style={{ fontSize:12, color:'hsl(220,10%,56%)', marginTop:2 }}>{order.qty} units · Ordered {order.dateOrdered}</div>
                </div>
                <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                  <Badge cls={fgStatusCls[order.status]}>{order.status}</Badge>
                  <div className="mono" style={{ fontSize:12, color:'hsl(220,10%,56%)' }}>{fmt(order.qty*order.unitCost)}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:12, paddingTop:10, borderTop:'1px solid hsl(220,15%,90%)', display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span style={{ color:'hsl(220,10%,56%)' }}>Unit COGS</span>
              <span className="mono" style={{ fontWeight:600 }}>{fmt(totalUnitCost)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle><Icons.Clipboard size={15} /> Recent Purchase Orders</CardTitle></CardHeader>
        <CardContent style={{ padding:'0 0 4px' }}>
          <table>
            <thead>
              <tr><TH>PO #</TH><TH>Supplier</TH><TH>Items</TH><TH>Total</TH><TH>Status</TH><TH>Date</TH></tr>
            </thead>
            <tbody>
              {purchaseOrders.slice().reverse().map(po => {
                const supplier = getSupplierById(po.supplierId);
                const itemNames = po.items.map(i => `${getPartById(i.partId)?.name} ×${i.qty}`).join(', ');
                return (
                  <tr key={po.id}>
                    <TD mono><span style={{ color:'hsl(220,70%,45%)', fontSize:12 }}>{po.poNumber}</span></TD>
                    <TD>{supplier?.shortName}</TD>
                    <TD muted><span style={{ fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block', maxWidth:200 }}>{itemNames}</span></TD>
                    <TD mono>{fmt(po.totalCost)}</TD>
                    <TD><Badge cls={orderStatusCls[po.orderStatus]}>{po.orderStatus}</Badge></TD>
                    <TD muted>{po.dateOrdered}</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Add Inventory Record Dialog ────────────────────────────────────────────────
function AddInventoryDialog() {
  const { parts, finishedGoods, suppliers, addInventoryRecord } = useData();
  const [open, setOpen] = useState(false);
  const [itemType, setItemType] = useState('part'); // 'part' | 'fg'
  const [partId, setPartId] = useState('');
  const [fgId, setFgId] = useState('');
  const [location, setLocation] = useState('');
  const [qty, setQty] = useState('');
  const [status, setStatus] = useState('on-order'); // for parts: paidFor bool; for FG: status string
  const [paidFor, setPaidFor] = useState(false);
  const [dateReceived, setDateReceived] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => { setPartId(''); setFgId(''); setLocation(''); setQty(''); setStatus('on-order'); setPaidFor(false); setDateReceived(''); setNotes(''); setItemType('part'); };

  const valid = (itemType==='part' ? partId : fgId) && location.trim() && qty && parseInt(qty) > 0;

  const submit = e => {
    e.preventDefault();
    if (!valid) return;
    if (itemType === 'part') {
      addInventoryRecord({ partId, fgId: null, location: location.trim(), qty: parseInt(qty), paidFor, dateReceived: dateReceived || today(), notes: notes || undefined });
    } else {
      addInventoryRecord({ partId: null, fgId, location: location.trim(), qty: parseInt(qty), paidFor: status === 'received', fgStatus: status, dateReceived: dateReceived || today(), notes: notes || undefined });
    }
    toast.success('Inventory record added');
    reset(); setOpen(false);
  };

  return (
    <>
      <Btn size="sm" onClick={() => setOpen(true)}><Icons.Plus /> Add Item</Btn>
      <Modal title="Add Inventory Record" open={open} onClose={() => { setOpen(false); reset(); }}>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Item Type">
            <Select value={itemType} onChange={v => { setItemType(v); setPartId(''); setFgId(''); }}>
              <option value="part">Component / Part / Packaging</option>
              <option value="fg">Finished Good SKU</option>
            </Select>
          </Field>

          {itemType === 'part' ? (
            <Field label="Part">
              <Select value={partId} onChange={setPartId} placeholder="Select part…">
                {parts.map(p => <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>)}
              </Select>
            </Field>
          ) : (
            <Field label="Finished Good">
              <Select value={fgId} onChange={setFgId} placeholder="Select SKU…">
                {finishedGoods.map(fg => <option key={fg.id} value={fg.id}>{fg.name} — {fg.sku}</option>)}
              </Select>
            </Field>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12 }}>
            <Field label="Location"><Input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Assembly Factory, In Transit, Warehouse…" /></Field>
            <Field label="Qty"><Input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} placeholder="0" /></Field>
          </div>

          {itemType === 'part' ? (
            <Field label="Payment Status">
              <Select value={paidFor ? 'paid' : 'unpaid'} onChange={v => setPaidFor(v === 'paid')}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </Select>
            </Field>
          ) : (
            <Field label="Status">
              <Select value={status} onChange={setStatus}>
                <option value="on-order">On Order</option>
                <option value="in-production">In Production</option>
                <option value="shipped">Shipped</option>
                <option value="received">Received</option>
              </Select>
            </Field>
          )}

          <Field label="Date"><Input type="date" value={dateReceived} onChange={e=>setDateReceived(e.target.value)} /></Field>
          <Field label="Notes (optional)"><Input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any notes…" /></Field>

          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn type="submit" disabled={!valid}>Add Record</Btn>
          </div>
        </form>
      </Modal>
    </>
  );
}

function InventoryPage() {
  const { parts, finishedGoods, inventoryRecords, finishedGoodOrders, getSupplierById, deleteInventoryRecord, updateInventoryRecord } = useData();
  const [view, setView] = useState('part');   // 'part' | 'fg'
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');

  // Build flat rows: one per inventory record
  const partRows = inventoryRecords
    .filter(r => r.partId)
    .map(r => {
      const part = parts.find(p => p.id === r.partId);
      const supplier = part ? getSupplierById(part.supplierId) : null;
      // Which FG SKUs use this part?
      const usedIn = finishedGoods.filter(fg => fg.bom.some(b => b.partId === r.partId)).map(fg => fg.sku);
      return {
        id: r.id,
        type: 'part',
        name: part?.name || '—',
        sku: part?.sku || '—',
        description: part?.notes || part?.type || '—',
        supplier: supplier?.shortName || '—',
        location: r.location,
        qty: r.qty,
        unitCost: part?.unitCost || 0,
        value: r.qty * (part?.unitCost || 0),
        status: r.paidFor ? 'paid' : 'unpaid',
        date: r.dateReceived,
        fgSkus: usedIn,
        notes: r.notes,
        partType: part?.type,
      };
    });

  // FG order rows — each FGO that isn't fully received becomes an inventory row
  const fgRows = finishedGoodOrders.map(o => {
    const fg = finishedGoods.find(fg => fg.sku === o.sku);
    const location = o.status === 'on-order' ? 'Factory — On Order'
      : o.status === 'in-production' ? 'Factory — In Production'
      : o.status === 'shipped' ? 'In Transit'
      : o.status === 'received' ? 'Warehouse'
      : o.status;
    return {
      id: o.id,
      type: 'fg',
      name: fg?.name || o.sku,
      sku: o.sku,
      description: `${o.qty} units ordered`,
      supplier: 'Assembly Factory',
      location,
      qty: o.qty,
      unitCost: o.unitCost,
      value: o.qty * o.unitCost,
      status: o.status,
      date: o.dateOrdered,
      fgSkus: [o.sku],
      orderNumber: o.orderNumber,
      qtySold: o.qtySold,
    };
  });

  // Also include any manually added FG inventory records
  const fgManualRows = inventoryRecords
    .filter(r => r.fgId)
    .map(r => {
      const fg = finishedGoods.find(f => f.id === r.fgId);
      return {
        id: r.id,
        type: 'fg',
        name: fg?.name || '—',
        sku: fg?.sku || '—',
        description: r.notes || '—',
        supplier: '—',
        location: r.location,
        qty: r.qty,
        unitCost: fg?.bom?.reduce((s,b) => { const p=parts.find(pt=>pt.id===b.partId); return s+(p?p.unitCost*b.qty:0); }, 0) || 0,
        value: 0,
        status: r.fgStatus || (r.paidFor ? 'received' : 'on-order'),
        date: r.dateReceived,
        fgSkus: fg ? [fg.sku] : [],
      };
    });

  const allRows = view === 'part'
    ? partRows
    : [...fgRows, ...fgManualRows];

  const q = search.toLowerCase();
  const filtered = q
    ? allRows.filter(r =>
        [r.name, r.sku, r.description, r.supplier, r.location, ...(r.fgSkus||[])].join(' ').toLowerCase().includes(q)
      )
    : allRows;

  const totalValue = filtered.reduce((s, r) => s + r.value, 0);
  const totalQty   = filtered.reduce((s, r) => s + r.qty, 0);

  const statusCls = {
    paid: 'badge-green', received: 'badge-green',
    shipped: 'badge-yellow', 'in-production': 'badge-primary', 'on-order': 'badge-muted',
    unpaid: 'badge-red',
  };
  const statusLabel = {
    paid: 'Paid', received: 'Received', shipped: 'Shipped',
    'in-production': 'In Production', 'on-order': 'On Order', unpaid: 'Unpaid',
  };

  // Group rows by SKU for display
  const groups = {};
  filtered.forEach(r => {
    const key = r.sku;
    if (!groups[key]) groups[key] = { name: r.name, sku: r.sku, rows: [] };
    groups[key].rows.push(r);
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>Inventory</div>
          <div style={{ fontSize:13, color:'hsl(220,10%,56%)', marginTop:4 }}>
            {filtered.length} records · {totalQty.toLocaleString()} units · <strong className="mono">{fmt(totalValue)}</strong> total value
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <AddInventoryDialog />
          <AddPartDialog />
        </div>
      </div>

      {/* View toggle + search */}
      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        <div style={{ display:'flex', background:'hsl(220,15%,92%)', borderRadius:7, padding:3, gap:2 }}>
          {[['part','By Part / Component'],['fg','By FG SKU']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:'5px 14px', fontSize:12, fontWeight:600, border:'none', borderRadius:5, cursor:'pointer',
              background: view===v ? 'white' : 'transparent',
              color: view===v ? 'hsl(220,25%,10%)' : 'hsl(220,10%,56%)',
              boxShadow: view===v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>{label}</button>
          ))}
        </div>
        <div style={{ position:'relative', flex:1 }}>
          <div style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
            <Icons.Search size={14} color="hsl(220,10%,56%)" />
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name, SKU, location, supplier…"
            style={{ width:'100%', padding:'7px 32px 7px 30px', fontSize:13, border:'1px solid hsl(220,15%,85%)', borderRadius:7, background:'white', fontFamily:'inherit', outline:'none' }} />
          {search && <button onClick={()=>setSearch('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'hsl(220,10%,56%)', fontSize:16, cursor:'pointer' }}>×</button>}
        </div>
      </div>

      {/* Table — grouped by SKU, flat rows by location */}
      <Card>
        <CardContent style={{ padding:0 }}>
          <table>
            <thead>
              <tr style={{ background:'hsl(220,15%,96%)' }}>
                <TH>Name</TH>
                <TH>SKU / Part No.</TH>
                {view === 'part' && <TH>Used In</TH>}
                <TH>Description</TH>
                <TH>Supplier</TH>
                <TH>Location</TH>
                <TH right>Qty</TH>
                <TH right>Unit Cost</TH>
                <TH right>Value</TH>
                <TH>Status</TH>
                <TH>Date</TH>
                <TH/>
              </tr>
            </thead>
            <tbody>
              {Object.values(groups).length === 0 && (
                <tr><td colSpan={12} style={{ padding:'40px 14px', textAlign:'center', color:'hsl(220,10%,56%)', fontSize:13 }}>No inventory records match.</td></tr>
              )}
              {Object.values(groups).map(({ name, sku, rows }) => (
                rows.map((r, ri) => {
                  const isEditing = editingId === r.id;
                  const isGroupFirst = ri === 0;
                  const rowBg = ri % 2 === 0 ? 'white' : 'hsl(220,20%,99%)';
                  const groupBorderTop = isGroupFirst && ri !== 0 ? '2px solid hsl(220,15%,88%)' : undefined;
                  return (
                    <tr key={r.id} style={{ borderTop: groupBorderTop, background: rowBg }}
                      onMouseEnter={e => e.currentTarget.style.background='hsl(220,70%,98%)'}
                      onMouseLeave={e => e.currentTarget.style.background=rowBg}>
                      {/* Name — only show on first row of group */}
                      <td style={{ padding:'9px 14px', fontSize:13, fontWeight: isGroupFirst ? 600 : 400, color: isGroupFirst ? 'hsl(220,25%,10%)' : 'hsl(220,10%,70%)', borderBottom:'1px solid hsl(220,15%,92%)', verticalAlign:'middle' }}>
                        {isGroupFirst ? name : ''}
                      </td>
                      <td style={{ padding:'9px 14px', borderBottom:'1px solid hsl(220,15%,92%)', verticalAlign:'middle' }}>
                        {isGroupFirst && <span className="mono" style={{ fontSize:12, color:'hsl(220,70%,45%)', fontWeight:600 }}>{sku}</span>}
                      </td>
                      {view === 'part' && (
                        <td style={{ padding:'9px 14px', borderBottom:'1px solid hsl(220,15%,92%)', verticalAlign:'middle' }}>
                          {isGroupFirst && r.fgSkus?.length > 0 && (
                            <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                              {r.fgSkus.map(s => <span key={s} style={{ fontSize:10, background:'hsl(220,70%,94%)', color:'hsl(220,70%,40%)', borderRadius:3, padding:'1px 6px', fontFamily:'JetBrains Mono,monospace', fontWeight:600 }}>{s}</span>)}
                            </div>
                          )}
                        </td>
                      )}
                      <TD muted><span style={{ fontSize:12 }}>{r.description}</span></TD>
                      <TD muted><span style={{ fontSize:12 }}>{r.supplier}</span></TD>
                      <td style={{ padding:'9px 14px', fontSize:13, fontWeight:500, borderBottom:'1px solid hsl(220,15%,92%)', verticalAlign:'middle' }}>{r.location}</td>
                      <td style={{ padding:'9px 14px', textAlign:'right', borderBottom:'1px solid hsl(220,15%,92%)', verticalAlign:'middle' }}>
                        {isEditing ? (
                          <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end' }}>
                            <input type="number" min="0" value={editQty} onChange={e=>setEditQty(e.target.value)} autoFocus
                              style={{ width:64, height:26, textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:12, border:'1px solid hsl(220,70%,65%)', borderRadius:4, padding:'0 6px' }}
                              onKeyDown={e => {
                                if (e.key==='Enter') { updateInventoryRecord(r.id, { qty: parseInt(editQty)||r.qty }); setEditingId(null); toast.success('Qty updated'); }
                                if (e.key==='Escape') setEditingId(null);
                              }} />
                            <button onClick={() => { updateInventoryRecord(r.id, { qty: parseInt(editQty)||r.qty }); setEditingId(null); toast.success('Qty updated'); }}
                              style={{ background:'hsl(220,70%,45%)', color:'white', border:'none', borderRadius:4, padding:'3px 7px', fontSize:11, cursor:'pointer' }}>✓</button>
                          </div>
                        ) : (
                          <span className="mono" style={{ fontWeight:600, cursor:'pointer', color:'hsl(220,25%,10%)' }}
                            onClick={() => { setEditingId(r.id); setEditQty(String(r.qty)); }}
                            title="Click to edit qty">
                            {r.qty.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <TD right mono><span style={{ fontSize:12 }}>{fmt(r.unitCost)}</span></TD>
                      <TD right mono bold>{fmt(r.value)}</TD>
                      <TD><Badge cls={statusCls[r.status]||'badge-muted'}>{statusLabel[r.status]||r.status}</Badge></TD>
                      <TD muted><span style={{ fontSize:12 }}>{r.date}</span></TD>
                      <td style={{ padding:'9px 8px', borderBottom:'1px solid hsl(220,15%,92%)', verticalAlign:'middle' }}>
                        {r.type === 'part' && (
                          <button onClick={() => { if(confirm('Delete this inventory record?')) deleteInventoryRecord(r.id); }}
                            style={{ background:'none', border:'none', color:'hsl(220,15%,75%)', cursor:'pointer', padding:'2px 4px', borderRadius:4, display:'flex', alignItems:'center' }}
                            onMouseEnter={e=>e.currentTarget.style.color='hsl(0,72%,51%)'}
                            onMouseLeave={e=>e.currentTarget.style.color='hsl(220,15%,75%)'}>
                            <Icons.Trash size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ))}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ background:'hsl(220,15%,96%)', fontWeight:700 }}>
                  <td colSpan={view==='part' ? 6 : 5} style={{ padding:'10px 14px', fontSize:13 }}>Totals</td>
                  <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{totalQty.toLocaleString()}</td>
                  <td/>
                  <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13, color:'hsl(220,70%,45%)' }}>{fmt(totalValue)}</td>
                  <td colSpan={3}/>
                </tr>
              </tfoot>
            )}
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// Inline status select used in PO table
const inlineSelectStyle = {
  fontSize: 11, fontWeight: 600, border: '1px solid transparent', borderRadius: 4,
  padding: '2px 6px', cursor: 'pointer', fontFamily: 'DM Sans, system-ui, sans-serif',
  appearance: 'none', WebkitAppearance: 'none', backgroundImage: 'none',
};

function InlineStatusSelect({ value, onChange, options, colorMap }) {
  const s = badgeStyle[colorMap[value]] || badgeStyle['badge-muted'];
  return (
    <select
      value={value}
      onChange={e => { e.stopPropagation(); onChange(e.target.value); }}
      onClick={e => e.stopPropagation()}
      style={{ ...inlineSelectStyle, background: s.background, color: s.color, border: s.border }}
    >
      {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
  );
}

function PurchaseOrdersPage({ supplierFilter, clearFilter }) {
  const { purchaseOrders, getPartById, getSupplierById, updatePurchaseOrder } = useData();
  const [selectedPO, setSelectedPO] = useState(null);
  const displayedPOs = supplierFilter ? purchaseOrders.filter(po => po.supplierId === supplierFilter.id) : purchaseOrders;
  const totalSpend = displayedPOs.reduce((s,po) => s+po.totalCost, 0);
  const openPOs = displayedPOs.filter(po => po.orderStatus==='submitted' && po.shippingStatus!=='delivered');

  const update = (poId, field, value) => {
    updatePurchaseOrder(poId, { [field]: value });
    toast.success('PO updated');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>Purchase Orders</div>
          <div style={{ fontSize:13, color:'hsl(220,10%,56%)', marginTop:4 }}>
            {purchaseOrders.length} total · {openPOs.length} open · Total spend: <strong className="mono">{fmt(totalSpend)}</strong>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <AddSupplierDialog /><AddPartDialog /><CreatePODialog />
        </div>
      </div>

      {supplierFilter && (
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'hsl(220,70%,96%)', border:'1px solid hsl(220,70%,85%)', borderRadius:8, padding:'10px 16px' }}>
          <Icons.Users size={14} color="hsl(220,70%,45%)" />
          <span style={{ fontSize:13, color:'hsl(220,70%,40%)', fontWeight:500 }}>Filtered by: <strong>{supplierFilter.name}</strong></span>
          <button onClick={clearFilter} style={{ marginLeft:'auto', background:'none', border:'none', color:'hsl(220,70%,45%)', fontSize:12, cursor:'pointer', fontWeight:600 }}>✕ Clear filter</button>
        </div>
      )}

      <div style={{ fontSize:12, color:'hsl(220,10%,56%)', display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ background:'hsl(220,15%,92%)', borderRadius:4, padding:'2px 7px', fontSize:11 }}>Tip</span>
        Click any status badge to update it inline · Click a row to view full PO detail
      </div>

      <Card>
        <CardContent style={{ padding:0 }}>
          <table>
            <thead>
              <tr style={{ background:'hsl(220,15%,96%)' }}>
                <TH>PO #</TH><TH>Supplier</TH><TH>Items</TH><TH right>Total</TH><TH>Order</TH><TH>Payment</TH><TH>Shipping</TH><TH>Date</TH>
              </tr>
            </thead>
            <tbody>
              {displayedPOs.slice().reverse().map(po => {
                const supplier = getSupplierById(po.supplierId);
                return (
                  <tr key={po.id} style={{ cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background='hsl(220,15%,97%)'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}
                    onClick={() => setSelectedPO(po)}>
                    <TD><span className="mono" style={{ color:'hsl(220,70%,45%)', fontSize:12, fontWeight:600 }}>{po.poNumber}</span></TD>
                    <TD>{supplier?.name}</TD>
                    <TD>
                      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                        {po.items.map((item,i) => {
                          const part = getPartById(item.partId);
                          return <div key={i} style={{ fontSize:12, color:'hsl(220,10%,56%)' }}>{part?.name} × {item.qty.toLocaleString()} @ {fmt(item.unitCost)}</div>;
                        })}
                      </div>
                    </TD>
                    <TD right mono bold>{fmt(po.totalCost)}</TD>
                    <td style={{ padding:'8px 14px' }}>
                      <InlineStatusSelect
                        value={po.orderStatus}
                        onChange={v => update(po.id, 'orderStatus', v)}
                        colorMap={orderStatusCls}
                        options={[['draft','Draft'],['submitted','Submitted']]}
                      />
                    </td>
                    <td style={{ padding:'8px 14px' }}>
                      <InlineStatusSelect
                        value={po.paymentStatus}
                        onChange={v => update(po.id, 'paymentStatus', v)}
                        colorMap={paymentCls}
                        options={[['unpaid','Unpaid'],['deposit-paid','Deposit Paid'],['paid','Paid']]}
                      />
                    </td>
                    <td style={{ padding:'8px 14px' }}>
                      <InlineStatusSelect
                        value={po.shippingStatus}
                        onChange={v => update(po.id, 'shippingStatus', v)}
                        colorMap={shippingCls}
                        options={[['unshipped','Unshipped'],['shipped','Shipped'],['delivered','Delivered']]}
                      />
                    </td>
                    <TD muted>{po.dateOrdered}</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <PODetail po={selectedPO} open={!!selectedPO} onClose={() => setSelectedPO(null)} />
    </div>
  );
}

function BOMPage() {
  const { finishedGoods, getPartById } = useData();
  const pct = n => `${(n*100).toFixed(1)}%`;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>Bill of Materials & COGS</div>
          <div style={{ fontSize:13, color:'hsl(220,10%,56%)', marginTop:4 }}>Manage parts, freight, and BOM for each finished good SKU</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <AddSupplierDialog /><AddPartDialog /><AddFinishedGoodDialog />
        </div>
      </div>
      {finishedGoods.map(fg => {
        const componentCost = fg.bom.reduce((s,l) => { const p=getPartById(l.partId); return s+(p?p.unitCost*l.qty:0); }, 0);
        const freightTotal  = fg.bom.reduce((s,l) => { const p=getPartById(l.partId); return s+(p?p.freightCost*l.qty:0); }, 0);
        const totalLanded   = componentCost + freightTotal + fg.assemblyCost;
        const grossMargin   = fg.retailPrice - totalLanded;
        const grossMarginPct = fg.retailPrice>0 ? grossMargin/fg.retailPrice : 0;
        return (
          <Card key={fg.id}>
            <CardHeader>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <CardTitle><Icons.Layers size={15} /> {fg.name}</CardTitle>
                <div style={{ textAlign:'right' }}>
                  <div className="mono" style={{ fontSize:11, color:'hsl(220,10%,56%)' }}>{fg.sku}</div>
                  <div className="mono" style={{ fontSize:13, fontWeight:700, color:'hsl(220,70%,45%)' }}>{fmt(totalLanded)} landed COGS</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <BOMEditor fgId={fg.id} bom={fg.bom} />
              <div style={{ marginTop:16, paddingTop:12, borderTop:'1px solid hsl(220,15%,90%)', display:'flex', flexDirection:'column', gap:6 }}>
                {[['Components', componentCost],['Freight-in', freightTotal],['Assembly & processing', fg.assemblyCost]].map(([label, val]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                    <span style={{ color:'hsl(220,10%,56%)' }}>{label}</span>
                    <span className="mono" style={{ fontWeight:600 }}>{fmt(val)}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:700, paddingTop:6, borderTop:'1px solid hsl(220,15%,90%)' }}>
                  <span>Total Landed COGS</span>
                  <span className="mono" style={{ color:'hsl(220,70%,45%)' }}>{fmt(totalLanded)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginTop:8, paddingTop:8, borderTop:'1px solid hsl(220,15%,90%)' }}>
                  <span style={{ color:'hsl(220,10%,56%)' }}>Retail Price</span>
                  <span className="mono" style={{ fontWeight:600 }}>{fmt(fg.retailPrice)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:700 }}>
                  <span>Gross Margin</span>
                  <span className="mono" style={{ color: grossMargin>=0 ? 'hsl(160,60%,35%)' : 'hsl(0,72%,45%)' }}>
                    {fmt(grossMargin)} ({pct(grossMarginPct)})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {finishedGoods.length===0 && (
        <Card><CardContent style={{ padding:'48px 20px', textAlign:'center', color:'hsl(220,10%,56%)' }}>No finished goods yet. Click "+ Finished Good" above to create one.</CardContent></Card>
      )}
    </div>
  );
}

function FinishedGoodsPage() {
  const { finishedGoodOrders } = useData();
  const revenue  = finishedGoodOrders.reduce((s,o) => s+(o.qtySold*o.salePrice), 0);
  const sold     = finishedGoodOrders.reduce((s,o) => s+o.qtySold, 0);
  const onOrder  = finishedGoodOrders.filter(o=>o.status!=='received').reduce((s,o) => s+o.qty, 0);
  const received = finishedGoodOrders.filter(o=>o.status==='received').reduce((s,o) => s+o.qty, 0);
  const unsold   = received - sold;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>Finished Goods</div>
          <div style={{ fontSize:13, color:'hsl(220,10%,56%)', marginTop:4 }}>ELEMENT-B_10BLD — OneBlade Element Razor, Black</div>
        </div>
        <AddFinishedGoodDialog />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:16 }}>
        <StatCard title="On Order / In Production" value={`${onOrder}`} icon={Icons.Truck} variant="warning" />
        <StatCard title="In Warehouse (unsold)"    value={`${unsold}`}  icon={Icons.Package} />
        <StatCard title="Sold"                     value={`${sold}`}    subtitle={fmt(revenue)} icon={Icons.Shopping} variant="success" />
        <StatCard title="Revenue"                  value={fmt(revenue)} subtitle="From sold units" icon={Icons.Dollar} variant="primary" />
      </div>
      <Card>
        <CardHeader><CardTitle style={{ fontSize:14 }}>All Orders</CardTitle></CardHeader>
        <CardContent style={{ padding:0 }}>
          <table>
            <thead>
              <tr style={{ background:'hsl(220,15%,96%)' }}>
                <TH>Order #</TH><TH right>Qty</TH><TH right>Unit COGS</TH><TH right>Total COGS</TH><TH>Status</TH><TH right>Sold</TH><TH right>Revenue</TH><TH>Ordered</TH><TH>Received</TH>
              </tr>
            </thead>
            <tbody>
              {finishedGoodOrders.map(order => (
                <tr key={order.id}
                  onMouseEnter={e => e.currentTarget.style.background='hsl(220,15%,97%)'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}>
                  <TD><span className="mono" style={{ fontSize:12, fontWeight:500 }}>{order.orderNumber}</span></TD>
                  <TD right mono>{order.qty}</TD>
                  <TD right mono>{fmt(order.unitCost)}</TD>
                  <TD right mono bold>{fmt(order.qty*order.unitCost)}</TD>
                  <TD><Badge cls={fgStatusCls[order.status]}>{order.status}</Badge></TD>
                  <TD right mono>{order.qtySold}</TD>
                  <TD right mono><span style={{ color:'hsl(160,60%,35%)' }}>{fmt(order.qtySold*order.salePrice)}</span></TD>
                  <TD muted>{order.dateOrdered}</TD>
                  <TD muted>{order.dateReceived||'—'}</TD>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background:'hsl(220,15%,96%)', fontWeight:700 }}>
                <td style={{ padding:'10px 14px', fontSize:13 }}>Totals</td>
                <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{finishedGoodOrders.reduce((s,o)=>s+o.qty,0)}</td>
                <td/>
                <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{fmt(finishedGoodOrders.reduce((s,o)=>s+o.qty*o.unitCost,0))}</td>
                <td/>
                <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{sold}</td>
                <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13, color:'hsl(160,60%,35%)' }}>{fmt(revenue)}</td>
                <td colSpan={2}/>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}


// ── Supplier Directory ─────────────────────────────────────────────────────────
function SupplierDirectory({ navigate }) {
  const { suppliers, parts, finishedGoods, inventoryRecords, purchaseOrders } = useData();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  // Build enriched supplier data
  const enriched = suppliers.map(s => {
    const suppliedParts = parts.filter(p => p.supplierId === s.id);
    const suppliedPartIds = suppliedParts.map(p => p.id);
    const suppliedFGs = finishedGoods.filter(fg =>
      fg.bom.some(line => suppliedPartIds.includes(line.partId))
    );

    // On Order value: POs that have NOT been delivered yet (paid or partially paid, but parts not shipped)
    const onOrderValue = purchaseOrders
      .filter(po => po.supplierId === s.id && po.shippingStatus !== 'delivered')
      .reduce((sum, po) => sum + po.totalCost, 0);

    // Balance Owed: what we still owe them (unpaid + deposit balance)
    const balanceOwed = purchaseOrders
      .filter(po => po.supplierId === s.id && po.paymentStatus !== 'paid')
      .reduce((sum, po) => {
        const paid = po.paymentStatus === 'deposit-paid' ? (po.depositAmount || 0) : 0;
        return sum + (po.totalCost - paid);
      }, 0);

    const corpus = [
      s.name, s.shortName, s.city, s.country, s.email, s.phone,
      s.preferredPaymentMethod, s.paymentTerms,
      ...suppliedParts.map(p => `${p.name} ${p.sku} ${p.notes || ''} ${p.type}`),
      ...suppliedFGs.map(fg => `${fg.name} ${fg.sku}`),
    ].join(' ').toLowerCase();

    return { s, suppliedParts, suppliedFGs, onOrderValue, balanceOwed, corpus };
  });

  const q = query.toLowerCase().trim();
  const filtered = q ? enriched.filter(e => e.corpus.includes(q)) : enriched;

  // Supplier detail modal content
  const SupplierDetailModal = ({ data }) => {
    const [previewPO, setPreviewPO] = useState(null);
    if (!data) return null;
    const { s, suppliedParts, suppliedFGs, onOrderValue, balanceOwed } = data;
    const supPOs = purchaseOrders.filter(po => po.supplierId === s.id);
    return (
      <>
      <Modal title="" open={!!selected} onClose={() => setSelected(null)} wide>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:20, fontWeight:700 }}>{s.name}</div>
              {(s.city || s.country) && (
                <div style={{ fontSize:13, color:'hsl(220,10%,56%)', display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
                  <Icons.MapPin color="hsl(220,10%,56%)" />{[s.city, s.country].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <div
                onClick={() => { setSelected(null); navigate('pos', s); }}
                style={{ background:'hsl(220,70%,96%)', border:'1px solid hsl(220,70%,85%)', borderRadius:8, padding:'10px 16px', textAlign:'right', cursor:'pointer', transition:'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background='hsl(220,70%,90%)'}
                onMouseLeave={e => e.currentTarget.style.background='hsl(220,70%,96%)'}
              >
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,70%,40%)', marginBottom:3 }}>On Order ↗</div>
                <div className="mono" style={{ fontSize:17, fontWeight:700, color:'hsl(220,70%,45%)' }}>{fmt(onOrderValue)}</div>
                <div style={{ fontSize:10, color:'hsl(220,70%,55%)', marginTop:2 }}>click to view POs</div>
              </div>
              <div style={{
                background: balanceOwed > 0 ? 'hsl(38,92%,96%)' : 'hsl(160,50%,95%)',
                border: `1px solid ${balanceOwed > 0 ? 'hsl(38,80%,80%)' : 'hsl(160,50%,80%)'}`,
                borderRadius:8, padding:'10px 16px', textAlign:'right'
              }}>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:3 }}>Balance Owed</div>
                <div className="mono" style={{ fontSize:17, fontWeight:700, color: balanceOwed > 0 ? 'hsl(38,80%,35%)' : 'hsl(160,60%,30%)' }}>{fmt(balanceOwed)}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact & terms */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {s.address && (
              <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:4 }}>Address</div>
                <div style={{ fontSize:13 }}>{[s.address, s.city, s.state, s.zip, s.country].filter(Boolean).join(', ')}</div>
              </div>
            )}
            {(s.email || s.phone) && (
              <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:4 }}>Contact</div>
                {s.email && <div style={{ fontSize:13, display:'flex', alignItems:'center', gap:5, marginBottom:3 }}><Icons.Mail color="hsl(220,10%,56%)" />{s.email}</div>}
                {s.phone && <div style={{ fontSize:13, display:'flex', alignItems:'center', gap:5 }}><Icons.Phone color="hsl(220,10%,56%)" />{s.phone}</div>}
              </div>
            )}
            {s.preferredPaymentMethod && (
              <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:4 }}>Payment Method</div>
                <div style={{ fontSize:13, fontWeight:500 }}>{s.preferredPaymentMethod}</div>
              </div>
            )}
            {s.paymentTerms && (
              <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:4 }}>Payment Terms</div>
                <div style={{ fontSize:13, fontWeight:500 }}>{s.paymentTerms}</div>
              </div>
            )}
          </div>

          {/* Parts supplied */}
          {suppliedParts.length > 0 && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:8 }}>Parts Supplied</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {suppliedParts.map(p => (
                  <div key={p.id} style={{ background:'hsl(220,15%,95%)', borderRadius:6, padding:'4px 10px', fontSize:12 }}>
                    <span style={{ fontWeight:500 }}>{p.name}</span>
                    <span className="mono" style={{ color:'hsl(220,10%,56%)', marginLeft:6, fontSize:11 }}>{p.sku}</span>
                    <span className="mono" style={{ color:'hsl(220,70%,45%)', marginLeft:6, fontSize:11 }}>{fmt(p.unitCost)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FGs */}
          {suppliedFGs.length > 0 && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:8 }}>Used In</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {suppliedFGs.map(fg => (
                  <div key={fg.id} style={{ background:'hsl(220,70%,96%)', borderRadius:6, padding:'4px 10px', fontSize:12 }}>
                    <span style={{ fontWeight:500 }}>{fg.name}</span>
                    <span className="mono" style={{ color:'hsl(220,70%,50%)', marginLeft:6, fontSize:11 }}>{fg.sku}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PO history */}
          {supPOs.length > 0 && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:8 }}>Purchase Order History</div>
              <table>
                <thead>
                  <tr style={{ background:'hsl(220,15%,96%)' }}>
                    <TH>PO #</TH><TH right>Total</TH><TH>Payment</TH><TH>Shipping</TH><TH>Date</TH>
                  </tr>
                </thead>
                <tbody>
                  {supPOs.slice().reverse().map(po => (
                    <tr key={po.id} style={{ cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='hsl(220,70%,97%)'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}
                      onClick={() => setPreviewPO(po)}>
                      <TD><span className="mono" style={{ fontSize:12, color:'hsl(220,70%,45%)', fontWeight:600 }}>{po.poNumber}</span></TD>
                      <TD right mono bold>{fmt(po.totalCost)}</TD>
                      <TD><Badge cls={paymentCls[po.paymentStatus]}>{po.paymentStatus}</Badge></TD>
                      <TD><Badge cls={shippingCls[po.shippingStatus]}>{po.shippingStatus}</Badge></TD>
                      <TD muted>{po.dateOrdered}</TD>
                      <TD muted><span style={{ fontSize:11, color:'hsl(220,70%,55%)' }}>view ↗</span></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
      <PODetail po={previewPO} open={!!previewPO} onClose={() => setPreviewPO(null)} onBack={() => setPreviewPO(null)} />
      </>
    );
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>Supplier Directory</div>
          <div style={{ fontSize:13, color:'hsl(220,10%,56%)', marginTop:4 }}>
            {filtered.length} of {suppliers.length} suppliers
          </div>
        </div>
        <AddSupplierDialog />
      </div>

      {/* Search */}
      <div style={{ position:'relative' }}>
        <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
          <Icons.Search size={15} color="hsl(220,10%,56%)" />
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by supplier name, city, country, part name, part no., FG SKU, FG name…"
          style={{
            width:'100%', padding:'10px 14px 10px 36px', fontSize:13,
            border:'1px solid hsl(220,15%,85%)', borderRadius:8, background:'white',
            fontFamily:'inherit', outline:'none', boxSizing:'border-box',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{
            position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', color:'hsl(220,10%,56%)', fontSize:18, cursor:'pointer', lineHeight:1,
          }}>×</button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent style={{ padding:0 }}>
          <table>
            <thead>
              <tr style={{ background:'hsl(220,15%,96%)' }}>
                <TH>Company Name</TH>
                <TH>Contact</TH>
                <TH right>On Order</TH>
                <TH right>Balance Owed</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ padding:'40px 14px', textAlign:'center', color:'hsl(220,10%,56%)', fontSize:13 }}>No suppliers match your search.</td></tr>
              )}
              {filtered.map(row => {
                const { s, onOrderValue, balanceOwed } = row;
                return (
                  <tr key={s.id} style={{ cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background='hsl(220,15%,97%)'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}
                    onClick={() => setSelected(row)}>
                    <TD>
                      <div style={{ fontWeight:600, fontSize:13 }}>{s.name}</div>
                      {(s.city || s.country) && (
                        <div style={{ fontSize:12, color:'hsl(220,10%,56%)', display:'flex', alignItems:'center', gap:3, marginTop:2 }}>
                          <Icons.MapPin size={11} color="hsl(220,10%,56%)" />
                          {[s.city, s.country].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </TD>
                    <TD>
                      {s.email && <div style={{ fontSize:12, color:'hsl(220,10%,56%)' }}>{s.email}</div>}
                      {s.phone && <div style={{ fontSize:12, color:'hsl(220,10%,56%)', marginTop:2 }}>{s.phone}</div>}
                      {!s.email && !s.phone && <span style={{ color:'hsl(220,10%,72%)', fontSize:12 }}>—</span>}
                    </TD>
                    <TD right>
                      <span className="mono" style={{ fontWeight:600, color: onOrderValue > 0 ? 'hsl(220,70%,45%)' : 'hsl(220,10%,56%)' }}>
                        {fmt(onOrderValue)}
                      </span>
                    </TD>
                    <TD right>
                      <span className="mono" style={{ fontWeight:600, color: balanceOwed > 0 ? 'hsl(38,80%,35%)' : 'hsl(160,60%,30%)' }}>
                        {fmt(balanceOwed)}
                      </span>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ background:'hsl(220,15%,96%)', fontWeight:700 }}>
                  <td colSpan={2} style={{ padding:'10px 14px', fontSize:13 }}>Totals</td>
                  <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13, color:'hsl(220,70%,45%)' }}>
                    {fmt(filtered.reduce((s,r) => s + r.onOrderValue, 0))}
                  </td>
                  <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13, color:'hsl(38,80%,35%)' }}>
                    {fmt(filtered.reduce((s,r) => s + r.balanceOwed, 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </CardContent>
      </Card>

      {/* Detail modal */}
      <SupplierDetailModal data={selected} />
    </div>
  );
}


// ── Sidebar ────────────────────────────────────────────────────────────────────

// ── Ledger Page ────────────────────────────────────────────────────────────────
function LedgerPage() {
  const { accounts, journal, finishedGoods, parts, reverseEntry, postSalesSummary, addAccount } = useData();
  const [tab, setTab] = useState('journal');  // journal | coa | trial | sales
  const [jeFilter, setJeFilter] = useState('');

  // Compute account balances from journal
  const balances = {};
  accounts.forEach(a => { balances[a.id] = 0; });
  journal.forEach(je => {
    je.lines.forEach(l => {
      const acct = accounts.find(a => a.id === l.accountId);
      if (!acct) return;
      if (acct.normal === 'debit')  balances[acct.id] += (l.debit - l.credit);
      else                          balances[acct.id] += (l.credit - l.debit);
    });
  });

  const totalDebits  = journal.reduce((s, je) => s + je.lines.reduce((ss, l) => ss + l.debit,  0), 0);
  const totalCredits = journal.reduce((s, je) => s + je.lines.reduce((ss, l) => ss + l.credit, 0), 0);
  const balanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const sourceLabel = { po:'Purchase Order', fgo:'FG Order', sales:'Sales Summary', reversal:'Reversal', manual:'Manual' };
  const sourceColor = { po:'badge-primary', fgo:'badge-green', sales:'badge-yellow', reversal:'badge-red', manual:'badge-muted' };

  const typeOrder = ['asset','liability','equity','revenue','cogs'];
  const typeLabel = { asset:'Assets', liability:'Liabilities', equity:'Equity', revenue:'Revenue', cogs:'Cost of Goods Sold' };

  const q = jeFilter.toLowerCase();
  const filteredJournal = q
    ? journal.filter(je => je.memo.toLowerCase().includes(q) || je.date.includes(q) || (je.source||'').includes(q))
    : journal;

  // Sales summary dialog state
  const [salesOpen, setSalesOpen] = useState(false);
  const [saleDate, setSaleDate] = useState('');
  const [saleMemo, setSaleMemo] = useState('');
  const [saleRevenue, setSaleRevenue] = useState('');
  const [saleUnits, setSaleUnits] = useState('');
  const [saleSku, setSaleSku] = useState(finishedGoods[0]?.sku || '');

  const computedCOGS = () => {
    const fg = finishedGoods.find(f => f.sku === saleSku);
    if (!fg || !saleUnits) return 0;
    return parseFloat(saleUnits) * fg.bom.reduce((s, b) => {
      const p = parts.find(pt => pt.id === b.partId);
      return s + (p ? (p.unitCost + p.freightCost) * b.qty : 0);
    }, 0);
  };

  const submitSales = () => {
    if (!saleDate || !saleRevenue || !saleUnits) return;
    postSalesSummary({ date: saleDate, memo: saleMemo || `Sales Summary — ${saleUnits} units ${saleSku}`, revenue: parseFloat(saleRevenue), cogs: computedCOGS(), units: parseInt(saleUnits) });
    toast.success('Sales summary posted to journal');
    setSalesOpen(false); setSaleDate(''); setSaleMemo(''); setSaleRevenue(''); setSaleUnits('');
  };

  // Add account dialog state
  const [acctOpen, setAcctOpen] = useState(false);
  const [newAcctNum, setNewAcctNum] = useState('');
  const [newAcctName, setNewAcctName] = useState('');
  const [newAcctType, setNewAcctType] = useState('asset');

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{
      padding:'6px 16px', fontSize:12, fontWeight:600, border:'none', borderRadius:5, cursor:'pointer',
      background: tab===id ? 'white' : 'transparent',
      color: tab===id ? 'hsl(220,25%,10%)' : 'hsl(220,10%,56%)',
      boxShadow: tab===id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    }}>{label}</button>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>General Ledger</div>
          <div style={{ fontSize:13, color:'hsl(220,10%,56%)', marginTop:4, display:'flex', alignItems:'center', gap:8 }}>
            {balanced
              ? <span style={{ color:'hsl(160,60%,35%)', fontWeight:600 }}>✓ Balanced — debits equal credits</span>
              : <span style={{ color:'hsl(0,72%,51%)', fontWeight:600 }}>⚠ Out of balance — check journal</span>}
            <span style={{ color:'hsl(220,15%,75%)' }}>·</span>
            <span>{journal.length} entries</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn size="sm" variant="ghost" onClick={() => setSalesOpen(true)}><Icons.Dollar /> Record Sales</Btn>
          <Btn size="sm" variant="ghost" onClick={() => setAcctOpen(true)}><Icons.Plus /> Add Account</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', background:'hsl(220,15%,92%)', borderRadius:7, padding:3, gap:2, alignSelf:'flex-start' }}>
        <TabBtn id="journal"  label="Journal" />
        <TabBtn id="coa"      label="Chart of Accounts" />
        <TabBtn id="trial"    label="Trial Balance" />
      </div>

      {/* ── Journal tab ── */}
      {tab === 'journal' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}><Icons.Search size={14} color="hsl(220,10%,56%)" /></div>
            <input value={jeFilter} onChange={e=>setJeFilter(e.target.value)} placeholder="Filter by memo, date, source…"
              style={{ width:'100%', padding:'8px 32px 8px 30px', fontSize:13, border:'1px solid hsl(220,15%,85%)', borderRadius:7, background:'white', fontFamily:'inherit', outline:'none' }} />
            {jeFilter && <button onClick={()=>setJeFilter('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'hsl(220,10%,56%)', fontSize:16, cursor:'pointer' }}>×</button>}
          </div>
          <Card>
            <CardContent style={{ padding:0 }}>
              <table>
                <thead>
                  <tr style={{ background:'hsl(220,15%,96%)' }}>
                    <TH>Date</TH><TH>Memo</TH><TH>Source</TH><TH>Account</TH><TH right>Debit</TH><TH right>Credit</TH><TH/>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredJournal].reverse().map((je, ji) => {
                    const rowCount = je.lines.length;
                    return je.lines.map((line, li) => {
                      const acct = accounts.find(a => a.id === line.accountId);
                      const isFirst = li === 0;
                      const isLast  = li === rowCount - 1;
                      const rowBg = ji % 2 === 0 ? 'white' : 'hsl(220,20%,99%)';
                      const borderB = isLast ? '2px solid hsl(220,15%,88%)' : '1px solid hsl(220,15%,94%)';
                      return (
                        <tr key={`${je.id}-${li}`} style={{ background: rowBg }}>
                          <td style={{ padding:'7px 14px', fontSize:12, borderBottom: borderB, verticalAlign:'middle', color:'hsl(220,10%,56%)', fontFamily:'JetBrains Mono,monospace', whiteSpace:'nowrap' }}>
                            {isFirst ? je.date : ''}
                          </td>
                          <td style={{ padding:'7px 14px', fontSize:12, borderBottom: borderB, verticalAlign:'middle', maxWidth:260 }}>
                            {isFirst ? <span style={{ fontWeight:500 }}>{je.memo}</span> : ''}
                          </td>
                          <td style={{ padding:'7px 14px', fontSize:12, borderBottom: borderB, verticalAlign:'middle' }}>
                            {isFirst ? <Badge cls={sourceColor[je.source]||'badge-muted'}>{sourceLabel[je.source]||je.source}</Badge> : ''}
                          </td>
                          <td style={{ padding:'7px 14px', fontSize:12, borderBottom: borderB, verticalAlign:'middle' }}>
                            <span className="mono" style={{ color:'hsl(220,10%,56%)', fontSize:11 }}>{acct?.number}</span>
                            <span style={{ marginLeft:8, fontWeight: line.debit > 0 ? 500 : 400 }}>{acct?.name || line.accountId}</span>
                          </td>
                          <td style={{ padding:'7px 14px', textAlign:'right', borderBottom: borderB, verticalAlign:'middle', fontFamily:'JetBrains Mono,monospace', fontSize:12, fontWeight: line.debit > 0 ? 600 : 400, color: line.debit > 0 ? 'hsl(220,25%,10%)' : 'transparent' }}>
                            {line.debit > 0 ? fmt(line.debit) : '—'}
                          </td>
                          <td style={{ padding:'7px 14px', textAlign:'right', borderBottom: borderB, verticalAlign:'middle', fontFamily:'JetBrains Mono,monospace', fontSize:12, fontWeight: line.credit > 0 ? 600 : 400, color: line.credit > 0 ? 'hsl(220,25%,10%)' : 'transparent' }}>
                            {line.credit > 0 ? fmt(line.credit) : '—'}
                          </td>
                          <td style={{ padding:'7px 8px', borderBottom: borderB, verticalAlign:'middle' }}>
                            {isFirst && je.source !== 'reversal' && (
                              <button onClick={() => { if(confirm('Post a reversal entry for this journal entry?')) reverseEntry(je.id); }}
                                title="Reverse this entry"
                                style={{ background:'none', border:'none', color:'hsl(220,15%,75%)', cursor:'pointer', padding:'2px 4px', fontSize:11, borderRadius:4 }}
                                onMouseEnter={e=>e.currentTarget.style.color='hsl(38,80%,35%)'}
                                onMouseLeave={e=>e.currentTarget.style.color='hsl(220,15%,75%)'}>
                                ↺
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background:'hsl(220,15%,96%)', fontWeight:700 }}>
                    <td colSpan={4} style={{ padding:'10px 14px', fontSize:13 }}>Totals</td>
                    <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{fmt(totalDebits)}</td>
                    <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{fmt(totalCredits)}</td>
                    <td/>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Chart of Accounts tab ── */}
      {tab === 'coa' && (
        <Card>
          <CardContent style={{ padding:0 }}>
            <table>
              <thead>
                <tr style={{ background:'hsl(220,15%,96%)' }}>
                  <TH>Number</TH><TH>Account Name</TH><TH>Type</TH><TH>Normal Balance</TH><TH right>Balance</TH>
                </tr>
              </thead>
              <tbody>
                {typeOrder.map(type => {
                  const group = accounts.filter(a => a.type === type);
                  if (!group.length) return null;
                  const groupTotal = group.reduce((s, a) => s + (balances[a.id] || 0), 0);
                  return [
                    <tr key={`hdr-${type}`}>
                      <td colSpan={5} style={{ padding:'10px 14px 6px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', background:'hsl(220,20%,98%)', borderTop:'2px solid hsl(220,15%,88%)' }}>{typeLabel[type]}</td>
                    </tr>,
                    ...group.map(a => (
                      <tr key={a.id}
                        onMouseEnter={e=>e.currentTarget.style.background='hsl(220,70%,98%)'}
                        onMouseLeave={e=>e.currentTarget.style.background='white'}>
                        <td style={{ padding:'8px 14px', borderBottom:'1px solid hsl(220,15%,92%)' }}><span className="mono" style={{ fontSize:12, color:'hsl(220,70%,45%)', fontWeight:600 }}>{a.number}</span></td>
                        <td style={{ padding:'8px 14px', fontSize:13, fontWeight:500, borderBottom:'1px solid hsl(220,15%,92%)' }}>{a.name}</td>
                        <td style={{ padding:'8px 14px', borderBottom:'1px solid hsl(220,15%,92%)' }}><Badge cls="badge-muted">{a.type}</Badge></td>
                        <td style={{ padding:'8px 14px', borderBottom:'1px solid hsl(220,15%,92%)' }}><Badge cls={a.normal==='debit'?'badge-primary':'badge-green'}>{a.normal}</Badge></td>
                        <td style={{ padding:'8px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13, fontWeight:600, borderBottom:'1px solid hsl(220,15%,92%)', color: (balances[a.id]||0) < 0 ? 'hsl(0,72%,51%)' : 'hsl(220,25%,10%)' }}>
                          {fmt(balances[a.id] || 0)}
                        </td>
                      </tr>
                    )),
                    <tr key={`tot-${type}`} style={{ background:'hsl(220,15%,96%)' }}>
                      <td colSpan={4} style={{ padding:'8px 14px', fontSize:12, fontWeight:700, textAlign:'right', borderTop:'1px solid hsl(220,15%,85%)' }}>Total {typeLabel[type]}</td>
                      <td style={{ padding:'8px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13, fontWeight:700, borderTop:'1px solid hsl(220,15%,85%)' }}>{fmt(groupTotal)}</td>
                    </tr>
                  ];
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── Trial Balance tab ── */}
      {tab === 'trial' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', gap:12 }}>
            {[
              { label:'Total Debits',  val: totalDebits,  color:'hsl(220,70%,45%)' },
              { label:'Total Credits', val: totalCredits, color:'hsl(160,60%,35%)' },
              { label:'Difference',    val: Math.abs(totalDebits-totalCredits), color: balanced ? 'hsl(160,60%,35%)' : 'hsl(0,72%,51%)' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ flex:1, background:'white', border:'1px solid hsl(220,15%,88%)', borderRadius:10, padding:'14px 18px' }}>
                <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'hsl(220,10%,56%)', marginBottom:6 }}>{label}</div>
                <div className="mono" style={{ fontSize:22, fontWeight:700, color }}>{fmt(val)}</div>
              </div>
            ))}
          </div>
          <Card>
            <CardContent style={{ padding:0 }}>
              <table>
                <thead>
                  <tr style={{ background:'hsl(220,15%,96%)' }}>
                    <TH>Account</TH><TH>Name</TH><TH right>Debit Balance</TH><TH right>Credit Balance</TH>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(a => {
                    const bal = balances[a.id] || 0;
                    const isDebitNormal = a.normal === 'debit';
                    const debitBal  = isDebitNormal  && bal > 0 ? bal : (!isDebitNormal && bal < 0 ? Math.abs(bal) : 0);
                    const creditBal = !isDebitNormal && bal > 0 ? bal : (isDebitNormal  && bal < 0 ? Math.abs(bal) : 0);
                    return (
                      <tr key={a.id}
                        onMouseEnter={e=>e.currentTarget.style.background='hsl(220,70%,98%)'}
                        onMouseLeave={e=>e.currentTarget.style.background='white'}>
                        <td style={{ padding:'8px 14px', borderBottom:'1px solid hsl(220,15%,92%)' }}><span className="mono" style={{ fontSize:12, color:'hsl(220,70%,45%)', fontWeight:600 }}>{a.number}</span></td>
                        <td style={{ padding:'8px 14px', fontSize:13, borderBottom:'1px solid hsl(220,15%,92%)' }}>{a.name}</td>
                        <td style={{ padding:'8px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:12, borderBottom:'1px solid hsl(220,15%,92%)', color: debitBal > 0 ? 'hsl(220,25%,10%)' : 'hsl(220,15%,75%)' }}>
                          {debitBal > 0 ? fmt(debitBal) : '—'}
                        </td>
                        <td style={{ padding:'8px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:12, borderBottom:'1px solid hsl(220,15%,92%)', color: creditBal > 0 ? 'hsl(220,25%,10%)' : 'hsl(220,15%,75%)' }}>
                          {creditBal > 0 ? fmt(creditBal) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background:'hsl(220,15%,96%)', fontWeight:700 }}>
                    <td colSpan={2} style={{ padding:'10px 14px', fontSize:13 }}>Totals</td>
                    <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{fmt(totalDebits)}</td>
                    <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:13 }}>{fmt(totalCredits)}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Sales Summary Dialog ── */}
      <Modal title="Record Sales Summary" open={salesOpen} onClose={() => setSalesOpen(false)}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'hsl(220,70%,96%)', border:'1px solid hsl(220,70%,85%)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'hsl(220,70%,40%)' }}>
            Posts a single journal entry: Cash DR / Revenue CR + COGS DR / FG Inventory CR
          </div>
          <Field label="Period / Date"><Input type="date" value={saleDate} onChange={e=>setSaleDate(e.target.value)} /></Field>
          <Field label="SKU">
            <Select value={saleSku} onChange={setSaleSku}>
              {finishedGoods.map(fg => <option key={fg.id} value={fg.sku}>{fg.name} — {fg.sku}</option>)}
            </Select>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Units Sold"><Input type="number" min="1" value={saleUnits} onChange={e=>setSaleUnits(e.target.value)} placeholder="0" /></Field>
            <Field label="Gross Revenue"><Input type="number" step="0.01" value={saleRevenue} onChange={e=>setSaleRevenue(e.target.value)} placeholder="0.00" /></Field>
          </div>
          {saleUnits && (
            <div style={{ background:'hsl(220,15%,96%)', borderRadius:8, padding:'10px 14px', fontSize:13 }}>
              Auto-computed COGS: <strong className="mono">{fmt(computedCOGS())}</strong>
              <span style={{ color:'hsl(220,10%,56%)', marginLeft:6, fontSize:12 }}>(from BOM × units)</span>
            </div>
          )}
          <Field label="Memo (optional)"><Input value={saleMemo} onChange={e=>setSaleMemo(e.target.value)} placeholder={`Sales Summary — ${saleUnits||'N'} units ${saleSku}`} /></Field>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <Btn variant="ghost" onClick={() => setSalesOpen(false)}>Cancel</Btn>
            <Btn onClick={submitSales} disabled={!saleDate || !saleRevenue || !saleUnits}>Post Entry</Btn>
          </div>
        </div>
      </Modal>

      {/* ── Add Account Dialog ── */}
      <Modal title="Add Account" open={acctOpen} onClose={() => setAcctOpen(false)}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
            <Field label="Account #"><Input value={newAcctNum} onChange={e=>setNewAcctNum(e.target.value)} placeholder="e.g. 1350" /></Field>
            <Field label="Name"><Input value={newAcctName} onChange={e=>setNewAcctName(e.target.value)} placeholder="e.g. Inventory — WIP" /></Field>
          </div>
          <Field label="Type">
            <Select value={newAcctType} onChange={setNewAcctType}>
              {typeOrder.map(t => <option key={t} value={t}>{typeLabel[t]}</option>)}
            </Select>
          </Field>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <Btn variant="ghost" onClick={() => setAcctOpen(false)}>Cancel</Btn>
            <Btn onClick={() => {
              if (!newAcctNum || !newAcctName) return;
              addAccount({ number: newAcctNum, name: newAcctName, type: newAcctType, normal: ['asset','cogs'].includes(newAcctType) ? 'debit' : 'credit' });
              toast.success('Account added');
              setAcctOpen(false); setNewAcctNum(''); setNewAcctName(''); setNewAcctType('asset');
            }} disabled={!newAcctNum || !newAcctName}>Add Account</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const navItems = [
  { id:'dashboard', label:'Dashboard',       Icon: Icons.Dashboard },
  { id:'inventory', label:'Inventory',       Icon: Icons.Package   },
  { id:'pos',       label:'Purchase Orders', Icon: Icons.Clipboard },
  { id:'bom',       label:'BOM & COGS',      Icon: Icons.Layers    },
  { id:'fg',        label:'Finished Goods',  Icon: Icons.Truck     },
  { id:'suppliers', label:'Suppliers',        Icon: Icons.Users     },
  { id:'ledger',    label:'General Ledger',   Icon: Icons.File      },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [supplierFilter, setSupplierFilter] = useState(null);

  const navigate = (p, filter=null) => { setSupplierFilter(filter); setPage(p); };

  const pageComponent = page === 'dashboard' ? <Dashboard setPage={setPage} />
    : page === 'inventory' ? <InventoryPage />
    : page === 'pos'       ? <PurchaseOrdersPage supplierFilter={supplierFilter} clearFilter={() => setSupplierFilter(null)} />
    : page === 'bom'       ? <BOMPage />
    : page === 'fg'        ? <FinishedGoodsPage />
    : page === 'suppliers' ? <SupplierDirectory navigate={navigate} />
    : page === 'ledger'    ? <LedgerPage />
    : <Dashboard setPage={setPage} />;

  return (
    <DataProvider>
      <ToastProvider>
        <style>{css}</style>
        <div style={{ display:'flex', minHeight:'100vh', background:'hsl(220,20%,97%)' }}>

          {/* Sidebar */}
          <div style={{
            width: collapsed ? 56 : 220, minHeight:'100vh', background:'hsl(220,25%,10%)',
            display:'flex', flexDirection:'column', flexShrink:0, transition:'width .2s',
          }}>
            <div style={{ padding: collapsed ? '16px 0' : '20px 16px', borderBottom:'1px solid hsl(220,20%,18%)' }}>
              {!collapsed ? (
                <div>
                  <div style={{ fontSize:17, fontWeight:700, color:'white', letterSpacing:'-0.3px' }}>OneBlade</div>
                  <div style={{ fontSize:11, color:'hsl(220,15%,50%)', marginTop:3 }}>Inventory & COGS Tracker</div>
                </div>
              ) : (
                <div style={{ display:'flex', justifyContent:'center' }}><Icons.Dollar size={18} color="hsl(220,70%,60%)" /></div>
              )}
            </div>

            <div style={{ padding: collapsed ? '8px 0' : '8px', flex:1 }}>
              <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:2, color:'hsl(220,15%,40%)', padding: collapsed ? '8px 0 4px' : '8px 8px 4px', textAlign: collapsed ? 'center' : 'left' }}>
                {!collapsed && 'Navigation'}
              </div>
              {navItems.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setPage(id)} style={{
                  width:'100%', display:'flex', alignItems:'center', gap: collapsed ? 0 : 10,
                  padding: collapsed ? '10px 0' : '9px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: page===id ? 'hsl(220,20%,18%)' : 'transparent',
                  border:'none', borderRadius:6, color: page===id ? 'white' : 'hsl(220,15%,60%)',
                  fontSize:13, fontWeight: page===id ? 600 : 400, marginBottom:2, transition:'all .15s',
                }}>
                  <Icon size={16} color={page===id ? 'hsl(220,70%,60%)' : 'hsl(220,15%,60%)'} />
                  {!collapsed && label}
                </button>
              ))}
            </div>

            <button onClick={() => setCollapsed(c => !c)} style={{
              padding:'12px 0', border:'none', background:'transparent', color:'hsl(220,15%,40%)',
              borderTop:'1px solid hsl(220,20%,18%)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icons.Menu size={16} color="hsl(220,15%,40%)" />
            </button>
          </div>

          {/* Main content */}
          <div style={{ flex:1, overflowY:'auto', padding:'32px 36px', minWidth:0 }}>
            {pageComponent}
          </div>
        </div>
      </ToastProvider>
    </DataProvider>
  );
}
