import React, { useEffect, useState } from "react";
// import "./typeit.css";
import "./CommentsAndSentiments.css";

const CommentsAndSentiments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  console.log("postId:", postId);

  useEffect(() => {
    // Fetch comments from the Flask backend when the component mounts
    fetch(`https://typeit-api.onrender.com/get_comments/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setComments(data);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <table className="blog-list striped">
            <thead>
              <tr>
                <th>Comments</th>
                <th>Date</th>
                <th>Likes</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, index) => (
                <tr key={index}>
                  <td>{comment.comment}</td>
                  <td>{comment.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommentsAndSentiments;
