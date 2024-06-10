import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { Menu, Card } from "antd";
import {
  HomeOutlined,
  StarOutlined,
  MessageOutlined,
} from "@mui/icons-material";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { HelpOutline } from "@mui/icons-material";
import BlogCreator from "./BlogCreator";
import CompanyPosts from "./CompanyPosts";
import DashboardContent from "./DashboardContents";
import TypeitSpaceCreator from "./TypeitSpaceCreator";
import TypeitSpacePosts from "./TypeitSpacePosts";
import User from "./User";
import jwt_decode from "jwt-decode";
import { ShareIcon } from "@heroicons/react/solid";
import Footer from "./Footer";
//import { BeatLoader } from 'react-spinners';
import DigitalMarketingSpace from "./DigitalMarketingSpace";

import CreateUserBlog from "./CreateUserBlog"; // Import CreateUserBlog component

import UpdateUserBlog from "./UpdateUserBlog"; // Import the UpdateUserBlog component
import FollowSpace from "./FollowSpace";

function DiaryBlogSpace({ isLoggedIn, setIsLoggedIn, selectedKey }) {
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [TypeitSpaceData, setTypeitSpaceData] = useState([]);
  const [selectedTypeitSpace, setSelectedTypeitSpace] = useState(null);
  const [totalCommentsCount, setTotalCommentsCount] = useState(null);
  const [showCreateUserBlog, setShowCreateUserBlog] = useState(false); // State for managing CreateUserBlog visibility
  const [followersCounts, setFollowersCounts] = useState({});
  const [blogSearch, setBlogSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showUpdateUserBlog, setShowUpdateUserBlog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBlogSpaceForEdit, setSelectedBlogSpaceForEdit] =
    useState(null);
  const [blogSpacesPage, setBlogSpacesPage] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Selected Key changed:", selectedKey);
  }, [selectedKey]);

  const handleNewBlog = (newCompany) => {
    setCompanyData((prevData) => [...prevData, newCompany]);
  };

  const handleCards = (company) => {
    setSelectedCompany(company);
    setBlogSpacesPage(false);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setShowUpdateUserBlog(true);
    setBlogSpacesPage(false);
  };

  const handleCreateBlogSpaceClick = () => {
    // Use the navigate function to redirect to the desired route
    setShowCreateUserBlog(true); // Update the route accordingly
    setBlogSpacesPage(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setBlogSearch(""); // Clear the search input when a category is selected
  };

  useEffect(() => {
    console.log("setSelectedTypeitSpace", selectedTypeitSpace);
  }, [selectedTypeitSpace]);

  console.log("you have selected", selectedCompany);
  const generateRandomImageUrls = (count) => {
    const imageUrls = [];
    for (let i = 0; i < count; i++) {
      imageUrls.push(`https://picsum.photos/200/200?random=${i}`);
    }
    return imageUrls;
  };

  useEffect(() => {
    //setLoading(true);  // Add this line

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }
    const decodedToken = jwt_decode(token);
    const user = decodedToken.user;
    const userId = user.id;

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

        //setLoading(false);  // Add this line
      });
  }, [showCreateUserBlog, showUpdateUserBlog, blogSpacesPage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }
    const decodedToken = jwt_decode(token);
    const user = decodedToken.user;
    const userId = user.id;

    fetch(`https://typeit-api.onrender.com/list_typeit_spaces/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched typeit data:", data);
        setTypeitSpaceData(data);
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
        setError(error.message);
      });
  }, []);

  const fetchTypeitSpaceData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }
    const decodedToken = jwt_decode(token);
    const user = decodedToken.user;
    const userId = user.id;

    fetch(`https://typeit-api.onrender.com/list_typeit_spaces/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched updated typeit data:", data);
        setTypeitSpaceData(data);
      })
      .catch((error) => {
        console.error("Error fetching updated typeit data:", error.message);
        setError(error.message);
      });
  };

  const handleChange = (e) => {
    setBlogSearch(e.target.value);
  };

  console.log("Company Data:", companyData);
  console.log("totalCommentsCount:", totalCommentsCount); // Corrected the variable name
  console.log("followersCounts:", followersCounts);

  const randomImageUrls = generateRandomImageUrls(companyData.length);

  return (
    <div className="right-side ">
      {selectedKey === "user" && console.log("Selected Key:", selectedKey)}
      {!selectedKey && (
        <div className="content-body">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Welcome to Dashboard
          </h1>
          <DashboardContent />
        </div>
      )}
      {selectedKey === "home" && (
        <div className="content-body">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Welcome to Dashboard
          </h1>
          <DashboardContent />
        </div>
      )}
      {selectedKey === "user" && (
        <div className="content-body">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to Dashboard
          </h1>
          <User /> {/* Render the User component */}
        </div>
      )}

      {selectedKey === "followAdmin" && (
        <div className="content-body">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            DiaryBlog Follower
          </h1>
          <FollowSpace /> {/* Render the User component */}
        </div>
      )}
      {selectedKey === "diaryBlogAdmin" && (
        <div className="content-body">
          {showCreateUserBlog && (
            <CreateUserBlog
              onClose={() => {
                setShowCreateUserBlog(false);
                setBlogSpacesPage(true);
              }}
              onNewBlog={handleNewBlog}
            />
          )}
          {showUpdateUserBlog == true && (
            <UpdateUserBlog
              onClose={() => {
                setShowUpdateUserBlog(false);
                setBlogSpacesPage(true);
              }}
              blog={selectedBlog}
            />
          )}

          {selectedCompany && blogSpacesPage == false && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedCompany.company}
              </h1>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setSelectedCompany(null);
                  setBlogSpacesPage(true);
                }}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
              </button>
              <CompanyPosts selectedCompany={selectedCompany} />
            </div>
          )}
          {showCreateUserBlog == false &&
            showUpdateUserBlog == false &&
            blogSpacesPage == true && (
              <React.Fragment>
                <div>
                  {/* {error && <p className="text-red-500">Error: {error}</p>} */}

                  <div className="mx-2 mb-4 bg-white">
                    <section className="py-6">
                      <div className="container  mx-auto space-y-1 text-center">
                        <h1 className="text-3xl font-semibold leading text-center">
                          {companyData.length} Blogs in 5 categories
                        </h1>

                        <div className="flex flex-wrap items-start justify-center">
                          <p className="relative px-8 py-3 text-lg font-semibold ">
                            Let's Start a Space
                          </p>
                        </div>

                        <div className="flex flex-wrap items-start justify-center">
                          <button
                            className=" bg-blue-500 px-2 py-2 text-white  font-medium"
                            onClick={handleCreateBlogSpaceClick}
                          >
                            Create Blog Space
                          </button>
                        </div>

                        <div className="flex flex-wrap items-start justify-center">
                          <input
                            type="search"
                            name="Search"
                            placeholder="Search by BlogSpace..."
                            value={blogSearch}
                            onChange={handleChange}
                            className="w-32 py-2 pl-10 bg-white border-2 text-sm text-slate-900 rounded-md sm:w-auto focus:outline "
                          />
                        </div>

                        <div className="flex flex-wrap items-start justify-center">
                          <button
                            type="button"
                            className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
                              selectedCategory === "Lifestyle"
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                            onClick={() => handleCategorySelect("Lifestyle")}
                          >
                            <span className="flex items-center">
                              Lifestyle
                              {selectedCategory === "Lifestyle" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent the button click event from triggering
                                    handleCategorySelect(null); // Deselect the category
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
                              selectedCategory === "Technology"
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                            onClick={() => handleCategorySelect("Technology")}
                          >
                            <span className="flex items-center">
                              Technology
                              {selectedCategory === "Technology" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent the button click event from triggering
                                    handleCategorySelect(null); // Deselect the category
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
                              selectedCategory === "Food and Recipes"
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                            onClick={() =>
                              handleCategorySelect("Food and Recipes")
                            }
                          >
                            <span className="flex items-center">
                              Food and Recipes
                              {selectedCategory === "Food and Recipes" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent the button click event from triggering
                                    handleCategorySelect(null); // Deselect the category
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
                              selectedCategory === "Personal Finance"
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                            onClick={() =>
                              handleCategorySelect("Personal Finance")
                            }
                          >
                            <span className="flex items-center">
                              Personal Finance
                              {selectedCategory === "Personal Finance" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent the button click event from triggering
                                    handleCategorySelect(null); // Deselect the category
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 ${
                              selectedCategory === "Parenting and Family"
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                            onClick={() =>
                              handleCategorySelect("Parenting and Family")
                            }
                          >
                            <span className="flex items-center">
                              Parenting and Family
                              {selectedCategory === "Parenting and Family" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent the button click event from triggering
                                    handleCategorySelect(null); // Deselect the category
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-2">
                    {companyData.length == 0 && (
                      <p className="flex items-center justify-center text-xl text-gray-400 text-center">
                        No blogspaces available. Create a new one.
                      </p>
                    )}
                    {companyData &&
                      companyData
                        .filter((blogSpace) =>
                          blogSpace.name
                            .toLowerCase()
                            .includes(blogSearch.toLowerCase())
                        )
                        .filter((blogSpace) =>
                          selectedCategory
                            ? blogSpace.category &&
                              blogSpace.category.includes(selectedCategory)
                            : true
                        )
                        .map((blogSpace, index) => (
                          <article
                            key={blogSpace._id || blogSpace.name}
                            style={{ borderWidth: "1vh" }}
                            className=" flex flex-col border-slate-200 rounded-md divide-slate-900  mb-4"
                          >
                            {/* <div className="flex flex-col space-y-1">
                              <p>
    <strong>Created Date:</strong>{" "}
                                {blogSpace.createDate
      ? new Date(blogSpace.createDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
                                  : "Loading..."}
                              </p>
</div> */}

                            <div>
                              <img
                                src={blogSpace.image_url}
                                alt=""
                                style={{
                                  maxHeight: "200px",
                                  width: "100%",
                                  height: "auto",
                                  objectFit: "cover",
                                }}
                                className=" mb-6 "
                              />
                            </div>

                            <div className="flex-grow flex flex-col justify-between bg-white dark:bg-slate-800 p-6">
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h3 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white ">
                                    {blogSpace.name}
                                  </h3>
                                  <div className="flex flex-col space-y-1">
                                    <p>
                                      <strong>Created Date:</strong>{" "}
                                      {blogSpace.createDate
                                        ? new Date(
                                            blogSpace.createDate
                                          ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "Loading..."}
                                    </p>
                                  </div>
                                </div>
                                {/*   <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                               <strong>description:</strong> {blogSpace.description.substring(0, 18)}{" "}

                              </p> */}
                                <p>
                                  <strong>category:</strong>{" "}
                                  {blogSpace.category}
                                </p>
                              </div>

                              <div className="flex flex-wrap justify-between">
                                <div className="flex space-x-2 text-sm dark:text-gray-400">
                                  <button
                                    aria-label="Share this post"
                                    type="button"
                                    className="flex items-center p-1 space-x-2 cursor-pointer hover:bg-slate-500 rounded"
                                    onClick={() => {
                                      setShowUpdateUserBlog(false);
                                      setShowCreateUserBlog(false);
                                      handleCards(blogSpace);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 512 512"
                                      className="w-4 h-4 fill-current dark:text-violet-400"
                                    >
                                      <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                    </svg>
                                    <span className="whitespace-nowrap">
                                      View Post
                                    </span>
                                  </button>
                                </div>

                                <button
                                  aria-label="Edit post"
                                  type="button"
                                  className="flex   items-center justify-center p-1 space-x-2 cursor-pointer "
                                  onClick={() => handleEditBlog(blogSpace)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="w-4 h-4 fill-current dark:text-violet-400 hover:text-blue-500"
                                  >
                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                  </svg>
                                  <span>Edit</span>
                                </button>

                                <button
                                  aria-label="Share post"
                                  type="button"
                                  className="flex items-center justify-center p-1 space-x-2 "
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="w-4 h-4 fill-current dark:text-violet-400 hover:text-green-500"
                                  >
                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                                  </svg>
                                  <span className="text-xs sm:text-sm">
                                    {blogSpace.followers || 0} followers
                                  </span>
                                </button>

                                <a
                                  href={`https://diaryblog.connectingpeopletech.com/${
                                    blogSpace._id
                                      ? encodeURIComponent(blogSpace._id)
                                      : ""
                                  }/viewposts`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6 "
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                    />
                                  </svg>
                                </a>
                              </div>
                              <div className="flex flex-wrap justify-between">
                                <div className="flex  space-x-2 text-sm dark:text-gray-400 mt-2">
                                  <span className="sr-only">Views</span>
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="text-block-400 hover:text-blue-500"
                                  />
                                  <p className="text-sm font-medium  leading-5 text-gray-500 dark:text-gray-400 ">
                                    {blogSpace.views}
                                  </p>
                                </div>

                                <div
                                  aria-label="Total Posts"
                                  type="button"
                                  className="flex items-center justify-center p-1 space-x-2 "
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="w-4 h-4 fill-current dark:text-violet-400 hover:text-pink-500"
                                  >
                                    <path d="M373.5 27.1C388.5 9.9 410.2 0 433 0c43.6 0 79 35.4 79 79c0 22.8-9.9 44.6-27.1 59.6L277.7 319l-10.3-10.3-64-64L193 234.3 373.5 27.1zM170.3 256.9l10.4 10.4 64 64 10.4 10.4-19.2 83.4c-3.9 17.1-16.9 30.7-33.8 35.4L24.4 510.3l95.4-95.4c2.6 .7 5.4 1.1 8.3 1.1c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32c0 2.9 .4 5.6 1.1 8.3L1.7 487.6 51.5 310c4.7-16.9 18.3-29.9 35.4-33.8l83.4-19.2z" />
                                  </svg>

                                  <span>{blogSpace.blogPosts.length}</span>
                                </div>

                                <div className="flex items-center p-1 space-x-2 ">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    aria-label="Number of likes"
                                    className="w-4 h-4 fill-current dark:text-violet-400  hover:text-green-500"
                                  >
                                    {/* Add your SVG path here */}
                                    <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                    <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                    {blogSpace.total_likes}
                                  </svg>
                                  <span>{blogSpace.total_likes}</span>
                                </div>

                                <div class="flex  space-x-2 text-sm dark:text-gray-400 mt-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    aria-label="Number of comments"
                                    className="w-4  fill-current text-violet-400 hover:text-blue-500"
                                  >
                                    <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                    <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                  </svg>
                                  <p className="text-sm ">
                                    {blogSpace.total_comments_count}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                  </div>
                </div>
              </React.Fragment>
            )}

          <Footer />
        </div>
      )}
      {selectedKey === "digitalMarketing" && <DigitalMarketingSpace />}
      {selectedKey === "typeitAdmin" && (
        <div className="content-body">
          {selectedTypeitSpace ? (
            <div>
              <h1 className="text-red-500">{selectedTypeitSpace.name}</h1>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedTypeitSpace(null)}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
              </button>
              <TypeitSpacePosts selectedTypeitSpace={selectedTypeitSpace} />
            </div>
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}

export default DiaryBlogSpace;
