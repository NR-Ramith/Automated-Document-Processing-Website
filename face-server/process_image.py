# backend/process_image.py
import cv2
import numpy as np
import sys

def remove_noise_and_extract_face(input_image_path, output_image_path, output_size):
    # Load the pre-trained face detection model from OpenCV
    # print("hi")
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Read the input image
    # print("path ",input_image_path)
    image = cv2.imread(input_image_path)
    # print(image)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    # print(faces)

    # Select the largest face as the main face
    if len(faces) > 0:
        main_face = max(faces, key=lambda rect: rect[2] * rect[3])
        x, y, w, h = main_face

        # Define the new region of interest with expanded dimensions
        roi_x = max(0, x - int(w * 0.2))  # Adjust the expansion factor as needed
        roi_y = max(0, y - int(h * 0.4))  # Adjust the expansion factor as needed
        roi_w = int(w * 1.4)  # Adjust the expansion factor as needed
        roi_h = int(h * 1.8)  # Adjust the expansion factor as needed

        # Create a mask with white background
        mask = np.ones_like(image) * 255

        # Copy the main face region along with the expanded area onto the mask
        mask[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w] = image[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]

        # Resize the image to the desired output size
        mask = cv2.resize(mask, output_size)

        # Save the resulting image
        cv2.imwrite(output_image_path, mask)
        print("donepy")
    else:
        print("No faces detected in the image.")

if __name__ == "__main__":
    print(sys.argv)
    if len(sys.argv) != 3:
        print("Usage: python process_image.py <input_image_path> <output_image_path> <output_width> <output_height>")
        sys.exit(1)

    input_image_path = sys.argv[1]
    output_image_path = sys.argv[2]
    output_size = (600, 600)

    remove_noise_and_extract_face(input_image_path, output_image_path, output_size)