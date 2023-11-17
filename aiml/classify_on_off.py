import torch
import torch.nn.functional as F
import torch.nn as nn
import torch.optim as optim
import random
import numpy as np
import pandas as pd

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import random
import pandas as pd
import numpy as np

class Grouped2DCNN(nn.Module):
    def __init__(self):
        super(Grouped2DCNN, self).__init__()
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=32, kernel_size=(5, 1), stride=(2, 1))
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=(5, 1), stride=(2, 1))
        self.conv3 = nn.Conv2d(in_channels=64, out_channels=32, kernel_size=(5, 1), stride=(2, 1))
        self.maxpool1 = nn.MaxPool2d(kernel_size=(5, 1))
        self.dropout1 = nn.Dropout(0.6)
        self.fc1 = nn.Linear(in_features=1472, out_features=32)
        self.dropout2 = nn.Dropout(0.8)
        self.fc2 = nn.Linear(in_features=32, out_features=2)
    def forward(self, x):
#         print(x.shape) # torch.Size([32, 3, 1875, 1])
        x = self.conv1(x)
        x = F.relu(x)
#         print(x.shape) # torch.Size([32, 32, 936, 1])
        x = self.conv2(x)
        x = F.relu(x)
#         print(x.shape) # torch.Size([32, 64, 466, 1])
        x = self.conv3(x)
        x = F.relu(x)
#         print(x.shape) # torch.Size([32, 32, 231, 1])
        x = self.maxpool1(x)
        x = self.dropout1(x)
#         print(x.shape) # torch.Size([32, 32, 46, 1])
        x = torch.flatten(x, 1)
#         print(x.shape) # torch.Size([32, 1472])
        x = self.fc1(x)
        x = F.relu(x)
        x = self.dropout2(x)
#         print(x.shape) # torch.Size([32, 32])
        output = self.fc2(x)
#         print(output.shape) # torch.Size([32, 2])
        return output

model = Grouped2DCNN()

lr = 0.001
betas = (0.9, 0.999)
model = Grouped2DCNN()
optimizer = optim.NAdam(model.parameters(), lr=lr, betas=betas)

file_path = './models/BESTfinal_G180_window_noval_3conv_6_8DO_2stride_2dcnn_imu_onoff.pth'

checkpoint = torch.load(file_path)
model.load_state_dict(checkpoint['state_dict'])
optimizer.load_state_dict(checkpoint['optimizer'])
model.eval()

def z_score_normalize(df):
    return (df)/df.std()

SAMPLE_RATE = 31.25 # samples per second
DURATION = 60 # in seconds
GROUP_SIZE = int(DURATION * SAMPLE_RATE)
print(GROUP_SIZE)

def classify(input):
    input = z_score_normalize(pd.DataFrame(input)).values.tolist()
    input = np.reshape(input, (1, 3, GROUP_SIZE, 1))
    input = torch.FloatTensor(input)
    # print(input.shape)

    output = model(input)
    print(output.shape)
    print(torch.max(output.data, 1)[1])
    prediction = int(np.argmax(np.bincount(torch.max(output.data, 1)[1]))) 
    return True if prediction == 0 else False
    # input = [[random.uniform(-range_rand, range_rand) for i in range(3)] for j in range(15)]
    # input = z_score_normalize(pd.DataFrame(input)).values.tolist()
    # input = [input] * 32
    # input = torch.FloatTensor(input)
    # print(input.shape)
    # # preprocessing steps????

    # output = model(input)
    # print(output.shape)
    # print(torch.max(output.data, 1)[1])
    # prediction = int(np.argmax(np.bincount(torch.max(output.data, 1)[1]))) 
    # return False if prediction == 0 else True
