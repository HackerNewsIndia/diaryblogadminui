import React, { useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import CreateNewPost from "./CreateNewPost";

const PostsTable = ({ selectedCompany, blog, startCreatingPost }) => {
  const [blogSpace, setBlogSpace] = useState({});
  const [errors, setErrors] = useState({});
  const [draftPosts, setDraftPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  const [sortedPosts, setSortedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const [lastPostId, setLastPostId] = useState("");
  const [previewPosts, setPreviewPosts] = useState([]);
  // const [editIconClicked, setEditIconClicked] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [editPostData, setEditPostData] = useState("");

  //const blogSpace = blog;
  console.log("selected blogSpace:", blogSpace);

  const handleChange = (e) => {
    setPostSearch(e.target.value);
  };

  const startEditingBlog = (post) => {
    // setEditIconClicked(true);
    setEditingPost(true);
    setEditPostData(post);
  };

  const cancelEditingBlog = () => {
    setEditingPost(false);
  };

  const blogSpaceId = selectedCompany._id;
  console.log("blogSpaceId", blogSpaceId);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://diaryblogapi2.onrender.com/api/drafts/${blogSpaceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setDraftPosts(data);
      } catch (error) {
        console.error("Error fetching draft posts:", error.message);
      }
    };
    fetchDrafts();
  }, [blogSpaceId, editingPost]);

  useEffect(() => {
    async function fetchPreviewPosts() {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await fetch(
          `https://diaryblogapi2.onrender.com/api/preview/${blogSpaceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch preview posts");
        }

        const data = await response.json();
        setPreviewPosts(data);
      } catch (error) {
        console.error(error);
        // Handle error, show error message to the user, etc.
      }
    }

    fetchPreviewPosts();
  }, [blogSpaceId, editingPost]);

  useEffect(() => {
    const fetchBlogSpaceData = async () => {
      console.log("Fetching blog space data...");

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `https://diaryblogapi2.onrender.com/api/blogSpace/${blogSpaceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Network response was not ok");
        }

        const data = await response.json();
        console.log(data);

        // Update the state with the fetched data
        setBlogSpace(data);
      } catch (error) {
        console.error("Error fetching blog space data:", error.message);
        setErrors({ blogSpace: error.message });
      }
    };

    fetchBlogSpaceData();
  }, [blogSpaceId, blog]);

  const fetch_latest_5_Posts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://diaryblogapi2.onrender.com/api/blogspace/${blogSpaceId}/posts`
        // `http://127.0.0.1:5001/api/blogspace/${blog_id}/posts`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      const sortedPosts = data.sort((a, b) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return dateB - dateA;
      });

      // const postsWithUsernames = await Promise.all(
      //   sortedPosts.map(async (post) => {
      //     const username = await getUsernameById(post.author);
      //     return { ...post, username };
      //   })
      // );

      setPosts(sortedPosts);
      const lastPostId =
        sortedPosts.length > 0 ? sortedPosts[sortedPosts.length - 1]._id : null;
      setLastPostId(lastPostId);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setLoading(false);
      // You can also set an error state here if you want to show an error message to the user
    }
  };

  useEffect(() => {
    if (blogSpaceId && blogSpaceId !== "undefined") {
      fetch_latest_5_Posts();
    } else {
      console.error("blog_id is undefined!");
    }
  }, [blogSpaceId, editingPost]);

  const fetch_more_posts = () => {
    if (!loading && lastPostId) {
      setFetchingMore(true);
      fetch_5_more_posts(lastPostId);
    }
  };

  useEffect(() => {
    // Check if conditions are appropriate to call fetch_more_posts
    if (!loading && !fetchingMore && !allPostsLoaded && lastPostId) {
      fetch_more_posts();
    }
  }, [loading, fetchingMore, allPostsLoaded, lastPostId]);

  const fetch_5_more_posts = async (lastPostId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://diaryblogapi2.onrender.com/api/blogspace/${blogSpaceId}/5_more_posts?last_post_id=${lastPostId}`
        // `http://127.0.0.1:5001/api/blogspace/${blog_id}/5_more_posts?last_post_id=${lastPostId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      const sortedPosts = data.sort((a, b) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return dateB - dateA;
      });

      if (sortedPosts.length < 1) {
        setAllPostsLoaded(true);
      } else {
        // Append new posts to the existing ones
        setPosts((prevPosts) => [...prevPosts, ...sortedPosts]);

        const lastPostId =
          sortedPosts.length > 0
            ? sortedPosts[sortedPosts.length - 1]._id
            : null;
        setLastPostId(lastPostId);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  return (
    <div>
      {editingPost ? (
        <CreateNewPost
          post={editPostData}
          cancelEditingBlog={cancelEditingBlog}
          selectedBlogspace={selectedCompany}
          selectedCompany={selectedCompany}
        />
      ) : (
        <section class="py-9 sm:py-12 space-y-6">
          <div class="flex flex-wrap items-stretch justify-center">
            <div class="flex flex-col space-y-1 items-center  ">
              <div class="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg text-center">
                <div class="w-1/3 bg-cover bg-landscape">
                  <img
                    alt=""
                    className="object-cover w-full h-52"
                    src={blogSpace.image_url || "default_image_url"}
                  />
                </div>
                <div class="w-2/3 p-4">
                  <h1 class="text-2xl font-bold text-gray-900">
                    {blogSpace.name || "Default Title"}
                  </h1>
                  <p class="mt-2 text-sm text-gray-600">
                    <strong>category:</strong> {blogSpace.category}
                  </p>
                  <div class="flex flex-wrap justify-between">
                    <div class="flex space-x-2 text-sm dark:text-gray-400">
                      <button
                        aria-label="Share this post"
                        type="button"
                        class="flex items-center p-1 space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          class="w-4 h-4 fill-current dark:text-violet-400"
                        >
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                        </svg>

                        <span> 10k follower </span>
                      </button>

                      <button
                        aria-label="Share this post"
                        type="button"
                        className="flex items-center p-1 space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="w-4 h-4 fill-current dark:text-violet-400"
                        >
                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                        </svg>
                        <span>{blogSpace.views} k</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h1 class="text-3xl font-semibold leadi text-center">
                {posts.length} posts in 1 categories
              </h1>

              <div class="flex flex-wrap items-start justify-center">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center relative px-8 py-3 text-lg font-semibold border rounded"
                  onClick={startCreatingPost}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="w-4 h-4 fill-current dark:text-violet-400"
                  >
                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                  </svg>
                  <span> Get Idea started</span>
                </button>
              </div>

              <div class="flex flex-wrap items-start justify-center ">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    {/* <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>  */}
                  </div>
                  <input
                    type="search"
                    name="Search"
                    placeholder="Search..."
                    value={postSearch}
                    onChange={handleChange}
                    className="w-32 py-2 pl-10 bg-white border-2 text-sm text-slate-900 rounded-md sm:w-auto focus:outline"
                  />
                </div>
              </div>
              <div class="flex flex-wrap items-start justify-center ">
                <button
                  type="button"
                  class="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
                >
                  Lifetyle
                </button>
                <button
                  type="button"
                  class="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
                >
                  Travel
                </button>
                <button
                  type="button"
                  class="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
                >
                  Food and Recipies
                </button>
                <button
                  type="button"
                  class="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
                >
                  Personal Finance
                </button>
                <button
                  type="button"
                  class="relative px-3 py-1 m-1 text-sm border rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50"
                >
                  Parenting and Family
                </button>
                <div></div>
              </div>
            </div>
          </div>

         <div className="container grid justify-center gap-4 mx-auto lg:grid-cols-2 xl:grid-cols-3">

         <div className="flex flex-col px-8 py-6">	  
				      <div
                className="flex flex-grow flex-col p-2 space-y-6 rounded shadow sm:p-8 items-center overflow-auto"
                style={{
                  maxHeight: "400px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div class="space-y-2">
                  <h2 class="text-xl font-bold p-4">Idea</h2>

                  <article className="px-4">
                    <ul>
                      {draftPosts.map(
                        (post, index) =>
                          post.status === "draft" && (
                            <li key={index} className="mb-4">
                              <div className="flex items-center mt-8 space-x-4">
                                <img
                                  src={
                                    post.imageUrl ||
                                    "https://assets.hongkiat.com/uploads/psd-text-svg/logo-example.jpg"
                                  }
                                  alt={"image"}
                                  className="w-16 h-16 rounded"
                                />{" "}
                                <div>
                                  <h2 className="text-md font-bold">
                                    {" "}
                                    {post.title.length > 18
                                      ? post.title.substring(0, 18) + "..."
                                      : post.title}
                                  </h2>
                                  <h3 className="text-sm font-medium">
                                    Leroy Jenkins
                                  </h3>
                                  <time className="text-sm dark:text-gray-400">
                                    {post.createDate
                                      ? new Date(
                                          post.createDate
                                        ).toLocaleDateString()
                                      : "Loading..."}{" "}
                                  </time>
                                </div>
                              </div>
                              <div>
                                <div className="flex flex-wrap justify-between mt-1">
                                  <div className="flex space-x-2 text-sm dark:text-gray-400 text-center items-center justify-center">
                                    <button
                                      aria-label="Share this post"
                                      type="button"
                                      className="flex items-center p-1 space-x-2"
                                      onClick={() => startEditingBlog(post)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        className="w-4 h-4 fill-current dark:text-violet-400"
                                      >
                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                                      </svg>
                                      <span> Edit </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                      )}
                    </ul>
                  </article>
                </div>
              </div>
            </div>              

              <div class="flex flex-col px-8 py-6">
              <div
                className="flex flex-grow flex-col p-2 space-y-6 rounded shadow sm:p-8 items-center overflow-auto"
                style={{
                  maxHeight: "400px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div class="space-y-2">
                  <h2 class="text-xl font-bold p-4">Preview</h2>

                  <article className="px-4">
                    <ul>
                      {previewPosts.map(
                        (post) =>
                          post.status === "preview" && (
                            <li key={post._id} className="mb-4">
                              <div className="flex items-center mt-8 space-x-4">
                                <img
                                  src={
                                    post.imageUrl ||
                                    "https://assets.hongkiat.com/uploads/psd-text-svg/logo-example.jpg"
                                  }
                                  alt={"image"}
                                  className="w-16 h-16 rounded"
                                />
                                <div>
                                  <h2 class="text-md font-bold">
                                    {" "}
                                    {post.title.length > 18
                                      ? post.title.substring(0, 18) + "..."
                                      : post.title}{" "}
                                  </h2>
                                  <h3 className="text-sm font-medium">
                                    Leroy Jenkins
                                  </h3>
                                  <time className="text-sm dark:text-gray-400">
                                    {post.createDate
                                      ? new Date(
                                          post.createDate
                                        ).toLocaleDateString()
                                      : "Loading..."}
                                  </time>
                                </div>
                              </div>
                              <div>
                                <div class="flex flex-wrap justify-between mt-1">
                                  <div class="flex space-x-2 text-sm dark:text-gray-400 text-center items-center justify-center">
                                    <button
                                      aria-label="Share this post"
                                      type="button"
                                      class="flex items-center p-1 space-x-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        class="w-4 h-4 fill-current dark:text-violet-400"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 576 512"
                                        >
                                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                        </svg>
                                        <span>Preview</span>
                                      </svg>
                                    </button>

                                    <button
                                      aria-label="Share this post"
                                      type="button"
                                      class="flex items-center p-1 space-x-2"
                                      onClick={() => startEditingBlog(post)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        class="w-4 h-4 fill-current dark:text-violet-400"
                                      >
                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                                      </svg>
                                      <span>Edit</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                      )}
                    </ul>{" "}
                  </article>
                </div>
              </div>
              </div>
				  
          <div class="flex flex-col px-8 py-6">
              <div
                className="flex flex-grow flex-col p-2 space-y-6 rounded shadow sm:p-8 items-center overflow-auto"
                style={{
                  maxHeight: "400px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <div class="space-y-2">
                  <h2 class="text-xl font-bold p-4">Live</h2>

                  <article className="px-4">
                    <ul>
                      {posts.map(
                        (post, index) =>
                          post.status === "published" && (
                            <li key={index} className="mb-4">
                              <div className="flex items-center mt-8 space-x-4">
                                <img
                                  src={
                                    post.imageUrl ||
                                    "https://assets.hongkiat.com/uploads/psd-text-svg/logo-example.jpg"
                                  }
                                  alt={"image"}
                                  className="w-16 h-16 rounded"
                                />
                                <div>
                                  <h2 class="text-md font-bold">
                                    {post.title.length > 18
                                      ? post.title.substring(0, 18) + "..."
                                      : post.title}
                                  </h2>
                                  <h3 class="text-sm font-medium">
                                    Leroy Jenkins
                                  </h3>
                                  <time className="text-sm dark:text-gray-400">
                                    {post.createDate
                                      ? new Date(
                                          post.createDate
                                        ).toLocaleDateString()
                                      : "Loading..."}
                                  </time>
                                </div>
                              </div>
                              <div>
                                <div class="flex flex-wrap justify-between mt-1">
                                  <div class="flex space-x-2 text-sm dark:text-gray-400 text-center items-center justify-center">
                                    <a
                                      href={`https://diaryblog.connectingpeopletech.com/${blogSpaceId}/${post._id}/post`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <button
                                        aria-label="Share this post"
                                        type="button"
                                        class="flex items-center p-1 space-x-2"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512"
                                          class="w-4 h-4 fill-current dark:text-violet-400"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                          >
                                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                          </svg>
                                          <span>View</span>
                                        </svg>
                                      </button>
                                    </a>

                                    <button
                                      aria-label="Share this post"
                                      type="button"
                                      class="flex items-center p-1 space-x-2"
                                      onClick={() => startEditingBlog(post)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        class="w-4 h-4 fill-current dark:text-violet-400"
                                      >
                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                                      </svg>
                                      <span>Edit</span>
                                    </button>

                                    <button
                                      aria-label="Bookmark this post"
                                      type="button"
                                      class="flex items-center p-1 space-x-1.5"
                                    >
                                      <svg
                                        class="w-4 h-4 mr-1"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                      </svg>
                                      <span>{post.views}</span>
                                    </button>

                                    <button
                                      type="button"
                                      class="flex items-center p-1 space-x-1.5"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        aria-label="Number of comments"
                                        class="w-4 h-4 fill-current dark:text-violet-400"
                                      >
                                        <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                        <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                      </svg>
                                      <span>{post.total_comments_count}</span>
                                    </button>

                                    <button
                                      type="button"
                                      class="flex items-center p-1 space-x-1.5"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        aria-label="Number of likes"
                                        class="w-4 h-4 fill-current dark:text-violet-400"
                                      >
                                        <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                        <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                      </svg>
                                      <span>{post.total_likes}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                      )}
                    </ul>
                  </article>
                </div>
                            </div>            
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PostsTable;
