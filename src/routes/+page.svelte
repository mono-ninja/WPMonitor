<script>
  import Features from '$lib/components/Features.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Stores from '$lib/components/Stores.svelte';
  import Envato from '$lib/components/Envato.svelte';
  import WordpPress from '$lib/components/WordpPress.svelte';
</script>

<svelte:head>
    <title>WP Monitor – Real-Time Analytics for WordPress Plugins and Themes</title>
    <meta name="description"
          content="Get real-time insights into your WordPress plugins and themes’ performance. Track rankings, downloads, and keyword visibility—no registration required. Perfect for WordPress developers looking to optimize their projects."/>
    <meta name="keywords"
          content="WordPress plugin monitoring, WordPress theme analytics, plugin performance tracking, WordPress real-time data, plugin ranking, theme monitoring, WordPress keyword tracking, WordPress developer tools, plugin metrics, theme insights."/>
</svelte:head>

<main class="bg-gray-50 flex-1 pb-48">

    <Heading/>
    <section class="p-4">
        <div class="mx-auto max-w-screen-lg grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Stores/>
            <Envato/>
        </div>
    </section>
    <WordpPress/>
    <Features/>

</main>