'use client';

import { useState } from 'react';
import styles from './Debts.module.css';
import formStyles from '../form.module.css';
import { useStore, Client } from '@/store/useStore';
import { calculateClientDebt } from '@/lib/utils';

export default function Debts() {
    const { clients, orders, addClient } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const mappedDebts = clients.map(client => {
        const totalOrders = orders.filter(o => o.clientId === client.id).length;
        const totalDebt = calculateClientDebt(client.id);
        return {
            ...client,
            totalOrders,
            totalDebt
        };
    });

    const filteredDebts = mappedDebts.filter(d =>
        (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.phone.includes(searchTerm) ||
            d.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        d.totalDebt > 0
    );

    const totalOutstandingDebt = filteredDebts.reduce((sum, client) => sum + client.totalDebt, 0);

    const handleCreateClient = (e: React.FormEvent) => {
        e.preventDefault();
        const newClient: Client = {
            id: `KH${Date.now().toString().slice(-4)}`,
            name,
            phone,
            address
        };
        addClient(newClient);
        setIsCreating(false);
        setName('');
        setPhone('');
        setAddress('');
    };

    return (
        <>
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
                        <button
                            className={styles.addButton}
                            onClick={() => setIsCreating(true)}
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            + Thêm Khách Hàng
                        </button>
                    </div>
                </div>

                <div className={`${styles.tableContainer} table-responsive`}>
                    <div className={styles.tableScrollWrapper}>
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
                                            <td
                                                className={styles.emphasizeName}
                                                onClick={() => setSelectedClientId(client.id)}
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >{client.name}</td>
                                            <td>{client.phone}</td>
                                            <td className={styles.addressCell}>{client.address}</td>
                                            <td className={styles.orderCountCell}>{client.totalOrders}</td>
                                            <td className={client.totalDebt > 0 ? styles.debtActive : styles.debtZero}>
                                                {client.totalDebt.toLocaleString()}đ
                                            </td>
                                            <td>
                                                <button className={styles.viewDetailBtn} onClick={() => setSelectedClientId(client.id)}>Chi tiết</button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredDebts.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className={styles.emptyState}>
                                            Không tìm thấy khách hàng nào có công nợ.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Info Modal */}
            {
                selectedClientId && (
                    <div className="modal-overlay">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Chi tiết khách hàng</h2>
                                <button className="modal-close-btn" onClick={() => setSelectedClientId(null)}>×</button>
                            </div>
                            <div className="modal-body">
                                {(() => {
                                    const client = clients.find(c => c.id === selectedClientId);
                                    return (
                                        <>
                                            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tên người mua:</label>
                                                <p style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{client?.name}</p>
                                            </div>
                                            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Số điện thoại:</label>
                                                <p style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{client?.phone}</p>
                                            </div>
                                            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Địa chỉ:</label>
                                                <p style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{client?.address}</p>
                                            </div>
                                            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Công nợ hiện tại:</label>
                                                <p style={{ fontWeight: 'bold', color: 'var(--danger-color)' }}>
                                                    {(() => {
                                                        const totalDebt = calculateClientDebt(client?.id || '');
                                                        return totalDebt > 0 ? totalDebt.toLocaleString() + 'đ' : '0đ';
                                                    })()}
                                                </p>
                                            </div>
                                        </>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Client Modal */}
            {isCreating && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Thêm Khách Hàng Mới</h2>
                            <button className="modal-close-btn" onClick={() => setIsCreating(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateClient}>
                                <div className={formStyles.formGroup}>
                                    <label>Tên Khách Hàng</label>
                                    <input type="text" className={formStyles.formInput} value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Số Điện Thoại</label>
                                    <input type="tel" className={formStyles.formInput} value={phone} onChange={e => setPhone(e.target.value)} required />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Địa Chỉ</label>
                                    <input type="text" className={formStyles.formInput} value={address} onChange={e => setAddress(e.target.value)} required />
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button type="button" onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>Hủy</button>
                                    <button type="submit" className={formStyles.submitBtn} style={{ marginTop: 0, flex: 2 }}>Lưu Khách Hàng</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
