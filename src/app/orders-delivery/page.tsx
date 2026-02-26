'use client';

import { useState } from 'react';
import styles from './OrdersDelivery.module.css';

// Mock Data
type DeliveryStatus = 'Đang giao' | 'Giao thành công' | 'Giao thất bại';

interface DeliveryOrder {
    id: string; // Mã MVĐ
    orderNdtId: string; // Mã đơn NĐT liên kết
    buyerName: string;
    phone: string;
    itemName: string;
    quantity: number;
    price: number;
    feeNDT: number;
    paid: number;
    status: DeliveryStatus;
    createdAt: string;
}

const mockDeliveries: DeliveryOrder[] = [
    {
        id: 'MVD001',
        orderNdtId: 'NDT001',
        buyerName: 'Nguyễn Văn A',
        phone: '0901234567',
        itemName: 'Áo thun Nam',
        quantity: 2,
        price: 1500000,
        feeNDT: 50000,
        paid: 0,
        status: 'Đang giao',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'MVD002',
        orderNdtId: 'NDT002',
        buyerName: 'Trần Thị B',
        phone: '0987654321',
        itemName: 'Váy dạ hội',
        quantity: 1,
        price: 2000000,
        feeNDT: 100000,
        paid: 2000000,
        status: 'Giao thành công',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
];

export default function OrdersDelivery() {
    const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(mockDeliveries);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDeliveries = deliveries.filter(d =>
        d.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className={styles.header}>
                <h1 className="page-title">Quản lý Giao Hàng (MVĐ)</h1>

                <div className={styles.actions}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm theo Mã KH, Tên, SĐT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button className={styles.addButton}>+ Thêm MVĐ</button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>MVĐ</th>
                            <th>Người Mua</th>
                            <th>SĐT</th>
                            <th>Tên Hàng</th>
                            <th>SL</th>
                            <th>Giá</th>
                            <th>COD</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDeliveries.map((delivery) => {
                            const cod = delivery.price - delivery.paid;
                            return (
                                <tr key={delivery.id} className={styles.tableRow}>
                                    <td className={styles.emphasizeId}>{delivery.id}</td>
                                    <td className={styles.emphasizeName}>{delivery.buyerName}</td>
                                    <td>{delivery.phone}</td>
                                    <td>{delivery.itemName}</td>
                                    <td>{delivery.quantity}</td>
                                    <td>{delivery.price.toLocaleString()}đ</td>
                                    <td className={cod > 0 ? styles.codActive : styles.codZero}>
                                        {cod.toLocaleString()}đ
                                    </td>
                                    <td>
                                        <select
                                            value={delivery.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value as DeliveryStatus;
                                                setDeliveries(deliveries.map(d =>
                                                    d.id === delivery.id ? { ...d, status: newStatus } : d
                                                ));
                                            }}
                                            className={`${styles.statusSelect} ${styles[delivery.status === 'Đang giao' ? 'statusDelivering' : delivery.status === 'Giao thành công' ? 'statusSuccess' : 'statusFailed']}`}
                                        >
                                            <option value="Đang giao">Đang giao</option>
                                            <option value="Giao thành công">Giao thành công</option>
                                            <option value="Giao thất bại">Giao thất bại</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredDeliveries.length === 0 && (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    Không tìm thấy dữ liệu vận đơn nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
