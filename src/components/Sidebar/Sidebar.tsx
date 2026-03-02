'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Đơn NĐT', path: '/orders-ndt', icon: '📦' },
    { name: 'Giao Hàng', path: '/orders-delivery', icon: '🚚' },
    { name: 'Khách Hàng', path: '/customers', icon: '👥' },
    { name: 'Công Nợ', path: '/debts', icon: '💰' },
    { name: 'Tồn Kho', path: '/inventory', icon: '🏭' },
    { name: 'Chi Phí', path: '/expenses', icon: '💸' },
    { name: 'Thống Kê', path: '/statistics', icon: '📊' },
];

const LOGO_KEY = 'lincheng-logo';

export default function Sidebar() {
    const pathname = usePathname();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(LOGO_KEY);
        if (saved) setLogoSrc(saved);
    }, []);

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setLogoSrc(base64);
            localStorage.setItem(LOGO_KEY, base64);
        };
        reader.readAsDataURL(file);
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <div
                    className={styles.logoImageWrapper}
                    onClick={handleLogoClick}
                    title="Nhấn để đổi logo"
                >
                    {logoSrc ? (
                        <img src={logoSrc} alt="Logo" className={styles.logoImage} />
                    ) : (
                        <div className={styles.logoIcon}>L</div>
                    )}
                    <div className={styles.logoOverlay}>📷</div>
                </div>
                <h1 className={styles.logoText}>Lincheng</h1>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
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
