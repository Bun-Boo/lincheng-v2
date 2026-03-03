'use client';

import { useState } from 'react';
import styles from './Inventory.module.css';
import formStyles from '../form.module.css';
import { useStore, InventoryItem } from '@/store/useStore';

export default function Inventory() {
    const { inventory, addInventory, updateInventory, deleteInventory } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Modals state
    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        id: '', image: '📦', name: '', quantity: 0, cost: 0, price: 0, sold: 0
    });

    const filteredItems = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => {
        setFormData({ id: '', image: '📦', name: '', quantity: 0, cost: 0, price: 0, sold: 0 });
        setIsCreating(true);
    };

    const openEdit = (item: InventoryItem) => {
        setFormData(item);
        setEditingItem(item);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateInventory(editingItem.id, formData);
            setEditingItem(null);
        } else {
            const finalId = formData.id || `HH${Date.now().toString().slice(-4)}`;
            if (inventory.some(i => i.id === finalId)) return alert('Mã hàng hoá đã tồn tại!');
            addInventory({
                ...formData,
                id: finalId,
                importedAt: new Date().toISOString()
            });
            setIsCreating(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc muốn xoá mặt hàng này?')) {
            deleteInventory(id);
        }
    };

    return (
        <>
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
                        <button className={styles.addButton} onClick={openCreate}>+ Thêm Hàng Mới</button>
                    </div>
                </div>

                <div className={`${styles.tableContainer} table-responsive`}>
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
                                const profit = (item.sold * item.price) - (item.cost * item.sold);

                                return (
                                    <tr key={item.id} className={styles.tableRow}>
                                        <td className={styles.imageCell}>
                                            <div className={styles.imagePlaceholder}>{item.image || '📦'}</div>
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
                                                <button className={styles.editBtn} onClick={() => openEdit(item)}>Sửa</button>
                                                <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)}>Xóa</button>
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

            {/* Add / Edit Form Modal */}
            {(isCreating || editingItem) && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Sửa Mặt Hàng' : 'Thêm Hàng Mới'}</h2>
                            <button type="button" className="modal-close-btn" onClick={() => { setIsCreating(false); setEditingItem(null); }}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Mã HH</label>
                                        <input type="text" className={formStyles.formInput} value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} disabled={!!editingItem} placeholder="Tự động" />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Tên Hàng Hóa</label>
                                        <input type="text" className={formStyles.formInput} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Vốn Nhập</label>
                                        <input type="number" className={formStyles.formInput} value={formData.cost} onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Giá Bán</label>
                                        <input type="number" className={formStyles.formInput} value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Tồn Kho</label>
                                        <input type="number" className={formStyles.formInput} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Đã Bán</label>
                                        <input type="number" className={formStyles.formInput} value={formData.sold} onChange={e => setFormData({ ...formData, sold: Number(e.target.value) })} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Emoji (Ảnh)</label>
                                        <input type="text" className={formStyles.formInput} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} maxLength={2} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button type="button" onClick={() => { setIsCreating(false); setEditingItem(null); }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>Hủy</button>
                                    <button type="submit" className={formStyles.submitBtn} style={{ marginTop: 0, flex: 2 }}>{editingItem ? 'Cập Nhật' : 'Lưu Mặt Hàng'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
