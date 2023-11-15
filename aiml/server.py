import random
import json
from flask import Flask, g, request, jsonify
import psycopg2
from configparser import ConfigParser
from flask_cors import CORS
from predictors import predict_tremor, predict_activity, predict_updrs
from mic import get_sound_data

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
    imuData = request.json['data']
    parsed_data = parse_imu_data(imuData)
    result = predict_tremor(parsed_data)
    return json.dumps(result) # required becuase boolean datatype

@app.route("/classify-activity", methods=['POST'])
def classify_activity():
    imuData = request.json['data']
    parsed_data = parse_imu_data(imuData)
    result = predict_activity(parsed_data)
    return result
    # return json.dumps("HELLO")

@app.route("/get-updrs", methods=['POST']) # uses voice data
def get_updrs():
    micData = request.json['data']
    data = parse_mic_data(micData)
    sound_data = get_sound_data(data)
    updrs = predict_updrs(sound_data)

    print("UPDRS")
    print(updrs)
    # return jsonify(data=updrs)
    return json.dumps(updrs.tolist())

##
## Helper functions
##
def parse_imu_data(data):
    parsed = []
    for val in data:
        row = [val['x'], val['y'], val['z']]
        parsed.append(row)
    return parsed

def parse_mic_data(data):
    THRESHOLD = 20 # Split data into chunks of arrays
    result = []
    inv_fundamental_frequency = []
    peak_to_peak = []
    for i, val in enumerate(data):
        if i > 0 and i % THRESHOLD == 0:
            result.append((inv_fundamental_frequency, peak_to_peak))
            inv_fundamental_frequency = []
            peak_to_peak = []
        ff = val['ff']
        ff = float(ff)
        invff = 1/ff
        inv_fundamental_frequency.append(invff)
        
        p2p = val['p2p']
        p2p = float(p2p)
        peak_to_peak.append(p2p)

    # if len(inv_fundamental_frequency) > 0 or len(peak_to_peak) > 0:
    #     result.append((inv_fundamental_frequency, peak_to_peak))
    return result

CORS(app)
app.run(host="localhost", port=8080, debug=True)
