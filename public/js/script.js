const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  captureBtn.addEventListener('click', () => {
    captureAndSave(canvas, displaySize);
  });

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});

async function captureAndSave(canvas, displaySize) {
  // Capture a frame from the video
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, video.width, video.height);

  // Get the captured frame as an image data URL
  const imageDataUrl = canvas.toDataURL();

  // Perform an AJAX request to save the captured frame to the database
  await saveToDatabase(imageDataUrl);
}

async function saveToDatabase(imageDataUrl) {
  try {
    // Dapatkan token csrf dari meta tag pada halaman
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Lakukan request AJAX untuk menyimpan frame yang ditangkap ke database
    const response = await fetch('/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,  // Sertakan token csrf dalam header
      },
      body: JSON.stringify({
        imageData: imageDataUrl,
      }),
    });

    if (response.ok) {
      // Tampilkan SweetAlert jika berhasil
      Swal.fire({
        icon: 'success',
        title: 'Capture saved successfully!',
        showConfirmButton: false,
        timer: 1500  // Durasi SweetAlert ditampilkan (dalam milidetik)
      });
    } else {
      // Tampilkan SweetAlert jika gagal
      Swal.fire({
        icon: 'error',
        title: 'Failed to save capture!',
        text: 'Please try again later.',
      });
    }
  } catch (error) {
    console.error('Error saving capture:', error);
    // Tampilkan SweetAlert jika terjadi kesalahan yang tidak terduga
    Swal.fire({
      icon: 'error',
      title: 'Unexpected error!',
      text: 'Please try again later.',
    });
  }
}


