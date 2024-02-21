import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const User = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [newUserLinkedIn, setNewUserLinkedIn] = useState("");
  const [newUserTwitter, setNewUserTwitter] = useState("");
  const [newUserGitHub, setNewUserGitHub] = useState("");
  const [newUserImage, setNewUserImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Token not found in local storage");
          return;
        }

        const decodedToken = jwt_decode(token);
        const userId = decodedToken.id;

        const response = await axios.get(
          `https://usermgtapi3.onrender.com/api/get_user/${userId}`
        );

        const existingUser = response.data;

        setUserId(existingUser._id);
        setNewUserLinkedIn(existingUser.linkedin || "");
        setNewUserTwitter(existingUser.twitter || "");
        setNewUserGitHub(existingUser.github || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
    console.log("Base64 Image Data:", base64Image);
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
      const userId = decodedToken.id;

      const userData = {
        user_id: userId,
        linkedin: newUserLinkedIn,
        twitter: newUserTwitter,
        github: newUserGitHub,
        image_base64: newUserImage,
      };

      if (userId) {
        const response = await axios.put(
          `https://usermgtapi3.onrender.com/api/update_user/${userId}`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const updatedUser = response.data;

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? updatedUser : user
          )
        );

        alert("User updated successfully!");
      } else {
        const response = await axios.post(
          "https://usermgtapi3.onrender.com/api/update_user",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newUser = response.data;

        setUsers((prevUsers) => [...prevUsers, newUser]);
        alert("User saved successfully!");
      }

      setUserId("");
      setNewUserLinkedIn("");
      setNewUserTwitter("");
      setNewUserGitHub("");
      setNewUserImage("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving/updating user. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-12 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Create User Profile</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            LinkedIn URL:
          </label>
          <input
            type="text"
            value={newUserLinkedIn}
            onChange={handleLinkedInChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Twitter URL:
          </label>
          <input
            type="text"
            value={newUserTwitter}
            onChange={handleTwitterChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            GitHub URL:
          </label>
          <input
            type="text"
            value={newUserGitHub}
            onChange={handleGitHubChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          />

          <ImageUploader onImageUpload={handleImageUpload} />

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Save
            </button>
          </div>
        </form>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm-p:md:grid-cols-2">
          {users.map((user) => (
            <div key={user._id}>
              <div className="flex justify-around mt-4">
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                )}
                {user.github && (
                  <a
                    href={user.github}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={user.twitter}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                )}
              </div>

              {user.image && (
                <div className="mt-4 ">
                  <img
                    src={`https://usermgtapi3.onrender.com/${user.image}`}
                    alt="User"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
