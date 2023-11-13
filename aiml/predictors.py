import random
import json
import numpy as np
from classify_on_off import classify as classify_tremor
from classify_activity import classify as classify_activity

def predict_tremor(data):
    result = classify_tremor(data)
    return result

def predict_activity(data):
    # print(np.array(data['data']).shape)
    predIndex = classify_activity(np.array(data['data']))
    # predIndex = 0
    categories = ['relax', 'fine-motor', 'eating', 'mobility']

    return categories[predIndex]