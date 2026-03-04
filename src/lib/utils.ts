import { useStore } from '@/store/useStore';

export function calculateClientDebt(clientId: string): number {
  const { orders } = useStore.getState();
  
  // Get all orders for this client
  const clientOrders = orders.filter(o => o.clientId === clientId);
  
  return clientOrders.reduce((sum, order) => {
    return sum + (order.price * order.quantity) - order.paid;
  }, 0);
}
