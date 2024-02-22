import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const User = () => {
  const [user, setUser] = useState({
    user_id: '',
    linkedin: '',
    twitter: '',
    github: '',
    image_base64: null,
  });

  const imageUploader = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://usermgtapi3.onrender.com/api/get_user/${user_id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      fileToBase64(file, (base64Data) => {
        setUser({ ...user, image_base64: base64Data });
      });
    }
  };
  function fileToBase64(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleCreateUser = async () => {
    try {
      await axios.post('https://usermgtapi3.onrender.com/api/update_user', user);
      fetchUserData();
      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('linkedin', user.linkedin);
      formData.append('twitter', user.twitter);
      formData.append('github', user.github);
      formData.append('image_base64', user.image_base64);

      await axios.put('https://usermgtapi3.onrender.com/api/get_user/${user_id}', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Add this line to include cookies

      });

      fetchUserData();
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">LinkedIn:</label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          name="linkedin"
          value={user.linkedin}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Twitter:</label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          name="twitter"
          value={user.twitter}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Github:</label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          name="github"
          value={user.github}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Image upload:</label>
        <input
          type="file"
          accept="image/*,application/pdf,.pdf"
          onChange={handleImageUpload}
          ref={imageUploader}
          className="hidden"
        />
        <button
          onClick={() => imageUploader.current.click()}
          className="bg-blue-500 text-white p-2 rounded-md mr-2"
        >
          Select File
        </button>
        {user.image_base64 && (
          <img
            className="mt-2 w-full h-auto rounded-md"
            src={user.image_base64}
            alt="User Preview"
          />
        )}
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded-md mr-2"
        onClick={handleCreateUser}
      >
        Create User
      </button>
      <button
        className="bg-green-500 text-white p-2 rounded-md"
        onClick={handleUpdateUser}
      >
        Update User
      </button>
    </div>
  );
};

export default User;
