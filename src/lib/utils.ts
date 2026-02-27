import { useStore } from '@/store/useStore';

export function calculateClientDebt(clientId: string): number {
  const { orders, deliveries } = useStore.getState();
  
  // Get all orders for this client
  const clientOrders = orders.filter(o => o.clientId === clientId);
  
  let totalDebt = 0;

  clientOrders.forEach(order => {
    // Check if this order has a linked delivery
    const delivery = deliveries.find(d => d.orderNdtId === order.id);

    if (delivery) {
      // If delivery exists and is 'Đang giao', add its COD
      if (delivery.status === 'Đang giao') {
        // COD = Giá - Đã thanh toán của đơn NĐT
        const cod = order.price - order.paid;
        totalDebt += cod;
      }
    } else {
      // If no delivery, but order is 'Nhận hàng', add its debt
      if (order.status === 'Nhận hàng') {
        const debt = order.price - order.paid;
        totalDebt += debt;
      }
    }
  });

  return totalDebt;
}
