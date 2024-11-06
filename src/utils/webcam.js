/**
 * Class to handle webcam
 */
export class Webcam {
  /**
   * Open webcam and stream it through video tag.
   * @param {HTMLVideoElement} videoRef video tag reference
   */
  open = (videoRef) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // URLパラメータからカメラインデックスを取得
      const urlParams = new URLSearchParams(window.location.search);
      const cameraParam = urlParams.get('camera');
      const cameraIndex = cameraParam !== null ? parseInt(cameraParam) : -1;

      // 利用可能なビデオデバイスを取得
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');

          let constraints;
          if (cameraIndex === -1) {
            // フロントカメラを使用
            constraints = {
              audio: false,
              video: { facingMode: { exact: "environment" }, }

            };
          } else if (cameraIndex >= 0 && cameraIndex < videoDevices.length) {
            // 指定されたインデックスのカメラを使用
            constraints = {
              audio: false,
              video: { deviceId: { exact: videoDevices[cameraIndex].deviceId } }
            };
          } else {
            throw new Error('Invalid camera index');
          }

          // 選択されたカメラでgetUserMediaを呼び出す
          return navigator.mediaDevices.getUserMedia(constraints);
        })
        .then(stream => {
          videoRef.srcObject = stream;
        })
        .catch(error => {
          console.error('Error accessing the camera:', error);
          alert("Can't open Webcam: " + error.message);
        });
    } else {
      alert("Can't open Webcam!");
    }
  };

  /**
   * Close opened webcam.
   * @param {HTMLVideoElement} videoRef video tag reference
   */
  close = (videoRef) => {
    if (videoRef.srcObject) {
      videoRef.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.srcObject = null;
    } else alert("Please open Webcam first!");
  };
}