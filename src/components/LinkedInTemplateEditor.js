import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";

const LinkedInTemplateEditor = () => {
  const [clientId, setClientId] = useState("");
  //   const [redirectUri, setRedirectUri] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const [postStatus, setPostStatus] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        // `http://127.0.0.1:5001/api/user_linkedin_details?user_id=${userId}`,
        `https://diaryblogapi-eul3.onrender.com/api/user_linkedin_details?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("user_linkedIn_data", data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token:", token);

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("decodedToken:", decodedToken);
      const userId = decodedToken.user.id; // assuming the ID is stored in the `user.id` field
      console.log("User ID:", userId);
      setUserId(userId);
      fetchUserData(userId);
    } else {
      console.log("No token found");
      setLoading(false);
    }
  }, []);

  //   const handleOAuth = async () => {
  //     const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=https://localhost:3000/&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  //     window.location.href = authUrl;
  //   };

  //   const handleSubmit = async (event) => {
  //     event.preventDefault();
  //     setLoadingSubmit(true);
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const code = urlParams.get("code");

  //     try {
  //       const response = await fetch(
  //         "http://127.0.0.1:5001/api/linkedin_exchange_token",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             clientId: clientId,
  //             redirectUri: "https://localhost:3000/",
  //             code: code,
  //           }),
  //         }
  //       );

  //       const json_data = await response.json();
  //       console.log("data:", json_data);
  //       setAccessToken(json_data.access_token);
  //     } catch (error) {
  //       console.error("Error during token exchange:", error);
  //     } finally {
  //       setLoadingSubmit(false);
  //     }
  //   };

  const handleLinkedInPost = async (event) => {
    event.preventDefault();
    setLoadingPost(true);

    try {
      const response = await fetch(
        // "http://127.0.0.1:5001/api/linkedin_post",
        "https://diaryblogapi-eul3.onrender.com/api/linkedin_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            linkedIn_access_token: userData.linkedIn_access_token,
            URN_sub: userData.URN_sub,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Post successful:", data);
      setMessage("");
      if (data.id) {
        setPostStatus(true);
      } else {
        setPostMessage("Post not successful!");
      }

      return data;
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      return { error: error.message };
    } finally {
      setLoadingPost(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BeatLoader color="#3498db" size={15} />
      </div>
    );
  }

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    //   {userData.linkedIn_access_token ? (
    //     <div className="w-full max-w-md bg-white shadow-md rounded p-6">
    //       <div
    //         className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4"
    //         role="alert"
    //       >
    //         <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
    //         <p className="font-bold">LinkedIn: Logged In</p>
    //       </div>
    //       <div className="flex space-x-4 mt-4">
    //         <form onSubmit={handleLinkedInPost} className="w-1/2 space-y-4">
    //           <textarea
    //             className="w-full p-2 border rounded"
    //             placeholder="Enter your message here"
    //             value={message}
    //             onChange={(e) => {
    //               setMessage(e.target.value);
    //               setPostStatus(false);
    //               setPostMessage("");
    //             }}
    //           ></textarea>
    //           <button
    //             className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //             type="submit"
    //             disabled={loadingPost}
    //           >
    //             {loadingPost ? <BeatLoader color="#fff" size={10} /> : "Submit"}
    //           </button>
    //         </form>
    //         <div className="w-1/2 bg-gray-200 p-4 rounded">
    //           <div className="bg-white p-2 rounded shadow-md linkedin-post-preview">
    //             <div className="flex items-center mb-2">
    //               <FontAwesomeIcon
    //                 className="w-10 h-10 mr-2 text-blue-500"
    //                 icon={faUserCircle}
    //               />
    //               <div>
    //                 <div className="font-bold">Your LinkedIn Name</div>
    //                 <div className="text-gray-500 text-sm">Just now</div>
    //               </div>
    //             </div>
    //             <div className="text-gray-700">{message}</div>
    //           </div>
    //         </div>
    //       </div>
    //       {postStatus && (
    //         <div
    //           className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4"
    //           role="alert"
    //         >
    //           <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
    //           <p className="font-bold">Successfully Posted!</p>
    //         </div>
    //       )}
    //       {postMessage && (
    //         <div
    //           className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4"
    //           role="alert"
    //         >
    //           <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faXmark} />
    //           <p className="font-bold">{postMessage}</p>
    //         </div>
    //       )}
    //     </div>
    //   ) : (
    //     <div className="w-full max-w-md bg-white shadow-md rounded p-6">
    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         <div className="mb-4">
    //           <label
    //             className="block text-gray-700 text-sm font-bold mb-2"
    //             htmlFor="clientId"
    //           >
    //             Client ID
    //           </label>
    //           <input
    //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //             id="clientId"
    //             type="text"
    //             placeholder="Client ID"
    //             value={clientId}
    //             onChange={(e) => setClientId(e.target.value)}
    //           />
    //         </div>
    //         <div className="mb-4">
    //           <label
    //             className="block text-gray-700 text-sm font-bold mb-2"
    //             htmlFor="redirectUri"
    //           >
    //             Redirect URI
    //           </label>
    //           {/* <input
    //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //             id="redirectUri"
    //             type="text"
    //             placeholder="Redirect URI"
    //             value={redirectUri}
    //             onChange={(e) => setRedirectUri(e.target.value)}
    //           /> */}
    //         </div>
    //         <div className="flex items-center justify-between">
    //           <button
    //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //             type="button"
    //             onClick={handleOAuth}
    //             disabled={loadingSubmit}
    //           >
    //             {loadingSubmit ? (
    //               <BeatLoader color="#fff" size={10} />
    //             ) : (
    //               "Login with LinkedIn"
    //             )}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   )}
    // </div>
    <div className="flex flex-col items-center bg-gray-100 p-4">
      {userData.linkedIn_access_token ? (
        <div className="w-full max-w-md bg-white shadow-md rounded p-6">
          <div
            className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-2 mb-2"
            role="alert"
          >
            <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
            <p className="font-bold">LinkedIn : LoggedIn</p>
          </div>
          <div className="flex items-center mt-1 mb-2 px-4 py-2">
            <p className="font-bold">Page : {userData.profile_name}</p>
          </div>
          <form onSubmit={handleLinkedInPost} className="space-y-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Enter your message here"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setPostStatus(false);
                setPostMessage("");
              }}
              rows="10"
            ></textarea>
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loadingPost}
            >
              {loadingPost ? <BeatLoader color="#fff" size={10} /> : "Submit"}
            </button>
          </form>
          {postStatus && (
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4"
              role="alert"
            >
              <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
              <p className="font-bold">Successfully Posted!!</p>
            </div>
          )}

          {postMessage && (
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4"
              role="alert"
            >
              <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faXmark} />
              <p className="font-bold">{postMessage}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            className="flex items-center bg-red-500 border border-green-400 text-white px-4 py-3 rounded mt-4 mb-2"
            role="alert"
          >
            <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faXmark} />
            <p className="font-bold">LinkedIn : Not LoggedIn</p>
          </div>
          <div>
            <p className="flex items-center text-gray-600">
              Go to "User" menu and complete LinkedIn Integration
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LinkedInTemplateEditor;
