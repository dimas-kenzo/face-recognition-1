<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Face Recognition</title>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script defer src="{{ asset('js/face-api.min.js') }}"></script>
  <script defer src="{{ asset('js/script.js') }}"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column; 
      align-items: center;
      justify-content: center;
      position: relative;
    }

    video {
      margin-bottom: 10px; 
    }

    canvas {
      position: absolute;
    }

  </style>
</head>
<body>
  <video id="video" width="720" height="560" autoplay muted></video>
  <button id="captureBtn">Capture</button>
</body>
</html>