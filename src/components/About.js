import React from "react";
import './About.css';
import asrimg from "../images/ASR.png";
import ocrimg from "../images/OCR.png";
import ipimg from "../images/IP.jpeg";

const About = () => {
    const ocr = "Our web application is equipped with cutting-edge ICR technology, allowing seamless and efficient processing of bank documents. With this powerful feature, the application forms can be easily scanned, and the data within them is automatically extracted and entered into the system accurately. Gone are the days of manual data entry, as our ICR system ensures a swift and error-free process, saving your valuable time and resources while enhancing the overall productivity of your banking operations."
    const asr = "Say goodbye to tedious manual data input with our innovative ASR capability. Our web application empowers users to provide answers related to the specific fields questions in the bank forms, and the system records their spoken answers, storing them directly in the relevant fields. This revolutionary technology not only streamlines data entry but also provides a user-friendly and intuitive experience. Voice commands make interacting with the system faster and more accessible, enabling seamless communication and collaboration within your banking institution.";
    const imgprocc = "Our web application includes a powerful image processing feature that takes any user-uploaded image as input and automatically converts it into a standard passport size photo. This functionality eliminates the need for manual image resizing and formatting, ensuring that all photos adhere to the required specifications for official documentation. With this convenient tool, you can be confident that your customers' passport photos will always meet the necessary standards, reducing potential delays and enhancing the efficiency of your bank's document processing procedures."

    return (
        <div className="about" id="about">
            <div className="about-container" style={{ padding: "5vh 10vh" }}>
                <h2 class="text-center fs-16" style={{ fontStyle: "italic" }}>Introducing Our State-of-the-Art Document Processing Web Application</h2>
                <h1 class="text-center fs-22 mt-3" style={{ fontStyle: "italic", fontFamily: "fantasy" }}>ICR, ASR, and Image Processing for Seamless Bank Document Management</h1>
                <div className="layer" style={{ marginTop: "15vh", display: "flex", justifyContent: "space-between" }}>
                    <div className="layer-text-container" style={{ flexBasis: "55%", padding: "0 3%", background: "light-gray" }}>
                        <h1>OCR (Optical Character Recognition)</h1>
                        <p style={{ textAlign: "justify" }}>{ocr}</p>
                    </div>
                    <div class="px-3 mr-5" className="layer-img-container" style={{ flexBasis: "35%", alignItems: "center", justifyContent: "center" }}>
                        <img src={ocrimg} alt="ASR" style={{ height: "30vh", width: "100%" }} />
                    </div>
                </div>
                <div className="layer" style={{ marginTop: "15vh", display: "flex", justifyContent: "space-between" }}>
                    <div class="px-3 mr-5" className="layer-img-container" style={{ flexBasis: "35%", alignItems: "center", justifyContent: "center" }}>
                        <img src={asrimg} alt="ASR" style={{ height: "30vh", width: "100%" }} />
                    </div>
                    <div className="layer-text-container" style={{ flexBasis: "55%", padding: "0 3%", background: "light-gray" }}>
                        <h1>ASR (Automatic Speech Recognition)</h1>
                        <p style={{ textAlign: "justify" }}>{asr}</p>
                    </div>
                </div>
                <div className="layer" style={{ marginTop: "15vh", display: "flex", justifyContent: "space-between" }}>
                    <div className="layer-text-container" style={{ flexBasis: "55%", padding: "0 3%", background: "light-gray" }}>
                        <h1>Image Processing</h1>
                        <p style={{ textAlign: "justify" }}>{imgprocc}</p>
                    </div>
                    <div class="px-3 mr-5" className="layer-img-container" style={{ flexBasis: "35%", alignItems: "center", justifyContent: "center" }}>
                        <img src={ipimg} alt="ASR" style={{ height: "30vh", width: "100%" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;