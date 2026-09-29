import jsQR from 'jsqr';

export interface DecodedQRResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Decodes a QR code from an image File or Blob using HTML5 Canvas and jsQR
 */
export async function decodeQrFromImageFile(file: File): Promise<DecodedQRResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve({ success: false, error: 'Failed to read image file.' });
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve({ success: false, error: 'Could not initialize image processing context.' });
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            resolve({ success: true, data: code.data });
          } else {
            resolve({
              success: false,
              error: 'No QR code could be extracted via optical scan. The image will be processed via AI visual analysis.'
            });
          }
        } catch (err: any) {
          resolve({
            success: false,
            error: err?.message || 'Error processing image canvas.'
          });
        }
      };

      img.onerror = () => {
        resolve({ success: false, error: 'Failed to load image for scanning.' });
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'Error reading file from disk.' });
    };

    reader.readAsDataURL(file);
  });
}
