// CreateNewPost.js

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./CreateNewPost.css";

const CreateNewPost = ({
  cancelCreatingPost,
  selectedCompany,
  addNewStory,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [url, setUrl] = useState("");

  console.log("Component render start");
  useEffect(() => {
    console.log("Inside useEffect before fetch");
    fetch("https://diaryblogapi2.onrender.com/api/md_templates")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data fetched", data);
        setTemplates(data); // Store the templates in state
      })
      .catch((error) =>
        console.error("There was an error fetching the templates:", error)
      );
  }, []);

  console.log("Component render end");
  console.log("templates:", templates);
  console.log("blogpost ");

  const currentTime = new Date().toISOString();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      console.log("Validation failed!");
      setValidationError("Title and Content are required!");
      console.log(validationError);
      return; // Exit early if validation fails
    }

    const token = localStorage.getItem("token");

    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}`,
      // `http://127.0.0.1:5001/api/posts/${selectedCompany.name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          category,
          status: "published",
        }), // This will be available in request.get_json() in your backend
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        addNewStory(data);
        // Handle the response, like redirecting to the posts list or clearing the form
        cancelCreatingPost(); // if you want to go back to the list after successfully creating a post
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveDraft = () => {
    const token = localStorage.getItem("token");

    console.log("Selected Company ID:", selectedCompany._id);

    fetch(
      `https://diaryblogapi2.onrender.com/api/drafts/${selectedCompany.company}/${selectedCompany._id.$oid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          imageUrl: imageUrl,
          company: selectedCompany.company,
          timestamp: currentTime,
          status: "draft",
        }), // This will be available in request.get_json() in your backend
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Draft saved:", data);
        cancelCreatingPost();
        // Maybe clear the form or show a notification to the user
      })
      .catch((error) => {
        console.error("Error saving draft:", error);
      });
  };

  console.log("hi");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setDescription(e.target.result); // Assuming setDescription updates your textarea
      };
      reader.readAsText(file);
    }
  };

  const handleURLChange = (event) => {
    setUrl(event.target.value);
  };
  console.log("url:", url);

  const fetchMarkdownFromURL = (e) => {
    e.preventDefault();
    fetch(
      `https://diaryblogapi2.onrender.com/fetch-content?url=${encodeURIComponent(
        url
      )}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch the file.");
        return response.text();
      })
      .then((content) => {
        setDescription(content);
      })
      .catch((error) => console.error("Error fetching .md file:", error));
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-heading">Create New Post</h1>

      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-split">
          <div className="post-details">
            {validationError && (
              <div className="error-message">{validationError}</div>
            )}
            <button
              className="submit-button"
              type="submit"
              // disabled={!title.trim() || !content.trim()}
            >
              Publish
            </button>
            <button className="save-draft-button" onClick={handleSaveDraft}>
              Save as Draft
            </button>
            <button className="cancel-button" onClick={cancelCreatingPost}>
              Cancel
            </button>
            <select
              className="post-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="Geography">Geography</option>
              <option value="History">History</option>
              <option value="Psychology">Psychology</option>
              <option value="others">others</option>
            </select>
            <label htmlFor="md-file" className="post-content-label">
              Upload .md file:
            </label>
            <input
              className="file-upload"
              type="file"
              id="md-file"
              accept=".md"
              onChange={handleFileChange}
            />
            <label className="post-content-label">
              Or enter the URL of the .md file:
            </label>
            <input
              className="url-upload"
              type="text"
              placeholder="Enter URL to .md file"
              onChange={handleURLChange}
            />
            <button
              className="submit-button"
              type="button"
              onClick={fetchMarkdownFromURL}
            >
              Fetch
            </button>

            <label className="post-content-label">Select Template:</label>
            <select
              className="template-dropdown"
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                const selectedTemplate = templates.find(
                  (t) => t.name === e.target.value
                );
                if (selectedTemplate) {
                  setDescription(selectedTemplate.content);
                }
              }}
            >
              <option value="">Select a template...</option>
              {templates.map((template) => (
                <option value={template.name} key={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
            <label className="post-title-label">Title:</label>
            <input
              className="post-title-input"
              type="text"
              value={`#${title}`}
              onChange={(e) => {
                setTitle(e.target.value.slice(1));
                setValidationError("");
              }}
            />
            <label className="post-image-label">Image URL:</label>
            <input
              className="post-image-input"
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setValidationError("");
              }}
            />
            <label className="post-content-label">Post Content:</label>
            <div>
              <textarea
                className="post-content-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength="9000"
              ></textarea>
              <div>{description.length}/9000</div>
            </div>
          </div>
          <div className="markdown-preview">
            <ReactMarkdown>
              {/* {`#${title}\n\n${content}\n\n![Image](${imageUrl})`} */}
              {`![Image](${imageUrl})\n\n#${title}\n\n${description}`}
            </ReactMarkdown>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNewPost;

// const TEMPLATES = (() => {
//   const templatesContext = require.context(
//     "../markdown_blog_templates",
//     false,
//     /\.md$/
//   );

//   return templatesContext.keys().reduce((templates, fileName) => {
//     const templateName = fileName.replace("./", "").replace(".md", "");
//     templates[templateName] = templatesContext(fileName).default;
//     return templates;
//   }, {});
// })();

// function fetchMarkdown(templateName) {
//   fetch(
//     `https://diaryblogadminui-9lj0.onrender.com/public/markdown_templates/${templateName}.md`
//   )
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.text();
//     })
//     .then((data) => {
//       console.log("template:", data);
//       setDescription(data);
//     })
//     .catch((error) => {
//       console.error(
//         "There was a problem with the fetch operation:",
//         error.message
//       );
//     });
// }

// const MARKDOWN_TEMPLATES = ["universal_blog_template"];`
