import React, { useState, useEffect } from "react";
import "./BlogCreator.css";
import jwt_decode from "jwt-decode";

function CreateTypeitSpace({ onClose, onNewBlog }) {
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

  const handlebloglist = (blogSpace) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }

    // Decode the JWT token to get the user_id
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.id;

    fetch(`http://127.0.0.1:5000/api/create_typeit_space/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: blogSpace.name,
        _id: blogSpace._id,
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data)) // Handle success
      .catch((error) => console.error("Error:", error));
  };

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
            companyData.map((blogSpace) => (
              <li
                className="blogspace-list"
                onClick={handlebloglist(blogSpace)}
              >
                {blogSpace.name}
              </li>
            ))}
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
