import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AcError = () => {
  // Preview data
  const previewData = [
   
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [acErrorData, setAcErrorData] = useState([]);

  useEffect(() => {
    // Fetch AC error data from backend
    axios.get('http://193.203.162.54:5000/errorCode')
      .then(response => {
        setAcErrorData(response.data);
      })
      .catch(error => {
        console.error('Error fetching AC error codes:', error);
      });
  }, []);

  const filteredData = [...previewData, ...acErrorData].filter(item =>
    item.errorCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>AC Error Codes</h1>
      <input
        type="text"
        placeholder="Search by Error Code"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '10px',
          padding: '8px',
          width: '100%',
          maxWidth: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Company</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Error Code</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.company}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.errorCode}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '8px' }}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AcError;
