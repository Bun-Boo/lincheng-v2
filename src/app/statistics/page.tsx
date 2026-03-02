'use client';

import { useState } from 'react';
import styles from './Statistics.module.css';
import { useStore } from '@/store/useStore';

export default function Statistics() {
    const { orders, expenses, inventory } = useStore();
    const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month' | 'year' | 'custom'>('all');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    // Time Filtering Logic (simplified for MVP)
    const filterByTime = (dateStr: string) => {
        if (timeRange === 'all') return true;

        const itemDate = new Date(dateStr);
        const today = new Date();

        if (timeRange === 'today') {
            return itemDate.toDateString() === today.toDateString();
        }
        if (timeRange === 'week') {
            const firstDayOfWeek = new Date(today);
            firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
            return itemDate >= firstDayOfWeek && itemDate <= lastDayOfWeek;
        }
        if (timeRange === 'month') {
            return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        }
        if (timeRange === 'year') {
            return itemDate.getFullYear() === today.getFullYear();
        }
        if (timeRange === 'custom') {
            if (customStart && customEnd) {
                const end = new Date(customEnd);
                end.setHours(23, 59, 59, 999);
                return itemDate >= new Date(customStart) && itemDate <= end;
            }
        }
        return true;
    };

    const filteredOrders = orders.filter(o => filterByTime(o.createdAt));
    const filteredExpenses = expenses.filter(e => filterByTime(e.date));

    // Compute Summaries
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
    const totalCost = filteredOrders.reduce((sum, o) => sum + o.cost + o.feeNDT, 0);
    const totalExpensesAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalCost - totalExpensesAmount;

    // Compute Top Items from Inventory (Sorted by sold qty)
    const topItems = [...inventory]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)
        .map(item => ({
            id: item.id,
            name: item.name,
            sold: item.sold,
            revenue: item.sold * item.price
        }));

    return (
        <div className="page-container">
            <div className={styles.header}>
                <h1 className="page-title">Thống Kê Tổng Quan</h1>

                <div className={styles.actions}>
                    <select
                        className={styles.timeSelect}
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                    >
                        <option value="all">Tất cả thời gian</option>
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này (1-31)</option>
                        <option value="year">Năm nay</option>
                        <option value="custom">Tùy chọn...</option>
                    </select>

                    {timeRange === 'custom' && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="date" className={styles.timeSelect} style={{ width: 'auto' }} value={customStart} onChange={e => setCustomStart(e.target.value)} />
                            <span>-</span>
                            <input type="date" className={styles.timeSelect} style={{ width: 'auto' }} value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                        </div>
                    )}

                    <button className={styles.exportButton}>📥 Xuất Báo Cáo</button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3>Tổng Doanh Thu</h3>
                        <span className={styles.iconWrapper} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>💰</span>
                    </div>
                    <p className={styles.statValue}>{totalRevenue.toLocaleString()}đ</p>
                    <p className={styles.statTrend}><span className={styles.trendUp}>Tổng</span> tiền bán (dựa trên Đơn NĐT)</p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3>Tổng Vốn Hàng</h3>
                        <span className={styles.iconWrapper} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>📦</span>
                    </div>
                    <p className={styles.statValue}>{totalCost.toLocaleString()}đ</p>
                    <p className={styles.statTrend}><span className={styles.trendDown}>Bao gồm</span> Vốn nhập + Phí NĐT</p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3>Tổng Chi Phí Hoạt Động</h3>
                        <span className={styles.iconWrapper} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>💸</span>
                    </div>
                    <p className={styles.statValue}>{totalExpensesAmount.toLocaleString()}đ</p>
                    <p className={styles.statTrend}><span className={styles.trendUp}>Từ</span> Danh mục quản lý chi phí</p>
                </div>

                <div className={`${styles.statCard} ${styles.primaryCard}`}>
                    <div className={styles.statHeader}>
                        <h3 style={{ color: 'white' }}>Lãi Thực Tế</h3>
                        <span className={styles.iconWrapper} style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>📈</span>
                    </div>
                    <p className={styles.statValue} style={{ color: 'white' }}>{netProfit.toLocaleString()}đ</p>
                    <p className={styles.statTrend} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Vượt kỳ vọng so với tháng trước
                    </p>
                </div>
            </div>

            <div className={styles.chartsPanel}>
                <div className={styles.chartWrapper}>
                    <div className={styles.chartHeader}>
                        <h3>Biểu đồ Doanh thu & Chi phí</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mô phỏng minh hoạ tuần gần nhất</p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(180deg, var(--primary-color), var(--primary-hover))' }}></span>
                                <span>Doanh thu</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.8)' }}></span>
                                <span>Chi phí</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mockChartArea}>
                        <div className={styles.barsContainer}>
                            {[60, 80, 40, 90, 70, 100, 85].map((h, i) => (
                                <div key={i} className={styles.barGroup}>
                                    <div className={styles.barRevenue} style={{ height: `${h}%` }}></div>
                                    <div className={styles.barExpense} style={{ height: `${h * 0.4}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.chartLabels}>
                            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                        </div>
                    </div>
                </div>

                <div className={styles.topItemsWrapper} style={{ overflowY: 'auto' }}>
                    <div className={styles.chartHeader}>
                        <h3>Mặt hàng bán chạy nhất (Từ Tồn Kho)</h3>
                    </div>
                    <div className={styles.topItemsList}>
                        {topItems.map((item, index) => (
                            <div key={item.id} className={styles.topItem} style={{
                                background: index === 0 ? 'rgba(245, 158, 11, 0.1)' : index === 1 ? 'rgba(209, 213, 219, 0.1)' : index === 2 ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                                border: index === 0 ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid transparent'
                            }}>
                                <div className={styles.itemRank} style={{
                                    background: index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : 'var(--border-color)',
                                    color: index < 3 ? 'white' : 'var(--text-secondary)'
                                }}>{index + 1}</div>
                                <div className={styles.itemInfo}>
                                    <h4>{item.name}</h4>
                                    <p>{item.sold} sản phẩm</p>
                                </div>
                                <div className={styles.itemRevenue}>
                                    {item.revenue.toLocaleString()}đ
                                </div>
                            </div>
                        ))}
                        {topItems.length === 0 && (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                Chưa có dữ liệu bán hàng.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
