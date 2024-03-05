import { Token } from "@mui/icons-material";
import React, { useState } from "react";

function CreateUserBlog({ onClose, onNewBlog }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [image_Url, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);




  function validateFields() {
    let validationErrors = {};

    if (title.length < 3 || title.length > 30) {
      validationErrors.title = "Title should be between 3 and 30 characters.";
    }

    const urlPattern = /^https?:\/\/.+$/;
    if (!urlPattern.test(url)) {
      validationErrors.url = "URL must be in http format.";
    }

    return validationErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");
    console.log('Token:', token);

    try {
      const response = await fetch(
        "https://diaryblogapi2.onrender.com/api/diaryblog_space",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: title,
            url: url,
            image_url: image_Url,
            category: category,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      
    setSuccess(true); // Set success state
    setLoading(false); // Stop loading state

      const data = await response.json();
      // Update state or trigger any other action on success

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
    {loading && <p>Loading...</p>}
    {success && (
      <div className="bg-green-200 text-green-800 p-2 mb-4 rounded-md">
        Blog updated successfully!
      </div>
    )}
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500 text-center mb-4">Create blog </h1>
        <button className="cancel-button text-red-600" onClick={onClose}>
            ❌
          </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Title:
            </label>
            <input
              type="text"
              className="blogInput border p-2 mb-2 w-full sm:mb-1"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="error text-red-500">{errors.title}</p>
            )}
            <label className="block text-gray-700 text-sm font-bold mb-1">
              URL:
            </label>
            <input
              type="url"
              className="blogInput border p-2 mb-2 w-full sm:mb-1"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {errors.url && <p className="error text-red-500">{errors.url}</p>}
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Image:
            </label>
            <input
              type="text"
              className="blogInput border p-2 mb-2 w-full sm:mb-1"
              placeholder="Image URL"
              value={image_Url}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Category:
            </label>
            <select
              className="blogInput border p-2 mb-2 w-full sm:mb-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Technology</option>
              <option value="Food and Recipes">Food and Recipes</option>
              <option value="Personal Finance">Personal Finance</option>
              <option value="Parenting and Family">Parenting and Family</option>
            </select>
            {errors.category && (
              <p className="error text-red-500">{errors.category}</p>
            )}
            
            <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          >
            Submit
          </button>
          </form>
        </div>
        </div>
      );
    }
    
    export default CreateUserBlog;
    
