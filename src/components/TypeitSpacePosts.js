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
                    {selectedPost === post._id ? (
                      <FontAwesomeIcon icon={faCircleChevronDown} />
                    ) : (
                      <FontAwesomeIcon icon={faCircleChevronRight} />
                    )}
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
