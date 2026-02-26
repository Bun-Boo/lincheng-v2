'use client';

import { useState } from 'react';
import styles from './Inventory.module.css';

// Mock Data
interface InventoryItem {
    id: string; // Mã HH
    image: string;
    name: string;
    quantity: number; // SL
    cost: number; // Vốn
    price: number; // Giá bán
    sold: number; // Đã bán
    importedAt: string; // Ngày nhập
}

const mockInventory: InventoryItem[] = [
    {
        id: 'HH001',
        image: '👕',
        name: 'Áo thun Nam Basic',
        quantity: 100,
        cost: 100000,
        price: 350000,
        sold: 45,
        importedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
        id: 'HH002',
        image: '👗',
        name: 'Váy dạ hội cao cấp',
        quantity: 50,
        cost: 500000,
        price: 1500000,
        sold: 10,
        importedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
        id: 'HH003',
        image: '👟',
        name: 'Giày thể thao Sneaker',
        quantity: 0,
        cost: 300000,
        price: 850000,
        sold: 200,
        importedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    }
];

export default function Inventory() {
    const [items] = useState<InventoryItem[]>(mockInventory);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className={styles.header}>
                <h1 className="page-title">Quản lý Hàng Tồn Kho</h1>

                <div className={styles.actions}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm tên hàng, mã HH..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button className={styles.addButton}>+ Thêm Hàng Mới</button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên Hàng</th>
                            <th>Tồn Kho</th>
                            <th>Vốn</th>
                            <th>Giá Bán</th>
                            <th>Đã Bán</th>
                            <th>Lãi (Dự kiến)</th>
                            <th>Ngày Nhập</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => {
                            // Lãi = đã bán * giá bán - vốn * đã bán
                            const profit = (item.sold * item.price) - (item.cost * item.sold);

                            return (
                                <tr key={item.id} className={styles.tableRow}>
                                    <td className={styles.imageCell}>
                                        <div className={styles.imagePlaceholder}>{item.image}</div>
                                    </td>
                                    <td>
                                        <div className={styles.itemName}>{item.name}</div>
                                        <div className={styles.itemId}>{item.id}</div>
                                    </td>
                                    <td>
                                        <span className={`${styles.stockBadge} ${item.quantity === 0 ? styles.stockOut : item.quantity < 20 ? styles.stockLow : styles.stockNormal}`}>
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td>{item.cost.toLocaleString()}đ</td>
                                    <td className={styles.priceCell}>{item.price.toLocaleString()}đ</td>
                                    <td className={styles.soldCell}>{item.sold}</td>
                                    <td className={profit > 0 ? styles.profitPos : styles.profitZero}>
                                        {profit.toLocaleString()}đ
                                    </td>
                                    <td className={styles.dateCell}>
                                        {new Date(item.importedAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.editBtn}>Sửa</button>
                                            <button className={styles.deleteBtn}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={9} className={styles.emptyState}>
                                    Không tìm thấy mặt hàng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
