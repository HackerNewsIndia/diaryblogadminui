import { Token } from "@mui/icons-material";
import { data } from "autoprefixer";
import React, { useState } from "react";

function CreateUserBlog({ onClose, onNewBlog }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [image_Url, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});

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
    console.log("Token:", token);

    try {
      const response = await fetch(
        "https://diaryblogapi2.onrender.com/api/diaryblog_space",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Replace yourExpiredToken with the correct variable
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

      // Read the response once and then use it as needed
      const data = await response.json();
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };
 return (
          <div className="flex min-h-full items-center justify-center px-6 py-12 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Create blog
                </h2>
                <button
                      onClick={onClose}
                      className="cancel-button text-red-600 text-sm sm:text-base"
                    >
                      ❌
                  </button>
              </div>
          
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6 createBlogForm" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Title:
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="block w-full rounded-md border-2 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
          
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      URL:
                    </label>
                    <input
                      id="url"
                      type="url"
                      className="block w-full rounded-md border-2 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                      placeholder="URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    {errors.url && (
                      <p className="mt-2 text-sm text-red-500">{errors.url}</p>
                    )}
                  </div>
          
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Image:
                    </label>
                    <input
                      id="image"
                      type="text"
                      className="block w-full rounded-md border-2 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                      placeholder="Image URL"
                      value={image_Url}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
          
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Category:
                    </label>
                    <select
                      id="category"
                      className="block w-full rounded-md border-2 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
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
                      <p className="mt-2 text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
          
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      );
    }
    
    export default CreateUserBlog;
    
