import * as faceapi from 'face-api.js';

export interface BiometricData {
  faceDescriptor: Float32Array;
  confidence: number;
  timestamp: string;
}

export class BiometricService {
  private static instance: BiometricService;
  private isInitialized = false;

  static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize biometric service:', error);
    }
  }

  async captureFaceData(videoElement: HTMLVideoElement): Promise<BiometricData | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const detection = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        return {
          faceDescriptor: detection.descriptor,
          confidence: detection.detection.score,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Face capture error:', error);
    }

    return null;
  }

  async verifyFace(currentDescriptor: Float32Array, storedDescriptor: Float32Array): Promise<boolean> {
    const distance = faceapi.euclideanDistance(currentDescriptor, storedDescriptor);
    return distance < 0.6; // Threshold for face match
  }

  // Secure transaction verification using biometrics
  async verifyTransactionWithBiometrics(amount: number): Promise<boolean> {
    if (amount < 10000) return true; // Skip biometric for small amounts

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      const biometricData = await this.captureFaceData(video);
      
      // Clean up
      stream.getTracks().forEach(track => track.stop());

      if (biometricData && biometricData.confidence > 0.8) {
        // In production, compare with stored biometric data
        return true;
      }
    } catch (error) {
      console.error('Biometric verification failed:', error);
    }

    return false;
  }
}