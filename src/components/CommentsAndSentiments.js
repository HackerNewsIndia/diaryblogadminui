import React, { useEffect, useState } from "react";
// import "./typeit.css";
import "./CommentsAndSentiments.css";

const CommentsAndSentiments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("postId:", postId);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://typeit-api.onrender.com/get_comments/${postId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setComments(data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        setError("Error fetching comments. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [postId]);
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
              {comments.map((comment) => (
                <tr key={comment.timestamp}>
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
