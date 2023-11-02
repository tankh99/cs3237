import random
from classify_on_off import classify as classify_tremor

def predict_tremor(data):
    result = classify_tremor(data)
    return result
    # pred = random.randint(0, 1)
    # if pred == 0:
    #   return False
    # else:
    #   return True

def predict_activity(data):
    # prediction = model.predict(data)
    prediction = [0, 0, 0, 0, 0, 0, 0, 0, 0] # mimics the one-hot encoded data to be received from model
    chosenIndex = random.randint(0, 8)
    prediction[chosenIndex] = 1
    predIndex = prediction.index(max(prediction))
    subcategories = ['relax', 'keyboard_writing', 'laptop', 'eating', 'downstairs', 'walking', 'walking_fast', 'upstairs_fast', 'upstairs']
    subcategory = subcategories[predIndex]
    categories = ['relax', 'fine-motor', 'eating', 'mobility']
    
    if predIndex == 0:
        categoryIndex = 0
    elif predIndex >= 1 and predIndex <= 2:
        categoryIndex = 1
    elif predIndex == 3:
        categoryIndex = 2
    else:
        categoryIndex = 3

    return categories[categoryIndex]