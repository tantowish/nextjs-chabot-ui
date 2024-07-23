type UploadResponse = {
    success?: boolean;
    data?: any;
    error?: string;
};

export async function uploadBucket(file: File): Promise<string> {
    const uploadUrl = '/api/files/upload';
    const dir = 'chabot';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dir', dir);

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Failed to upload file: ${file.name}`);
        }

        const result: UploadResponse = await response.json();
        if (result.success === true) {
            console.log("upload gambar berhasil");
            return result.data
        } else {
            throw new Error(`Upload failed for file: ${file.name}`);
        }
    } catch (error) {
        console.error(error);
        return (error as Error).message// Using index as key
    }  
}