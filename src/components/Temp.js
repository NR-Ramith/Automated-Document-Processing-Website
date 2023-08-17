import React, { useState, useEffect } from "react";
import pewimg from '../images/pew.jpeg';

const Temp = () => {
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(pewimg); // Replace with the actual path
        const imageBlob = await response.blob();
        const imgUrl = URL.createObjectURL(imageBlob);
        setBlob(imgUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }

    fetchImage();
  }, []);

  if (!blob) {
    return <p>Loading...</p>;
  }


  return (
    <div>
      <img src={blob} alt="processed" />
    </div>
  );
};

export default Temp;
