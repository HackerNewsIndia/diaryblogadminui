import React, { useState, useEffect } from "react";
import "./PostsTable.css";

const TypeitSpacePosts = (selectedTypeitSpace) => {
  const [postsList, setPostsList] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [creatingPost, setCreatingPost] = useState(false);

  //   console.log({ selectedCompany });

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
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
  console.log([sortedPostsList]);

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
              <tr className="postsTable-tr" key={post.id}>
                <td className="postsTable-td">{post.title}</td>
                {/* <td className="postsTable-td">
                  <button
                    className="postsTable-view"
                    onClick={() => {
                      selectStory(story);
                      handleIncrementViews(story);
                    }}
                  >
                    View
                  </button>
                </td> */}
                {/* <td className="postsTable-td">
                  <button
                    className="post-delete"
                    onClick={() => {
                      handleDeletePost(story);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TypeitSpacePosts;
