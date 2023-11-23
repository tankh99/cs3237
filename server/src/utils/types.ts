export type IMURecording = {
  x: number;
  y: number;
  z: number;
};


export type IMUTremorActivityRecording = IMURecording & {
  sessionName?: string;
  activityName: string;
  timestamp: number;
  medicationStatus: boolean;
};

// Used for diary entry. Shows both medication status and activity predicted givne IMU values
export type IMUClassificationResult = {
  timestamp: number;
  name?: string;
  device_id?: string;
  activityType: string;
  medicationStatus: boolean;
};

export type MicRecording = {
  p2p: number;
  ff: number;
  device_id?: string;
  timestamp: number;
};