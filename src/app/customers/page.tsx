'use client';

import { useState } from 'react';
import styles from './Customers.module.css';
import formStyles from '../form.module.css';
import { useStore, Client } from '@/store/useStore';

export default function Customers() {
    const { clients, orders, addClient, updateClient, deleteClient } = useStore();
    const [isCreating, setIsCreating] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const calculateDebt = (clientId: string) => {
        const clientOrders = orders.filter(o => o.clientId === clientId);
        return clientOrders.reduce((sum, o) => sum + (o.price * o.quantity) - o.paid, 0);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newClient: Client = {
            id: `KH${clients.length > 0 ? (parseInt(clients[clients.length - 1].id.slice(2)) + 1).toString().padStart(3, '0') : '001'}`,
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

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClient) {
            updateClient(editingClient.id, { name, phone, address });
            setEditingClient(null);
            setIsCreating(false);
            setName('');
            setPhone('');
            setAddress('');
        }
    };

    const handleDelete = (clientId: string) => {
        const hasOrders = orders.some(o => o.clientId === clientId);
        if (hasOrders) {
            alert('Không thể xóa khách hàng đã có đơn hàng!');
            return;
        }
        if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
            deleteClient(clientId);
        }
    };

    const openCreate = () => {
        setIsCreating(true);
        setEditingClient(null);
        setName('');
        setPhone('');
        setAddress('');
    };

    const openEdit = (client: Client) => {
        setEditingClient(client);
        setIsCreating(true);
        setName(client.name);
        setPhone(client.phone);
        setAddress(client.address);
    };

    return (
        <>
            <div className="page-container">
                <div className={styles.header}>
                    <h1 className="page-title">Thông Tin Khách Hàng</h1>
                    <button className={styles.addButton} onClick={openCreate}>+ Thêm Khách Hàng</button>
                </div>

                <div className={`${styles.tableContainer} table-responsive`}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Khách Hàng</th>
                                <th>Số Điện Thoại</th>
                                <th>Địa Chỉ</th>
                                <th>Công Nợ Hiện Tại</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => {
                                const debt = calculateDebt(client.id);
                                return (
                                    <tr key={client.id} className={styles.tableRow}>
                                        <td>{client.id}</td>
                                        <td className={styles.emphasize}>{client.name}</td>
                                        <td>{client.phone}</td>
                                        <td>{client.address}</td>
                                        <td className={debt > 0 ? styles.profitNeg : ''}>
                                            {debt > 0 ? debt.toLocaleString() + 'đ' : '0đ'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => openEdit(client)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                                    title="Sửa"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--danger-color, #ef4444)' }}
                                                    title="Xóa"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>Chưa có khách hàng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreating && (
                <div className="modal-overlay" onClick={() => setIsCreating(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingClient ? 'Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng Mới'}</h2>
                            <button className="modal-close-btn" onClick={() => setIsCreating(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingClient ? handleUpdate : handleCreate}>
                                <div className={formStyles.formGroup}>
                                    <label>Tên Khách Hàng</label>
                                    <input type="text" className={formStyles.formInput} value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Số Điện Thoại</label>
                                    <input type="text" className={formStyles.formInput} value={phone} onChange={e => setPhone(e.target.value)} required />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Địa Chỉ</label>
                                    <input type="text" className={formStyles.formInput} value={address} onChange={e => setAddress(e.target.value)} required />
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button type="button" onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>Hủy</button>
                                    <button type="submit" className={formStyles.submitBtn} style={{ marginTop: 0, flex: 2 }}>
                                        {editingClient ? 'Cập Nhật' : 'Thêm Khách Hàng'}
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
