import torch
import torch.nn.functional as F
import torch.nn as nn
import torch.optim as optim
import random
import numpy as np
import pandas as pd

#  hypter params
input_size=3
batch_size=32
n_layers=2
hidden_size=64
output_size=4
learning_rate=0.001

class LSTM(nn.Module):
    def __init__(self):
        super(LSTM, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, n_layers, batch_first=True)
        self.output = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x, _ = self.lstm(x)
        x = self.output(x[:,-1,:])
        x = F.softmax(x, dim=1)
        
        return x

model = LSTM()
optimizer = optim.Adam(model.parameters())

file_path = './models/activity-classification.pth'

model.load_state_dict(torch.load(file_path))
model.eval()

def z_score_normalize(df):
    return (df - df.mean())/df.std()

range_rand = 5.0

# Expects an input of 10-15 pieces of tri-axial acceleration values over 10-15 seconds
def classify(input):
    input = np.tile(input, (32,1, 1)) # Creates a batch of 32
    input = torch.FloatTensor(input)
    output = model(input)
    return torch.argmax(output[0])
