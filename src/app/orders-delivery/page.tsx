'use client';

import { useState } from 'react';
import styles from './OrdersDelivery.module.css';
import formStyles from '../form.module.css';
import { useStore, Delivery, DeliveryStatus } from '@/store/useStore';
import CustomSelect from '@/components/CustomSelect/CustomSelect';

export default function OrdersDelivery() {
    const { deliveries, orders, clients, addDelivery, updateDelivery } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    // Form State
    const [deliveryId, setDeliveryId] = useState('');
    const [orderNdtId, setOrderNdtId] = useState('');

    // Computations
    const getOrderInfo = (id: string) => orders.find(o => o.id === id);
    const getClientInfo = (id: string) => clients.find(c => c.id === id);

    const mappedDeliveries = deliveries.map(d => {
        const order = getOrderInfo(d.orderNdtId);
        const client = order ? getClientInfo(order.clientId) : null;
        return {
            ...d,
            buyerName: client?.name || '---',
            phone: client?.phone || '---',
            itemName: order?.itemName || '---',
            quantity: order?.quantity || 0,
            price: order?.price || 0,
            paid: order?.paid || 0,
        };
    });

    const filteredDeliveries = mappedDeliveries.filter(d =>
        d.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Available orders for new delivery (doesn't already have one)
    const availableOrders = orders.filter(
        (order) => !deliveries.some((d) => d.orderNdtId === order.id)
    );

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!deliveryId || !orderNdtId) return alert('Vui lòng điền đủ mã và chọn Đơn NĐT');

        // Check if delivery ID exists
        if (deliveries.some(d => d.id === deliveryId)) {
            return alert('Mã Vận Đơn (MVĐ) đã tồn tại!');
        }

        const newDelivery: Delivery = {
            id: deliveryId,
            orderNdtId,
            createdAt: new Date().toISOString(),
            status: 'Đang giao'
        };

        addDelivery(newDelivery);
        setIsCreating(false);

        // Reset form
        setDeliveryId('');
        setOrderNdtId('');
    };

    return (
        <>
            <div className="page-container">
                <div className={styles.header}>
                    <h1 className="page-title">Quản lý Giao Hàng (MVĐ)</h1>

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
                        <button className={styles.addButton} onClick={() => setIsCreating(true)}>+ Thêm MVĐ</button>
                    </div>
                </div>

                <div className={`${styles.tableContainer} table-responsive`}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>MVĐ</th>
                                <th>Người Mua</th>
                                <th>SĐT</th>
                                <th>Tên Hàng</th>
                                <th>SL</th>
                                <th>Giá</th>
                                <th>COD</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map((delivery) => {
                                const cod = delivery.price - delivery.paid;
                                return (
                                    <tr key={delivery.id} className={styles.tableRow}>
                                        <td className={styles.emphasizeId}>{delivery.id}</td>
                                        <td
                                            className={styles.emphasizeName}
                                            onClick={() => {
                                                const order = getOrderInfo(delivery.orderNdtId);
                                                if (order?.clientId) setSelectedClientId(order.clientId);
                                            }}
                                            style={getOrderInfo(delivery.orderNdtId)?.clientId ? { cursor: 'pointer', textDecoration: 'underline' } : {}}
                                        >{delivery.buyerName}</td>
                                        <td>{delivery.phone}</td>
                                        <td>{delivery.itemName}</td>
                                        <td>{delivery.quantity}</td>
                                        <td>{delivery.price.toLocaleString()}đ</td>
                                        <td className={cod > 0 ? styles.codActive : styles.codZero}>
                                            {cod.toLocaleString()}đ
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <CustomSelect
                                                value={delivery.status}
                                                onChange={(newStatus) => updateDelivery(delivery.id, { status: newStatus as DeliveryStatus })}
                                                className={`${styles.statusSelect} ${styles[delivery.status === 'Đang giao' ? 'statusDelivering' : delivery.status === 'Giao thành công' ? 'statusSuccess' : 'statusFailed']}`}
                                                options={[
                                                    { value: "Đang giao", label: "Đang giao", className: styles.statusDelivering },
                                                    { value: "Giao thành công", label: "Giao thành công", className: styles.statusSuccess },
                                                    { value: "Giao thất bại", label: "Giao thất bại", className: styles.statusFailed },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredDeliveries.length === 0 && (
                                <tr>
                                    <td colSpan={8} className={styles.emptyState}>
                                        Không tìm thấy dữ liệu vận đơn nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Modal */}
            {
                selectedClientId && (
                    <div className="modal-overlay" onClick={() => setSelectedClientId(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Chi tiết khách hàng</h2>
                                <button className="modal-close-btn" onClick={() => setSelectedClientId(null)}>×</button>
                            </div>
                            <div className="modal-body">
                                {(() => {
                                    const client = getClientInfo(selectedClientId);
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

            {/* Create Delivery Modal */}
            {isCreating && (
                <div className="modal-overlay" onClick={() => setIsCreating(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Thêm Mã Vận Đơn Mới</h2>
                            <button className="modal-close-btn" onClick={() => setIsCreating(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreate}>

                                <div className={formStyles.formGroup}>
                                    <label>Mã Vận Đơn (MVĐ)</label>
                                    <input
                                        type="text"
                                        className={formStyles.formInput}
                                        value={deliveryId}
                                        onChange={e => setDeliveryId(e.target.value)}
                                        placeholder="VD: SPX123456789"
                                        required
                                    />
                                </div>

                                <div className={formStyles.formGroup}>
                                    <label>Liên kết Đơn NĐT</label>
                                    <CustomSelect
                                        className={formStyles.formInput}
                                        value={orderNdtId}
                                        onChange={val => setOrderNdtId(val)}
                                        placeholder="-- Chọn đơn Mua Hộ --"
                                        options={[
                                            { value: "", label: "-- Chọn đơn Mua Hộ --", className: "hidden" },
                                            ...availableOrders.map(o => {
                                                const c = getClientInfo(o.clientId);
                                                return {
                                                    value: o.id,
                                                    label: `${o.id} - ${c?.name} - ${o.itemName}`
                                                };
                                            })
                                        ]}
                                    />
                                    {availableOrders.length === 0 && (
                                        <p style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '4px' }}>
                                            Tất cả đơn NĐT hiện tại đã có mã MVĐ hoặc chưa có đơn NĐT nào.
                                        </p>
                                    )}
                                </div>

                                <button type="submit" className={formStyles.submitBtn}>Tạo Vận Đơn</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
