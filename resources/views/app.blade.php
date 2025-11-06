<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- PWA Meta Tags -->
    <link rel="manifest" href="/manifest.json">
    {{-- <meta name="theme-color" content="#4f46e5"> --}}
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Qatiarent">
    <link rel="apple-touch-icon" href="/android-chrome-512x512.png">

    <!-- Google tag (gtag.js) for google analitycs-->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-YSV2T775CJ"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-YSV2T775CJ');
    </script>


    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- custom --}}
    <meta name="google-site-verification" content="usf6qRe9Cgqox7Fr8GstqorVqOeUfQg5hZvilNa6bys" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    {{-- custom --}}

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

{{-- custom --}}
<title>Qatia Rent - Sewa Pakaian Mudah & Cepat</title>
<meta name="description"
    content='Koleksi pakaian eksklusif untuk setiap acara. Nikmati pengalaman sewa yang nyaman, cepat, dan berkualitas tinggi.'>
<meta name="keywords"
    content="qatia rent, qatiarent, sewa pakaian, rental baju, booking online, dress, sewa dress murah, rental dress murah">
<meta name="author" content="Qatia Rent">

<meta property="og:title" content="Qatia Rent - Sewa Pakaian Mudah & Cepat" />
<meta property="og:description"
    content="Koleksi pakaian eksklusif untuk setiap acara. Nikmati pengalaman sewa yang nyaman, cepat, dan berkualitas tinggi." />
<meta property="og:image" content="https://qatiarent-development.site/storage/android-chrome-512x512.png" />
<meta property="og:url" content="https://qatiarent-development.site" />
<meta property="og:type" content="website" />
{{-- custom --}}

<body class="font-sans antialiased">
    @inertia
</body>

</html>
