const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const scaleFactor = 0.7; // Adjust this value to change compression level
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/jpeg',
                    0.8 // Adjust this value to change compression quality
                );
            };
            img.onerror = () => reject(new Error('Image loading failed'));
        };
        reader.onerror = (error) => reject(error);
    });
};