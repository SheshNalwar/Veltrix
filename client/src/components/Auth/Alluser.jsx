import React, { useEffect, useState } from 'react';

const EmailsList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => {
        if (data.emails && Array.isArray(data.emails)) {
          // Flatten nested arrays and extract emailAddress
          const extractedEmails = data.emails.flat().map(item => item.emailAddress);
          setEmails(extractedEmails);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching emails:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Email List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {emails.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailsList;
