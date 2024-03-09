// // CreateNewPost.js

// import React, { useState, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import "./CreateNewPost.css";

// const CreateNewPost = ({
//   cancelCreatingPost,
//   selectedCompany,
//   addNewStory,
// }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [category, setCategory] = useState("");
//   const [validationError, setValidationError] = useState("");
// const [selectedTemplate, setSelectedTemplate] = useState("");
// const [templates, setTemplates] = useState([]);
//   const [url, setUrl] = useState("");

//   console.log("Component render start");
// useEffect(() => {
//   console.log("Inside useEffect before fetch");
//   fetch("https://diaryblogapi2.onrender.com/api/md_templates")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Data fetched", data);
//       setTemplates(data); // Store the templates in state
//     })
//     .catch((error) =>
//       console.error("There was an error fetching the templates:", error)
//     );
// }, []);

//   console.log("Component render end");
//   console.log("templates:", templates);
//   console.log("blogpost ");

//   const currentTime = new Date().toISOString();

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (!title.trim() || !description.trim()) {
//       console.log("Validation failed!");
//       setValidationError("Title and Content are required!");
//       console.log(validationError);
//       return; // Exit early if validation fails
//     }

//     const token = localStorage.getItem("token");

//     fetch(
//       `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}`,
//       // `http://127.0.0.1:5001/api/posts/${selectedCompany.name}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           imageUrl,
//           category,
//           status: "published",
//         }), // This will be available in request.get_json() in your backend
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         addNewStory(data);
//         // Handle the response, like redirecting to the posts list or clearing the form
//         cancelCreatingPost(); // if you want to go back to the list after successfully creating a post
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

// const handlePreview = (event) => {
//   event.preventDefault();

//   if (!title.trim() || !description.trim()) {
//     console.log("Validation failed!");
//     setValidationError("Title and Content are required!");
//     console.log(validationError);
//     return; // Exit early if validation fails
//   }

//   const token = localStorage.getItem("token");

//   fetch(
//     `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}`,
//     // `http://127.0.0.1:5001/api/posts/${selectedCompany.name}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         title,
//         description,
//         imageUrl,
//         category,
//         status: "preview",
//       }), // This will be available in request.get_json() in your backend
//     }
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Success:", data);
//       addNewStory(data);
//       // Handle the response, like redirecting to the posts list or clearing the form
//       cancelCreatingPost(); // if you want to go back to the list after successfully creating a post
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };

// const handleSaveDraft = () => {
//   const token = localStorage.getItem("token");

//   console.log("Selected Company ID:", selectedCompany._id);

//   fetch(
//     `https://diaryblogapi2.onrender.com/api/drafts/${selectedCompany.company}/${selectedCompany._id.$oid}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         title: title,
//         description: description,
//         imageUrl: imageUrl,
//         company: selectedCompany.company,
//         timestamp: currentTime,
//         status: "draft",
//       }), // This will be available in request.get_json() in your backend
//     }
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Draft saved:", data);
//       cancelCreatingPost();
//       // Maybe clear the form or show a notification to the user
//     })
//     .catch((error) => {
//       console.error("Error saving draft:", error);
//     });
// };

//   console.log("hi");

// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       setDescription(e.target.result); // Assuming setDescription updates your textarea
//     };
//     reader.readAsText(file);
//   }
// };

// const handleURLChange = (event) => {
//   setUrl(event.target.value);
// };
//   console.log("url:", url);

// const fetchMarkdownFromURL = (e) => {
//   e.preventDefault();
//   fetch(
//     `https://diaryblogapi2.onrender.com/fetch-content?url=${encodeURIComponent(
//       url
//     )}`
//   )
//     .then((response) => {
//       if (!response.ok) throw new Error("Failed to fetch the file.");
//       return response.text();
//     })
//     .then((content) => {
//       setDescription(content);
//     })
//     .catch((error) => console.error("Error fetching .md file:", error));
// };

//   return (
//     <div className="create-post-container">
//       <h1 className="create-post-heading">Create New Post</h1>

//       <form className="create-post-form" onSubmit={handleSubmit}>
//         <div className="form-split">
//           <div className="post-details">
//             {validationError && (
//               <div className="error-message">{validationError}</div>
//             )}
//             <div className="button-group">
//               <button className="submit-button" type="submit">
//                 Publish
//               </button>
//               <button className="save-draft-button" onClick={handleSaveDraft}>
//                 Save as Draft
//               </button>
//               <button className="save-draft-button" onClick={handlePreview}>
//                 Save to Preview
//               </button>
//               <button className="cancel-button" onClick={cancelCreatingPost}>
//                 Cancel
//               </button>

