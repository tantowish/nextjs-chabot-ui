type UploadResponse = {
    success?: boolean;
    data?: any;
    error?: string;
};

export async function deleteBucket(fileLocation: string): Promise<string> {
    const deleteUrl = '/api/files/delete';
    const formData = new FormData();
    formData.append('fileLocation', fileLocation);

    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Failed to delete file: ${fileLocation}`);
        }

        const result: UploadResponse = await response.json();
        if (result.success === true) {
            console.log("Delete gambar berhasil");
            return result.data
        } else {
            throw new Error(`Delete failed for file: ${fileLocation}`);
        }
    } catch (error) {
        console.error(error);
        return (error as Error).message
    }  
}