import React, { useState, useEffect } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import EmailTemplate from "./EmailTemplate";

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
  const [sendEmailClicked, setSendEmailClicked] = useState(false);
  const [updatedDraftPost, setUpdatedDraftPost] = useState(false);
  const [cacheKey, setCacheKey] = useState("");

  console.log("Edit Post Data:", post);

  useEffect(() => {
    if (post) {
      if (post.status === "draft") {
        setEditPostData(post);
        setCategory(post.category);
        setTitle(post.title);
        setInputHtml(post.description);
        setDescription(post.description);
        setImageUrl(post.imageUrl);
        // setDraftPostData(post);
      } else if (post.status === "preview") {
        setEditPostData(post);
        setCategory(post.category);
        setTitle(post.title);
        setInputHtml(post.description);
        setDescription(post.description);
        setImageUrl(post.imageUrl);
        setDraftPostData(post);
        setIsPostSavedasDraft(true);
      } else if (post.status === "published") {
        setEditPostData(post);
        setCategory(post.category);
        setTitle(post.title);
        setInputHtml(post.description);
        setDescription(post.description);
        setImageUrl(post.imageUrl);
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
      `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}/${
        draftPostData._id || previewPostData._id || post._id
      }`,
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
      `https://diaryblogapi2.onrender.com/api/posts/${selectedCompany.name}/${
        draftPostData._id || post._id
      }`,
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
        setUpdatedDraftPost(true);
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

  const handleSendEmail = (e, blogId) => {
    e.preventDefault();
    fetch(
      `https://diaryblogapi2.onrender.com/api/email_preview`,
      // `http://127.0.0.1:5001/api/email_preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: blogId,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("cacheKey:", data);
        setCacheKey(data);
      })
      .catch((error) => console.error("Error fetching .md file:", error));
    setSendEmailClicked(true);
  };

  return (
    <div>
      {/* {sendEmailClicked && <SendEmail  draftPostData = {draftPostData} />} */}

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
        sendEmailClicked === true && post.status === "published" ? (
          <EmailTemplate draftPostData={post} cacheKey={cacheKey} />
        ) : (
          <div
            className="container mx-auto py-10 px-4 mb-10 h-screen overflow-y-auto"
            style={{ scrollbarWidth: "none", "-ms-overflow-style": "none" }}
          >
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
              <div className="flex flex-col-reverse md:flex-row items-center text-center justify-between">
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
                <div className="mt-4 md:mt-0 flex-end">
                  {/* <button
                  disabled={post.status != "published"}
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0
                   ${
                     post.status === "published"
                       ? ""
                       : "opacity-50 cursor-not-allowed"
                   }`}
                  onClick={(e) => handleSendEmail(e)}
                >
                  Send Email
                </button> */}
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
                  // <div className="text-red-500 mb-4">{validationError}</div>
                  <div
                    className="bg-red-50 border-4 border-red-500 p-4 "
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center h-8 w-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 ">
                          <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold">Error!</h3>
                        <p className="text-sm text-gray-700 ">
                          {validationError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {publishedPostData && (
                <div className="mb-4">
                  {/* <span>
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
                </span> */}
                  <div
                    className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                          <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                          Successfully Published.
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-400">
                          <a
                            href={`https://diaryblog.connectingpeopletech.com/${publishedPostData.blogSpace}/${publishedPostData._id}/post`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "teal",
                              textDecoration: "underline",
                            }}
                          >
                            Click here
                          </a>{" "}
                          to view your post
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!publishedPostData && previewPostData && (
                <div className="mb-4">
                  {/* <span>
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
                </span> */}

                  <div
                    className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                          <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                          Success. Your post is on hold for review
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-400">
                          <span>
                            {previewKey ? (
                              <a
                                href={`https://diaryblog.connectingpeopletech.com/${previewPostData.blogSpace}/${previewPostData._id}/previewpost?key=${previewKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                              >
                                Preview Link
                              </a>
                            ) : (
                              <a
                                href={`https://diaryblog.connectingpeopletech.com/${post.blogSpace}/${post._id}/previewpost?key=${post.pkey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                              >
                                Preview Link
                              </a>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* {!publishedPostData && !previewPostData && draftPostData && (
              <p className="mb-4">Your post saved as Draft</p>
            )} */}

              {updatedDraftPost && (
                // <p className="mb-4">Your post saved as Draft</p>

                <div className="mb-4">
                  <div
                    className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                          <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                          Success. Your post saved as Draft
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-row space-x-2 sm:flex-row sm:justify-between items-center text-center">
                <button
                  type="submit"
                  // disabled={isPostSavedasDraft === false}
                  aria-label="Publish Post"
                  title="Publish Post"
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg  space-x-2 sm:mb-0 flex items-center justify-center `}
                  // ${
                  //   isPostSavedasDraft === false
                  //     ? "opacity-50 cursor-not-allowed"
                  //     : ""
                  // }`}
                >
                  <FontAwesomeIcon
                    icon={faFileImport}
                    className="hidden sm:inline"
                  />
                  <span className="hidden sm:inline">Publish</span>
                </button>
                <button
                  disabled={post.status === "published"}
                  aria-label="Preview Post"
                  title="Preview Post"
                  onClick={(e) => handlePreview(e)}
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg  space-x-2 sm:mb-0 flex items-center justify-center
                ${
                  post.status === "published"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                `}
                >
                  <FontAwesomeIcon icon={faEye} className="hidden sm:inline" />

                  <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  onClick={(e) => handleUpdateDraft(e)}
                  aria-label="Update Draft"
                  title="Update Draft"
                  disabled={
                    post.status === "preview" || post.status === "published"
                  }
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg  space-x-2 sm:mb-0 flex items-center justify-center ${
                    post.status === "preview"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } ${
                    post.status === "published"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    className="hidden sm:inline"
                  />

                  <span className="hidden sm:inline">Save as Draft</span>
                </button>

                <button
                  disabled={post.status != "published"}
                  aria-label="Send Email"
                  title="Send Email"
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded  sm:mb-0 flex items-center justify-center
                   ${
                     post.status === "published"
                       ? ""
                       : "opacity-50 cursor-not-allowed"
                   }`}
                  onClick={(e) => handleSendEmail(e, post.blogSpace)}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="hidden sm:inline"
                  />
                  <span className="hidden sm:inline">Send Email</span>
                </button>

                <button
                  type="button"
                  aria-label="Cancel"
                  title="Cancel"
                  onClick={() => cancelEditingBlog()}
                  className=" text-gray-700 font-bold py-1 px-2 rounded-lg space-x-2 flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="hidden sm:inline"
                  />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )
      ) : sendEmailClicked === true && publishedPostData ? (
        <EmailTemplate draftPostData={publishedPostData} cacheKey={cacheKey} />
      ) : (
        <div
          className="container mx-auto py-10 px-4 mb-10 h-screen overflow-y-auto"
          style={{ scrollbarWidth: "none", "-ms-overflow-style": "none" }}
        >
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
            <div className="flex flex-col-reverse md:flex-row items-center text-center justify-between">
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
              <div className="mt-4 md:mt-0 flex-end">
                {/* <button
                  disabled={publishedPostData === ""}
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mb-2 sm:mb-0 ${
                    publishedPostData ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={(e) => handleSendEmail(e)}
                >
                  Send Email
                </button> */}
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
                // <div className="text-red-500 mb-4"></div>
                <div
                  className="bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                        <svg
                          className="flex-shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Error!
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {validationError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {publishedPostData && (
              <div className="mb-4">
                {/* <span>
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
                </span> */}
                <div
                  className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                        <svg
                          className="flex-shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Successfully Published.
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        <a
                          href={`https://diaryblog.connectingpeopletech.com/${publishedPostData.blogSpace}/${publishedPostData._id}/post`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "teal", textDecoration: "underline" }}
                        >
                          Click here
                        </a>{" "}
                        to view your post
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!publishedPostData && previewPostData && (
              <div className="mb-4">
                {/* <span>
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
                </span> */}

                <div
                  className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                        <svg
                          className="flex-shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Success. Your post is on hold for review
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        <span>
                          <a
                            href={`https://diaryblog.connectingpeopletech.com/${previewPostData.blogSpace}/${previewPostData._id}/previewpost?key=${previewKey}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                            }}
                          >
                            Preview Link
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!publishedPostData && !previewPostData && draftPostData && (
              // <p className="mb-4">Your post saved as Draft</p>
              <div className="mb-4">
                <div
                  className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                        <svg
                          className="flex-shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Success. Your post saved as Draft
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-row space-x-2 sm:flex-row sm:justify-between items-center text-center">
              <button
                type="submit"
                disabled={isPostSavedasDraft === false}
                aria-label="Publish Post"
                title="Publish Post"
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg  sm:mb-0 flex items-center justify-center ${
                  isPostSavedasDraft === false
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faFileImport}
                  className="hidden sm:inline"
                />
                <span className="hidden sm:inline">Publish</span>
              </button>
              <button
                disabled={isPostSavedasDraft === false}
                onClick={(e) => handlePreview(e)}
                aria-label="Preview Post"
                title="Preview Post"
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg  sm:mb-0 flex items-center justify-center ${
                  isPostSavedasDraft === false
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faEye} className="hidden sm:inline" />

                <span className="hidden sm:inline">Preview</span>
              </button>
              {isPostSavedasDraft === true ? (
                <button
                  onClick={(e) => handleUpdateDraft(e)}
                  aria-label="Update Draft"
                  title="Update Draft"
                  // disabled={post.status==="preview"|| post.status==="published"}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg  sm:mb-0 flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    className="hidden sm:inline"
                  />

                  <span className="hidden sm:inline">Save as Draft</span>
                </button>
              ) : (
                <button
                  onClick={(e) => handleSaveDraft(e)}
                  aria-label="Save as Draft"
                  title="Save as Draft"
                  // disabled={post.status==="preview"|| post.status==="published"}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg  sm:mb-0 flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    className="hidden sm:inline"
                  />

                  <span className="hidden sm:inline">Save as Draft</span>
                </button>
              )}

              <button
                disabled={publishedPostData === ""}
                aria-label="Send Email"
                type="Send Email"
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded  sm:mb-0 flex items-center justify-center
                   ${publishedPostData ? "" : "opacity-50 cursor-not-allowed"}`}
                onClick={(e) => handleSendEmail(e, publishedPostData.blogSpace)}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="hidden sm:inline"
                />
                <span className="hidden sm:inline">Send Email</span>
              </button>

              <button
                type="button"
                aria-label="Cancel"
                title="Cancel"
                onClick={() => cancelCreatingPost()}
                className="text-gray-700 font-bold py-1 px-2 rounded-lg flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faXmark} className="hidden sm:inline" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateNewPost;
