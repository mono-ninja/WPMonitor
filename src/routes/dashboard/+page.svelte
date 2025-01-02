<svelte:head>
    <title>WPMonitor: Track WordPress Plugin & Theme Performance in Real-Time | No Sign-Up Needed</title>
    <meta name="description"
          content="Effortlessly track the performance of your WordPress plugins and themes with WPMonitor. Get real-time metrics, monitor downloads, and identify growth trends. No account required, and all data is stored locally in your browser for enhanced privacy."/>
</svelte:head>

<script>
  import {isMenuOpen} from '$lib/stores/menuStore';

  let isOpen = false;

  $: isMenuOpen.subscribe((value) => {
    isOpen = value;
  });

</script>

<main class="p-4">

    <div class="mx-auto max-w-screen-lg">

        <hgroup class="my-4">
        <h1 class="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Welcome to
                <span class="text-primary-700">WPMonitor</span></h1>
                <p class="text-lg text-gray-500 xl:mr-64 lg:mb-0 dark:text-gray-400">Your simple and effective solution
                    for tracking the performance of your WordPress plugins and themes.</p>
        </hgroup>

        <div class="max-w-none format">
            <h2>Get Started in Just 3 Easy Steps</h2>
            <ol>
                <li>
                    <strong>Add Your Plugins and Themes in Settings</strong>
                    <p>Go to the <a href="/dashboard/wp">Settings</a> page and enter your plugin or theme name along
                        with
                        its slug to begin monitoring.
                        No complex setup or registration required—just plug in your details and start tracking.</p>
                </li>
                <li>
                    <strong>Navigate to Your Metrics Page</strong>
                    <p>After adding your items, find them listed in the side navigation menu. Select an
                        item to access detailed performance metrics and insights.</p>
                </li>
                <li>
                    <strong>View Real-Time Data</strong>
                    <p>Get up-to-date statistics and trends directly from your dashboard. Monitor your growth, identify
                        opportunities, and keep track of your plugin or theme’s performance effortlessly.</p>
                </li>
            </ol>


            <h2>Why Use <span data-color="primary">WP</span>MONITOR</h2>
            <p>Whether you’re a plugin developer or a theme creator,
                having access to real-time data is
                essential for optimizing
                and improving your projects. With Monitor, you can:</p>
            <ul>
                <li>Identify high-performing keywords to increase your visibility.</li>
                <li>Track active downloads, and user engagement over time.</li>
                <li>Spot performance trends to stay ahead of competitors.</li>
            </ul>

            <h2 class="color-accent">Get Started Now — No Account Needed!</h2>
            <p>Ready to begin? Just enter your plugin or theme
                name in the search bar and start tracking instantly. No sign-up,
                no hassle—just instant insights.</p>

            <h2>Data Privacy and Storage</h2>
            <p>We prioritize your privacy and ensure that all your plugin and theme data is stored
                locally in your browser—never
                on our servers. We do not collect, save, or track any information related to your WordPress plugins or
                themes.
                Here’s how we handle your data: </p>

            <h3>Local Storage Only</h3>
            <p>All of your settings and monitored items are stored in your browser’s LocalStorage. This
                means your data stays on
                your device and is not accessible to us or any third party. </p>

            <h3>Your Control</h3>
            <p>If you wish to remove the stored data, simply clear your browser’s LocalStorege for this
                site</p>
            <p>This action will erase all stored plugin and theme data, including your settings and preferences. If you
                use a
                new browser or switch devices, your data will not be available, and you’ll need to re-enter your plugins
                and
                themes on the Settings page to start tracking again. </p>

            <h2 class="color-attention">Important Notice:</h2>
            <p>Your data is available only in the current browser and will remain
                until you manually clear it. If you switch to
                another browser or device, your settings will not carry over, and you’ll need to re-add your plugins and
                themes. </p>
        </div>
    </div>
</main>


