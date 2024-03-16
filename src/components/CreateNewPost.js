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
  post,
  cancelEditingBlog,
  selectedBlogspace,
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
  const [isPostSavedasDraft, setIsPostSavedasDraft] = useState(false);
  const [editPostData, setEditPostData] = useState("");

  console.log("previewpostdata:", previewPostData);

  useEffect(() => {
    if (post) {
      setEditPostData(post);
      setCategory(post.category);
      setTitle(post.title);
      setInputHtml(post.description);
      setDescription(post.description);
      setImageUrl(post.imageUrl);
      if (post.status === "preview") {
        setDraftPostData(post);
        setIsPostSavedasDraft(true);
      }
      if (post.status === "published") {
        setDraftPostData(post);
        setIsPostSavedasDraft(true);
      }
    }
  }, [post]);

  console.log("previewPostData:", previewPostData);
  console.log("publishedPostData:", publishedPostData);

  const handleEditorChange = ({ html, text }) => {
    setInputHtml(text);
    setDescription(text);
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

    const titleWords = title.trim().split(/\s+/).filter(Boolean);
    if (titleWords.length < 3 || titleWords.length > 35) {
      setValidationError("Title must be between 3 and 35 words.");
      return;
    }

    const descriptionWords = description.trim().split(/\s+/).filter(Boolean);
    if (descriptionWords.length < 100) {
      setValidationError("Description must be at least 100 words.");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !imageUrl.trim() ||
      !category.trim()
    ) {
      setValidationError(
        "Title, Description, Image url and category are required!"
      );
      return;
    }

    const token = localStorage.getItem("token");

    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}/${draftPostData._id}`,
      {
        method: "PUT",
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
        // addNewStory(data);
        setPublishedPostData(data);
        // cancelCreatingPost();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handlePreview = (event) => {
    event.preventDefault();
    const pkey = generatePreviewKey();
    console.log(pkey);
    setPreviewKey(pkey);
    console.log(previewKey);

    const titleWords = title.trim().split(/\s+/).filter(Boolean);
    if (titleWords.length < 3 || titleWords.length > 35) {
      setValidationError("Title must be between 3 and 35 words.");
      return;
    }

    const descriptionWords = description.trim().split(/\s+/).filter(Boolean);
    if (descriptionWords.length < 100) {
      setValidationError("Description must be at least 100 words.");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !imageUrl.trim() ||
      !category.trim()
    ) {
      setValidationError(
        "Title, Description, Image url and category are required!"
      );
      return;
    }

    const token = localStorage.getItem("token");

    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}/${draftPostData._id}`,
      // `http://127.0.0.1:5001/api/posts/${selectedCompany.name}`,
      {
        method: "PUT",
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
          pkey: pkey,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // addNewStory(data);
        setpreviewPostData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdateDraft = (event) => {
    event.preventDefault();

    const titleWords = title.trim().split(/\s+/).filter(Boolean);
    if (titleWords.length < 3 || titleWords.length > 35) {
      setValidationError("Title must be between 3 and 35 words.");
      return;
    }

    const descriptionWords = description.trim().split(/\s+/).filter(Boolean);
    if (descriptionWords.length < 100) {
      setValidationError("Description must be at least 100 words.");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !imageUrl.trim() ||
      !category.trim()
    ) {
      setValidationError(
        "Title, Description, Image url and category are required!"
      );
      return;
    }

    const token = localStorage.getItem("token");

    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${selectedBlogspace.name}/${post._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          imageUrl: imageUrl,
          description: description,
          category: category,
          status: "draft",
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
        // addNewStory(data);
        setDraftPostData(data);
        // cancelCreatingPost();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveDraft = (event) => {
    event.preventDefault();

    const titleWords = title.trim().split(/\s+/).filter(Boolean);
    if (titleWords.length < 3 || titleWords.length > 35) {
      setValidationError("Title must be between 3 and 35 words.");
      return;
    }

    const descriptionWords = description.trim().split(/\s+/).filter(Boolean);
    if (descriptionWords.length < 50) {
      setValidationError("Description must be at least 100 words.");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !imageUrl.trim() ||
      !category.trim()
    ) {
      setValidationError(
        "Title, Description, Image url and category are required!"
      );
      return;
    }

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
        setIsPostSavedasDraft(true);
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
    return key;
  };

  console.log("preview key:", previewKey);

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
      {editPostData ? (
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
                  <option className="text-gray-400">
                    Select a template...
                  </option>
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

            {!publishedPostData &&
              !previewPostData &&
              !draftPostData &&
              validationError && (
                <div className="text-red-500 mb-4">{validationError}</div>
              )}

            {publishedPostData && (
              <div className="mb-4">
                <span>
                  <p className="mb-4" style={{ color: "#28a745" }}>
                    Your post published successfully!!! To view your published
                    post:
                  </p>
                </span>
                <span>
                  <a
                    href={`https://diaryblog.connectingpeopletech.com/${publishedPostData.blogSpace}/${publishedPostData._id}/post`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    Click Here
                  </a>
                </span>
              </div>
            )}

            {!publishedPostData && previewPostData && (
              <div className="mb-4">
                <span>
                  Your post is on hold for review. Your review link here:
                </span>
                <span>
                  {previewKey ? (
                    <a
                      href={`https://diaryblog.connectingpeopletech.com/${previewPostData.blogSpace}/${previewPostData._id}/previewpost?key=${previewKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      Preview Link
                    </a>
                  ) : (
                    <a
                      href={`https://diaryblog.connectingpeopletech.com/${post.blogSpace}/${post._id}/previewpost?key=${post.pkey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      Preview Link
                    </a>
                  )}
                </span>
              </div>
            )}

            {!publishedPostData && !previewPostData && draftPostData && (
              <p className="mb-4">Your post saved as Draft</p>
            )}

            <div className="flex flex-col space-x-2 sm:flex-row sm:justify-between">
              <button
                type="submit"
                disabled={isPostSavedasDraft === false}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0 ${
                  isPostSavedasDraft === false
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Publish
              </button>
              <button
                disabled={isPostSavedasDraft === false}
                onClick={(e) => handlePreview(e)}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0 ${
                  isPostSavedasDraft === false
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Preview
              </button>
              <button
                onClick={(e) => handleUpdateDraft(e)}
                disabled={
                  post.status === "preview" || post.status === "published"
                }
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0 ${
                  post.status === "preview"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } ${
                  post.status === "published"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => cancelEditingBlog()}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-2 rounded "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
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
                  <option className="text-gray-400">
                    Select a template...
                  </option>
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

            {!publishedPostData &&
              !previewPostData &&
              !draftPostData &&
              validationError && (
                <div className="text-red-500 mb-4">{validationError}</div>
              )}

            {publishedPostData && (
              <div className="mb-4">
                <span>
                  <p className="mb-4" style={{ color: "#28a745" }}>
                    Your post published successfully!!! To view your published
                    post:
                  </p>
                </span>
                <span>
                  <a
                    href={`https://diaryblog.connectingpeopletech.com/${publishedPostData.blogSpace}/${publishedPostData._id}/post`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    Click Here
                  </a>
                </span>
              </div>
            )}

            {!publishedPostData && previewPostData && (
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

            {!publishedPostData && !previewPostData && draftPostData && (
              <p className="mb-4">Your post saved as Draft</p>
            )}

            <div className="flex flex-col space-x-2 sm:flex-row sm:justify-between">
              <button
                type="submit"
                disabled={isPostSavedasDraft === false}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0 ${
                  isPostSavedasDraft === false
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Publish
              </button>
              <button
                disabled={isPostSavedasDraft === false}
                onClick={(e) => handlePreview(e)}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0 ${
                  isPostSavedasDraft === false
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Preview
              </button>
              {isPostSavedasDraft === true ? (
                <button
                  onClick={(e) => handleUpdateDraft(e)}
                  // disabled={post.status==="preview"|| post.status==="published"}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0"
                >
                  Save as Draft
                </button>
              ) : (
                <button
                  onClick={(e) => handleSaveDraft(e)}
                  // disabled={post.status==="preview"|| post.status==="published"}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0"
                >
                  Save as Draft
                </button>
              )}

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
      )}
    </div>
  );
};

export default CreateNewPost;
