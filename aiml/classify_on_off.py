import torch
import torch.nn.functional as F
import torch.nn as nn
import torch.optim as optim
import random
import numpy as np
import pandas as pd

class Grouped2DCNN(nn.Module):
    def __init__(self):
        super(Grouped2DCNN, self).__init__()
        self.conv1 = nn.Conv2d(in_channels=32, out_channels=32, kernel_size=(6, 1))
        self.maxpool1 = nn.MaxPool2d(kernel_size=(5, 1))
        self.fc1 = nn.Linear(in_features=6, out_features=10)
        self.dropout1 = nn.Dropout(0.1)
        self.fc2 = nn.Linear(in_features=10, out_features=2)
    def forward(self, x):
        # torch.Size([32, 15, 3])
        x = self.conv1(x)
        x = F.relu(x)
        # torch.Size([32, 10, 3])
        x = self.maxpool1(x)
        # torch.Size([32, 2, 3])
        x = torch.flatten(x, 1)
        # torch.Size([32, 6])
        x = self.fc1(x)
        x = F.relu(x)
        x = self.dropout1(x)
        # torch.Size([32, 10])
        output = self.fc2(x)
        # torch.Size([32, 2])
        return output

lr = 0.001
betas = (0.9, 0.999)
model = Grouped2DCNN()
optimizer = optim.NAdam(model.parameters(), lr=lr, betas=betas)

file_path = './models/best_2dcnn_imu_onoff_model.pth'

checkpoint = torch.load(file_path)
model.load_state_dict(checkpoint['state_dict'])
optimizer.load_state_dict(checkpoint['optimizer'])
model.eval()

def z_score_normalize(df):
    return (df - df.mean())/df.std()

range_rand = 5.0

def classify(input):
    input = [[random.uniform(-range_rand, range_rand) for i in range(3)] for j in range(15)]
    input = z_score_normalize(pd.DataFrame(input)).values.tolist()
    input = [input] * 32
    input = torch.FloatTensor(input)
    print(input.shape)
    # preprocessing steps????

    output = model(input)
    print(output.shape)
    print(torch.max(output.data, 1)[1])
    prediction = int(np.argmax(np.bincount(torch.max(output.data, 1)[1]))) 
    return False if prediction == 0 else True
