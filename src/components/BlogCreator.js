import React, { useState } from "react";
import "./BlogCreator.css";

// function CreateUserBlog({ onClose, onNewBlog }) {
//   // const [blogs, setBlogs] = useState([]);
//   const [title, setTitle] = useState("");
//   const [url, setUrl] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Add the new blog to the blogs array
//     // setBlogs([...blogs, { title, url }]);
//     onNewBlog({ title, url });
//     // Optionally clear the form
//     setTitle("");
//     setUrl("");
//   };
function CreateUserBlog({ onClose, onNewBlog }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setcategory] = useState("");
  const [errors, setErrors] = useState({});

  function validateFields() {
    let validationErrors = {};

    // Validate title length
    if (title.length < 3 || title.length > 30) {
      validationErrors.title = "Title should be between 3 and 30 characters.";
    }

    // Validate URL format using a simple regex pattern
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
        "https://diaryblogapi2.onrender.com/api/diaryblog_space",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: title, url: url, category: category }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      onNewBlog(data);
      setTitle("");
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  return (

<div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
  {success && (
    <div className="bg-green-200 text-green-800 p-2 mb-4 rounded-md text-center">
      Blog updated successfully!
    </div>
  )}
  <div className="mb-4">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold text-blue-500">Edit Blog</h1>
      <button className="text-red-600" onClick={onClose}>
        ❌
      </button>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Title:
      </label>
      <input
        type="text"
        className="w-full p-2 border mb-2 rounded-md"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {errors.title && <p className="text-red-500">{errors.title}</p>}

      <label className="block text-gray-700 text-sm font-bold mb-2">
        URL:
      </label>
      <input
        type="url"
        className="w-full p-2 border mb-2 rounded-md"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {errors.url && <p className="text-red-500">{errors.url}</p>}

      <label className="block text-gray-700 text-sm font-bold mb-2">
        Image:
      </label>
      <input
        type="text"
        className="w-full p-2 border mb-2 rounded-md"
        placeholder="Image URL"
        value={image_Url}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <label className="block text-gray-700 text-sm font-bold mb-2">
        Category:
      </label>
      <select
        className="w-full p-2 border mb-2 rounded-md"
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

const BlogCreator = ({ onNewBlog }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div>
      {showCreateForm ? (
        <CreateUserBlog onClose={toggleCreateForm} onNewBlog={onNewBlog} />
      ) : (
        <button className="create-blog-button" onClick={toggleCreateForm}>
          CREATE NEW BLOG SPACE
        </button>
      )}
    </div>
  );
};

export default BlogCreator;
