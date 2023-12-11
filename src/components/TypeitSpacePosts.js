import React, { useState, useEffect } from "react";
import "./PostsTable.css";
import CommentsAndSentiments from "./CommentsAndSentiments";
import "./TypeitSpacePosts.css";

const TypeitSpacePosts = ({ selectedTypeitSpace }) => {
  const [postsList, setPostsList] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [creatingPost, setCreatingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  console.log({ selectedTypeitSpace });

  const handlePost = (postId) => {
    setSelectedPost((prevPostId) => (prevPostId === postId ? null : postId));
  };
  useEffect(() => {
    // This will log the updated state
    console.log("setSelectedPost", selectedPost);
  }, [selectedPost]);

  const fetchPosts = () => {
    if (!selectedTypeitSpace || !selectedTypeitSpace.name) {
      console.error("selectedTypeitSpace.name is not set");
      return;
    }
    fetch(
      `https://diaryblogapi2.onrender.com/api/posts/${selectedTypeitSpace.name}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPostsList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedTypeitSpace.name]);

  //   const selectStory = (story) => {
  //     setSelectedStory(story);
  //   };

  //   const backToList = () => {
  //     setSelectedStory(null);
  //   };

  //   const startCreatingPost = () => {
  //     setCreatingPost(true);
  //   };

  //   const cancelCreatingPost = () => {
  //     setCreatingPost(false);
  //   };

  //   const addNewStory = (newStory) => {
  //     fetchPosts();
  //   };
  const sortedPostsList = postsList.sort((a, b) => {
    new Date(a.createDate) - new Date(b.createDate);
  });
  console.log([sortedPostsList]);
  // Sorting the array based on createDate in descending order
  const sortedPostsListDescending = postsList.sort(
    (a, b) => new Date(b.createDate) - new Date(a.createDate)
  );

  console.log(sortedPostsListDescending);

  return (
    <div>
      <h1 className="blog-heading">List Of Post</h1>
      <div className="table-container">
        <table className="story-table">
          <thead className="postsTable-thead">
            <tr className="postsTable-tr">
              <th className="postsTable-th">Title</th>
              {/* <th className="postsTable-th">View</th>
              <th className="postsTable-th">Delete Post</th> */}
            </tr>
          </thead>
          <tbody className="postsTable-tbody">
            {sortedPostsList.map((post) => (
              <React.Fragment key={post._id}>
                <tr className="postsTable-tr">
                  <td
                    className="postsTable-td"
                    onClick={() => handlePost(post._id)}
                  >
                    {post.title}
                  </td>
                </tr>
                {selectedPost === post._id && (
                  <tr className="postsTable-tr">
                    <td colSpan="1">
                      <CommentsAndSentiments postId={post._id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TypeitSpacePosts;
