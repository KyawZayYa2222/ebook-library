const validateFileTypeAndSize = (validMimeTypes = [], limitedSize = 1024 * 1024, file) => {
    // const validMineTypes = ['image/jpeg', 'image/png', 'image/svg', 'image/gif', 'image/webp'];
    // const limitSize = 1024 * 1024;
    console.log('file info: ' + file.mimetype)

    if (!validMimeTypes.includes(file.mimetype)) {
        return [{
            field: 'image_url',
            msg: 'Only valid file type allows to upload.',
            upload_file_info: file,
        }]
    }

    if (file.size > limitedSize) {
        return [{
            field: 'image_url',
            msg: 'Image file size exceeds 1MB',
            upload_file_info: file,
        }]
    }

    return null;
}

module.exports = { validateFileTypeAndSize };