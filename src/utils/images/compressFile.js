import imageCompression from 'browser-image-compression';

const compressFile = async (file, maxSizeMB, fileType) => imageCompression(file, { maxSizeMB, fileType });

export default compressFile;
