import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { FaChevronDown, FaChevronUp, FaCopy } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import BeatLoader from "react-spinners/BeatLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const ImageUploader = ({ onImageUpload }) => {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;

      reader.onload = (e) => {
        current.src = e.target.result;

        const base64Image = e.target.result.split(",")[1];
        onImageUpload(base64Image);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="file"
        accept="image/*,application/pdf,.pdf"
        onChange={handleImageUpload}
        ref={imageUploader}
        className="hidden"
      />
      <div
        // className="h-40 w-40 border-2 border-dashed border-gray-500 rounded-full cursor-pointer"
        style={{
          height: "10rem", // 40 * 0.25rem = 10rem
          width: "10rem", // 40 * 0.25rem = 10rem
          borderWidth: "2px",
          borderStyle: "dashed",
          borderColor: "#6b7280", // gray-500 in Tailwind CSS
          borderRadius: "50%",
          cursor: "pointer",
        }}
        onClick={() => imageUploader.current.click()}
      >
        <img
          ref={uploadedImage}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <p
        className="mt-2 cursor-pointer text-blue-500"
        onClick={() => imageUploader.current.click()}
      >
        Click to upload Image
      </p>
    </div>
  );
};

const User = () => {
  const [newUserLinkedIn, setNewUserLinkedIn] = useState("");
  const [newUserTwitter, setNewUserTwitter] = useState("");
  const [newUserGitHub, setNewUserGitHub] = useState("");
  const [newUserImage, setNewUserImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isFbDetailsOpen, setIsFbDetailsOpen] = useState(false);
  const [isFbInputsOpen, setIsFbInputsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [userDetailsUpdated, setUserDetailsUpdated] = useState(false);
  const [fbError, setFbError] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(false);
  const [isLinkedInInputsOpen, setIsLinkedInInputsOpen] = useState(false);
  const [isLinkedInDetailsOpen, setIsLinkedInDetailsOpen] = useState(false);
  const [linkedInAccessToken, setLinkedInAccessToken] = useState("");
  const [loadingLinkedInSubmit, setLoadingLinkedInSubmit] = useState(false);
  const [linkedInError, setLinkedInError] = useState(false);
  const [isLinkedInDetailsUpdated, setIsLinkedInDetailsUpdated] =
    useState(false);
  const [linkedInTokenCopied, setLinkedInTokenCopied] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      console.log("Token not found in local storage");
      return;
    }

    const decodedToken = jwt_decode(token);
    const userId = decodedToken.user.id;
    setCurrentUserId(userId);
  }, [token]);

  const handleLinkedInChange = (event) => {
    setNewUserLinkedIn(event.target.value);
  };

  const handleTwitterChange = (event) => {
    setNewUserTwitter(event.target.value);
  };

  const handleGitHubChange = (event) => {
    setNewUserGitHub(event.target.value);
  };

  const handleImageUpload = (base64Image) => {
    setNewUserImage(base64Image);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token not found in local storage");
        return;
      }

      const decodedToken = jwt_decode(token);
      const userId = decodedToken.user.id;

      // Collect all profile links
      const profileLinks = [];
      if (newUserLinkedIn)
        profileLinks.push({ type: "LinkedIn", url: newUserLinkedIn });
      if (newUserTwitter)
        profileLinks.push({ type: "Twitter", url: newUserTwitter });
      if (newUserGitHub)
        profileLinks.push({ type: "GitHub", url: newUserGitHub });

      const userData = {};
      if (profileLinks.length > 0) userData.profile_links = profileLinks;
      if (newUserImage) userData.image_base64 = newUserImage;

      const response = await axios.patch(
        `https://usermgtapi-msad.onrender.com/api/update_user/${userId}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newUser = response.data;

      // Update state or perform any necessary actions after successful save
      console.log("User saved successfully:", newUser);
      setNewUserLinkedIn("");
      setNewUserTwitter("");
      setNewUserGitHub("");
      setNewUserImage(null);
      setCurrentUserId(userId);
      // alert("User saved successfully!");
      setUserDetailsUpdated(true);
    } catch (error) {
      console.error("Error updating user:", error);
      // alert("Error updating the user. Please try again.");
      setUserDetailsError(true);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://usermgtapi-msad.onrender.com/api/get_user/${currentUserId}`
        );
        const user = response.data;
        setCurrentUser(user);
        console.log(user);
        setNewUserLinkedIn(
          user.profile_links.find((link) => link.type === "LinkedIn")?.url || ""
        );
        console.log("profile_links:", user.profile_links);
        // console.log("newUserLinkedIn:", user.profile_links);
        console.log("newUserLinkedIn:", newUserLinkedIn);

        setNewUserTwitter(
          user.profile_links.find((link) => link.type === "Twitter")?.url || ""
        );
        setNewUserGitHub(
          user.profile_links.find((link) => link.type === "GitHub")?.url || ""
        );
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (currentUserId) {
      fetchUser();
    }
  }, [currentUserId]);

  const handleFbSubmit = async (event) => {
    event.preventDefault();
    setLoadingSubmit(true); // Set loading to true when submitting
    try {
      const response = await fetch(
        "https://diaryblogapi-eul3.onrender.com/api/exchange_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: clientId,
            clientSecret: clientSecret,
            accessToken: accessToken,
          }),
        }
      );
      const json_data = await response.json();
      console.log("data:", json_data);
      console.log("permanent token:", json_data.data[0].access_token);
      console.log("pageId:", json_data.data[0].id);

      if (json_data.data[0].access_token) {
        setPermanentToken(json_data.data[0].access_token);
        setPageId(json_data.data[0].id);
        setPermanentTokenGenerated(true);
      }

      if (
        json_data.data[0].access_token &&
        json_data.data[0].id &&
        json_data.data[0].name
      ) {
        const response2 = await fetch(
          "https://diaryblogapi-eul3.onrender.com/api/user_facebook_details",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              permanent_token: json_data.data[0].access_token,
              page_id: json_data.data[0].id,
              page_name: json_data.data[0].name,
              user_id: currentUserId,
            }),
          }
        );
        const data2 = await response2.json();
        console.log("data2:", data2);
        // Handle data2 as needed
        return data2;
      }
    } catch (error) {
      console.error(
        "Error during token exchange or user details update:",
        error
      );
      setFbError(true);
    } finally {
      setLoadingSubmit(false); // Set loading to false after submission
    }
  };

  const handleLinkedInSubmit = async (event) => {
    event.preventDefault();
    setLoadingLinkedInSubmit(true); // Set loading to true when submitting
    try {
      const response = await fetch(
        "https://diaryblogapi-eul3.onrender.com/api/user_linkedin_details",
        // "http://127.0.0.1:5001/api/user_linkedin_details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            linkedInAccessToken: linkedInAccessToken,
            user_id: currentUserId,
          }),
        }
      );
      const json_data = await response.json();
      console.log("data:", json_data);
      if (!response.ok) {
        setLinkedInError(true);
      } else {
        setIsLinkedInDetailsUpdated(true);
      }
    } catch (error) {
      console.error("Error during linkedIn details update:", error);
      setLinkedInError(true);
    } finally {
      setLoadingLinkedInSubmit(false); // Set loading to false after submission
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="w-1/2 p-8 bg-white shadow-lg overflow-auto "
        style={{
          maxHeight: "700px",
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2">
              LinkedIn URL:
            </label>
            <input
              type="text"
              value={newUserLinkedIn}
              onChange={handleLinkedInChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2">
              Twitter URL:
            </label>
            <input
              type="text"
              value={newUserTwitter}
              onChange={handleTwitterChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2">
              GitHub URL:
            </label>
            <input
              type="text"
              value={newUserGitHub}
              onChange={handleGitHubChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Save
          </button>
        </form>
        {userDetailsUpdated == true && (
          <div
            className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 mb-2"
            role="alert"
          >
            <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
            <p className="font-bold">User Details Updated.</p>
          </div>
        )}
        {userDetailsError == true && (
          <div
            className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 mb-2"
            role="alert"
          >
            <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faXmark} />
            <p className="font-bold"></p>
          </div>
        )}

        <div className="mt-6">
          <h4
            className="text-md font-semibold cursor-pointer flex items-center"
            onClick={() => setIsFbInputsOpen(!isFbInputsOpen)}
          >
            Facebook Integration
            {isFbInputsOpen ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </h4>
          {isFbInputsOpen && (
            <form onSubmit={handleFbSubmit} className="space-y-4 mt-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientId"
                >
                  Client ID
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="clientId"
                  type="number"
                  placeholder="Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientSecret"
                >
                  Client Secret
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="clientSecret"
                  type="text"
                  placeholder="Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="accessToken"
                >
                  Access Token
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="accessToken"
                  type="text"
                  placeholder="Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? (
                    <BeatLoader color="#fff" size={10} />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          )}
          {permanentTokenGenerated == true && (
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 mb-2"
              role="alert"
            >
              <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
              <p className="font-bold">Facebook Integration Complete</p>
            </div>
          )}
          {fbError == true && (
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 mb-2"
              role="alert"
            >
              <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faXmark} />
              <p className="font-bold">
                Error updating the user. Please try again.
              </p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <h4
            className="text-md font-semibold cursor-pointer flex items-center"
            onClick={() => setIsLinkedInInputsOpen(!isLinkedInInputsOpen)}
          >
            LinkedIn Integration
            {isLinkedInInputsOpen ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </h4>
          {isLinkedInInputsOpen && (
            <form onSubmit={handleLinkedInSubmit} className="space-y-4 mt-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientId"
                >
                  LinkedIn Access Token
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="token"
                  type="token"
                  placeholder="access_token"
                  value={linkedInAccessToken}
                  onChange={(e) => setLinkedInAccessToken(e.target.value)}
                />
              </div>
              {/* <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientSecret"
                >
                  Client Secret
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="clientSecret"
                  type="text"
                  placeholder="Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="accessToken"
                >
                  Access Token
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="accessToken"
                  type="text"
                  placeholder="Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div> */}
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={loadingLinkedInSubmit}
                >
                  {loadingLinkedInSubmit ? (
                    <BeatLoader color="#fff" size={10} />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          )}
          {isLinkedInDetailsUpdated == true && (
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 mb-2"
              role="alert"
            >
              <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faCheck} />
              <p className="font-bold">LinkedIn Integration Complete</p>
            </div>
          )}
          {linkedInError == true && (
            <div
              className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 mb-2"
              role="alert"
            >
              <FontAwesomeIcon className="w-5 h-5 mr-2" icon={faXmark} />
              <p className="font-bold">
                Error updating the user. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
      <div
        className="w-1/2 p-8 bg-gray-100 overflow-auto"
        style={{
          maxHeight: "700px",
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}
      >
        {currentUser == null && (
          <div className="flex justify-center items-center mx-auto my-auto">
            <BeatLoader color="hsla(168, 4%, 75%, 1)" />
          </div>
        )}
        {currentUser && (
          <>
            <div className="mb-4">
              {currentUser.image_base64 && (
                <img
                  src={`data:image/jpeg;base64,${currentUser.image_base64}`}
                  alt="User"
                  // className="w-40 h-40 object-cover rounded-full mx-auto"
                  style={{
                    width: "10rem", // 40 * 0.25rem = 10rem
                    height: "10rem", // 40 * 0.25rem = 10rem
                    objectFit: "cover",
                    borderRadius: "50%",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
              )}
            </div>
            <div className="p-4 bg-white rounded-md shadow-md">
              <div className="mb-4">
                <h3 className="text-md font-semibold">
                  Username:{" "}
                  <span className="text-md font-semibold text-gray-500">
                    {currentUser.username}
                  </span>
                </h3>
              </div>
              <div className="mb-4">
                <h4 className="text-md font-semibold">
                  Email:{" "}
                  <span className="text-md font-semibold text-gray-500">
                    {currentUser.email}
                  </span>
                </h4>
              </div>
              <div className="mb-4">
                <h4 className="text-md font-semibold">Profile Links</h4>
                {currentUser.profile_links.map((link, index) => (
                  <div key={index}>
                    <a
                      href={JSON.parse(link).url}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {JSON.parse(link).type}
                    </a>
                  </div>
                ))}
              </div>
              {currentUser.facebook_integration_details && (
                <div className="mb-4">
                  <h4
                    className="text-md font-semibold cursor-pointer flex items-center"
                    onClick={() => setIsFbDetailsOpen(!isFbDetailsOpen)}
                  >
                    Facebook Integration Details
                    {isFbDetailsOpen ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </h4>
                  {isFbDetailsOpen && (
                    <table className="table-auto w-full mt-2">
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Page Name
                          </td>
                          <td className="border px-4 py-2 text-gray-500 break-words">
                            {currentUser.facebook_integration_details.page_name}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Client ID
                          </td>
                          <td className="border px-4 py-2 text-gray-500 break-words">
                            {currentUser.facebook_integration_details.client_id}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Client Secret
                          </td>
                          <td className="border px-4 py-2 text-gray-500 break-words">
                            {
                              currentUser.facebook_integration_details
                                .client_secret
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Permanent Access Token
                          </td>
                          <td className="border px-4 py-2 flex items-center text-gray-500 break-words">
                            <span className="overflow-hidden text-ellipsis whitespace-normal break-all max-w-xs">
                              {
                                currentUser.facebook_integration_details
                                  .permanent_token
                              }
                            </span>
                            <CopyToClipboard
                              text={
                                currentUser.facebook_integration_details
                                  .permanent_token
                              }
                              onCopy={() => setCopied(true)}
                            >
                              <button className="ml-2">
                                <FaCopy />
                              </button>
                            </CopyToClipboard>
                            {copied && (
                              <span className="ml-2 text-green-500">
                                Copied!
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              {currentUser.LinkedIn_integration_details && (
                <div className="mb-4">
                  <h4
                    className="text-md font-semibold cursor-pointer flex items-center"
                    onClick={() =>
                      setIsLinkedInDetailsOpen(!isLinkedInDetailsOpen)
                    }
                  >
                    LinkedIn Integration Details
                    {isLinkedInDetailsOpen ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </h4>
                  {isLinkedInDetailsOpen && (
                    <table className="table-auto w-full mt-2">
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Profile Name
                          </td>
                          <td className="border px-4 py-2 text-gray-500 break-words">
                            {
                              currentUser.LinkedIn_integration_details
                                .profile_name
                            }
                          </td>
                        </tr>

                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            URN_sub
                          </td>
                          <td className="border px-4 py-2 text-gray-500 break-words">
                            {currentUser.LinkedIn_integration_details.URN_sub}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            LinkedIn Access Token
                          </td>
                          <td className="border px-4 py-2 flex items-center text-gray-500 break-words">
                            <span className="overflow-hidden text-ellipsis whitespace-normal break-all max-w-xs">
                              {
                                currentUser.LinkedIn_integration_details
                                  .linkedIn_access_token
                              }
                            </span>
                            <CopyToClipboard
                              text={
                                currentUser.LinkedIn_integration_details
                                  .linkedIn_access_token
                              }
                              onCopy={() => setLinkedInTokenCopied(true)}
                            >
                              <button className="ml-2">
                                <FaCopy />
                              </button>
                            </CopyToClipboard>
                            {linkedInTokenCopied && (
                              <span className="ml-2 text-green-500">
                                Copied!
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              <div className="mb-4">
                <h4 className="text-md font-semibold">
                  Created Date:{" "}
                  <span className="text-md font-semibold text-gray-500">
                    {new Date(currentUser.createDate).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      }
                    )}
                  </span>
                </h4>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default User;
