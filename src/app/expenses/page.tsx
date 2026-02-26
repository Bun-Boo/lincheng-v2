'use client';

import { useState } from 'react';
import styles from './Expenses.module.css';

// Mock Data
type ExpenseCategory = 'Vận chuyển' | 'Khác';

interface Expense {
    id: string; // STT
    date: string;
    time: string;
    amount: number;
    category: ExpenseCategory;
    note: string;
}

const mockExpenses: Expense[] = [
    {
        id: 'CP001',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        amount: 500000,
        category: 'Vận chuyển',
        note: 'Gửi hàng đi HN cho KH Nguyễn Văn A'
    },
    {
        id: 'CP002',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        time: '14:30:00',
        amount: 1200000,
        category: 'Khác',
        note: 'Mua văn phòng phẩm, băng keo đóng hàng'
    }
];

export default function Expenses() {
    const [expenses] = useState<Expense[]>(mockExpenses);
    const [categoryFilter, setCategoryFilter] = useState<'All' | ExpenseCategory>('All');

    const filteredExpenses = expenses.filter(e =>
        categoryFilter === 'All' || e.category === categoryFilter
    );

    return (
        <div className="page-container">
            <div className={styles.header}>
                <h1 className="page-title">Quản lý Chi Phí</h1>

                <div className={styles.actions}>
                    <select
                        className={styles.filterSelect}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                    >
                        <option value="All">Tất cả chi phí</option>
                        <option value="Vận chuyển">Vận chuyển</option>
                        <option value="Khác">Khác</option>
                    </select>
                    <button className={styles.addButton}>+ Thêm Chi Phí</button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ngày</th>
                            <th>Giờ</th>
                            <th>Số Tiền</th>
                            <th>Loại Chi Phí</th>
                            <th>Ghi chú</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense) => (
                            <tr key={expense.id} className={styles.tableRow}>
                                <td className={styles.idCell}>{expense.id}</td>
                                <td className={styles.dateCell}>
                                    {new Date(expense.date).toLocaleDateString('vi-VN')}
                                </td>
                                <td className={styles.timeCell}>{expense.time.substring(0, 5)}</td>
                                <td className={styles.amountCell}>{expense.amount.toLocaleString()}đ</td>
                                <td>
                                    <span className={`${styles.categoryBadge} ${expense.category === 'Vận chuyển' ? styles.catTransport : styles.catOther}`}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td className={styles.noteCell}>{expense.note}</td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.editBtn}>Sửa</button>
                                        <button className={styles.deleteBtn}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredExpenses.length === 0 && (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    Không có dữ liệu chi phí nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
