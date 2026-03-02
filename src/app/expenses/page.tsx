'use client';

import { useState } from 'react';
import styles from './Expenses.module.css';
import formStyles from '../form.module.css';
import { useStore, Expense, ExpenseCategory } from '@/store/useStore';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import ImageUploader from '@/components/ImageUploader/ImageUploader';

export default function Expenses() {
    const { expenses, addExpense, updateExpense, deleteExpense } = useStore();
    const [categoryFilter, setCategoryFilter] = useState<'All' | ExpenseCategory>('All');

    // Modals state
    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<Expense | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        id: '', date: '', time: '', amount: 0, category: 'Vận chuyển' as ExpenseCategory, note: '', image: ''
    });

    const filteredExpenses = expenses.filter(e =>
        categoryFilter === 'All' || e.category === categoryFilter
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const openCreate = () => {
        const now = new Date();
        setFormData({
            id: `CP${Date.now().toString().slice(-4)}`,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0],
            amount: 0,
            category: 'Vận chuyển',
            note: '',
            image: ''
        });
        setIsCreating(true);
    };

    const openEdit = (expense: Expense) => {
        setFormData({ ...expense, image: expense.image || '' });
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
                                <th>Số Tiền</th>
                                <th>Ảnh Hóa Đơn</th>
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
                                    <td className={styles.amountCell}>{expense.amount.toLocaleString()}đ</td>
                                    <td>
                                        {expense.image ? (
                                            <a href={expense.image} target="_blank" rel="noopener noreferrer">
                                                <img src={expense.image} alt="Hóa đơn" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)' }}>-</span>
                                        )}
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <CustomSelect
                                            value={expense.category}
                                            onChange={(val) => updateExpense(expense.id, { category: val as ExpenseCategory })}
                                            className={`${styles.categoryBadge} ${expense.category === 'Vận chuyển' ? styles.catTransport : styles.catOther}`}
                                            options={[
                                                { value: "Vận chuyển", label: "Vận chuyển" },
                                                { value: "Khác", label: "Khác" }
                                            ]}
                                        />
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
                                        <label>Số Tiền (VNĐ)</label>
                                        <input type="number" className={formStyles.formInput} value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} required />
                                    </div>
                                </div>

                                <div className={formStyles.formGroup} style={{ marginTop: '4px' }}>
                                    <label>Ảnh hóa đơn (Link/URL hoặc tải từ máy)</label>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '64px', height: '64px', flexShrink: 0,
                                            border: '1px dashed var(--border-color)', borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(0,0,0,0.02)', overflow: 'hidden'
                                        }}>
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>📄</span>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', gap: '8px', height: '40px' }}>
                                                <input
                                                    type="text"
                                                    className={formStyles.formInput}
                                                    style={{
                                                        flex: 1,
                                                        fontFamily: formData.image?.startsWith('data:image') ? 'monospace' : 'inherit',
                                                        fontSize: formData.image?.startsWith('data:image') ? '0.8rem' : 'inherit'
                                                    }}
                                                    value={formData.image || ''}
                                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                    placeholder="Dán link hóa đơn..."
                                                />
                                                <ImageUploader onImageSelected={(base64) => setFormData({ ...formData, image: base64 })} />
                                            </div>
                                            {formData.image?.startsWith('data:image') && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                    <span style={{ color: 'var(--success-color, #10b981)' }}>✓ Đã tải HĐ lên thành công</span>
                                                    <button
                                                        type="button"
                                                        onClick={e => { e.preventDefault(); setFormData({ ...formData, image: '' }); }}
                                                        style={{ border: 'none', background: 'none', color: 'var(--danger-color, #ef4444)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                                    >
                                                        Xóa ảnh
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
