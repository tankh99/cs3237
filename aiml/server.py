import random
import json
from flask import Flask, g, request
import psycopg2
from configparser import ConfigParser
from flask_cors import CORS
from predictors import predict_tremor, predict_activity

def config(filename='database.ini', section='postgresql'):
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)

    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    print(db)
    return db

def connect():
    if 'db' not in g: 
        """ Connect to the PostgreSQL database server """
        conn = None
        try:
            # read connection parameters
            params = config()

            # connect to the PostgreSQL server
            print('Connecting to the PostgreSQL database...')
            g.db = psycopg2.connect(**params)

        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
    return g.db
    

app = Flask(__name__)

@app.before_request
def before_request():
   g.db = connect()

@app.teardown_request
def teardown_request(exception):
    g.db.close()

@app.route("/")
def index():
    conn = g.db
    cur = conn.cursor()
    cur.execute('SELECT * FROM public."ActivityRecording"')
    data = cur.fetchall()
    
    return data

@app.route("/classify-tremor", methods=['POST']) # uses imu data to classify on/off data
def classify_tremor():
    imuData = request.json
    result = predict_tremor(imuData)
    return json.dumps(result)

@app.route("/classify-activity", methods=['POST'])
def classify_activity():
    imuData = request.json
    result = predict_activity(imuData)
    return result

@app.route("/get-updrs") # uses voice and imu data
def get_updrs():
    return json.dumps(random.random())



CORS(app)
app.run(host="localhost", port=8080, debug=True)
