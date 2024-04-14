import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const CreateDigitalCampaign = ({ onClose, marketSpace }) => {
  const [title, setTitle] = useState("");
  const [campaignAbout, setCampaginAbout] = useState("");
  // const [imageUrl, setImageUrl] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState("");

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleRemoveImageUrl = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  useEffect(() => {
    if (marketSpace != "") {
      setId(marketSpace._id);
      setTitle(marketSpace.title);
      setCampaginAbout(marketSpace.campaign_about);
      // setImageUrl(marketSpace.image_url);
      setImageUrls(marketSpace.image_url);
      setCategory(marketSpace.category);
    }
  }, [marketSpace]);

  function validateFields() {
    let validationErrors = {};

    // Validate title length
    if (title.length < 3 || title.length > 30) {
      validationErrors.title = "Title should be between 3 and 30 characters.";
    }

    const urlPattern = /^https?:\/\/.+$/;
    imageUrls.forEach((url, index) => {
      if (!urlPattern.test(url)) {
        validationErrors[`imageUrl_${index}`] = "URL must be in http format.";
      }
    });

    return validationErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://diaryblogapi2.onrender.com/api/digital_marketing_space",
        // "http://127.0.0.1:5001/api/digital_marketing_space",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            campaign_about: campaignAbout,
            category: category,
            // imageUrl: imageUrl,
            imageUrl: imageUrls,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setSuccess(true);
      setTitle("");
      setCampaginAbout("");
      setCategory("");
      setImageUrls([]);
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://diaryblogapi2.onrender.com/api/digital_marketing_space/${id}`,
        // `http://127.0.0.1:5001/api/digital_marketing_space/${id}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            campaign_about: campaignAbout,
            category: category,
            // imageUrl: imageUrl,
            imageUrl: imageUrls,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setSuccess(true);
      setTitle("");
      setCampaginAbout("");
      setCategory("");
      setImageUrls([]);
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
      {success === true && (
        <div className="text-green-800 p-2 mb-4 rounded-md text-center">
          {marketSpace ? (
            <span>
              <FontAwesomeIcon icon={faCircleCheck} /> Marketing space updated
              successfully!
            </span>
          ) : (
            <span>
              <FontAwesomeIcon icon={faCircleCheck} /> Marketing space created
              successfully!
            </span>
          )}
        </div>
      )}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-500">
            Create Digital Campaign
          </h1>
          <button className="text-red-600" onClick={onClose}>
            ❌
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title of Campaign:
          </label>
          <input
            type="text"
            className="w-full p-2 border mb-2 rounded-md"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Write about campaign:
          </label>
          <textarea
            className="w-full p-2 border mb-2 rounded-md"
            placeholder="text"
            defaultValue={campaignAbout}
            onChange={(e) => setCampaginAbout(e.target.value)}
          />

          {/* <label className="block text-gray-700 text-sm font-bold mb-2">
            Image:
          </label>
          <input
            type="text"
            className="w-full p-2 border mb-2 rounded-md"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          /> */}
          <div className="flex flex-row items-center justify-between">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image URL
            </label>
            <button type="button" onClick={handleAddImageUrl}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </button>
          </div>

          {imageUrls.map((url, index) => (
            <div key={index}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Image {index + 1}:
              </label>
              <div className="flex flex-row items-center space-x-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Image URL"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                />
                <img src={url} className="w-8 h-8 rounded-md mt-2 mb-2" />
                <button onClick={() => handleRemoveImageUrl(index)}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>

              {errors[`imageUrl_${index}`] && (
                <p className="text-red-500">{errors[`imageUrl_${index}`]}</p>
              )}
            </div>
          ))}
          {/* Add button to add more image URLs */}

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category:
          </label>
          <select
            className="w-full p-2 border mb-2 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Technology">Technology</option>
            <option value="Food and Recipes">Food and Recipes</option>
            <option value="Personal Finance">Personal Finance</option>
            <option value="Parenting and Family">Parenting and Family</option>
          </select>

          {errors.category && <p className="text-red-500">{errors.category}</p>}

          {marketSpace ? (
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateDigitalCampaign;
