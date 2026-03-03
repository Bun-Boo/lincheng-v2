'use client';

import { useState, useMemo } from 'react';
import styles from './OrdersNDT.module.css';
import formStyles from '../form.module.css';
import { useStore, Order, OrderStatus } from '@/store/useStore';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import ImageUploader from '@/components/ImageUploader/ImageUploader';
import { compressImage } from '@/lib/imageUtils';

export default function OrdersNDT() {
    const { orders, clients, addOrder, updateOrder, deleteOrder } = useStore();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    // Filter State
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Form State
    const [clientId, setClientId] = useState('');
    const [itemName, setItemName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [cost, setCost] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [feeNDT, setFeeNDT] = useState('');
    const [paid, setPaid] = useState('');

    // Filter and Sort by new first
    const sortedOrders = useMemo(() => {
        let filtered = [...orders];
        if (fromDate) {
            filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(fromDate));
        }
        if (toDate) {
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(o => new Date(o.createdAt) <= end);
        }
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [orders, fromDate, toDate]);

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
        setImage('');
        setQuantity('1');
        setPrice('');
        setCost('');
        setFeeNDT('');
        setPaid('');
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOrder) {
            updateOrder(editingOrder.id, {
                clientId,
                itemName,
                image,
                quantity: Number(quantity) || 1,
                price: Number(price) || 0,
                cost: Number(cost) || 0,
                feeNDT: Number(feeNDT) || 0,
                paid: Number(paid) || 0,
            });
            setEditingOrder(null);
            setIsCreating(false);

            // Reset form
            setClientId('');
            setItemName('');
            setImage('');
            setQuantity('1');
            setPrice('');
            setCost('');
            setFeeNDT('');
            setPaid('');
        }
    };

    const openCreate = () => {
        setEditingOrder(null);
        setIsCreating(true);
        setClientId('');
        setItemName('');
        setImage('');
        setQuantity('1');
        setPrice('');
        setCost('');
        setFeeNDT('');
        setPaid('');
    };

    const openEdit = (order: Order) => {
        setEditingOrder(order);
        setIsCreating(true);
        setClientId(order.clientId);
        setItemName(order.itemName);
        setImage(order.image || '');
        setQuantity(order.quantity.toString());
        setPrice(order.price.toString());
        setCost(order.cost.toString());
        setFeeNDT(order.feeNDT.toString());
        setPaid(order.paid.toString());
    };

    const handleCloseCreate = () => {
        setEditingOrder(null);
        setIsCreating(false);
        setClientId('');
        setItemName('');
        setImage('');
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
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Từ:</label>
                            <input
                                type="date"
                                className={formStyles.formInput}
                                style={{ padding: '6px 10px', width: 'auto' }}
                                value={fromDate}
                                onChange={e => setFromDate(e.target.value)}
                            />
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Đến:</label>
                            <input
                                type="date"
                                className={formStyles.formInput}
                                style={{ padding: '6px 10px', width: 'auto' }}
                                value={toDate}
                                onChange={e => setToDate(e.target.value)}
                            />
                        </div>
                        <button className={styles.addButton} onClick={openCreate}>+ Tạo Đơn Mới</button>
                    </div>
                </div>

                <div className={`${styles.tableContainer} table - responsive`}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày Tạo</th>
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map((order) => {
                                const profit = (order.price * order.quantity) - order.cost - order.feeNDT;
                                const client = getClientInfo(order.clientId);

                                return (
                                    <tr key={order.id} className={styles.tableRow}>
                                        <td>{order.id}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            {order.image?.startsWith('http') || order.image?.startsWith('data:image') ? (
                                                <img src={order.image} alt={order.itemName} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            ) : (
                                                <span style={{ fontSize: '1.25rem' }}>{order.image || '📦'}</span>
                                            )}
                                        </td>
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
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <CustomSelect
                                                value={order.status}
                                                onChange={(newStatus) => updateOrder(order.id, { status: newStatus as OrderStatus })}
                                                className={`${styles.statusSelect} ${styles[order.status === 'Chờ' ? 'statusWait' : order.status === 'Đã đặt' ? 'statusOrdered' : 'statusReceived']} `}
                                                options={[
                                                    { value: "Chờ", label: "Chờ", className: styles.statusWait },
                                                    { value: "Đã đặt", label: "Đã đặt", className: styles.statusOrdered },
                                                    { value: "Nhận hàng", label: "Nhận hàng", className: styles.statusReceived },
                                                ]}
                                            />
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEdit(order);
                                                    }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                                    title="Sửa"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
                                                            deleteOrder(order.id);
                                                        }
                                                    }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--danger-color, #ef4444)' }}
                                                    title="Xóa đơn hàng"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
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

            </div >

            {/* Info Modal */}
            {
                selectedOrder && (
                    <div className="modal-overlay">
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
                                            <div className={styles.infoGroup}>
                                                <label>Công nợ hiện tại:</label>
                                                <p className={styles.profitNeg} style={{ fontWeight: 'bold' }}>
                                                    {(() => {
                                                        const clientOrders = orders.filter(o => o.clientId === client?.id);
                                                        const totalDebt = clientOrders.reduce((sum, o) => sum + (o.price * o.quantity) - o.paid, 0);
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

            {/* Create Order Modal */}
            {
                isCreating && (
                    <div className="modal-overlay">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingOrder ? 'Sửa Đơn NĐT' : 'Tạo Đơn NĐT Mới'}</h2>
                                <button type="button" className="modal-close-btn" onClick={handleCloseCreate}>×</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={editingOrder ? handleUpdate : handleCreate}>
                                    <div className={formStyles.formGroup}>
                                        <label>Khách Hàng</label>
                                        <CustomSelect
                                            className={formStyles.formInput}
                                            value={clientId}
                                            onChange={val => setClientId(val)}
                                            placeholder="-- Chọn Khách Hàng --"
                                            options={[
                                                { value: "", label: "-- Chọn Khách Hàng --" },
                                                ...clients.map(c => ({
                                                    value: c.id,
                                                    label: `${c.name} - ${c.phone}`
                                                }))
                                            ]}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                        <div className={formStyles.formGroup}>
                                            <label>Tên Mặt Hàng</label>
                                            <input type="text" className={formStyles.formInput} value={itemName} onChange={e => setItemName(e.target.value)} required />
                                        </div>
                                        <div className={formStyles.formGroup}>
                                            <label>Số Lượng</label>
                                            <input type="number" min="1" className={formStyles.formInput} value={quantity} onChange={e => setQuantity(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className={formStyles.formGroup} style={{ marginTop: '4px' }}>
                                        <label>Ảnh sản phẩm (Link, Emoji hoặc tải từ máy)</label>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{
                                                width: '64px', height: '64px', flexShrink: 0,
                                                border: '1px dashed var(--border-color)', borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'rgba(0,0,0,0.02)', overflow: 'hidden'
                                            }}>
                                                {image && (image.startsWith('http') || image.startsWith('data:image')) ? (
                                                    <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontSize: '2rem' }}>{image || '📦'}</span>
                                                )}
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ display: 'flex', gap: '8px', height: '40px' }}>
                                                    <input
                                                        type="text"
                                                        className={formStyles.formInput}
                                                        style={{
                                                            flex: 1,
                                                            fontFamily: image?.startsWith('data:image') ? 'monospace' : 'inherit',
                                                            fontSize: image?.startsWith('data:image') ? '0.8rem' : 'inherit'
                                                        }}
                                                        value={image}
                                                        onChange={e => setImage(e.target.value)}
                                                        onPaste={async (e) => {
                                                            const items = e.clipboardData?.items;
                                                            if (!items) return;
                                                            for (let i = 0; i < items.length; i++) {
                                                                if (items[i].type.indexOf('image') !== -1) {
                                                                    const file = items[i].getAsFile();
                                                                    if (file) {
                                                                        e.preventDefault();
                                                                        try {
                                                                            const base64 = await compressImage(file);
                                                                            setImage(base64);
                                                                        } catch (err) {
                                                                            console.error('Lỗi khi nén ảnh từ clipboard:', err);
                                                                            alert('Không thể dán ảnh này. Vui lòng thử lại.');
                                                                        }
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        placeholder="Dán link ảnh, nhập emoji, hoặc dán ảnh (Ctrl+V)..."
                                                    />
                                                    <ImageUploader onImageSelected={(base64) => setImage(base64)} />
                                                </div>
                                                {image?.startsWith('data:image') && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                        <span style={{ color: 'var(--success-color, #10b981)' }}>✓ Đã tải ảnh lên thành công</span>
                                                        <button
                                                            type="button"
                                                            onClick={e => { e.preventDefault(); setImage(''); }}
                                                            style={{ border: 'none', background: 'none', color: 'var(--danger-color, #ef4444)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                                        >
                                                            Xóa ảnh
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                                        <button type="button" onClick={handleCloseCreate} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>Hủy</button>
                                        <button type="submit" className={formStyles.submitBtn} style={{ marginTop: 0, flex: 2 }}>{editingOrder ? 'Cập Nhật' : 'Tạo Đơn Hàng'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
