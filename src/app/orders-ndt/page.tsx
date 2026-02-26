'use client';

import { useState, useMemo } from 'react';
import styles from './OrdersNDT.module.css';

// Mock Data
type OrderStatus = 'Chờ' | 'Đã đặt' | 'Nhận hàng';

interface Order {
    id: string;
    buyerName: string;
    phone: string;
    address: string;
    totalDebt: number; // Công nợ
    price: number; // Giá
    cost: number; // Vốn
    feeNDT: number; // Phí NĐT
    paid: number; // Đã thanh toán
    status: OrderStatus;
    createdAt: string;
}

const mockOrders: Order[] = [
    {
        id: 'NDT001',
        buyerName: 'Nguyễn Văn A',
        phone: '0901234567',
        address: 'Hà Nội',
        totalDebt: 500000,
        price: 1500000,
        cost: 1000000,
        feeNDT: 50000,
        paid: 0,
        status: 'Chờ',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'NDT002',
        buyerName: 'Trần Thị B',
        phone: '0987654321',
        address: 'TP.HCM',
        totalDebt: 0,
        price: 2000000,
        cost: 1500000,
        feeNDT: 100000,
        paid: 2000000,
        status: 'Nhận hàng',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
];

export default function OrdersNDT() {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Sort by new first
    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [orders]);

    return (
        <div className="page-container">
            <div className={styles.header}>
                <h1 className="page-title">Quản lý Đơn NĐT</h1>
                <button className={styles.addButton}>+ Tạo Đơn Mới</button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người Mua</th>
                            <th>Giá</th>
                            <th>Vốn</th>
                            <th>Phí NĐT</th>
                            <th>Lãi</th>
                            <th>Đã TT</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.map((order) => {
                            const profit = order.price - order.cost - order.feeNDT;
                            return (
                                <tr key={order.id} className={styles.tableRow} onClick={() => setSelectedOrder(order)}>
                                    <td>{order.id}</td>
                                    <td className={styles.emphasize}>{order.buyerName}</td>
                                    <td>{order.price.toLocaleString()}đ</td>
                                    <td>{order.cost.toLocaleString()}đ</td>
                                    <td>{order.feeNDT.toLocaleString()}đ</td>
                                    <td className={profit > 0 ? styles.profitPos : styles.profitNeg}>
                                        {profit.toLocaleString()}đ
                                    </td>
                                    <td>{order.paid.toLocaleString()}đ</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[order.status === 'Chờ' ? 'statusWait' : order.status === 'Đã đặt' ? 'statusOrdered' : 'statusReceived']}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className={styles.overlay} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Chi tiết khách hàng</h2>
                            <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.infoGroup}>
                                <label>Tên người mua:</label>
                                <p>{selectedOrder.buyerName}</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Số điện thoại:</label>
                                <p>{selectedOrder.phone}</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Địa chỉ:</label>
                                <p>{selectedOrder.address}</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Công nợ hiện tại:</label>
                                <p className={styles.debtText}>{selectedOrder.totalDebt.toLocaleString()}đ</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
