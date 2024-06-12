import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaReddit,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";

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
        className="h-60 w-60 border-2 border-dashed border-black"
        onClick={() => imageUploader.current.click()}
      >
        <img
          ref={uploadedImage}
          className="w-full h-full object-cover"
          alt="Uploaded"
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

const socialMediaIcons = {
  LinkedIn: <FaLinkedin style={{ color: '#0077B5' }} />, // LinkedIn color
  Twitter: <FaTwitter style={{ color: '#1DA1F2' }} />, // Twitter color
  GitHub: <FaGithub style={{ color: '#333' }} />, // GitHub color
  Reddit: <FaReddit style={{ color: '#FF4500' }} />, // Reddit color
  WhatsApp: <FaWhatsapp style={{ color: '#25D366' }} />, // WhatsApp color
  Facebook: <FaFacebook style={{ color: '#1877F2' }} />, // Facebook color
  Instagram: <FaInstagram style={{ color: '#E1306C' }} />, // Instagram color
  Website: <FaGlobe style={{ color: '#000' }} />, // Website color (black)
};

const socialMediaOptions = [
  { type: "LinkedIn", placeholder: "LinkedIn URL" },
  { type: "Twitter", placeholder: "Twitter URL" },
  { type: "GitHub", placeholder: "GitHub URL" },
  { type: "Reddit", placeholder: "Reddit URL" },
  { type: "Whatsapp", placeholder: "Whatsapp URL" },
  { type: "Facebook", placeholder: "Facebook URL" },
  { type: "Instagram", placeholder: "Instagram URL" },
  { type: "Website", placeholder: "Website URL" },
];

const User = () => {
  const [users, setUsers] = useState([]);
  const [profileLinks, setProfileLinks] = useState([{ type: "", url: "" }]);
  const [newUserImage, setNewUserImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = jwt_decode(token);
      const userId = payload.user.id;

      const response = await axios.get(`https://usermgtapi3.onrender.com/api/get_user/${userId}`);
      console.log("User data from API:", response.data);

      if (response.data && response.data.user_id) {
        const profileLinks = response.data.profile_links.map(link => {
          try {
            return JSON.parse(link.replace(/'/g, '"'));
          } catch (error) {
            console.error("Error parsing profile link:", link, error);
            return null;
          }
        }).filter(link => link !== null);

        setUsers([response.data]);
        setProfileLinks(profileLinks || [{ type: "", url: "" }]);
        setNewUserImage(response.data.image_base64);
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleProfileLinkChange = (index, field, value) => {
    const updatedLinks = [...profileLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setProfileLinks(updatedLinks);
  };

  const addProfileLink = () => {
    if (profileLinks.length < 10) {
      setProfileLinks([...profileLinks, { type: "", url: "" }]);
    } else {
      alert("You can only add up to 10 links.");
    }
  };

  const removeProfileLink = (index) => {
    const updatedLinks = profileLinks.filter((_, i) => i !== index);
    setProfileLinks(updatedLinks);
  };

  const handleImageUpload = (base64Image) => {
    setNewUserImage(base64Image);
  };

  const handleSaveUser = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const payload = jwt_decode(token);
      const userId = payload.user.id;

      const userData = {
        profile_links: profileLinks.map(link => ({ type: link.type, url: link.url })),
        image_base64: newUserImage,
      };

      if (isNewUser) {
        await axios.post(
          `https://usermgtapi3.onrender.com/api/create_user`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("User created successfully");
      } else {
        await axios.put(
          `https://usermgtapi3.onrender.com/api/update_user/${userId}`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("User updated successfully");
      }

      fetchUserData();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
      )}
      <form onSubmit={handleSaveUser}>
        {profileLinks.map((link, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-semibold mb-2">Profile Link Type:</label>
            <select
              value={link.type}
              onChange={(e) => handleProfileLinkChange(index, "type", e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2"
            >
              <option value="">Select</option>
              {socialMediaOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.type}
                </option>
              ))}
            </select>
            <div className="flex items-center mb-2">
              {link.type && socialMediaIcons[link.type]}
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleProfileLinkChange(index, "url", e.target.value)}
                placeholder={
                  socialMediaOptions.find((option) => option.type === link.type)
                   ?.placeholder || "Enter URL"
                }
                className="w-full border border-gray-300 rounded-md py-2 px-3 ml-2"
              />
            </div>
            <button
              type="button"
              onClick={() => removeProfileLink(index)}
              className="mt-2 text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addProfileLink}
          className="mb-4 bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Add Another Link
        </button>

        <ImageUploader onImageUpload={handleImageUpload} />

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Save
          </button>
        </div>
      </form>

      <div className="mt-8">
        {users.length > 0 && users.map((user) => (
          <div key={user.user_id}>
            <div className="flex flex-col items-center">
              {user.profile_links.map((link, index) => (
                <div key={index} className="flex items-center mb-2">
                  {socialMediaIcons[link.type]}
                  <a
                    href={link.url}
                    className="ml-2 text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.type}
                  </a>
                </div>
              ))}
            </div>
            {user.image_base64 && (
              <div className="mt-4">
                <img
                  src={`data:image/jpeg;base64,${user.image_base64}`}
                  alt="User"
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
