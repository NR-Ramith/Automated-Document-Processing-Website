import sys
sys.path.insert(0, './OCR')
# sys.path.append('..../react-app/src/components')
import cv2
import sqlite3
from sqlite3 import Error
import json
import math
import os
from recognizer import *
import pytesseract
import easyocr
# from values import Field

REGISTERED_IMAGE = './temp/finalimage.png'
UPLOAD_FOLDER = './temp/blocks'
DATABASE = './user.db'
# pytesseract.pytesseract.tesseract_cmd = ""

def create_connection(filename):
    try:
        conn = sqlite3.connect(filename)
        return conn
    except Error as e:
        print(e)
    return none
    

def get_data(tid,model,mapping,fieldValues):
    conn = create_connection(DATABASE)
    cur = conn.cursor()
    cur.execute("SELECT * FROM field WHERE templateid is "+tid)

    im = cv2.imread(REGISTERED_IMAGE)
    x = im.shape[1]
    y = im.shape[0]
    
    columns =   []
    columndata = []
    rows = cur.fetchall()
    for row in rows:
        print(row)

        id = row[0]
        name = row[1]
        box_count = row[4]

        columns.append(name)

        left  = row[9]
        right  = row[10]
        top  = row[11]
        bottom  = row[12]

        x1 = math.ceil((left/100)*x)
        x2 = math.ceil((right/100)*x)
        y1 = math.ceil((top/100)*y)
        y2 = math.ceil((bottom/100)*y)

        block = im[y1:y2,x1:x2]
        cv2.imwrite(os.path.join(UPLOAD_FOLDER,"{}.png".format(id)),block)
        if row[2]=="Text":
            text = pytesseract.image_to_string(block, lang = 'eng')
            print('pytesseract prediction -', text)
            # Initialize the EasyOCR reader
            # reader = easyocr.Reader(['en'], gpu=False)
            # results = reader.readtext(block)
            # eocrtext=''
            # for (bbox, text, prob) in results:
            #     eocrtext+=text
            # print('easyocr prediction -', eocrtext)
            text_without_spaces = "".join([char for char in text if char != ' '])
            if text_without_spaces:
                fieldValues[row[1]]=text_without_spaces
            print(text_without_spaces)

            block_height = block.shape[0]
            block_width = block.shape[1]
            box_width = block_width/ box_count

            data = ""
            for i in range(box_count):
                s = round(i*box_width)
                e = round((i+1)*box_width)

                box = block[0:block_height, s:e]
                cv2.imwrite(os.path.join(UPLOAD_FOLDER,"{}.png".format(str(id)+" "+str(i))), box)
                # data+=predict(box,model,mapping)
                data+=pytesseract.image_to_string(box, lang = 'eng')
                # eocrres = reader.readtext(box)
                # print(eocrres)
                # for (bbox, text, prob) in eocrres:
                #     data+=text

            print(data)
            
            columndata.append(data)
        elif row[2]=="Signature":
            # Convert the image data to base64
            _, signature_data = cv2.imencode('.png', block)
            signature_base64 = base64.b64encode(signature_data).decode('utf-8')

            # Include the base64 string in the data to be sent
            fieldValues[row[1]]=signature_base64
            columndata.append(signature_base64)
    # print(columns)
    # print(columndata)
    sql = 'INSERT INTO "'+str(tid)+'"("'+'","'.join(columns)+'") values('+",".join(["?"]*len(columns))+')'
    print(sql)
    cur.execute(sql,tuple(columndata))
    conn.commit()
    return cur.lastrowid