//               <select
//                 className="post-categories"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <option value="Science">Science</option>
//                 <option value="Technology">Technology</option>
//                 <option value="Geography">Geography</option>
//                 <option value="History">History</option>
//                 <option value="Psychology">Psychology</option>
//                 <option value="others">others</option>
//               </select>
// <label htmlFor="md-file" className="post-content-label">
//   Upload .md file:
// </label>
// <input
//   className="file-upload"
//   type="file"
//   id="md-file"
//   accept=".md"
//   onChange={handleFileChange}
// />
// <label className="post-content-label">
//   Or enter the URL of the .md file:
// </label>
// <input
//   className="url-upload"
//   type="text"
//   placeholder="Enter URL to .md file"
//   onChange={handleURLChange}
// />
// <button
//   className="submit-button"
//   type="button"
//   onClick={fetchMarkdownFromURL}
// >
//   Fetch
// </button>

//               <label className="post-content-label">Select Template:</label>
//               <select
//                 className="template-dropdown"
//                 value={selectedTemplate}
//                 onChange={(e) => {
//                   setSelectedTemplate(e.target.value);
//                   const selectedTemplate = templates.find(
//                     (t) => t.name === e.target.value
//                   );
//                   if (selectedTemplate) {
//                     setDescription(selectedTemplate.content);
//                   }
//                 }}
//               >
//                 <option value="">Select a template...</option>
//                 {templates.map((template) => (
//                   <option value={template.name} key={template.name}>
//                     {template.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <label className="post-title-label">Title:</label>
//             <input
//               className="post-title-input"
//               type="text"
//               value={`#${title}`}
//               onChange={(e) => {
//                 setTitle(e.target.value.slice(1));
//                 setValidationError("");
//               }}
//             />
//             <label className="post-image-label">Image URL:</label>
//             <input
//               className="post-image-input"
//               type="text"
//               value={imageUrl}
//               onChange={(e) => {
//                 setImageUrl(e.target.value);
//                 setValidationError("");
//               }}
//             />
//             <label className="post-content-label">Post Content:</label>
//             <div>
//               <textarea
//                 className="post-content-textarea"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 maxLength="9000"
//               ></textarea>
//               <div>{description.length}/9000</div>
//             </div>
//           </div>
//           <div className="markdown-preview">
//             <ReactMarkdown>
//               {/* {`#${title}\n\n${content}\n\n![Image](${imageUrl})`} */}
//               {`![Image](${imageUrl})\n\n#${title}\n\n${description}`}
//             </ReactMarkdown>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateNewPost;
import React, { useState, useEffect } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const mdParser = new MarkdownIt();

