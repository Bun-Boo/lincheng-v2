'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Đơn NĐT', path: '/orders-ndt', icon: '📦' },
    { name: 'Giao Hàng', path: '/orders-delivery', icon: '🚚' },
    { name: 'Công Nợ', path: '/debts', icon: '💰' },
    { name: 'Tồn Kho', path: '/inventory', icon: '🏭' },
    { name: 'Chi Phí', path: '/expenses', icon: '💸' },
    { name: 'Thống Kê', path: '/statistics', icon: '📊' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>L</div>
                <h1 className={styles.logoText}>Lincheng</h1>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.path} className={styles.navItem}>
                                <Link
                                    href={item.path}
                                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    <span className={styles.icon}>{item.icon}</span>
                                    <span className={styles.text}>{item.name}</span>
                                    {isActive && <div className={styles.activeIndicator} />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>A</div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>Admin</p>
                        <p className={styles.userRole}>Quản lý Kho</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
