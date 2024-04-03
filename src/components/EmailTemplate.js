import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";

const EmailTemplate = ({ draftPostData, cacheKey }) => {
  console.log("draftPostData", draftPostData);
  const postTitle = draftPostData.title;
  const postDescription = draftPostData.description;
  const postImageUrl = draftPostData.imageUrl;
  const blogId = draftPostData.blogSpace;
  const postId = draftPostData._id;
  const userId = draftPostData.author;

  const [username, setUsername] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [blogSpaceImageUrl, setBlogSpaceImageUrl] = useState("");
  const [blogSpaceName, setBlogSpaceName] = useState("");
  const [markdownDescription, setMarkdownDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const markdownToJSX = (postDescription) => {
      const H1 = ({ children }) => (
        <h1 className="text-2xl font-bold mb-4">{children}</h1>
      );
      const H2 = ({ children }) => (
        <h2 className="text-xl font-bold mb-4">{children}</h2>
      );
      const H3 = ({ children }) => (
        <h3 className="text-lg font-bold mb-4">{children}</h3>
      );
      const P = ({ children }) => <p className="mb-4">{children}</p>;
      const Hr = () => <hr />;
      const a = ({ children }) => <a style={{ color: "blue" }}>{children}</a>;
      const Img = ({ alt, src }) => (
        <div style={{ textAlign: "center" }}>
          <img
            alt={alt}
            src={src}
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "300px",
              display: "block",
              margin: "0 auto",
              borderRadius: "5px",
            }}
          />
        </div>
      );

      const CodeBlock = ({ children }) => {
        return (
          <pre
            style={{
              backgroundColor: "#f3f4f6",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {children}
          </pre>
        );
      };

      function truncateText(text, limit) {
        const words = text.split(" ");
        const truncated = words.slice(0, limit).join(" ");
        return `${truncated}${words.length > limit ? "..." : ""}`;
      }
      return (
        <Markdown
          options={{
            overrides: {
              h1: { component: H1 },
              h2: { component: H2 },
              h3: { component: H3 },
              p: { component: P },
              img: { component: Img },
              hr: { component: Hr },
              a: { component: a },
              code: { component: CodeBlock },
            },
          }}
        >
          {truncateText(postDescription, 100)}
        </Markdown>
      );
    };

    // Convert Markdown to JSX and update state
    setMarkdownDescription(markdownToJSX(postDescription));
  }, [postDescription]);

  console.log("markdownDescription", markdownDescription);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `https://usermgtapi3.onrender.com/api/get_user/${userId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          setUsername(data.username);
          setImageBase64(data.image_base64);
        } catch (error) {
          console.error("Error fetching username and image", error.message);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchBlogData = async () => {
      fetch(`https://diaryblogapi2.onrender.com/api/blogSpace/${blogId}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setBlogSpaceImageUrl(data.image_url);
          setBlogSpaceName(data.name);
        })
        .catch((error) => {
          console.error("Error incrementing views:", error);
        });
    };
    fetchBlogData();
  }, [blogId]);

  useEffect(() => {
    const followersEmails = async () => {
      fetch(
        `https://diaryblogapi2.onrender.com/api/blogSpace/${blogId}/followers`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("followersData", data);
          console.log("emails:", data.userEmails);
          setRecipients(data.userEmails);
        })
        .catch((error) => {
          console.error("Error incrementing views:", error);
        });
    };
    followersEmails();
  }, [blogId]);

  const MAX_LINES = 15;

  const handleRecipientChange = (e) => {
    setRecipientInput(e.target.value);
  };

  const handleRecipientKeyDown = (e) => {
    if (e.key === "Enter" && recipientInput.trim() !== "") {
      e.preventDefault();
      // Add recipient to the list
      setRecipients([recipientInput.trim(), ...recipients]);
      setRecipientInput("");
    }
  };

  const removeRecipient = (index) => {
    const updatedRecipients = [...recipients];
    updatedRecipients.splice(index, 1);
    setRecipients(updatedRecipients);
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://diaryblogapi2.onrender.com/api/send_email_new_post",
        // "http://127.0.0.1:5001/api/send_email_new_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_title: postTitle,
            post_description: markdownDescription,
            post_imageUrl: postImageUrl,
            blogId: blogId,
            postId: postId,
            // imageBase64: imageBase64,
            username: username,
            // blogSpaceImageUrl: blogSpaceImageUrl,
            blogSpaceName: blogSpaceName,
            userId: userId,
            cacheKey: cacheKey,
          }),
        }
      );

      if (response.ok) {
        setEmailSent(true);
        const responseData = await response.json();
        setSuccessMessage(responseData.message || "Email sent successfully.");
      } else {
        throw new Error("Failed to send email.");
      }
    } catch (error) {
      setErrorMessage("Failed to send email. Please try again later.");
      console.error("Error sending email:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <html>
      <head>
        <title>DiaryBlog New Post Notification</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
        /* Your inline CSS styles here */
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }

          table {
            width: 100% !important;
            border-radius: 0 !important;
          }

          h1 {
            font-size: 24px !important;
          }
        }
      `,
          }}
        />
      </head>
      <body
        bgcolor="#ffffff"
        text="#3b3f44"
        link="#696969"
        yahoo="fix"
        style={{
          margin: 0,
          padding: "20px",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <input
      type="email"
      value={recipient}
      onChange={(e) => setRecipient(e.target.value)}
      placeholder="Recipient Email"
      style={{
        marginBottom: "10px",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    /> */}
        <table
          cellSpacing="0"
          cellPadding="0"
          border="0"
          role="presentation"
          width="80%"
          style={{ margin: 0, borderRadius: "20px", border: "1px solid #ccc" }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "20px" }}>
                <img
                  src={postImageUrl}
                  width="600"
                  border="0"
                  style={{
                    display: "block",
                    width: "80%",
                    borderRadius: "20px",
                  }}
                />
                <h1
                  style={{
                    margin: "20px 0 0",
                    color: "#1f2d3d",
                    fontFamily: "arial, helvetica, sans-serif",
                    fontSize: "32px",
                  }}
                >
                  {postTitle}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#3b3f44",
                    marginBottom: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <img
                    src={`data:image/jpeg;base64, ${imageBase64}`}
                    alt="avatar"
                    style={{
                      objectFit: "cover",
                      width: "2.5rem",
                      height: "2.5rem",
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                      borderRadius: "9999px",
                    }}
                  />
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <a
                      href={`https://diaryblog.connectingpeopletech.com/profile?user_id=${encodeURIComponent(
                        userId
                      )}`}
                      style={{
                        fontSize: "1rem",
                        textDecoration: "none",
                        color: "inherit",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {username}
                    </a>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        color: "#3b3f44",
                        fontSize: "0.875rem",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ display: "none", marginRight: "0.5rem" }}>
                        Published in
                      </p>
                      <img
                        src={blogSpaceImageUrl}
                        alt="Blog Space"
                        style={{
                          objectFit: "fill",
                          width: "1rem",
                          height: "1rem",
                          borderRadius: "9999px",
                          marginRight: "0.5rem",
                        }}
                      />
                      <a
                        href={`https://diaryblog.connectingpeopletech.com/${blogId}/viewposts`}
                        style={{
                          textDecoration: "none",
                          color: "#3b3f44",
                          cursor: "pointer",
                          marginRight: "0.5rem",
                        }}
                      >
                        {blogSpaceName}
                      </a>
                      <a
                        href={`https://diaryblog.connectingpeopletech.com/${blogId}/subscribe`}
                        style={{
                          color: "#007bff",
                          fontWeight: "bold",
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginRight: "0.5rem",
                        }}
                      >
                        Follow
                      </a>
                    </div>
                  </span>
                </div>

                <p style={{ marginTop: "20px" }}>
                  {/* {truncateDescription(markdownDescription)} */}
                  {markdownDescription}
                </p>
                <a
                  href={`https://diaryblog.connectingpeopletech.com/${blogId}/${postId}/post`}
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#1B1B1B",
                    textDecoration: "none",
                    display: "inline-block",
                    padding: "12px",
                    borderRadius: "4px",
                    marginTop: "15px",
                  }}
                >
                  Read the whole story
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <form
          className="flex flex-col w-full md:w-1/2 lg:w-1/2 mt-4 space-y-2"
          id="emailForm"
        >
          <div className="flex-grow flex flex-wrap">
            <div
              className="overflow-auto flex flex-row flex-grow flex-wrap border-2 border-gray-500 rounded-md items-center text-center justify-center"
              style={{
                maxHeight: "90px",
                scrollbarWidth: "thin",
                scrollbarColor: "transparent transparent",
              }}
            >
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-300 rounded-lg px-3 py-1 m-1 space-x-2"
                >
                  <span className="text-sm">{recipient}</span>
                  <button
                    type="button"
                    onClick={() => removeRecipient(index)}
                    className="text-white ml-1"
                  >
                    &#10005;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className=" flex flex-col md:flex-row lg:flex-row items-center align-center justify-center space-x-2">
            <input
              type="text"
              id="emailInput"
              className=" rounded-md py-2 px-3 border-1 border-b-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300"
              placeholder="Enter email recipients"
              value={recipientInput}
              onChange={handleRecipientChange}
              onKeyDown={handleRecipientKeyDown}
            />
            <button
              onClick={handleSendEmail}
              className="w-1/4 ml-2 rounded-md bg-indigo-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading || emailSent}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="mr-2">Loading</span>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : emailSent ? (
                "Send Email"
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        </form>
        {errorMessage && (
          <p className="mt-2" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mt-2" style={{ color: "green" }}>
            {successMessage}
          </p>
        )}
      </body>
    </html>
  );
};

export default EmailTemplate;
