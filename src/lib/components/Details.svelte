<script>
  export let summary = ''; // Prop for the summary
  export let open = false; // Prop for the description
</script>

<details class="p-4 group" {open} name="faqs">
    {#if summary}
        <summary
                class="[&::-webkit-details-marker]:hidden relative pr-8 font-medium list-none cursor-pointer text-slate-700 focus-visible:outline-none transition-colors duration-300 group-hover:text-slate-900 ">{summary}
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-0 w-4 h-4 transition duration-300 top-1 stroke-slate-700 shrink-0 group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-labelledby="title-ac21 desc-ac21">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        </summary>
    {/if}
    <div class="mt-4 text-slate-500">
        <slot/>
    </div>

</details>