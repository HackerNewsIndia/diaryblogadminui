import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
// import FacebookLogin from "@greatsumini/react-facebook-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";

const FacebookTemplateEditor = () => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [permanentToken, setPermanentToken] = useState("");
  const [pageId, setPageId] = useState("");
  const [permanentTokenGenerated, setPermanentTokenGenerated] = useState(false);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const [postStatus, setPostStatus] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for handleSubmit
  const [loadingPost, setLoadingPost] = useState(false); // Loading state for handleFacebookPost and handleFacebookPostReady

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        // `http://localhost:5001/api/user_facebook_details?user_id=${userId}`, // Include user_id as a query parameter
        `https://diaryblogapi-eul3.onrender.com/api/user_facebook_details?user_id=${userId}`,
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
      console.log("user_data", data);
      setUserData(data); // Assuming setUserData is a state updater function
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

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setLoadingSubmit(true); // Set loading to true when submitting
  //   try {
  //     const response = await fetch(
  //       // "http://localhost:5001/api/exchange_token",
  //       "https://diaryblogapi-eul3.onrender.com/api/exchange_token",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           clientId: clientId,
  //           clientSecret: clientSecret,
  //           accessToken: accessToken,
  //         }),
  //       }
  //     );
  //     const json_data = await response.json();
  //     console.log("data:", json_data);
  //     console.log("permanent token:", json_data.data[0].access_token);
  //     console.log("pageId:", json_data.data[0].id);

  //     if (json_data.data[0].access_token) {
  //       setPermanentToken(json_data.data[0].access_token);
  //       setPageId(json_data.data[0].id);
  //       setPermanentTokenGenerated(true);
  //     }

  //     if (
  //       json_data.data[0].access_token &&
  //       json_data.data[0].id &&
  //       json_data.data[0].name
  //     ) {
  //       const response2 = await fetch(
  //         // "http://localhost:5001/api/user_facebook_details",
  //         "https://diaryblogapi-eul3.onrender.com/api/user_facebook_details",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             client_id: clientId,
  //             client_secret: clientSecret,
  //             permanent_token: json_data.data[0].access_token,
  //             page_id: json_data.data[0].id,
  //             page_name: json_data.data[0].name,
  //             user_id: userId,
  //           }),
  //         }
  //       );
  //       const data2 = await response2.json();
  //       console.log("data2:", data2);
  //       return data2;
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error during token exchange or user details update:",
  //       error
  //     );
  //   } finally {
  //     setLoadingSubmit(false); // Set loading to false after submission
  //   }
  // };

  const handleFacebookPost = async (event) => {
    event.preventDefault();
    setLoadingPost(true); // Set loading to true when posting
    try {
      const response = await fetch(
        // "http://localhost:5001/api/facebook_post",
        "https://diaryblogapi-eul3.onrender.com/api/facebook_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            page_id: pageId,
            permanent_token: permanentToken,
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
      console.error("Error posting to Facebook:", error);
      return { error: error.message };
    } finally {
      setLoadingPost(false); // Set loading to false after posting
    }
  };

  const handleFacebookPostReady = async (event) => {
    event.preventDefault();
    console.log("message:", message);
    console.log("page_id:", pageId);
    console.log("PermanentToken:", permanentToken);
    setLoadingPost(true); // Set loading to true when posting
    try {
      const response = await fetch(
        // "http://localhost:5001/api/facebook_post",
        "https://diaryblogapi-eul3.onrender.com/api/facebook_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            page_id: userData.page_id,
            permanent_token: userData.permanent_token,
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
      console.error("Error posting to Facebook:", error);
      return { error: error.message };
    } finally {
      setLoadingPost(false); // Set loading to false after posting
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
    <div className="p-4 px-5 mx-auto">
      {userData.permanent_token ? (
        <div className="w-full sm:w-3/4 bg-white p-6 px-10 mx-auto space-y-4">
          {/* Flex container for Facebook status and Page name */}
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center mt-1 mb-2 py-2">
              <p className="font-bold text-lg">Page: {userData.page_name}</p>
            </div>
            <div
              className="flex items-center text-green-700 px-4 py-2 rounded"
              role="alert"
            >
              <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
              <p className="font-bold">Facebook: Logged In</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFacebookPostReady} className="space-y-4">
            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Write Your Post Here
              </label>
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Enter your message here"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setPostStatus(false);
                  setPostMessage("");
                }}
                rows="7"
              ></textarea>
            </div>

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
              className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4"
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
            <p className="font-bold">Facebook: Not Logged In</p>
          </div>
          <div>
            <p className="text-gray-600">
              Go to "User" menu and complete Facebook Integration
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FacebookTemplateEditor;
