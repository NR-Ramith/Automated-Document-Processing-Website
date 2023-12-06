import sys
sys.path.insert(0, './ImageRegistration')
sys.path.insert(0, './Extracts')
from flask_hashing import Hashing

from flask import *
from sqlalchemy import *
from flask_uploads import UploadSet, configure_uploads, IMAGES
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from datetime import datetime
from model import *
from image_registration import *
from getdata import *
import os,json,datetime

app = Flask(__name__)
CORS(app)
hashing = Hashing(app)

DATABASE = './user.db'
UPLOAD_FOLDER = './templates/'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
 
from sqlalchemy.ext.declarative import DeclarativeMeta

#class to encode SQLAlchemy data to JSON to pass as a response
class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    json.dumps(data) # this will fail on non-encodable values, like other classes
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)
#


@app.route('/')
# def default():
#     return "<h1><a href='http://3.16.164.73:3000'>Document Scanning</a></h1>"

@app.route('/login', methods=['POST'])
def login():
    print("56789")
    if request.method == 'POST':
        print(request.get_json())
        password = request.get_json()['password']
        username = request.get_json()['username']
        user = sqlsession.query(User).filter_by(username=username).first()
        if username == '' or hashing.check_value(password, '', salt='abcd'):
            resp = jsonify({"error":"Fields can't be empty"})
            resp.status_code = 404
        if user is None:
            resp = jsonify({"error":"Username does not exist"})
            resp.status_code = 404
        elif hashing.check_value(user.password, password, salt='abcd'):
            sqlsession.add(user)
            sqlsession.commit()
            resp = jsonify({"error":None})
            resp.status_code = 200
        elif not hashing.check_value(user.password, password, salt='abcd'):
            resp = jsonify({"error":"Incorrect Password"})
            resp.status_code = 404
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        error = None
        user = User()
        user.username = request.get_json()['username']
        user.emailid = request.get_json()['emailid']
        user.name = request.get_json()['name']
        password = request.get_json()['password']
        if user.username == '' or user.emailid == '' or user.name == '' or password == '':
            error = "Fields can't be empty"
        elif sqlsession.query(User).filter_by(username=user.username).first() is not None:
            error = "Username already exists"
        elif sqlsession.query(User).filter_by(emailid=user.emailid).first() is not None:
            error = "Email already exists"

        resp = jsonify({"error":error})
        resp.headers.add('Access-Control-Allow-Origin', '*')
        if error:
            resp.status_code = 404
            return resp

        user.password = hashing.hash_value(password, salt='abcd')
        sqlsession.add(user)
        sqlsession.commit()
        # Session['user'] = user.username

        resp.status_code = 200
        return resp

@app.route('/submitimage/<tid>',methods=['POST'])
def submit_image(tid=None):
    # check if the post request has the file part
    if 'image' not in request.files:
            print('No file part')
            resp = jsonify({"error":'No file part'})
            resp.status_code = 400
            # return redirect(request.url)
    else:
        file = request.files['image']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            print('No selected file')
            resp = jsonify({"error":'No selected file'})
            resp.status_code = 400
            # return redirect(request.url)
        else :
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], tid))
            resp = jsonify({"error":None})
            # resp.headers.add('Access-Control-Allow-Origin', '*')
            resp.status_code = 200
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/submitform/<tid>',methods=['POST'])
def submit_form(tid=None):
    if 'image' not in request.files:
            print('No file part')
            resp = jsonify({"error":'No file part'})
            resp.status_code = 400
    else:
        file = request.files['image']
        if file.filename == '':
            print('No selected file')
            resp = jsonify({"error":'No selected file'})
            resp.status_code = 400
        else :
            fieldValues={}
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], tid+" form"))
            print('IMAGE UPLOADED')
            imageRegistration(UPLOAD_FOLDER+tid+" form",UPLOAD_FOLDER+tid)
            print('IMAGE REGISTERED')
            rid = get_data(tid,model,mapping,fieldValues)
            print('DATA EXTRACTED SUCCESSFULLY > ',rid)
            print(fieldValues)
            resp = jsonify({"error":None,"id":rid, "fieldValues":fieldValues })
            resp.status_code = 200
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

