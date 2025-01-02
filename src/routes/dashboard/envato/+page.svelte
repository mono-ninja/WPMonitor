<svelte:head>
    <title>Monitor Envato Sales & Earnings | Add API for Real-Time Tracking</title>
    <meta name="description"
          content="Efficiently track your Envato item sales and earnings by connecting your API. Get instant access to detailed performance stats, sales data, and revenue insights to maximize your growth on Envato Marketplace"/>
</svelte:head>

<script>
  import Envato from './Envato.svelte';
  import Details from '$lib/components/Details.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import {isMenuOpen} from '$lib/stores/menuStore';
  let isOpen = false;

  $: isMenuOpen.subscribe((value) => {
    isOpen = value;
  });

</script>


<main class="p-4 bg-gray-50 flex-1 pb-48">

    <div class="mx-auto max-w-screen-lg">

        <hgroup class="flex flex-col gap-2">
            <h1 class="font-bold text-base">Track Your Envato Item
                Sales and Earnings</h1>
            <p class="text-sm text-gray-400 max-w-96">Add your Envato API key to access
                real-time sales and earnings data for your items and optimize your revenue
                tracking.</p>
        </hgroup>


    <Envato/>

    <section class="w-full bg-white border divide-y rounded divide-slate-200 border-slate-200 mt-16">

        <Details summary="What is the Username?">
            <p>Your Username refers to the unique name you use on the Envato Market. This is the username associated with
                your
                account and items on platforms like ThemeForest, CodeCanyon, and others in the Envato ecosystem. Enter your
                Envato Market username to link your sales and earnings data for tracking.</p>
        </Details>

        <Details summary="What is the Token?">
            <p>
                The Token is a unique API key that allows the app to securely access your Envato sales and earnings data. To
                generate a token, you need to create an application on the <a href="https://build.envato.com/"
                                                                              rel="noopener noreferrer" target="_blank" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">Envato
                API platform</a>. Once your app is created, you
                will receive a token that you can add here to enable data tracking. Make sure to grant the necessary
                permissions
                when generating the token for full access to your sales information. </p>
        </Details>

    </section>

    <div class="mt-10">
        <Alert type="info" title="Notice">
            <p>The WPMonitor does not save or store your token on its servers. Your token is securely saved in your
                browser’s
                LocalStorage and is only used by you for tracking purposes. This ensures your data remains private and
                secure.</p>
        </Alert>
    </div>

    </div>
</main>