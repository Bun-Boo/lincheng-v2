import { useRef, useState } from 'react';
import styles from './ImageUploader.module.css';
import { compressImage } from '@/lib/imageUtils';

interface Props {
    onImageSelected: (base64: string) => void;
    className?: string;
    buttonText?: string;
}

export default function ImageUploader({ onImageSelected, className, buttonText = '📷' }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsCompressing(true);
        try {
            const base64 = await compressImage(file);
            onImageSelected(base64);
        } catch (error) {
            console.error('Error compressing image:', error);
            alert('Không thể xử lý ảnh này. Vui lòng thử ảnh khác.');
        } finally {
            setIsCompressing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    return (
        <div className={`${styles.uploaderContainer} ${className || ''}`}>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadBtn}
                disabled={isCompressing}
                title="Chụp/Tải ảnh lên"
            >
                {isCompressing ? '⏳' : buttonText}
            </button>
        </div>
    );
}
