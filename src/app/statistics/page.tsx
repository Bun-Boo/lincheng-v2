'use client';

import { useState } from 'react';
import styles from './Statistics.module.css';

// Dashboard Overview Data
const summaryData = {
    totalRevenue: 45000000,
    totalCost: 28000000,
    totalExpenses: 5000000,
    netProfit: 12000000, // Lãi thực = Doanh thu - Vốn - Chi phí
};

const topItems = [
    { id: 'HH001', name: 'Áo thun Nam Basic', sold: 120, revenue: 42000000 },
    { id: 'HH003', name: 'Giày thể thao', sold: 85, revenue: 72250000 },
    { id: 'HH005', name: 'Mũ lưỡi trai', sold: 45, revenue: 6750000 },
];

export default function Statistics() {
    const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');

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
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này (1-31)</option>
                        <option value="year">Năm nay</option>
                        <option value="custom">Tùy chọn...</option>
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
                    <p className={styles.statValue}>{summaryData.totalRevenue.toLocaleString()}đ</p>
                    <p className={styles.statTrend}><span className={styles.trendUp}>+12.5%</span> so với tháng trước</p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3>Tổng Vốn Hàng</h3>
                        <span className={styles.iconWrapper} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>📦</span>
                    </div>
                    <p className={styles.statValue}>{summaryData.totalCost.toLocaleString()}đ</p>
                    <p className={styles.statTrend}><span className={styles.trendDown}>-2.4%</span> so với tháng trước</p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3>Tổng Chi Phí</h3>
                        <span className={styles.iconWrapper} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>💸</span>
                    </div>
                    <p className={styles.statValue}>{summaryData.totalExpenses.toLocaleString()}đ</p>
                    <p className={styles.statTrend}><span className={styles.trendUp}>+5.1%</span> so với tháng trước</p>
                </div>

                <div className={`${styles.statCard} ${styles.primaryCard}`}>
                    <div className={styles.statHeader}>
                        <h3 style={{ color: 'white' }}>Lãi Thực Tế</h3>
                        <span className={styles.iconWrapper} style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>📈</span>
                    </div>
                    <p className={styles.statValue} style={{ color: 'white' }}>{summaryData.netProfit.toLocaleString()}đ</p>
                    <p className={styles.statTrend} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Lãi = Doanh thu - Vốn - Chi phí</p>
                </div>
            </div>

            <div className={styles.chartsPanel}>
                <div className={styles.chartWrapper}>
                    <div className={styles.chartHeader}>
                        <h3>Biểu đồ Doanh thu & Chi phí</h3>
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

                <div className={styles.topItemsWrapper}>
                    <div className={styles.chartHeader}>
                        <h3>Mặt hàng bán chạy nhất</h3>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
