<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Gallapasal</title>

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#ffffff">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.ico">

    @viteReactRefresh
    @vite(['resources/js/index.css', 'resources/js/main.tsx'])
</head>

<body class="antialiased">
    <div id="root"></div>
</body>

</html>