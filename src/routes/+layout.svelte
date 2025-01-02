<script>
  import {page} from '$app/stores';
  import '../app.css';

  import Header from '$lib/components/Header.svelte';


</script>

<div class="antialiased flex flex-col min-h-screen">
    <Header/>
    <slot></slot>
</div>