@app.route("/submit/",methods=['POST'])
def submit_template():
    reqbody = request.get_json(force = True)
    fields = reqbody['data']
    print('fields are -' ,fields)
    # fields are : {'0': {'fieldname': 'q', 'desc': 'q', 'boxcount': None, 'type': 'Text', 'left_x': 528, 'right_x':703, 'top_y': 231, 'bottom_y': 266, 'image_width': 1349, 'image_height': 1568, 'templateName': 'wq', 'username': 'admin', 'templateDesc': 'qw'}}
    template = Template()

    user = sqlsession.query(User).filter_by(username=fields['0']['username']).first()
    print(user)
    template.userid = user.id
    template.name = fields['0']['templateName']
    if 'templateDesc' in fields['0']:
        template.description = fields['0']['templateDesc']
    template.createdon = datetime.datetime.today().strftime('%Y-%m-%d')
    sqlsession.add(template)
    sqlsession.flush()

    tid = reqbody['tid']
    sqlsession.commit()

    attr_dict = {'__tablename__' : tid, 'id' : Column('id', Integer, Sequence('user_id_seq'), primary_key=True)} #

    cnt = 1
    for fid,finfo in fields.items():
        field = Field()
        field.name = finfo['fieldname']
        field.description = finfo['desc']
        field.boxcount = finfo['boxcount']
        field.Type = finfo['type']
        field.leftx = finfo['left_x']
        field.rightx = finfo['right_x']
        field.topy = finfo['top_y']
        field.bottomy = finfo['bottom_y']
        field.percentleftx = finfo['left_x']/finfo['image_width'] * 100
        field.percentrightx = finfo['right_x']/finfo['image_width'] * 100
        field.percenttopy = finfo['top_y']/finfo['image_height'] * 100
        field.percentbottomy = finfo['bottom_y']/finfo['image_height'] * 100
        field.userid = user.id
        field.markedon = datetime.datetime.today().strftime('%Y-%m-%d')
        field.templateid = tid
        if cnt == 1:
            field.anchor = True
        else:
            field.anchor = False
        cnt+=1
        sqlsession.add(field)

        attr_dict[field.name] = Column(String(255))

    #create table for each template with name as their template id
    MyTableClass = type('MyTableClass', (Base,), attr_dict)
    Base.metadata.create_all(engine) 

    sqlsession.commit()
    resp = jsonify({"error":None,"tid":tid})
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.status_code = 200
    return resp

@app.route("/createMarkTemplate/",methods=['POST'])
def createMarkTemplate():
    reqbody = request.get_json(force = True)
    fields = reqbody['data']
    print('fields are -' ,fields)
    # fields are : {'0': {'fieldname': 'q', 'desc': 'q', 'boxcount': None, 'type': 'Text', 'left_x': 528, 'right_x':703, 'top_y': 231, 'bottom_y': 266, 'image_width': 1349, 'image_height': 1568, 'templateName': 'wq', 'username': 'admin', 'templateDesc': 'qw'}}
    tid=reqbody['tid']
    print(tid)
    template = Template()
    template.userid = tid
    template.name = fields['0']['templateName']
    if 'templateDesc' in fields['0']:
        template.description = fields['0']['templateDesc']
    template.createdon = datetime.datetime.today().strftime('%Y-%m-%d')
    sqlsession.add(template)
    sqlsession.flush()

    tid = template.id
    sqlsession.commit()

    attr_dict = {'__tablename__' : tid, 'id' : Column('id', Integer, Sequence('user_id_seq'), primary_key=True)} #

    cnt = 1
    for fid,finfo in fields.items():
        field = Field()
        field.name = finfo['fieldname']
        field.description = finfo['desc']
        field.boxcount = finfo['boxcount']
        field.Type = finfo['type']
        field.leftx = finfo['left_x']
        field.rightx = finfo['right_x']
        field.topy = finfo['top_y']
        field.bottomy = finfo['bottom_y']
        field.percentleftx = finfo['left_x']/finfo['image_width'] * 100
        field.percentrightx = finfo['right_x']/finfo['image_width'] * 100
        field.percenttopy = finfo['top_y']/finfo['image_height'] * 100
        field.percentbottomy = finfo['bottom_y']/finfo['image_height'] * 100
        field.userid = tid
        field.markedon = datetime.datetime.today().strftime('%Y-%m-%d')
        field.templateid = tid
        if cnt == 1:
            field.anchor = True
        else:
            field.anchor = False
        cnt+=1
        sqlsession.add(field)

        attr_dict[field.name] = Column(String(255))

    #create table for each template with name as their template id
    MyTableClass = type('MyTableClass', (Base,), attr_dict)
    Base.metadata.create_all(engine) 

    sqlsession.commit()
    resp = jsonify({"error":None,"tid":tid})
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.status_code = 200
    return resp

