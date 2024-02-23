import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';

const User = () => {
  const token = localStorage.getItem('token');
  const payload = jwt_decode(token);
  const user_id = payload.user.id;

  const [user, setUser] = useState({
    user_id: '',
    linkedin: '',
    twitter: '',
    github: '',
    image_base64: null,
  });

  const [editMode, setEditMode] = useState({
    linkedin: false,
    twitter: false,
    github: false,
  });

  const [successMessage, setSuccessMessage] = useState('');
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
    if (editMode[name]) {
      setUser({ ...user, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      fileToBase64(file, (base64Data) => {
        const base64WithoutPrefix = base64Data.split(',')[1];
        setUser({ ...user, image_base64: base64WithoutPrefix });
        handleBase64Storage(base64WithoutPrefix);
      });
    }
  };

  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64Storage = (base64Data) => {
    console.log('Base64 Data:', base64Data);
  };

  const toggleEditMode = (fieldName) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [fieldName]: !prevEditMode[fieldName],
    }));
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('https://usermgtapi3.onrender.com/api/create_user', {
        linkedin: user.linkedin,
        twitter: user.twitter,
        github: user.github,
        image_base64: user.image_base64,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);

      fetchUserData();
      setSuccessMessage('User created successfully');
      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (user_id) {
      try {
        const response = await axios.put(`https://usermgtapi3.onrender.com/api/update_user/${user_id}`, {
          linkedin: user.linkedin,
          twitter: user.twitter,
          github: user.github,
          image_base64: user.image_base64,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response.data);

        fetchUserData();
        setSuccessMessage('User updated successfully');
        console.log('User updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      console.error('User ID is undefined. Cannot update user.');
    }
  };

  const handleSaveUser = async () => {
    await handleUpdateUser();
    await handleCreateUser();
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">LinkedIn:</label>
        <div className="relative">
          <input
            className={`w-full p-2 border rounded-md ${editMode.linkedin ? 'bg-gray-100' : ''}`}
            type="text"
            name="linkedin"
            value={user.linkedin}
            onChange={handleInputChange}
            readOnly={!editMode.linkedin}
          />
          <FontAwesomeIcon
            icon={faPencilAlt}
            className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            onClick={() => toggleEditMode('linkedin')}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Twitter:</label>
        <div className="relative">
          <input
            className={`w-full p-2 border rounded-md ${editMode.twitter ? 'bg-gray-100' : ''}`}
            type="text"
            name="twitter"
            value={user.twitter}
            onChange={handleInputChange}
            readOnly={!editMode.twitter}
          />
          <FontAwesomeIcon
            icon={faPencilAlt}
            className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            onClick={() => toggleEditMode('twitter')}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Github:</label>
        <div className="relative">
          <input
            className={`w-full p-2 border rounded-md ${editMode.github ? 'bg-gray-100' : ''}`}
            type="text"
            name="github"
            value={user.github}
            onChange={handleInputChange}
            readOnly={!editMode.github}
          />
          <FontAwesomeIcon
            icon={faPencilAlt}
            className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            onClick={() => toggleEditMode('github')}
          />
        </div>
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
            src={`data:image/jpeg;base64,${user.image_base64}`}
            alt="User Preview"
          />
        )}
      </div>
      <div className="mb-4 flex justify-center">
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={handleSaveUser}        >
          Save
        </button>
      </div>
    </div>
  );
};

export default User;
