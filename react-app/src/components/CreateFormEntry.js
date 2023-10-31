import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateFormEntry.css';
import { getNewTemplateId } from './values';

const CreateFormEntry = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    setFrontImage(file);
  };

  const handleImagesChange = (e) => {
    const selectedImages = e.target.files;
    setImages([...images, ...selectedImages]);
  };

  const removeFrontImage = () => {
    setFrontImage(null);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const goBack = () => {
    navigate('/createNewTemplate');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', getNewTemplateId());
    formData.append('name', name);
    formData.append('description', description);
    formData.append('frontImage', frontImage);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      // Send the form data to the server
      await axios.post('http://localhost:3001/makeFormEntry', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Form entry has been made.');

      // After successful submission, navigate to /createNewTemplate
      navigate('/createNewTemplate');
    } catch (error) {
      console.error('Error submitting form entry:', error);
    }
  };

  return (
    <div className="create-form-entry-container">
      <button onClick={goBack} className="back-button">&lt; Back</button>
      <div className="create-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input type="text" id="name" className="input-field" onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              id="description"
              className="input-field"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="frontImage" className="form-label">
              Front Image:
            </label>
            <input
              type="file"
              id="frontImage"
              className="file-input"
              onChange={handleFrontImageChange}
            />
            <label htmlFor="frontImage" className="file-label">Upload Front Image</label>
          </div>

          {frontImage && (
            <div className="selected-images">
              <div className="selected-image">
                <span>{frontImage.name}</span>
                <button className="remove-button" onClick={removeFrontImage}>
                  X
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="images" className="form-label">
              Images:
            </label>
            <input
              type="file"
              id="images"
              className="file-input"
              multiple
              onChange={handleImagesChange}
            />
            <label htmlFor="images" className="file-label">Upload Images</label>
          </div>

          <div className="selected-images">
            {images.map((image, index) => (
              <div className="selected-image" key={index}>
                <span>{image.name}</span>
                <button className="remove-button" onClick={() => removeImage(index)}>
                  X
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button">Submit Form Entry</button>
        </form>
      </div>
    </div>
  );
};

export default CreateFormEntry;