newTemplateId=17

@app.route("/getCurrentNewTemplateId",methods=['GET'])
def get_current_new_template_id():
    response = app.response_class(
        response = json.dumps(newTemplateId, cls=AlchemyEncoder),
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.status_code = 200
    return response

@app.route("/getNewTemplateId",methods=['GET'])
def get_new_template_id():
    global newTemplateId
    newTemplateId+=1
    response = app.response_class(
        response = json.dumps(newTemplateId, cls=AlchemyEncoder),
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.status_code = 200
    return response

@app.route("/prevTemplates/",methods=['POST'])
def prev_templates():
    username = request.get_json(force=True)
    user = sqlsession.query(User).filter_by(username=username).first()
    templates = sqlsession.query(Template).filter_by(userid=user.id).all()
    response = app.response_class(
        response = json.dumps([c for c in templates], cls=AlchemyEncoder),
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.status_code = 200
    return response

@app.route("/showTemplate/",methods=['POST'])
def show_template():
    username = request.get_json(force=True)['username']
    tid = request.get_json(force=True)['tid']    
    user = sqlsession.query(User).filter_by(username=username).first()
    fields = sqlsession.query(Field).filter_by(templateid = tid).filter_by(userid=user.id).all()
    response = app.response_class(
        response = json.dumps([c for c in fields], cls=AlchemyEncoder),
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.status_code = 200
    return response

@app.route("/showData/<tid>",methods=['GET'])
def show_data(tid=None):
    # Create an inspector to inspect the database
    inspector = inspect(engine)

    # Get the column names for the specified table (tid)
    column_names = [column['name'] for column in inspector.get_columns(tid)]
    with engine.connect() as conn:
        rows = conn.execute(text('select * from "' + tid + '"'))
    json_data=[]
    for row in rows:
        json_data.append(dict(zip(column_names,row)))
    response = app.response_class(
        response = json.dumps(json_data),
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.status_code = 200
    return response

@app.route("/showMarked/<tid>/<did>",methods=['GET'])
def show_marked(tid=None,did=None):
    # Create an inspector to inspect the database
    inspector = inspect(engine)

    # Get the column names for the specified table (tid)
    column_names = [column['name'] for column in inspector.get_columns(tid)]
    # print('Column names:', column_names)

    fields = sqlsession.query(Field).filter_by(templateid = tid).all()
    # print('show_marked  fields -',fields)
    rows = json.dumps([c for c in fields], cls=AlchemyEncoder)
    # print("rows - ", rows)
    fdata = eval(rows)
    # print("fdata- " ,fdata)
    # conn = engine.connect()
    try:
        with engine.connect() as conn:
            el = conn.execute(text('select * from "' + str(tid) + '" where id is '+did))
    except Exception as e:
        print('error: ',e)
    # for it in el:
    #     print('it - ',it)
    #     data = dict(zip(it.keys(),it))   
    for it in el:
        data = dict(zip(column_names,[val for val in it]))

    # print("data - ",data)

        
    json_data=[]
    for key in data:
        for row in fdata:
            if row["name"] == key:
                loc = {
                    "ty" : row["percenttopy"],
                    "by" : row["percentbottomy"],
                    "lx" : row["percentleftx"],
                    "rx" : row["percentrightx"],
                    "bc" : row["boxcount"],
                    "type": row["Type"]
                }
                pos = {
                    data[key]: loc,
                }
                json_data.append(pos)
                break

    response = app.response_class(
        response = json.dumps(json_data),
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.status_code = 200
    # conn.close()
    return response

@app.route("/showFinalMarked/<tid>",methods=['POST'])
def show_final_marked(tid=None):
    # Create an inspector to inspect the database
    # inspector = inspect(engine)

    # Get the column names for the specified table (tid)
    # column_names = [column['name'] for column in inspector.get_columns(tid)]
    # print('Column names:', column_names)

    fields = sqlsession.query(Field).filter_by(templateid = tid).all()
    # print('show_marked  fields -',fields)
    rows = json.dumps([c for c in fields], cls=AlchemyEncoder)
    # print("rows - ", rows)
    fdata = eval(rows)
    # print("fdata- " ,fdata)
    # conn = engine.connect()
    # try:
    #     with engine.connect() as conn:
    #         el = conn.execute(text('select * from "' + str(tid) + '" where id is '+did))
    # except Exception as e:
    #     print('error: ',e)
    # for it in el:
    #     print('it - ',it)
    #     data = dict(zip(it.keys(),it))   
    # for it in el:
    #     data = dict(zip(column_names,[val for val in it]))
    print(request)
    data2=request.get_json(force=True)
    

    data=dict()
    for d in data2:
        if d=="passportImage":
            # data[d]=request.files['image']
            data[d]=d
        else:
            data[d]=data2[d]
    print(data)
        
    json_data=[]
    for key in data:
        for row in fdata:
            if row["name"] == key:
                loc = {
                    "ty" : row["percenttopy"],
                    "by" : row["percentbottomy"],
                    "lx" : row["percentleftx"],
                    "rx" : row["percentrightx"],
                    "bc" : row["boxcount"],
                    "type": row["Type"],
                    "field": row["name"],
                }
                if key=="passportImage":
                    # loc["imageData"]=data[key]
                    pos = {
                        "passportImage": loc,
                    }
                else:
                    pos = {
                        data[key]: loc,
                    }
                json_data.append(pos)
                break

    response = app.response_class(
        response = json.dumps(json_data),
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.status_code = 200
    # conn.close()
    return response

@app.route("/deleteTemplate/<tid>",methods=['DELETE'])
def delete_template(tid=None):
    template = sqlsession.query(Template).filter_by(id=tid).first()
    sqlsession.delete(template)
    sqlsession.commit()
    with engine.connect() as conn:
        conn.execute(text('drop table if exists "' + str(tid) + '"'))

    resp = jsonify({"error":None})
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.status_code = 200
    return resp

@app.route("/deleteField/<fid>",methods=["DELETE"])
def delete_field(fid=None):
    field = sqlsession.query(Field).filter_by(id=fid).first()
    sqlsession.delete(field)
    sqlsession.commit()
    resp = jsonify({"error":None})
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.status_code = 200
    return resp

@app.route('/getTemplateFile/<tid>', methods=['GET'])
def get_template_image(tid=None):
    # Determine the path to the image file based on the template ID
    file_path = os.path.join(app.config['UPLOAD_FOLDER'],tid)

    # Check if the file exists
    if not os.path.exists(file_path):
        return "File not found", 404
    
    # Send the image file as a response
    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.secret_key = os.urandom(12)
    app.run(host='0.0.0.0' ,port = '9000',debug=False)
