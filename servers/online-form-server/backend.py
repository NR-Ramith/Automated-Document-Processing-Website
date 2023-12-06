from flask import Flask, request
from form import fill_form  # Importing the function from form.py
from form2 import fill_form2
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/submit_form101', methods=['POST'])
def submit_form():
    print(request.form)
    # Access the ImmutableMultiDict
    form_data = request.form

    # Extract the JSON string from the ImmutableMultiDict
    json_string = form_data.get('userInput')

    # Parse the JSON string to obtain a Python dictionary
    data = json.loads(json_string)
    print(data)
    
    Name = data['name']
    SRN = data['srn']
    Email = data['email']
    Gender = data['gender']
    Age = data['age']
    Address = data['address']
    Phone_no = data['phoneNumber']
    
    # Call fill_form for FormComponent with the received data
    fill_form(Name, SRN, Email, Gender, Age, Address, Phone_no)
    return "Form 1 submitted successfully!", 200

@app.route('/submit_form102', methods=['POST'])
def submit_form2():
    # Access the ImmutableMultiDict
    form_data = request.form

    # Extract the JSON string from the ImmutableMultiDict
    json_string = form_data.get('userInput')

    # Parse the JSON string to obtain a Python dictionary
    data = json.loads(json_string)

    Name = data['name']
    Usn = data['usn']
    Email = data['email']
    Gender = data['gender']
    City = data['city']
    Create_Password = data['password']
    Confirm_Password = data['confirmPassword']
    Address = data['address']
    Phone_no = data['phoneNumber']
    State = data['state']
    fill_form2(Name,Usn,Email,Gender,City,Create_Password,Confirm_Password,Phone_no,State)
    return "Form2 submitted successfully!", 200

if __name__ == '__main__':
    app.run(port=5000)
