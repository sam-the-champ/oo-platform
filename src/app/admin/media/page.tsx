'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface UploadedFile { name: string; url: string; size: string; type: string; }

export default function AdminMedia() {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    setProgress(0);

    for (const file of files) {
      try {
        const path = `media/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, path);
        const task = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          task.on('state_changed',
            snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            reject,
            async () => {
              const url = await getDownloadURL(task.snapshot.ref);
              setUploads(prev => [...prev, {
                name: file.name,
                url,
                size: (file.size / 1024).toFixed(1) + ' KB',
                type: file.type,
              }]);
              resolve();
            }
          );
        });
        toast.success(`${file.name} uploaded.`);
      } catch {
        toast.error(`Failed to upload ${file.name}.`);
      }
    }
    setUploading(false);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    multiple: true,
  });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl mb-1">Media Library</h1>
        <p className="text-sm" style={{ color: 'var(--text3)' }}>
          Upload images and files. Copy URLs to paste into project/article forms.
        </p>
      </div>

      {/* Drop zone */}
      <div {...getRootProps()}
        className="mb-8 rounded-2xl p-12 text-center cursor-pointer transition-all"
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border2)'}`,
          background: isDragActive ? 'rgba(0,229,255,0.03)' : 'var(--surface)',
        }}>
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">{isDragActive ? '⬇️' : '📁'}</div>
        <p className="font-display font-bold text-base mb-1">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm" style={{ color: 'var(--text3)' }}>
          or click to browse · PNG, JPG, SVG, PDF · Any size
        </p>
        {uploading && (
          <div className="mt-5 max-w-xs mx-auto">
            <div className="skill-track mb-2">
              <div className="skill-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="font-mono text-xs" style={{ color: 'var(--accent)' }}>Uploading... {progress}%</p>
          </div>
        )}
      </div>

      {/* Uploaded files */}
      {uploads.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-base mb-4">Uploaded this session</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploads.map((file, i) => (
              <div key={i} className="card p-4 flex flex-col gap-3">
                <div className="text-3xl text-center">
                  {file.type.startsWith('image/') ? '🖼️' : '📄'}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs truncate mb-1" style={{ color: 'var(--text2)' }}>{file.name}</div>
                  <div className="font-mono text-xs" style={{ color: 'var(--text3)' }}>{file.size}</div>
                </div>
                <button onClick={() => copyUrl(file.url)}
                  className="btn btn-primary text-xs py-1.5 justify-center">
                  Copy URL
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploads.length === 0 && !uploading && (
        <div className="text-center py-8" style={{ color: 'var(--text3)' }}>
          <p className="text-sm">Files uploaded during this session will appear here.<br />
            For persistent media management, use Firebase Storage console.</p>
        </div>
      )}
    </div>
  );
}
