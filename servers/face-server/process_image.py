# backend/process_image.py
import cv2
import numpy as np
import sys
from rembg import remove
from PIL import Image

def remove_noise_and_extract_face(input_image_path, output_image_path, output_size):
    # Load the pre-trained face detection model from OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Read the input image
    image = cv2.imread(input_image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

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
    else:
        print("No faces detected in the image.")

def save_main_face_with_extended_area(input_image_path, output_image_path):
    # Load the pre-trained face detection model from OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Read the input image
    image = cv2.imread(input_image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Select the largest face as the main face
    if len(faces) > 0:
        main_face = max(faces, key=lambda rect: rect[2] * rect[3])
        x, y, w, h = main_face

        # Define the extended cropping region
        top_extend = int(h * 0.2)  # Extending above the head
        bottom_extend = int(h * 0.4)  # Extending down to the shoulder

        y_start = max(y - top_extend, 0)
        y_end = min(y + h + bottom_extend, image.shape[0])
        x_start = max(x, 0)
        x_end = min(x + w, image.shape[1])

        # Crop the extended face region
        main_face_extended_roi = image[y_start:y_end, x_start:x_end]
        resized_face = cv2.resize(main_face_extended_roi, (250, 300))

        # Save the extended main face as a new image
        cv2.imwrite(output_image_path,resized_face)
        print("Main face with extended area saved as:", output_image_path)
    else:
        print("No faces detected in the image.")

def add_output_on_background(output_image_path, background_image_path, output_with_background_path, border_size):
    # Open the output image and background image
    output_img = Image.open(output_image_path)
    background_img = Image.open(background_image_path)

    # Calculate the dimensions of the new canvas (output image size + border size)
    new_width = output_img.width + 2 * border_size
    new_height = output_img.height + 2 * border_size

    # Create a new blank image with the specified dimensions
    new_img = Image.new("RGBA", (new_width, new_height), (0, 0, 0, 0))  # Transparent background

    # Calculate the position to place the output image on the new canvas
    x_position = border_size
    y_position = border_size

    # Paste the output image onto the new canvas
    new_img.paste(background_img, (0, 0))
    new_img.paste(output_img, (x_position, y_position))

    # Save the new image with the output placed on the background
    new_img.save(output_with_background_path, format='png')

if __name__ == "__main__":
    print(sys.argv)
    if len(sys.argv) != 4:
        print("Usage: python process_image.py <input_image_path> <output_image_path> <background_color>")
        sys.exit(1)

    input_image_path = sys.argv[1]
    output_image_path = sys.argv[2]
    background_color = sys.argv[3]
    main_face_output_path = './main_face.png'
    main_face_size=(95,120)  # Adjust the desired output size as needed
    output_size = (95, 120)

    # save_main_face_with_extended_area(input_image_path,main_face_output_path)
    remove_noise_and_extract_face(input_image_path, main_face_output_path, output_size)

    removed_bg_output_path = './image_without_background.png'

    input = Image.open(main_face_output_path)
    removed_bg_output = remove(input)
    removed_bg_output.save(removed_bg_output_path)

    background_color_paths={
        "white": './white_background.png',
        "blue": './blue_background.png',
    }

    background_path = background_color_paths[background_color]
    image_with_new_bg_path = './image_with_new_bg.png'
    background_img = Image.open(background_path)

    background_img = background_img.resize(main_face_size)

    foreground_img = Image.open(removed_bg_output_path)
    foreground_img = foreground_img.resize(main_face_size)

    background_img = background_img.convert("RGBA")
    foreground_img = foreground_img.convert("RGBA")
    alpha_channel = foreground_img.getchannel('A')
    background_img.paste(foreground_img, (0,0), alpha_channel)
    background_img.save(image_with_new_bg_path, format='png')

    border_size = 5  # Adjust the border size as needed

    add_output_on_background(image_with_new_bg_path, background_path, output_image_path, border_size)