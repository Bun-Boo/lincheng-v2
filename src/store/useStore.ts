import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDocs, initializeFirestore } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
  image?: string;
}

interface AppState {
  clients: Client[];
  orders: Order[];
  deliveries: Delivery[];
  inventory: InventoryItem[];
  expenses: Expense[];
  isSynced: boolean;

  addClient: (c: Client) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addOrder: (o: Order) => void;
  updateOrder: (id: string, o: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  addDelivery: (d: Delivery) => void;
  updateDelivery: (id: string, d: Partial<Delivery>) => void;

  addInventory: (i: InventoryItem) => void;
  updateInventory: (id: string, i: Partial<InventoryItem>) => void;
  deleteInventory: (id: string) => void;

  addExpense: (e: Expense) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  syncFirestore: () => () => void; // Returns an unsubscribe function
  seedMockData: () => Promise<void>; // Feature to initialize the database with some mock data
}

// Initial Mock Data (used only for seeding)
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
      clients: [],
      orders: [],
      deliveries: [],
      inventory: [],
      expenses: [],
      isSynced: false,

      // === CLIENTS ===
      addClient: async (c) => {
        set((state) => ({ clients: [...state.clients, c] }));
        try { await setDoc(doc(db, 'clients', c.id), c); } catch (e) { console.error('Error adding client', e); }
      },
      updateClient: async (id, c) => {
        set((state) => ({ clients: state.clients.map(client => client.id === id ? { ...client, ...c } : client) }));
        try { await updateDoc(doc(db, 'clients', id), c); } catch (e) { console.error('Error updating client', e); }
      },
      deleteClient: async (id) => {
        set((state) => ({ clients: state.clients.filter(client => client.id !== id) }));
        try { await deleteDoc(doc(db, 'clients', id)); } catch (e) { console.error('Error deleting client', e); }
      },

      // === ORDERS ===
      addOrder: async (o) => {
        set((state) => ({ orders: [o, ...state.orders] }));
        try { await setDoc(doc(db, 'orders', o.id), o); } catch (e) { console.error('Error adding order', e); }
      },
      updateOrder: async (id, o) => {
        set((state) => ({ orders: state.orders.map(order => order.id === id ? { ...order, ...o } : order) }));
        try { await updateDoc(doc(db, 'orders', id), o); } catch (e) { console.error('Error updating order', e); }
      },
      deleteOrder: async (id) => {
        set((state) => ({ orders: state.orders.filter(order => order.id !== id) }));
        try { await deleteDoc(doc(db, 'orders', id)); } catch (e) { console.error('Error deleting order', e); }
      },

      // === DELIVERIES ===
      addDelivery: async (d) => {
        set((state) => ({ deliveries: [d, ...state.deliveries] }));
        try { await setDoc(doc(db, 'deliveries', d.id), d); } catch (e) { console.error('Error adding delivery', e); }
      },
      updateDelivery: async (id, d) => {
        set((state) => ({ deliveries: state.deliveries.map(del => del.id === id ? { ...del, ...d } : del) }));
        try { await updateDoc(doc(db, 'deliveries', id), d); } catch (e) { console.error('Error updating delivery', e); }
      },

      // === INVENTORY ===
      addInventory: async (i) => {
        set((state) => ({ inventory: [i, ...state.inventory] }));
        try { await setDoc(doc(db, 'inventory', i.id), i); } catch (e) { console.error('Error adding inventory', e); }
      },
      updateInventory: async (id, i) => {
        set((state) => ({ inventory: state.inventory.map(item => item.id === id ? { ...item, ...i } : item) }));
        try { await updateDoc(doc(db, 'inventory', id), i); } catch (e) { console.error('Error updating inventory', e); }
      },
      deleteInventory: async (id) => {
        set((state) => ({ inventory: state.inventory.filter(item => item.id !== id) }));
        try { await deleteDoc(doc(db, 'inventory', id)); } catch (e) { console.error('Error deleting inventory', e); }
      },

      // === EXPENSES ===
      addExpense: async (e) => {
        set((state) => ({ expenses: [e, ...state.expenses] }));
        try { await setDoc(doc(db, 'expenses', e.id), e); } catch (e) { console.error('Error adding expense', e); }
      },
      updateExpense: async (id, e) => {
        set((state) => ({ expenses: state.expenses.map(exp => exp.id === id ? { ...exp, ...e } : exp) }));
        try { await updateDoc(doc(db, 'expenses', id), e); } catch (e) { console.error('Error updating expense', e); }
      },
      deleteExpense: async (id) => {
        set((state) => ({ expenses: state.expenses.filter(exp => exp.id !== id) }));
        try { await deleteDoc(doc(db, 'expenses', id)); } catch (e) { console.error('Error deleting expense', e); }
      },

      // === SYNC & SEED ===
      syncFirestore: () => {
        const unsubClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
          const clients = snapshot.docs.map(doc => doc.data() as Client);
          set({ clients });
        });

        const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
          const orders = snapshot.docs.map(doc => doc.data() as Order);
          set({ orders });
        });

        const unsubDeliveries = onSnapshot(collection(db, 'deliveries'), (snapshot) => {
          const deliveries = snapshot.docs.map(doc => doc.data() as Delivery);
          set({ deliveries });
        });

        const unsubInventory = onSnapshot(collection(db, 'inventory'), (snapshot) => {
          const inventory = snapshot.docs.map(doc => doc.data() as InventoryItem);
          set({ inventory });
        });

        const unsubExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
          const expenses = snapshot.docs.map(doc => doc.data() as Expense);
          set({ expenses });
        });

        set({ isSynced: true });

        // return unsubscribe function
        return () => {
          unsubClients();
          unsubOrders();
          unsubDeliveries();
          unsubInventory();
          unsubExpenses();
        };
      },

      seedMockData: async () => {
        // Only run if empty
        const snapshot = await getDocs(collection(db, 'clients'));
        if (!snapshot.empty) return;

        console.log("Seeding Mock Data to Firestore...");
        try {
          for (const c of initialClients) await setDoc(doc(db, 'clients', c.id), c);
          for (const o of initialOrders) await setDoc(doc(db, 'orders', o.id), o);
          for (const d of initialDeliveries) await setDoc(doc(db, 'deliveries', d.id), d);
          for (const i of initialInventory) await setDoc(doc(db, 'inventory', i.id), i);
          for (const e of initialExpenses) await setDoc(doc(db, 'expenses', e.id), e);
          console.log("Mock data seeded successfully.");
        } catch (err) {
          console.error("Error seeding mock data", err);
        }
      }

    }),
    {
      name: 'lincheng-erp-storage',
    }
  )
);
