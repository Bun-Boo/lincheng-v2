'use client';

import { useState, useMemo } from 'react';
import styles from './OrdersNDT.module.css';
import formStyles from '../form.module.css';
import { useStore, Order, OrderStatus } from '@/store/useStore';

export default function OrdersNDT() {
    const { orders, clients, addOrder, updateOrder } = useStore();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [clientId, setClientId] = useState('');
    const [itemName, setItemName] = useState('');
    const [image, setImage] = useState('📦');
    const [price, setPrice] = useState('');
    const [cost, setCost] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [feeNDT, setFeeNDT] = useState('');
    const [paid, setPaid] = useState('');

    // Sort by new first
    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [orders]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) return alert('Vui lòng chọn khách hàng');

        const newOrder: Order = {
            id: `NDT${Date.now().toString().slice(-4)}`,
            clientId,
            itemName,
            image,
            quantity: Number(quantity) || 1,
            price: Number(price) || 0,
            cost: Number(cost) || 0,
            feeNDT: Number(feeNDT) || 0,
            paid: Number(paid) || 0,
            status: 'Chờ',
            createdAt: new Date().toISOString()
        };

        addOrder(newOrder);
        setIsCreating(false);

        // Reset form
        setClientId('');
        setItemName('');
        setImage('📦');
        setQuantity('1');
        setPrice('');
        setCost('');
        setFeeNDT('');
        setPaid('');
    };

    const getClientInfo = (id: string) => clients.find(c => c.id === id);

    return (
        <>
            <div className="page-container">
                <div className={styles.header}>
                    <h1 className="page-title">Quản lý Đơn NĐT</h1>
                    <button className={styles.addButton} onClick={() => setIsCreating(true)}>+ Tạo Đơn Mới</button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ảnh</th>
                                <th>Người Mua</th>
                                <th>Tên Hàng</th>
                                <th>SL</th>
                                <th>Giá (Bán)</th>
                                <th>Vốn</th>
                                <th>Phí NĐT</th>
                                <th>Lãi</th>
                                <th>Đã TT</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map((order) => {
                                const profit = (order.price * order.quantity) - order.cost - order.feeNDT;
                                const client = getClientInfo(order.clientId);

                                return (
                                    <tr key={order.id} className={styles.tableRow}>
                                        <td>{order.id}</td>
                                        <td><span style={{ fontSize: '1.25rem' }}>{order.image || '📦'}</span></td>
                                        <td
                                            className={styles.emphasize}
                                            onClick={() => setSelectedOrder(order)}
                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {client?.name || 'Khách Vô Danh'}
                                        </td>
                                        <td>{order.itemName}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.price.toLocaleString()}đ</td>
                                        <td>{order.cost.toLocaleString()}đ</td>
                                        <td>{order.feeNDT.toLocaleString()}đ</td>
                                        <td className={profit > 0 ? styles.profitPos : styles.profitNeg}>
                                            {profit.toLocaleString()}đ
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={order.paid === 0 ? '' : order.paid}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const numValues = parseFloat(val);
                                                    updateOrder(order.id, { paid: isNaN(numValues) || numValues < 0 ? 0 : numValues });
                                                }}
                                                className={styles.inlineInput}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                                                className={`${styles.statusSelect} ${order.status === 'Chờ' ? styles.statusWait : order.status === 'Đã đặt' ? styles.statusOrdered : styles.statusReceived}`}
                                            >
                                                <option value="Chờ">Chờ</option>
                                                <option value="Đã đặt">Đã đặt</option>
                                                <option value="Nhận hàng">Nhận hàng</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}

                            {sortedOrders.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '24px' }}>Chưa có đơn hàng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Info Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Chi tiết khách hàng</h2>
                            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            {(() => {
                                const client = getClientInfo(selectedOrder.clientId);
                                return (
                                    <>
                                        <div className={styles.infoGroup}>
                                            <label>Tên người mua:</label>
                                            <p>{client?.name}</p>
                                        </div>
                                        <div className={styles.infoGroup}>
                                            <label>Số điện thoại:</label>
                                            <p>{client?.phone}</p>
                                        </div>
                                        <div className={styles.infoGroup}>
                                            <label>Địa chỉ:</label>
                                            <p>{client?.address}</p>
                                        </div>
                                        {/* Simplified for now, real debt computed in M3 */}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Order Modal */}
            {isCreating && (
                <div className="modal-overlay" onClick={() => setIsCreating(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Tạo Đơn NĐT Mới</h2>
                            <button className="modal-close-btn" onClick={() => setIsCreating(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreate}>
                                <div className={formStyles.formGroup}>
                                    <label>Khách Hàng</label>
                                    <select
                                        className={formStyles.formInput}
                                        value={clientId}
                                        onChange={e => setClientId(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Chọn Khách Hàng --</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Tên Mặt Hàng</label>
                                        <input type="text" className={formStyles.formInput} value={itemName} onChange={e => setItemName(e.target.value)} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Số Lượng</label>
                                        <input type="number" min="1" className={formStyles.formInput} value={quantity} onChange={e => setQuantity(e.target.value)} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Ảnh(Emoji)</label>
                                        <input type="text" className={formStyles.formInput} value={image} onChange={e => setImage(e.target.value)} maxLength={2} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Giá (Bán cho KH)</label>
                                        <input type="number" className={formStyles.formInput} value={price} onChange={e => setPrice(e.target.value)} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Vốn nhập</label>
                                        <input type="number" className={formStyles.formInput} value={cost} onChange={e => setCost(e.target.value)} required />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={formStyles.formGroup}>
                                        <label>Phí NĐT</label>
                                        <input type="number" className={formStyles.formInput} value={feeNDT} onChange={e => setFeeNDT(e.target.value)} required />
                                    </div>
                                    <div className={formStyles.formGroup}>
                                        <label>Đã Thanh Toán</label>
                                        <input type="number" className={formStyles.formInput} value={paid} onChange={e => setPaid(e.target.value)} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button type="button" onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>Hủy</button>
                                    <button type="submit" className={formStyles.submitBtn} style={{ marginTop: 0, flex: 2 }}>Tạo Đơn Hàng</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
