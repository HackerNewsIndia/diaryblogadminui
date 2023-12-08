import React, { useEffect, useState } from "react";
// import "./typeit.css";

const CommentsAndSentiments = ({ postId }) => {
  const [comments, setComments] = useState([]);

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
                <th>Date & Time</th>
                <th>Comment</th>
                <th>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {/* {comments &&
                comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.date}</td>
                    <td>{comment.text}</td>
                    <td className="comment-emoji">{comment.sentiment}</td>
                  </tr>
                ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommentsAndSentiments;
