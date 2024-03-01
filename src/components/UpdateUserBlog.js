import React, { useState, useEffect } from "react";

function UpdateUserBlog({ onClose, blog, onUpdateBlog, blogSpaceId }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [image_Url, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});

  const blogSpace = blog;
  console.log("selected blogSpace:", blogSpace);

  useEffect(() => {
    const fetchBlogSpaceData = async () => {
      console.log("Fetching blog space data...");

      const token = localStorage.getItem("token");

      try {
        // console.log("Fetching blog space data...", blogSpaceId);

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
        setUrl(data.url);
        setImageUrl(data.image_url);
        setCategory(data.category);
      } catch (error) {
        console.error("Error fetching blog space data:", error.message);
        setErrors({ blogSpace: error.message }); // Set an error state
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

    try {
      const response = await fetch(
        `https://diaryblogapi2.onrender.com/api/blogSpace/${blogSpaceId}`,
        {
          method: "PUT",
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

      setSuccess(true);
      onUpdateBlog();
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  return (
    <div className="form-container max-w-lg mx-auto p-4">
      <div className="form-header flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-500">Edit Blog</h3>
        <button className="cancel-button text-red-600" onClick={onClose}>
          ❌
        </button>
      </div>
      <form className="updateBlogForm" onSubmit={handleSubmit}>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          className="blogInput border p-2 mb-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error text-red-500">{errors.title}</p>}

        <label className="block text-gray-700 text-sm font-bold mb-2">
          URL:
        </label>
        <input
          type="url"
          className="blogInput border p-2 mb-2 w-full"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {errors.url && <p className="error text-red-500">{errors.url}</p>}

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Image:
        </label>
        <input
          type="text"
          className="blogInput border p-2 mb-2 w-full"
          placeholder="Image URL"
          value={image_Url}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category:
        </label>
        <select
          className="blogInput border p-2 mb-2 w-full"
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
  );
}

export default UpdateUserBlog;
