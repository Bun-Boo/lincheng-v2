'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import styles from './page.module.css';

export default function LoginPage() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(pin);
        if (success) {
            router.push('/');
        } else {
            setError('Mã PIN không chính xác.');
            setPin('');
        }

        setIsLoading(false);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <h1>Lincheng Mini ERP</h1>
                    <p>Hệ thống quản lý bán hàng & công nợ</p>
                </div>

                <form onSubmit={handleLogin} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="pin">Mã PIN Đăng Nhập</label>
                        <input
                            id="pin"
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Nhập mã PIN..."
                            required
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={isLoading || !pin}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
