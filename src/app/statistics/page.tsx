'use client';

import { useState } from 'react';
import styles from './Statistics.module.css';
import { useStore } from '@/store/useStore';

export default function Statistics() {
    const { orders, expenses, inventory } = useStore();
    const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month' | 'year' | 'custom'>('all');

    // Time Filtering Logic (simplified for MVP)
    const filterByTime = (dateStr: string) => {
        if (timeRange === 'all') return true;

        const itemDate = new Date(dateStr);
        const today = new Date();

        if (timeRange === 'today') {
            return itemDate.toDateString() === today.toDateString();
        }
        if (timeRange === 'month') {
            return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        }
        if (timeRange === 'year') {
            return itemDate.getFullYear() === today.getFullYear();
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
                        onChange={(e) => setTimeRange(e.target.value as 'all' | 'today' | 'month' | 'year')}
                    >
                        <option value="all">Tất cả thời gian</option>
                        <option value="today">Hôm nay</option>
                        <option value="month">Tháng này (1-31)</option>
                        <option value="year">Năm nay</option>
                    </select>
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
                            <div key={item.id} className={styles.topItem}>
                                <div className={styles.itemRank}>{index + 1}</div>
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
