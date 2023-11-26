from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def fill_form2(Name, Usn, Email, Gender, City, Create_Password, Confirm_Password, Phone_no, State):
    web = webdriver.Edge()
    web.get('https://www.pessat.com/?utm_medium=B.Tech_Google_Search_IND&utm_campaign=B.Tech_Search&utm_source=Google_Ads&gad_source=1')

    web.maximize_window()
    wait = WebDriverWait(web, 20)
    # global wait

    submit = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="lnkBtech"]')))
    submit.click()

    sub = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="btnnext"]')))
    sub.click()

    name = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="txtName"]')))
    name.send_keys(Name)

    email = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="txtEmail"]')))
    email.send_keys(Email)

    phone_no = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="txtmobileno"]')))
    phone_no.send_keys(str(Phone_no))

    usn = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="txtusername"]')))
    usn.send_keys(Usn)

    create_password = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="txtpassword"]')))
    create_password.send_keys(Create_Password)

    confirm_password = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="txtconfirmpassword"]')))
    confirm_password.send_keys(Confirm_Password)

    if Gender == "Male":
        gender = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="rdbGender_0"]')))
    else:
        gender = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="rdbGender_1"]')))
    gender.click()

    city = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="txtcity"]')))
    city.send_keys(City)

    state = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="ddlState"]')))
    state.send_keys(State)

    time.sleep(50)
    
