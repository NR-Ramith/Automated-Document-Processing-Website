from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def fill_form(Name, SRN, Email, Gender, Age, Address, Phone_no):
    web = webdriver.Edge()
    web.get('https://docs.google.com/forms/d/e/1FAIpQLSdX7VTdsVsNeFu3GPxNcRAP6dziAaeXzZyYjHaXLgIDf_kuPQ/viewform?usp=sf_link')

    wait = WebDriverWait(web, 20)

    name = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/input')))
    name.send_keys(Name)

    srn = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[2]/div[2]/div/div/div[2]/div/div[1]/div/div[1]/input')))
    srn.send_keys(SRN)

    email = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[2]/div[3]/div/div/div[2]/div/div[1]/div/div[1]/input')))
    email.send_keys(Email)

    if Gender == "Male":
        gender = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="i17"]/div[3]/div')))
    else:
        gender = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="i20"]/div[3]/div')))
    gender.click()

    age = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[2]/div[5]/div/div/div[2]/div/div[1]/div/div[1]/input')))
    age.send_keys(str(Age))

    address = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[2]/div[6]/div/div/div[2]/div/div[1]/div/div[1]/input')))
    address.send_keys(Address)

    phone_no = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[2]/div[7]/div/div/div[2]/div/div[1]/div/div[1]/input')))
    phone_no.send_keys(str(Phone_no))

    submit = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[3]/div[1]/div[1]/div/span/span')))
    submit.click()

    print(Name+" your form has been submitted")