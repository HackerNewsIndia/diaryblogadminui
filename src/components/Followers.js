import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Followers = ({ companyData, blogSpaceId, space }) => {
  const [emailList, setEmailList] = useState([]);
  const [importedEmails, setImportedEmails] = useState([]);
  const [successMessage, setSuccessMessage] = useState(''); 
  const [followers, setFollowers] = useState([]);
  const [manualEmail, setManualEmail] = useState('');



  
  const handleOnFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (!file) {
      console.error('No file selected.');
      return;
    }
    if (!file.type.startsWith('text/csv')) {
      console.error('Invalid file type. Please select a CSV file.');
      return;
    }
    reader.onload = (event) => {
      const contents = event.target.result;
      const emails = contents.split('\n').map((line) => line.trim());
      setEmailList(emails);
      setImportedEmails(emails);
    };
    reader.readAsText(file);
  };

  const handleClearInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = ''; 
    }
    setEmailList([]); 
  };

  const handleImport = () => {
    if (emailList.length === 0) {
      console.error('No emails to import.');
      return;
    }
    const validEmails = emailList.filter((email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });
    if (validEmails.length === 0) {
      console.error('No valid emails to import.');
      alert('No valid emails found in the imported list.');
      return;
    }
    const newFollowers = validEmails.map((email) => ({ email }));
    if (Array.isArray(followers)) {
      setFollowers((prevFollowers) => [...prevFollowers,...newFollowers]);
    } else {
      console.error('followers is not an array:', followers);
    }
    setEmailList([]);
  };
  const handleExport = () => {
    const csvData = followers.map((follower) => follower.email).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'followers_email_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToFollower = async () => {
    try {
      const emailsToAdd = [...importedEmails];
      if (manualEmail) {
        emailsToAdd.push(manualEmail);
      }
      if (emailsToAdd.length === 0) {
        console.error('No imported or manual emails to add.');
        return;
      }


      const response = await axios.post(`https://diaryblogapi2.onrender.com/api/followers`, {
        blogSpaceId: blogSpaceId,
        followers: emailsToAdd.map((email) => ({ email })),
      });

    
      if (response.data.message === 'Followers added successfully') {
        setSuccessMessage('Followers added successfully');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        setImportedEmails([]);
        setManualEmail('');
      } else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Error adding followers:', error);
    }
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        if (!blogSpaceId) {
          console.log('blogSpaceId is null or undefined');
          return;
        }
        const response = await fetch(`https://diaryblogapi2.onrender.com/api/followers/${blogSpaceId}/followers`);
        if (!response.ok) {
          throw new Error('Failed to fetch followers');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setFollowers(data);
        } else {
          console.error('data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [blogSpaceId]);

  return (
    <div>
      {successMessage && (
        <div className="bg-blue-200 text-blue-800 p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      <section className="py-9 sm:py-12 space-y-6">
        <div className="flex flex-wrap items-start justify-center">
          <div className="space-y-2">
            {space && (
              <article>
                <div className="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg text-center">
                  <div className="w-1/3 bg-cover bg-landscape">
                    <img alt="" className="object-cover w-full h-52" src={space.image_url || "default_image_url"} />
                  </div>
                  <div className="w-2/3 p-4">
                    <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
                    <p className="mt-2 text-sm text-gray-600"><strong>category:</strong> {space.category}</p>
                    <div className="flex flex-wrap justify-between">
                      <div className="flex space-x-2 text-sm dark:text-gray-400">
                        <button aria-label="Share this post" type="button" className="flex items-center p-1 space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current dark:text-violet-400">
                            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                          </svg>
                          <span>{space.followers} Follower</span>
                        </button>
                        <button aria-label="Share this post" type="button" className="flex items-center p-1 space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current dark:text-violet-400">
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 9.1 .7 17.9 1.3 26.3c.3 4.5 3.4 8.3 7.9 9.6c8.4 2.4 17.1 3.7 26.2 3.7c53 0 96-43 96-96c0-9.2-1.3-18.1-3.7-26.5c-1.3-4.4-5.6-7.6-10.1-7.4c-8.5 .3-17.1 .7-26.3 1.3c-5.8 .4-9.2 6.3-7.3 11.6c2.1 6.3 3.3 13.1 3.3 20.3z"></path>
                          </svg>
                          <span>{space.views} Views</span>
                        </button>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          {/* <div className="flex flex-col space-y-2"> */}
            <input
              type="file"
              accept=".csv"
              onChange={handleOnFileChange}
              // className="file-input file-input-bordered w-full max-w-xs text-xs"
              id="fileInput"
            />
            <div className="flex space-x-2">
              <button className="btn btn-primary btn-xs" onClick={handleImport}>Import</button>
              <button className="btn btn-secondary btn-xs" onClick={handleExport}>Export</button>
              <button className="btn btn-warning btn-xs" onClick={handleClearInput}>Clear</button>
            </div>
          {/* </div> */}
          <div >
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="Enter email address"
              className="input input-bordered  max-w-xs "
            />
            <button className="btn btn-primary mt-2" onClick={handleAddToFollower}>Add to Followers</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col className="w-24" />
            </colgroup>
            <thead className="dark:bg-gray-700">
              <tr className="text-left">
                <th className="p-3">#</th>
                <th className="p-3">Email</th>
                <th className="p-3">Subscription</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Subscribed Date</th>
                <th className="p-3">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {followers.map((follower, index) => (
                <tr key={index} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{follower.email && typeof follower.email === 'object' ? follower.email.email : follower.email}</td>
                  <td className="p-3">{follower.subscription}</td>
                  <td className="p-3">{follower.type}</td>
                  <td className="p-3 text-right">{follower.amount}</td>
                  <td className="p-3">{follower.subscribedDate}</td>
                  <td className="p-3">{follower.paidDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Followers;
