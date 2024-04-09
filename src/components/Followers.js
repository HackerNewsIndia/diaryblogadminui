import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Followers = ({ companyData, blogSpaceId }) => {
  const [emailList, setEmailList] = useState([]);


  const [followers, setFollowers] = useState([]);
   //console.log("blogSpaceId", blogSpaceId);
   console.log("Received companyData:", companyData);
   console.log("Received blogSpaceId:", blogSpaceId);
   const handleOnFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (!file) {
      console.error('No file selected.');
      return;
    }
      // Check if the file type is valid (e.g., CSV)
  if (!file.type.startsWith('text/csv')) {
    console.error('Invalid file type. Please select a CSV file.');
    return;
  }

    reader.onload = (event) => {
      const contents = event.target.result;
      const emails = contents.split('\n').map((line) => line.trim());
      setEmailList(emails);
    };
    reader.readAsText(file);
  };
  const handleClearInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = ''; // Clear the input field
    }
    setEmailList([]); // Clear the email list
  };
  
  const handleImport = () => {
    console.log('Imported Email List:', emailList);
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
      // Map the email list to follower objects
      const newFollowers = emailList.map((email, index) => ({
        id: index + 1,
        email,
        subscription: '',
        type: '',
        amount: 0,
        subscribedDate: '',
        paidDate: ''
      }));
  
      // Send a POST request to your backend API to add followers
      const response = await axios.post('https://diaryblogapi2.onrender.com/api/followers', {
        followers: newFollowers,
        blogSpaceId: blogSpaceId // Include the blogSpaceId in the request body
      });
  
      // Handle the response
      console.log('Added followers:', response.data);
  
      // Clear the email list after adding to followers
      setEmailList([]);
    } catch (error) {
      console.error('Error adding followers:', error);
    }
  };
  

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
         if (!blogSpaceId) {
          console.log('blogSpaceId is null or undefined');
          return; // If blogSpaceId is null, do not proceed with fetching followers
         }
        // if (!blogSpaceId) return;
        const response = await fetch(`https://diaryblogapi2.onrender.com/api/followers/${blogSpaceId}/followers`);
        if (!response.ok) {
          throw new Error('Failed to fetch followers');
        }
        const data = await response.json();
        setFollowers(data);
        console.log('Fetched followers:', data);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };
  
    fetchFollowers();
  }, [ blogSpaceId]);
  
  // console.log("Selected Space:", selectedSpace);
  console.log("Received blogSpaceId:", blogSpaceId);
  console.log("blogSpaceId", blogSpaceId);




  return (
    <div>
      
      <section className="py-9 sm:py-12 space-y-6">
        <div className="flex flex-wrap items-start justify-center">
          <div className="space-y-2">
            {/* <h2 className="text-xl font-bold">DiaryBlog Follower</h2> */}
            

            {companyData.map((company) => (
              <article key={company._id || company.blogSpace}>
              <div className="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg text-center">
                <div className="w-1/3 bg-cover bg-landscape">
                  <img alt="" className="object-cover w-full h-52" src={company.image_url || "default_image_url"} />
                </div>
                <div className="w-2/3 p-4">
                  <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                  <p className="mt-2 text-sm text-gray-600"> <strong>category:</strong> {company.category}</p>
                  <div className="flex flex-wrap justify-between">
                    <div className="flex space-x-2 text-sm dark:text-gray-400">
                      <button aria-label="Share this post" type="button" className="flex items-center p-1 space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current dark:text-violet-400">
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                        </svg>
                        <span> {company.followers} Follower </span>
                      </button>
                      {/* <button aria-label="Share this post" type="button" className="flex items-center p-1 space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current dark:text-violet-400">
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                        </svg>
                        <span> Edit </span>
                      </button> */}
                      <button aria-label="Share this post" type="button" className="flex items-center p-1 space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current dark:text-violet-400">
                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                        </svg>
                        <span>{company.views} View </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            ))}
          </div>
        </div>

       

        <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
          <h2 className="mb-4 text-2xl font-semibold leading">Followers</h2>
          <div className="flex space-x-4 mb-4">
       {/* CSV Reader component for importing */}
       <input type="file" id="fileInput" onChange={handleOnFileChange} />
       {emailList.length > 0 && (
          <button className="btn bg-gray-300 hover:bg-gray-400" onClick={handleClearInput}>
            Clear
          </button>
        )}
        {/* Import button */}
        <button className="btn bg-gray-300 hover:bg-gray-400" onClick={handleImport}>
          Import
        </button>
        {/* Add to followers button */}
        <button className="btn bg-gray-300 hover:bg-gray-400" onClick={handleAddToFollower}>
          Add to Followers
        </button>
        {/* Export button */}
        <button className="btn bg-gray-300 hover:bg-gray-400" onClick={handleExport}>
          Export CSV
        </button>
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
      <td className="p-3">{follower.email}</td>
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
        </div>
      </section>
    </div>
  );
};


export default Followers;
