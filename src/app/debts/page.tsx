'use client';

import { useState } from 'react';
import styles from './Debts.module.css';

// Mock Data
interface ClientDebt {
    id: string; // Mã KH
    name: string;
    phone: string;
    address: string;
    totalOrders: number;
    totalDebt: number; // Công nợ
}

const mockDebts: ClientDebt[] = [
    {
        id: 'KH001',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: 'Hà Nội',
        totalOrders: 5,
        totalDebt: 1500000,
    },
    {
        id: 'KH002',
        name: 'Trần Thị B',
        phone: '0987654321',
        address: 'TP.HCM',
        totalOrders: 2,
        totalDebt: 0,
    },
    {
        id: 'KH003',
        name: 'Lê Văn C',
        phone: '0912345678',
        address: 'Đà Nẵng',
        totalOrders: 8,
        totalDebt: 4500000,
    }
];

export default function Debts() {
    const [debts] = useState<ClientDebt[]>(mockDebts);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDebts = debts.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalOutstandingDebt = filteredDebts.reduce((sum, client) => sum + client.totalDebt, 0);

    return (
        <div className="page-container">
            <div className={styles.header}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '8px' }}>Quản lý Công Nợ</h1>
                    <p className={styles.subtitle}>Tổng nợ khách hàng: <span className={styles.totalDebtSum}>{totalOutstandingDebt.toLocaleString()}đ</span></p>
                </div>

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
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mã KH</th>
                            <th>Tên KH</th>
                            <th>SĐT</th>
                            <th>Địa chỉ</th>
                            <th>Tổng đơn mua</th>
                            <th>Công nợ</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDebts.map((client) => {
                            return (
                                <tr key={client.id} className={styles.tableRow}>
                                    <td className={styles.emphasizeId}>{client.id}</td>
                                    <td className={styles.emphasizeName}>{client.name}</td>
                                    <td>{client.phone}</td>
                                    <td className={styles.addressCell}>{client.address}</td>
                                    <td className={styles.orderCountCell}>{client.totalOrders}</td>
                                    <td className={client.totalDebt > 0 ? styles.debtActive : styles.debtZero}>
                                        {client.totalDebt.toLocaleString()}đ
                                    </td>
                                    <td>
                                        <button className={styles.viewDetailBtn}>Chi tiết</button>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredDebts.length === 0 && (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    Không tìm thấy khách hàng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
