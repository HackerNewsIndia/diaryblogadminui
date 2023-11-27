import React, { useState, useEffect } from "react";
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
function CreateTypeitSpace({ onClose, onNewBlog }) {
  //   const [title, setTitle] = useState("");
  //   const [url, setUrl] = useState("");
  //   const [category, setcategory] = useState("");
  //   const [errors, setErrors] = useState({});
  const [companyData, setCompanyData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }

    // Decode the JWT token to get the user_id
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.id;

    fetch(
      `https://diaryblogapi2.onrender.com/api/diaryblog_space/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setCompanyData(data);
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
        setError(error.message);
      });
  }, []);

  //   function validateFields() {
  //     let validationErrors = {};

  //     // Validate title length
  //     if (title.length < 3 || title.length > 30) {
  //       validationErrors.title = "Title should be between 3 and 30 characters.";
  //     }

  //     // Validate URL format using a simple regex pattern
  //     const urlPattern = /^https?:\/\/.+$/;
  //     if (!urlPattern.test(url)) {
  //       validationErrors.url = "URL must be in http format.";
  //     }

  //     return validationErrors;
  //   }

  return (
    <div className="form-container">
      <div className="form-header">
        <h3 className="blogHeading">Create Type-It Space here</h3>
        <button className="cancel-button" onClick={onClose}>
          ❌
        </button>
      </div>
      <div>
        <ul>
          {companyData &&
            companyData.map((blogSpace) => <li>{blogSpace.name}</li>)}
        </ul>
      </div>
    </div>
  );
}

const TypeitSpaceCreator = ({ onNewBlog }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div>
      {showCreateForm ? (
        <CreateTypeitSpace onClose={toggleCreateForm} onNewBlog={onNewBlog} />
      ) : (
        <button className="create-blog-button" onClick={toggleCreateForm}>
          CREATE NEW TYPE-IT SPACE
        </button>
      )}
    </div>
  );
};

export default TypeitSpaceCreator;

// const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateFields();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(
//         "https://diaryblogapi2.onrender.com/api/diaryblog_space",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ name: title, url: url, category: category }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Network response was not ok");
//       }

//       const data = await response.json();
//       console.log(data);
//       onNewBlog(data);
//       setTitle("");
//       onClose(); // Close the form after successful submission
//     } catch (error) {
//       console.error(
//         "There was a problem with the fetch operation:",
//         error.message
//       );
//     }
//   };
