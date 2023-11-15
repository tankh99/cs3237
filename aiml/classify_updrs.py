from sklearn.neural_network import MLPClassifier
import torch
import numpy as np
import pickle

model = MLPClassifier(hidden_layer_sizes=(100, 200, 300, 100), activation='relu', tol=1e-6, max_iter=2000, random_state=0)

file_path = './models/updrs-classification.pth'

model = pickle.load(open(file_path, 'rb'))
# model.load_state_dict(torch.load(file_path))

def z_score_normalize(df):
    return (df - df.mean())/df.std()

range_rand = 5.0

def classify(input):
    # input = np.tile(input, (32,1, 1)) # Creates a batch of 32
    # input = torch.FloatTensor(input)
    print(input)
    output = model.predict(input)
    return output

