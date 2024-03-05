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
      <h1 className="text-2xl font-bold mb-4">Create blog here</h1>
      <button className="cancel-button" onClick={onClose}>❌</button>
      <form className="createBlogForm" onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="mb-4 text-red-600 font-semibold">{errors.title}</p>}
        <input
          type="url"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {errors.url && <p className="mb-4 text-red-600 font-semibold">{errors.url}</p>}
        <input
          type="text"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        {errors.category && <p className="mb-4 text-red-600 font-semibold">{errors.category}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Submit</button>
      </form>
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
