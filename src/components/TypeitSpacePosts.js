import React, { useState, useEffect } from "react";
import "./PostsTable.css";
import CommentsAndSentiments from "./CommentsAndSentiments";
import "./TypeitSpacePosts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronRight,
  faCircleChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const TypeitSpacePosts = ({ selectedTypeitSpace }) => {
  const [postsList, setPostsList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  console.log({ selectedTypeitSpace });

  const handlePost = (postId) => {
    setSelectedPost((prevPostId) => (prevPostId === postId ? null : postId));
  };
  useEffect(() => {
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

  const sortedPostsList = postsList.sort((a, b) => {
    new Date(a.createDate) - new Date(b.createDate);
  });
  console.log([sortedPostsList]);
  const sortedPostsListDescending = postsList.sort(
    (a, b) => new Date(b.createDate) - new Date(a.createDate)
  );

  console.log(sortedPostsListDescending);

  function timeSince(timeString) {
    if (!timeString) return "Invalid timestamp";

    const now = new Date();
    const timestamp = new Date(timeString); // Convert the ISO string to a Date object

    if (isNaN(timestamp.getTime())) return "Invalid date";

    const secondsPast = Math.floor((now - timestamp) / 1000);

    if (secondsPast < 60) return `${secondsPast} seconds ago`;
    if (secondsPast < 3600)
      return `${Math.floor(secondsPast / 60)} minutes ago`;
    if (secondsPast <= 86400)
      return `${Math.floor(secondsPast / 3600)} hours ago`;
    if (secondsPast <= 86400 * 30) {
      const days = Math.floor(secondsPast / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
    if (secondsPast <= 86400 * 365) {
      const months = Math.floor(secondsPast / (86400 * 30));
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
    const years = Math.floor(secondsPast / (86400 * 365));
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  return (
    <div>
      <h1 className="blog-heading">List Of Post</h1>
      <div className="table-container">
        <table className="story-table">
          <thead className="postsTable-thead">
            <tr className="postsTable-tr">
              <th className="postsTable-th">Posts</th>
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
                    <div className="postInfoContainer">
                      {selectedPost === post._id ? (
                        <FontAwesomeIcon icon={faCircleChevronDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCircleChevronRight} />
                      )}
                      <span className="postTitle">{post.title}</span>
                    </div>
                    <span className="postDate">
                      {timeSince(post.createDate)}
                    </span>
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
