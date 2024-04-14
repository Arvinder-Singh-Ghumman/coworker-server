async function uploadFileToStorage(filePath, destination) {
  try {
    await bucket.upload(filePath, {
      destination: destination,
    });
    console.log('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
export default uploadFileToStorage;
// Example usage:
uploadFileToStorage('path/to/local/file.jpg', 'uploads/file.jpg');
