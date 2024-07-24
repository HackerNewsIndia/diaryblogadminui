import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const LinkedInTemplateEditor = () => {
  const [clientId, setClientId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const [postStatus, setPostStatus] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [postType, setPostType] = useState("text"); // default post type
  const [link, setLink] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [mediaInputType, setMediaInputType] = useState("file"); // default to file input
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
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
      const userId = decodedToken.user.id;
      console.log("User ID:", userId);
      setUserId(userId);
      fetchUserData(userId);
    } else {
      console.log("No token found");
      setLoading(false);
    }
  }, []);

  const handleLinkedInPost = async (event) => {
    event.preventDefault();
    setLoadingPost(true);

    let endpoint = "";
    let body = new FormData();
    body.append("message", message);
    body.append("linkedIn_access_token", userData.linkedIn_access_token);
    body.append("URN_sub", userData.URN_sub);

    if (postType === "text") {
      // endpoint = "http://127.0.0.1:5001/api/linkedin_post";
      endpoint = "https://diaryblogapi-eul3.onrender.com/api/linkedin_post";
    } else if (postType === "link") {
      // endpoint = "http://127.0.0.1:5001/api/linkedin_link_post";
      endpoint =
        "https://diaryblogapi-eul3.onrender.com/api/linkedin_link_post";
      body.append("link", link);
    } else if (postType === "media") {
      // endpoint = "http://127.0.0.1:5001/api/linkedin_media_post";
      endpoint =
        "https://diaryblogapi-eul3.onrender.com/api/linkedin_media_post";
      if (mediaInputType === "file") {
        for (let i = 0; i < media.length; i++) {
          body.append("media", media[i]);
        }
      } else if (mediaInputType === "url") {
        for (let i = 0; i < mediaUrls.length; i++) {
          body.append("mediaUrls", mediaUrls[i]);
        }
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Post successful:", data);
      setMessage("");
      setLink("");
      setMedia([]);
      setMediaUrls([]);
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

  const handleMediaUrlsChange = (index, value) => {
    const newMediaUrls = [...mediaUrls];
    newMediaUrls[index] = value;
    setMediaUrls(newMediaUrls);
  };

  const addMediaUrlField = () => {
    setMediaUrls([...mediaUrls, ""]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BeatLoader color="#3498db" size={15} />
      </div>
    );
  }

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
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
            <p className="font-bold">Profile/Page : {userData.profile_name}</p>
          </div>
          <form onSubmit={handleLinkedInPost} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Post Type
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="text">Text Post</option>
                <option value="link">Link Post</option>
                <option value="media">Image/Video Post</option>
              </select>
            </div>
            <div className="relative mb-4">
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Enter your message here"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setPostStatus(false);
                  setPostMessage("");
                }}
                rows="5"
              ></textarea>
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="absolute z-10">
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
            {/* <ReactQuill
              className="w-full p-2 border rounded"
              value={message}
              onChange={(value) => {
                setMessage(value);
                setPostStatus(false);
                setPostMessage("");
              }}
              placeholder="Enter your message here"
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
            /> */}
            {postType === "link" && (
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter link here"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            )}
            {postType === "media" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Media Input Type
                  </label>
                  <select
                    value={mediaInputType}
                    onChange={(e) => setMediaInputType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="file">File Upload</option>
                    <option value="url">Image URL</option>
                  </select>
                </div>
                {mediaInputType === "file" && (
                  <input
                    type="file"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setMedia(Array.from(e.target.files))}
                    multiple
                  />
                )}
                {mediaInputType === "url" && (
                  <>
                    {mediaUrls.map((url, index) => (
                      <input
                        key={index}
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        placeholder={`Enter image URL ${index + 1}`}
                        value={url}
                        onChange={(e) =>
                          handleMediaUrlsChange(index, e.target.value)
                        }
                      />
                    ))}
                    <button
                      type="button"
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
                      onClick={addMediaUrlField}
                    >
                      Add Another Image URL
                    </button>
                  </>
                )}
              </>
            )}
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
