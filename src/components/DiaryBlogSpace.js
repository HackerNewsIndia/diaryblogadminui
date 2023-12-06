import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Card } from "antd";
import {
  HomeOutlined,
  StarOutlined,
  MessageOutlined,
} from "@mui/icons-material";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { HelpOutline } from "@mui/icons-material";
import "./DiaryBlogSpace.css";
import BlogCreator from "./BlogCreator";
import CompanyPosts from "./CompanyPosts";
import DashboardContent from "./DashboardContents";
import TypeitSpaceCreator from "./TypeitSpaceCreator";
import jwt_decode from "jwt-decode";

function DiaryBlogSpace({ isLoggedIn, setIsLoggedIn, selectedKey }) {
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [TypeitSpaceData, setTypeitSpaceData] = useState([]);

  const navigate = useNavigate();

  const handleNewBlog = (newCompany) => {
    setCompanyData((prevData) => [...prevData, newCompany]);
  };

  const handleCards = (company) => {
    setSelectedCompany(company);
  };

  console.log("you have selected", selectedCompany);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.id;

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
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.id;

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
    const userId = decodedToken.id;

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

  console.log("Company Data:", companyData);

  return (
    <div className="right-side">
      {!selectedKey && (
        <div className="content-body">
          <h1 className="dashboard_heading">Welcome to Dashboard</h1>
          <DashboardContent />
        </div>
      )}
      {selectedKey === "home" && (
        <div className="content-body">
          <h1 className="dashboard_heading">Welcome to Dashboard</h1>
          <DashboardContent />
        </div>
      )}
      {selectedKey === "diaryBlogAdmin" && (
        <div className="content-body">
          {selectedCompany ? (
            <div>
              <h1 className="company_heading">{selectedCompany.company}</h1>
              <button
                className="back_button"
                onClick={() => setSelectedCompany(null)}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
              </button>
              <CompanyPosts selectedCompany={selectedCompany} />
            </div>
          ) : (
            <React.Fragment>
              <div>
                {error && <p>Error: {error}</p>}
                <div className="content heading_row">
                  <h1 className="dairyBlogAdmin_h1">
                    Web Components That Just Works.
                  </h1>
                </div>
                <br />
                <div className="row">
                  <BlogCreator onNewBlog={handleNewBlog} />
                </div>
                <div className="blog-content">
                  <h3 className="blog-h3">My Blog Space</h3>
                  <div className="blog-card-container">
                    {companyData &&
                      companyData.map((blogSpace) => (
                        <div
                          key={blogSpace._id || blogSpace.name} // using _id as key if available, otherwise using name
                          className="blog-card"
                          onClick={() => handleCards(blogSpace)}
                        >
                          <h4 className="blog-title">{blogSpace.name}</h4>
                          <p>
                            <strong>Category:</strong> {blogSpace.category}
                          </p>
                          <p>
                            <strong>Owner:</strong> {blogSpace.owner}
                          </p>
                          <p>
                            <strong>Created Date:</strong>
                            {blogSpace.createDate
                              ? new Date(
                                  blogSpace.createDate
                                ).toLocaleDateString()
                              : "Loading..."}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      )}
      {selectedKey === "typeitAdmin" && (
        <div className="content-body">
          {selectedCompany ? (
            <div>
              <h1 className="company_heading">{selectedCompany.company}</h1>
              <button
                className="back_button"
                onClick={() => setSelectedCompany(null)}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
              </button>
              <CompanyPosts selectedCompany={selectedCompany} />
            </div>
          ) : (
            <React.Fragment>
              <div>
                {error && <p>Error: {error}</p>}
                <div className="content heading_row">
                  <h1 className="dairyBlogAdmin_h1">
                    Web Components That Just Works.
                  </h1>
                </div>
                <br />
                <div className="row">
                  <TypeitSpaceCreator
                    onNewBlog={handleNewBlog}
                    onUpdateTypeitData={fetchTypeitSpaceData}
                  />
                </div>
                <div className="blog-content">
                  <h3 className="blog-h3">My Type-It Space</h3>
                  <div className="blog-card-container">
                    {TypeitSpaceData.typeit_spaces &&
                      TypeitSpaceData.typeit_spaces.map((typeitSpace) => (
                        <div key={typeitSpace._id} className="blog-card"
         onClick={() => handlebloglist(blogSpace)} >
                          <h4 className="blog-title">{typeitSpace.name}</h4>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}

export default DiaryBlogSpace;