const CreateNewPost = ({
  cancelCreatingPost,
  selectedCompany,
  addNewStory,
}) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [inputHtml, setInputHtml] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [publishedPostData, setPublishedPostData] = useState("");
  const [previewPostData, setpreviewPostData] = useState("");
  const [draftPostData, setDraftPostData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [previewKey, setPreviewKey] = useState("");

  const post_data = {
    title: title,
    imageUrl: imageUrl,
    description: description,
    category: category,
  };

  const handleEditorChange = ({ html, text }) => {
    setInputHtml(text);
    setDescription(html);
  };

  useEffect(() => {
    console.log("Inside useEffect before fetch");
    fetch("https://diaryblogapi2.onrender.com/api/md_templates")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data fetched", data);
        setTemplates(data);
      })
      .catch((error) =>
        console.error("There was an error fetching the templates:", error)
      );
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setValidationError("Title and Content are required!");
      return;
    }

    const token = localStorage.getItem("token");

    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          imageUrl: imageUrl,
          description: description,
          category: category,
          status: "published",
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        addNewStory(data);
        setPublishedPostData(data);
        // cancelCreatingPost();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handlePreview = (event) => {
    event.preventDefault();
    generatePreviewKey();

    if (!title.trim() || !description.trim()) {
      console.log("Validation failed!");
      setValidationError("Title and Content are required!");
      console.log(validationError);
      return;
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
          title: title,
          description: description,
          imageUrl: imageUrl,
          category: category,
          status: "preview",
          pkey: previewKey,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        addNewStory(data);
        setpreviewPostData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveDraft = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    console.log("Selected Company ID:", selectedCompany._id);

    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}`,
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
          category: category,
          status: "draft",
        }), // This will be available in request.get_json() in your backend
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Draft saved:", data);
        setDraftPostData(data);
        // cancelCreatingPost();
        // Maybe clear the form or show a notification to the user
      })
      .catch((error) => {
        console.error("Error saving draft:", error);
      });
  };

  const handleUpload = () => {
    setModalOpen(true); // Open the modal
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setInputHtml(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleURLChange = (event) => {
    setUrl(event.target.value);
  };

  const fetchMarkdownFromURL = (e, url) => {
    e.preventDefault();
    fetch(
      `https://diaryblogapi2.onrender.com/api/fetch-content?url=${encodeURIComponent(
        url
      )}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch the file.");
        return response.text();
      })
      .then((content) => {
        setInputHtml(content);
      })
      .catch((error) => console.error("Error fetching .md file:", error));
  };

  const currentTime = new Date().toISOString();

  const generatePreviewKey = () => {
    const key = Math.floor(1000 + Math.random() * 9000);
    setPreviewKey(key);
    return key;
  };

  return (
    <div
      className="h-screen overflow-y-auto"
      style={{ scrollbarWidth: "none", "-ms-overflow-style": "none" }}
    >
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg p-8 max-w-md border-2 border-slate-400">
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>
            {/* Modal content */}
            <label htmlFor="md-file" className="block mt-4">
              Upload .md file:
            </label>
            <input
              className="block w-full border-2 border-slate-400 rounded-md mt-1 ml-1"
              type="file"
              id="md-file"
              accept=".md"
              onChange={handleFileChange}
            />
            <label className="block mt-4">
              Or enter the URL of the .md file:
            </label>
            <input
              className="block w-full border-2 border-slate-400 rounded-md mt-1 p-1"
              type="text"
              placeholder="Enter URL to .md file"
              onChange={handleURLChange}
            />
            <button
              className="bg-blue-500 text-white py-1 px-2 rounded-md mt-4 hover:bg-blue-600"
              type="button"
              onClick={(e) => fetchMarkdownFromURL(e, url)}
            >
              Fetch
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto py-10 px-4 mb-10">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6">
            <h1 className="text-3xl flex-row font-bold">Create New Post</h1>
            <div className="flex flex-row  space-x-2">
              <select
                className="flex-row border-2 border-slate-800 px-1 py-0 rounded"
                placeholder="select category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option className="text-gray-400">select category</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Geography">A.I.</option>
                <option value="History">LifeStyle</option>
                <option value="Psychology">Travel</option>
                <option value="others">others</option>
              </select>

              <select
                className="flex-row border-2 border-slate-800 px-3 py-2 rounded"
                placeholder=" select template"
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
                <option className="text-gray-400">Select a template...</option>
                {templates.map((template) => (
                  <option value={template.name} key={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleUpload()}
              >
                <FontAwesomeIcon icon={faUpload} />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-row space-x-4">
              <div className="flex-row mb-4">
                <label htmlFor="title" className="block mb-2">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
              </div>
              <div className="flex-row mb-4">
                <label htmlFor="image" className="block mb-2">
                  ImageUrl:
                </label>
                <input
                  type="url"
                  id="image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <MdEditor
              style={{ height: "400px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              value={inputHtml}
            />
          </div>

          {validationError && (
            <div className="text-red-500 mb-4">{validationError}</div>
          )}

          {publishedPostData && (
            <p className="mb-4" style={{ color: "#28a745" }}>
              Your post published successfully!!!
            </p>
          )}

          {previewPostData && (
            <div className="mb-4">
              <span>
                Your post is on hold for review. Your review link here:
              </span>
              <span>
                <a
                  href={`https://diaryblog.connectingpeopletech.com/${previewPostData.blogSpace}/${previewPostData._id}/previewpost?key=${previewKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  Preview Link
                </a>
              </span>
            </div>
          )}

          {draftPostData && <p className="mb-4">Your post saved as Draft</p>}

          <div className="flex flex-col space-x-2 sm:flex-row sm:justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0"
            >
              Publish
            </button>
            <button
              onClick={(e) => handlePreview(e)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0"
            >
              Preview
            </button>
            <button
              onClick={(e) => handleSaveDraft(e)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => cancelCreatingPost()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 rounded "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPost;
