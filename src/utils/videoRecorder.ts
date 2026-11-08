import { GreetingData } from '../types';

export interface RecorderOptions {
  durationSeconds?: number;
  format?: 'webm' | 'mp4';
  fps?: number;
  onProgress?: (percent: number, status: string) => void;
}

export class DiwaliVideoRecorder {
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;

  public static isFormatSupported(format: 'webm' | 'mp4'): boolean {
    if (typeof MediaRecorder === 'undefined') return false;
    if (format === 'mp4') {
      return (
        MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ||
        MediaRecorder.isTypeSupported('video/mp4')
      );
    }
    return (
      MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ||
      MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ||
      MediaRecorder.isTypeSupported('video/webm')
    );
  }

  public static getSupportedFormats(): ('webm' | 'mp4')[] {
    const list: ('webm' | 'mp4')[] = [];
    if (this.isFormatSupported('webm')) list.push('webm');
    if (this.isFormatSupported('mp4')) list.push('mp4');
    return list.length ? list : ['webm'];
  }

  /**
   * Records a cinematic segment of the Diwali canvas
   */
  public async recordCanvas(
    sourceCanvas: HTMLCanvasElement,
    _greetingData?: GreetingData,
    options: RecorderOptions = {}
  ): Promise<Blob> {
    if (this.isRecording) {
      throw new Error('Recording is already in progress');
    }

    const duration = options.durationSeconds || 12;
    const fps = options.fps || 30;
    const format = options.format || (DiwaliVideoRecorder.isFormatSupported('mp4') ? 'mp4' : 'webm');

    let mimeType = 'video/webm';
    if (format === 'mp4') {
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        mimeType = 'video/mp4;codecs=avc1';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      }
    } else {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      }
    }

    // Capture stream from canvas
    const stream = sourceCanvas.captureStream(fps);
    this.recordedChunks = [];
    this.isRecording = true;

    return new Promise((resolve, reject) => {
      try {
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 5000000, // 5 Mbps for pristine cinematic quality
        });

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          this.isRecording = false;
          const blob = new Blob(this.recordedChunks, { type: mimeType });
          if (options.onProgress) {
            options.onProgress(100, 'Video ready to save!');
          }
          resolve(blob);
        };

        recorder.onerror = (err) => {
          this.isRecording = false;
          reject(err);
        };

        // Start recording
        recorder.start(250); // Slice every 250ms
        const startTime = Date.now();

        // Progress timer
        const intervalId = window.setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          const progress = Math.min(Math.round((elapsed / duration) * 100), 99);
          if (options.onProgress) {
            options.onProgress(
              progress,
              `Capturing golden cinematic Diwali moments (${Math.round(elapsed)}s / ${duration}s)...`
            );
          }

          if (elapsed >= duration) {
            clearInterval(intervalId);
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
          }
        }, 200);

      } catch (err) {
        this.isRecording = false;
        reject(err);
      }
    });
  }

  /**
   * Download a blob as a file with custom filename
   */
  public static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  }
}
