# TremorGuard

### Client
```
npm run dev
```

### Starting NestJS Server
```
npm run start:dev
```

### Starting AI Server
```
python3 server.py
```

### Steps
#### Collect IoT data
Simply start the main server. The IoT devices should start sending data once connected to Wi-FI

#### View classifications
Classifications are only shown after 60 seconds due to the requirement of having at least 60 seconds of past data before making classifications

#### Submit labelled data
Data collected must be for the same activity type. 