import imageCompression from 'browser-image-compression';

const compressFile = async (file, maxSizeMB, maxWidthOrHeight, fileType) => imageCompression(file, { maxSizeMB, fileType, maxWidthOrHeight });

export default compressFile;
