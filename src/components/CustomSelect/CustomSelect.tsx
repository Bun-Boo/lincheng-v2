'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './CustomSelect.module.css';

interface CustomSelectProps {
    value: string;
    options: { value: string; label: string; className?: string }[];
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
}

export default function CustomSelect({ value, options, onChange, className = '', placeholder }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find(o => o.value === value);

    const updatePosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && dropdownRef.current && containerRef.current) {
                if (!dropdownRef.current.contains(event.target as Node) && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            }
        };

        const handleScroll = (e: Event) => {
            if (isOpen) {
                // Ignore scroll events originating from inside the dropdown itself
                if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
                    return;
                }
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const dropdownContent = isOpen ? (
        <div
            ref={dropdownRef}
            className={styles.optionsDropdown}
            style={{
                top: `${dropdownStyle.top}px`,
                left: `${dropdownStyle.left}px`,
                width: `${dropdownStyle.width}px`
            }}
        >
            {options.map((opt) => (
                <div
                    key={opt.value}
                    className={`${styles.optionItem} ${value === opt.value ? styles.selected : ''} ${opt.className || ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange(opt.value);
                        setIsOpen(false);
                    }}
                >
                    {opt.label}
                </div>
            ))}
        </div>
    ) : null;

    return (
        <div
            className={styles.customSelectContainer}
            ref={containerRef}
        >
            <div
                className={`${styles.selectTrigger} ${className} ${selectedOption?.className || ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    if (!isOpen) updatePosition();
                    setIsOpen(!isOpen);
                }}
            >
                <span>{selectedOption ? selectedOption.label : (placeholder || 'Chọn...')}</span>
                <span className={styles.arrow}>▼</span>
            </div>

            {typeof document !== 'undefined' ? createPortal(dropdownContent, document.body) : null}
        </div>
    );
}
