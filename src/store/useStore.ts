import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'Chờ' | 'Đã đặt' | 'Nhận hàng';
export type DeliveryStatus = 'Đang giao' | 'Giao thành công' | 'Giao thất bại';
export type ExpenseCategory = 'Vận chuyển' | 'Khác';

export interface Client {
  id: string; // KH001
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string; // NDT001
  clientId: string; // KH001
  itemName: string;
  image: string; // Emoji representing item
  quantity: number;
  price: number;
  cost: number;
  feeNDT: number;
  paid: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Delivery {
  id: string; // MVD001
  orderNdtId: string; // NDT001
  createdAt: string;
  status: DeliveryStatus;
}

export interface InventoryItem {
  id: string; // HH001
  image: string;
  name: string;
  quantity: number;
  cost: number;
  price: number;
  sold: number;
  importedAt: string;
}

export interface Expense {
  id: string; // CP001
  date: string;
  time: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
}

interface AppState {
  clients: Client[];
  orders: Order[];
  deliveries: Delivery[];
  inventory: InventoryItem[];
  expenses: Expense[];

  addClient: (c: Client) => void;
  updateClient: (id: string, c: Partial<Client>) => void;

  addOrder: (o: Order) => void;
  updateOrder: (id: string, o: Partial<Order>) => void;

  addDelivery: (d: Delivery) => void;
  updateDelivery: (id: string, d: Partial<Delivery>) => void;

  addInventory: (i: InventoryItem) => void;
  updateInventory: (id: string, i: Partial<InventoryItem>) => void;
  deleteInventory: (id: string) => void;

  addExpense: (e: Expense) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

// Initial Mock Data
const initialClients: Client[] = [
  { id: 'KH001', name: 'Nguyễn Văn A', phone: '0901234567', address: 'Hà Nội' },
  { id: 'KH002', name: 'Trần Thị B', phone: '0987654321', address: 'TP.HCM' },
];

const initialOrders: Order[] = [
  {
    id: 'NDT001',
    clientId: 'KH001',
    itemName: 'Áo thun Nam',
    image: '👕',
    quantity: 2,
    price: 1500000,
    cost: 1000000,
    feeNDT: 50000,
    paid: 0,
    status: 'Chờ',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'NDT002',
    clientId: 'KH002',
    itemName: 'Váy dạ hội',
    image: '👗',
    quantity: 1,
    price: 2000000,
    cost: 1500000,
    feeNDT: 100000,
    paid: 2000000,
    status: 'Nhận hàng',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const initialDeliveries: Delivery[] = [
  {
    id: 'MVD001',
    orderNdtId: 'NDT001',
    createdAt: new Date().toISOString(),
    status: 'Đang giao',
  },
  {
    id: 'MVD002',
    orderNdtId: 'NDT002',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'Giao thành công',
  }
];

const initialInventory: InventoryItem[] = [
  { id: 'HH001', image: '👕', name: 'Áo thun Nam Basic', quantity: 100, cost: 100000, price: 350000, sold: 45, importedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'HH002', image: '👗', name: 'Váy dạ hội cao cấp', quantity: 50, cost: 500000, price: 1500000, sold: 10, importedAt: new Date(Date.now() - 15 * 86400000).toISOString() },
];

const initialExpenses: Expense[] = [
  { id: 'CP001', date: new Date().toISOString().split('T')[0], time: '10:00:00', amount: 500000, category: 'Vận chuyển', note: 'Gửi hàng đi HN' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      clients: initialClients,
      orders: initialOrders,
      deliveries: initialDeliveries,
      inventory: initialInventory,
      expenses: initialExpenses,

      addClient: (c) => set((state) => ({ clients: [...state.clients, c] })),
      updateClient: (id, c) => set((state) => ({
        clients: state.clients.map(client => client.id === id ? { ...client, ...c } : client)
      })),

      addOrder: (o) => set((state) => ({ orders: [o, ...state.orders] })),
      updateOrder: (id, o) => set((state) => ({
        orders: state.orders.map(order => order.id === id ? { ...order, ...o } : order)
      })),

      addDelivery: (d) => set((state) => ({ deliveries: [d, ...state.deliveries] })),
      updateDelivery: (id, d) => set((state) => ({
        deliveries: state.deliveries.map(del => del.id === id ? { ...del, ...d } : del)
      })),

      addInventory: (i) => set((state) => ({ inventory: [i, ...state.inventory] })),
      updateInventory: (id, i) => set((state) => ({
        inventory: state.inventory.map(item => item.id === id ? { ...item, ...i } : item)
      })),
      deleteInventory: (id) => set((state) => ({
        inventory: state.inventory.filter(item => item.id !== id)
      })),

      addExpense: (e) => set((state) => ({ expenses: [e, ...state.expenses] })),
      updateExpense: (id, e) => set((state) => ({
        expenses: state.expenses.map(exp => exp.id === id ? { ...exp, ...e } : exp)
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(exp => exp.id !== id)
      })),

    }),
    {
      name: 'lincheng-erp-storage',
    }
  )
);
