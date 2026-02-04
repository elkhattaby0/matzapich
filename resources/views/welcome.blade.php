<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>{{ config('app.name') }}</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
      crossorigin="anonymous" referrerpolicy="no-referrer" />
     <link rel="icon" type="image/x-icon" href="{{ asset('matzapich.ico') }}?v={{ time() }}">



</head>
<body>
    <div id="app"></div>
</body>
</html>