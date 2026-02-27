'use client';

import { useState } from 'react';
import styles from './Expenses.module.css';
import formStyles from '../form.module.css';
import { useStore, Expense, ExpenseCategory } from '@/store/useStore';
import CustomSelect from '@/components/CustomSelect/CustomSelect';

export default function Expenses() {
    const { expenses, addExpense, updateExpense, deleteExpense } = useStore();
    const [categoryFilter, setCategoryFilter] = useState<'All' | ExpenseCategory>('All');

    // Modals state
    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<Expense | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        id: '', date: '', time: '', amount: 0, category: 'Vận chuyển' as ExpenseCategory, note: ''
    });

    const filteredExpenses = expenses.filter(e =>
        categoryFilter === 'All' || e.category === categoryFilter
    ).sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());

    const openCreate = () => {
        const now = new Date();
        setFormData({
            id: `CP${Date.now().toString().slice(-4)}`,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0],
            amount: 0,
            category: 'Vận chuyển',
            note: ''
        });
        setIsCreating(true);
    };

    const openEdit = (expense: Expense) => {
        setFormData(expense);
        setEditingItem(expense);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateExpense(editingItem.id, formData);
            setEditingItem(null);
        } else {
            addExpense(formData as Expense);
            setIsCreating(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc muốn xoá khoản chi phí này?')) {
            deleteExpense(id);
        }
    };

    return (
        <>
            <div className="page-container">
                <div className={styles.header}>
                    <h1 className="page-title">Quản lý Chi Phí</h1>

                    <div className={styles.actions}>
                        <CustomSelect
                            value={categoryFilter}
                            onChange={(val) => setCategoryFilter(val as ExpenseCategory | 'All')}
                            className={styles.filterSelect}
                            options={[
                                { value: "All", label: "Tất cả chi phí" },
                                { value: "Vận chuyển", label: "Vận chuyển" },
                                { value: "Khác", label: "Khác" }
                            ]}
                        />
                        <button className={styles.addButton} onClick={openCreate}>+ Thêm Chi Phí</button>
                    </div>
                </div>

                <div className={`${styles.tableContainer} table-responsive`}>
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
                                            <button className={styles.editBtn} onClick={() => openEdit(expense)}>Sửa</button>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(expense.id)}>Xóa</button>
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

            {/* Add / Edit Form Modal */}
            {(isCreating || editingItem) && (
                <div className="modal-overlay" onClick={() => { setIsCreating(false); setEditingItem(null); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Sửa Chi Phí' : 'Thêm Chi Phí Mới'}</h2>
                            <button type="button" className="modal-close-btn" onClick={() => { setIsCreating(false); setEditingItem(null); }}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Mã Phiếu</label>
                                        <input type="text" className={formStyles.formInput} value={formData.id} disabled placeholder="Tự động" />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Loại Chi Phí</label>
                                        <CustomSelect
                                            className={formStyles.formInput}
                                            value={formData.category}
                                            onChange={val => setFormData({ ...formData, category: val as ExpenseCategory })}
                                            options={[
                                                { value: "Vận chuyển", label: "Vận chuyển" },
                                                { value: "Khác", label: "Khác" }
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Ngày</label>
                                        <input type="date" className={formStyles.formInput} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Thời gian</label>
                                        <input type="time" className={formStyles.formInput} value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
                                    </div>
                                </div>

                                <div className={formStyles.formGroup}>
                                    <label>Số Tiền (VNĐ)</label>
                                    <input type="number" className={formStyles.formInput} value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} required />
                                </div>

                                <div className={formStyles.formGroup}>
                                    <label>Ghi chú (Không bắt buộc)</label>
                                    <textarea
                                        className={formStyles.formInput}
                                        value={formData.note}
                                        onChange={e => setFormData({ ...formData, note: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button type="button" onClick={() => { setIsCreating(false); setEditingItem(null); }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>Hủy</button>
                                    <button type="submit" className={formStyles.submitBtn} style={{ marginTop: 0, flex: 2, background: 'var(--danger-color)', color: 'white' }}>
                                        {editingItem ? 'Cập Nhật' : 'Lưu Chi Phí'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
