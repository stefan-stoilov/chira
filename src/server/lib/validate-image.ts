const MAX_SIZE_MB = 1;

function checkBlobSizeIsValid(blob: Blob, maxSizeInMB = MAX_SIZE_MB): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  return blob.size <= maxSizeInBytes;
}

/**
 * Utility function used to check if a Blob is of File type `png`, `jpg`/`jpeg` or `webp` and does not exceed allowed size.
 *
 * @param {Blob} blob - Blob to be checked.
 *
 * @returns {boolean} Whether the blob is valid.
 */
export async function validateImage(blob: Blob): Promise<boolean> {
  const isValid = checkBlobSizeIsValid(blob);

  if (!isValid) return false;

  // Read the first 12 bytes (enough to cover all signatures)
  const buffer = await blob.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Check for JPEG (first 3 bytes)
  const jpegSignature = [0xff, 0xd8, 0xff];
  const isJPEG = jpegSignature.every((byte, index) => bytes[index] === byte);

  if (isJPEG) return true;

  // Check for PNG (first 8 bytes)
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const isPNG = pngSignature.every((byte, index) => bytes[index] === byte);

  if (isPNG) return true;

  // Check for WEBP (RIFF header at 0–3, WEBP at 8–11)
  const isWEBP =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 && // "RIFF"
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50; // "WEBP"

  if (isWEBP) return true;

  return false;
}
