import React, { useState, useEffect } from "react";

function UpdateUserBlog({ onClose, blog, onUpdateBlog, blogSpaceId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_Url, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const blogSpace = blog;
  console.log("selected blogSpace:", blogSpace);

  useEffect(() => {
    const fetchBlogSpaceData = async () => {
      console.log("Fetching blog space data...");

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `https://diaryblogapi2.onrender.com/api/blogSpace/${blogSpace._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setTitle(data.name);
        setDescription(data.description || ""); // Set description from fetched data
        setImageUrl(data.image_url);
        setCategory(data.category);
      } catch (error) {
        console.error("Error fetching blog space data:", error.message);
        setErrors({ blogSpace: error.message });
      }
    };

    fetchBlogSpaceData();
  }, [blogSpaceId]);

  function validateFields() {
    let validationErrors = {};

    if (title.length < 3 || title.length > 30) {
      validationErrors.title = "Title should be between 3 and 30 characters.";
    }

   
    const urlPattern = /^https?:\/\/.+$/;
    if (image_Url.trim() !== "" && !urlPattern.test(image_Url)) {
      validationErrors.image_Url = "Icon URL must be in http format."; // Changed from 'icon' to 'image_Url'
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

    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://diaryblogapi2.onrender.com/api/blogSpace/${blogSpace._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: title,
            description: description,
            image_url: image_Url,
            category: category,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      setSuccess(true);
      onUpdateBlog();
      setLoading(false);

      // Optional: You can set a timeout to hide the success message after a certain time
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
      {success && (
        <div className="bg-green-200 text-green-800 p-2 mb-4 rounded-md">
          Blog updated successfully!
        </div>
      )}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500 text-center mb-4">
            Edit Blog
          </h1>
          <button className="cancel-button text-red-600" onClick={onClose}>
            ❌
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-1">Title:</label>
        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="text-red-500">{errors.title}</p>}
      </div>

      <div className="flex flex-col mb-2">
      <label className="block text-gray-700 text-sm font-bold mb-1">
            Description:
          </label>
          <textarea
            className="p-2 border rounded-md"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
      </div>
      <label className="block text-gray-700 text-sm font-bold mb-1">
  Icon URL:
</label>
      <div className="flex items-center"> {/* Added flex container */}
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Icon URL"
            value={image_Url}
            onChange={(e) => setImageUrl(e.target.value)}
          />
           {image_Url && ( // Updated variable name
  <div className="ml-2">
    <img
      src={image_Url} // Updated variable name
      alt="Icon Preview"
      className="w-6 h-6 rounded-md mt-1" 
    />
  </div>
)}
          {errors.image_Url && (
            <p className="text-red-500">{errors.image_Url}</p>
          )}
      </div>

      <div className="flex flex-col mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-1">Category:</label>
        <select
          className="p-2 border rounded-md"
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
          <p className="text-red-500">{errors.category}</p>
        )}
      </div>

      <div>
  {loading ? (
    <button
      type="submit"
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      disabled
    >
      <span className="flex items-center">
        <span className="mr-2">Loading</span>
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </span>
    </button>
  ) : (
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
    >
      Save
    </button>
  )}
</div>

        </form>
      </div>
    </div>
  );
}

export default UpdateUserBlog;
