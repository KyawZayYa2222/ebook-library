const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
    keyFile: './google_service_account_key.json',
    scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

// get file by ID
const getFileById = async (fileId) => {
    try {
        const response = await drive.files.get({
            fileId,
            fields: 'id, name, size, parents, webViewLink, webContentLink'
        });

        return response;
    } catch (e) {
        console.error('Error getting file:', e);
        return null;
    }
}

// upload file 
const uploadToDrive = async (file, driveFolderId) => {
    try {
        const fileMetadata = {
            name: file.filename,
            parents: [driveFolderId] // replace with your Google Drive folder id
        };

        const media = {
            mimeType: file.mimeType,
            body: fs.createReadStream(file.path)
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name, size, parents, webViewLink, webContentLink'
        });

        // permission create to view anyone 
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
                value: 'anyoneWithLink'
            }
        })

        console.log('File uploaded to Drive:', response.data);

        // remove temp file 
        fs.unlinkSync(file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });

        return response;
    } catch (e) {
        console.error('Error uploading file:', e);
        throw e;
    }
}

// update file 
const updateDriveFile = async (file, driveFileId) => {
    try {
        const media = {
            body: fs.createReadStream(file.path),
            mimeType: file.mimeType
        };

        const response = await drive.files.update({
            fileId: driveFileId,
            media: media,
            fields: 'id, name, size, parents, webViewLink, webContentLink, modifiedTime',
            uploadType: 'multipart',
        });

        console.log('File updated in Drive:', response.data);

        // remove temp file 
        fs.unlinkSync(file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });

        return response;
    } catch (e) {
        console.error('Error updating file:', e);
        throw e;
    }
}

// delete file
const deleteDriveFile = async (driveFileId) => {
    try {
        const response = await drive.files.delete({
            fileId: driveFileId
        });

        console.log('File deleted from Drive:', response.data);
        return response;
    } catch (e) {
        console.error('Error deleting file:', e);
        throw e;
    }
}


module.exports = {
    getFileById,
    uploadToDrive,
    updateDriveFile,
    deleteDriveFile
}