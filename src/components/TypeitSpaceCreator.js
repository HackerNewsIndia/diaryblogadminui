import React, { useState, useEffect } from "react";
import "./BlogCreator.css";
import jwt_decode from "jwt-decode";

function CreateTypeitSpace({ onClose, onNewBlog, onUpdateTypeitData }) {
  const [companyData, setCompanyData] = useState("");
  const [createdTypeitSpaces, setCreatedTypeitSpaces] = useState([]);
  const [message, setMessage] = useState("");

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

    fetch(`https://typeit-api.onrender.com/api/create_typeit_space/${userId}`, {
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
      .then((data) => {
        console.log(data); // Handle success
        setCreatedTypeitSpaces((prevSpaces) => [...prevSpaces, blogSpace._id]);
        setMessage("Typeit Space Created!");
        onUpdateTypeitData(); // Trigger parent component to fetch updated data
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Failed to create Typeit Space.");
      });
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
                key={blogSpace._id}
                className="blogspace-list"
                onClick={() => handlebloglist(blogSpace)}
              >
                {blogSpace.name}{" "}
                {createdTypeitSpaces.includes(blogSpace._id) && (
                  <span style={{ color: "green" }}>Typeit Space Created!</span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

const TypeitSpaceCreator = ({ onNewBlog, onUpdateTypeitData }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createdTypeitSpaces, setCreatedTypeitSpaces] = useState([]);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  useEffect(() => {
    // Update createdTypeitSpaces state when onUpdateTypeitData is called
    setCreatedTypeitSpaces([]);
  }, [onUpdateTypeitData]);

  return (
    <div>
      {showCreateForm ? (
        <CreateTypeitSpace
          onClose={toggleCreateForm}
          onNewBlog={onNewBlog}
          onUpdateTypeitData={onUpdateTypeitData}
          setCreatedTypeitSpaces={setCreatedTypeitSpaces}
        />
      ) : (
        <button className="create-blog-button" onClick={toggleCreateForm}>
          CREATE NEW TYPE-IT SPACE
        </button>
      )}
    </div>
  );
};

export default TypeitSpaceCreator;
