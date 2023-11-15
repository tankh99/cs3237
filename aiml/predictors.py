import random
import json
import numpy as np
from classify_on_off import classify as classify_tremor
from classify_activity import classify as classify_activity
from classify_updrs import classify as classify_updrs

def predict_tremor(data):
    result = classify_tremor(np.array(data))
    return result

def predict_activity(data):

    predIndex = classify_activity(np.array(data))
    # predIndex = 0
    categories = ['relax', 'fine-motor', 'eating', 'mobility']

    return categories[predIndex]

def predict_updrs(data):
    print(data)
    updrs = classify_updrs(data)
    return updrs