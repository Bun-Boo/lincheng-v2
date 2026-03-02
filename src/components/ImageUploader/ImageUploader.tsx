import { useRef, useState } from 'react';
import styles from './ImageUploader.module.css';

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

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject(new Error('Canvas context not available'));

                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to WebP or JPEG
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
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
