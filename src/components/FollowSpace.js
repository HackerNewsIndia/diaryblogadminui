import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Followers from "./Followers"; // Import the Followers component
import { BeatLoader } from "react-spinners";
import jwt_decode from "jwt-decode";

function FollowSpace({ isLoggedIn, setIsLoggedIn, selectedKey }) {
  // const [userDetails, setUserDetails] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false); // State to track if Followers component should be shown
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState(null);

  //   const [selectedKey, setSelectedKey] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [followSpaces, setFollowSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const navigate = useNavigate();

  const handleNewBlog = (newCompany) => {
    setCompanyData((prevData) => [...prevData, newCompany]);
  };

   const handleCards = (company) => {

     setSelectedCompany(company);
   };
 
  
   const handleViewClick = (space) => {
    console.log('Selected space:', space); // Check the structure of the space object
    setSelectedSpace(space);
    // setSelectedCompany(space);
    setShowFollowers(true); // Show Followers component

   };
  
 
// Back button click handler
const handleBackClick = () => {
  setShowFollowers(false); // Hide Followers component
  setSelectedSpace(null); // Clear selected space
};

 
  console.log("you have selected", selectedCompany);
  console.log("you have selected this followSpace", selectedSpace);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }

    // Decode the JWT token to get the user_id
    const decodedToken = jwt_decode(token);
    const user = decodedToken.user;
    const userId = user.id;

    fetch(
      `https://diaryblogapi2.onrender.com/api/diaryblog_space/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setCompanyData(data);
                setLoading(false); // Set loading to false after data is fetched

      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
        setError(error.message);
      });
  }, []);


  return (
    <div>
 {loading && (
            <div className="flex justify-center items-center py-5">
              <BeatLoader color="hsla(168, 4%, 75%, 1)" />
            </div>
          )}
 {showFollowers  ? (
<div>
 <button
   className="bg-blue-500 text-white px-4 py-2 rounded"
   onClick={handleBackClick}
 >
   <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
 </button>
 <Followers companyData={companyData} blogSpaceId={selectedSpace ? selectedSpace.blogSpace : null} space={selectedSpace}/>
</div>) : (
    <section class="py-9 sm:py-12 space-y-6">
     
   
   
    <div class="flex flex-wrap items-stretch ">
      <div class="flex flex-grow flex-col-reverse mx-auto lg:flex-row  ">
      <div class="flex flex-grow flex-col lg:w-2/3 p-6 space-y-6 rounded sm:p-8">
          <div class="space-y-2">
   
            {/* <h2 class="text-xl font-bold">DiaryBlog Follower</h2> */}
   
            {companyData &&
  companyData.map((space) => (
    <article key={space._id || space.blogSpace} className="blog-card">           
       <div class="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg text-center">
                <div class="w-1/3 bg-cover bg-landscape">
                  <img alt="" class="object-cover w-full h-52 " src={space.image_url || "default_image_url"} />
                </div>
                <div class="w-2/3 p-4">
                <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>

                  <p class="mt-2 text-sm text-gray-600">
                  <strong>category:</strong> {space.category }
                  </p>
                  <div class="flex flex-wrap justify-between">
                    <div class="flex space-x-2 text-sm dark:text-gray-400">
                      
                      <button aria-label="Share this post" type="button" class="flex items-center p-1 space-x-2">
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 fill-current dark:text-violet-400">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path></svg>
          
        <span>  {space.followers }  Follower </span>
        </button>
   
                      {/* <button aria-label="Share this post" type="button" class="flex items-center p-1 space-x-2">
   
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 fill-current dark:text-violet-400">
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                        </svg>
   
                        <span> Edit </span>
                      </button> */}
                      
                      <button
 onClick={(event) => {
  handleViewClick(space);
}}            className="flex items-center p-1 space-x-2"
            aria-label="Share this post"
            type="button"
          >          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 fill-current dark:text-violet-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>
          </svg>
          <span >view</span>
        </button>
   
                    </div>
                  </div>
                </div>
   
              </div>
   
            </article>
      ))}
          </div>
        </div>
        
              
      </div>
    </div>
   
   </section>
     )}
   </div>
  );
}

export default FollowSpace;
