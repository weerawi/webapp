// lib/services/uploadService.ts
export const uploadService = {
    async uploadImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_upload_preset'); // Create this in Cloudinary
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      return data.secure_url;
    }
  };