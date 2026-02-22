'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [fileExists, setFileExists] = useState<boolean | string>(false);
  const [fileSize, setFileSize] = useState('');
  const [loadTest, setLoadTest] = useState('');

  useEffect(() => {
    // Test if file can be loaded
    const testLoad = async () => {
      try {
        console.log('Testing model load...');
        const response = await fetch('/login.glb', { method: 'HEAD' });
        
        if (response.ok) {
          setFileExists(true);
          const size = response.headers.get('content-length');
          if (size) {
            const sizeInMB = (parseInt(size) / (1024 * 1024)).toFixed(2);
            setFileSize(`${sizeInMB} MB`);
          }
          setLoadTest('✅ File found and accessible!');
          console.log('✅ Model file accessible');
        } else {
          setFileExists(false);
          setLoadTest(`❌ File not found. Status: ${response.status}`);
          console.log('❌ File not found. Status:', response.status);
        }
      } catch (error) {
        setFileExists(false);
        setLoadTest(`❌ Error: ${error}`);
        console.error('❌ Error testing file:', error);
      }
    };

    testLoad();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to br, #f0f9ff, #e0f2fe)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#1e40af', marginBottom: '30px' }}>🔧 Debug: 3D Model Loading</h1>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '2px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>File Status</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
              File Exists:
            </label>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              background: fileExists ? '#dcfce7' : '#fee2e2',
              color: fileExists ? '#166534' : '#991b1b',
              fontWeight: 'bold',
            }}>
              {fileExists ? '✅ YES' : '❌ NO'}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
              File Size:
            </label>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              background: '#f3f4f6',
              color: '#374151',
              fontWeight: '500',
            }}>
              {fileSize || 'Checking...'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
              Load Test:
            </label>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              background: loadTest.includes('✅') ? '#dcfce7' : '#fee2e2',
              color: loadTest.includes('✅') ? '#166534' : '#991b1b',
              fontWeight: '500',
            }}>
              {loadTest || 'Testing...'}
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '2px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>Troubleshooting</h2>
          
          <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
            <h3 style={{ marginTop: '15px', marginBottom: '8px', color: '#374151' }}>If file shows ❌ NOT FOUND:</h3>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Check file path: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>frontend/public/login.glb</code></li>
              <li>Ensure filename is exactly <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>login.glb</code> (lowercase)</li>
              <li>Restart dev server after placing file</li>
              <li>Clear browser cache (Ctrl+Shift+Delete)</li>
            </ul>

            <h3 style={{ marginTop: '15px', marginBottom: '8px', color: '#374151' }}>If file shows ✅ FOUND but model doesn't render:</h3>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Open DevTools (F12) and check Console tab</li>
              <li>Look for any error messages about the model</li>
              <li>Verify .glb file is valid (not corrupted)</li>
              <li>Try re-exporting from Blender</li>
              <li>Check file size - if very small (&lt;1KB), export failed</li>
            </ul>

            <h3 style={{ marginTop: '15px', marginBottom: '8px', color: '#374151' }}>File location:</h3>
            <code style={{
              background: '#f3f4f6',
              padding: '12px',
              borderRadius: '6px',
              display: 'block',
              wordBreak: 'break-all',
              fontSize: '12px',
            }}>
              frontend/public/login.glb
            </code>
          </div>
        </div>

        <div style={{
          marginTop: '30px',
          textAlign: 'center',
        }}>
          <a href="/login" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#f59e0b',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background 0.3s',
          }}>
            Go to Login Page
          </a>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#92400e',
        }}>
          <strong>💡 Tip:</strong> Open DevTools Console (F12) to see detailed loading messages and errors
        </div>
      </div>
    </div>
  );
}
