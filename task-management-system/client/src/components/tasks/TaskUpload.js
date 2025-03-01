import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi';

const TaskUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const [taskId] = useState('64f5a7b1c2f2e3a4b5d6e7f8'); // Example task ID - removed unused setTaskId

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setUploadStatus(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus(null);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(0);
      setError(null);
      setUploadStatus('uploading');

      const response = await axios.post(
        `/api/tasks/${taskId}/attachments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadStatus('success');
      console.log('Upload successful:', response.data);
    } catch (err) {
      setUploadStatus('error');
      setError(
        err.response?.data?.message || 'An error occurred during upload'
      );
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Task Attachment</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {!uploadStatus || uploadStatus === 'error' ? (
        <>
          <div className="file-input-container">
            <div className="icon">
              <FiUpload />
            </div>
            <p>Drag and drop your file here, or click to browse</p>
            <p className="small">Maximum file size: 5MB</p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
          </div>

          {file && (
            <div className="file-preview">
              <div className="file-info">
                <div className="file-icon">
                  <FiFile />
                </div>
                <div className="file-name">{file.name}</div>
                <div className="file-size">({formatFileSize(file.size)})</div>
              </div>
              <button className="remove-btn" onClick={removeFile}>
                <FiX />
              </button>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <button
            className="btn upload-btn"
            onClick={handleUpload}
            disabled={!file || uploadStatus === 'uploading'}
          >
            {uploadStatus === 'uploading'
              ? `Uploading... ${uploadProgress}%`
              : 'Upload File'}
          </button>
        </>
      ) : (
        <div className="upload-success">
          <div className="success-icon">
            <FiCheck />
          </div>
          <h3>Upload Successful!</h3>
          <p>Your file has been uploaded successfully.</p>
          <button className="btn" onClick={removeFile}>
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskUpload; 