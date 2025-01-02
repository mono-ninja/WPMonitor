<script>
  let homeURL = '';

  if (typeof window !== 'undefined') {
    homeURL = `${window.location.protocol}//${window.location.host}/`;
  }
</script>

<header>
    <nav class="bg-white border-b border-gray-200 px-4 py-2.5  left-0 right-0 top-0 z-50">
        <div class="flex flex-wrap justify-between items-center max-w-screen-lg mx-auto">
            <div class="flex justify-start items-center">
                <a href="{homeURL}" class="flex items-center justify-between">
                    <svg class="mr-3 h-6 sm:h-9 text-primary-600" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" viewBox="0 0 512 512">

                        <g id="1728127909379-8007129_Artboard-Copy-3" stroke="none" stroke-width="1" fill="none"
                           fill-rule="evenodd">
                            <rect id="1728127909379-8007129_Rectangle" fill="currentColor"
                                  transform="rotate(-27 135 256)" x="85" y="34" width="100" height="444" rx="50"></rect>
                            <rect id="1728127909379-8007129_Rectangle-Copy" fill="currentColor"
                                  transform="rotate(-27 311.592 256.665)" x="261.092" y="34.665" width="101"
                                  height="444" rx="50.5"></rect>
                            <circle id="1728127909379-8007129_Oval-Copy" fill="currentColor" cx="431.5" cy="112.5"
                                    r="62.5"></circle>
                        </g>

                    </svg>
                    <span class="self-center text-2xl font-semibold whitespace-nowrap uppercase hidden sm:inline">Monitor
                    </span>
                </a>

                <span class="mx-2 w-px h-5 bg-gray-200 dark:bg-gray-600 lg:inline"></span>

                <a href="/dashboard" class="text-sm font-medium hover:underline">
                    About
                </a>

            </div>
            <div class="flex items-center">
                <div class="flex items-center">
                    <a href="/dashboard/wp"
                       class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300">
                        <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" viewBox="0 0 24 24">

                            <path fill="currentColor"
                                  d="M0,12c0,4.7,2.8,8.9,6.8,10.8L1,7.1C0.4,8.6,0,10.3,0,12z"></path>
                            <path fill="currentColor"
                                  d="M20.1,11.4c0-1.5-0.5-2.5-1-3.3c-0.6-1-1.2-1.8-1.2-2.8c0-1.1,0.8-2.1,2-2.1c0.1,0,0.1,0,0.2,0 C18,1.2,15.1,0,12,0C7.8,0,4.1,2.2,2,5.4c0.3,0,0.5,0,0.8,0c1.3,0,3.2-0.2,3.2-0.2c0.6,0,0.7,0.9,0.1,1c0,0-0.7,0.1-1.4,0.1l4.4,13 l2.6-7.9L9.8,6.4c-0.6,0-1.3-0.1-1.3-0.1c-0.6,0-0.6-1,0.1-1c0,0,2,0.2,3.2,0.2C13,5.4,15,5.3,15,5.3c0.6,0,0.7,0.9,0.1,1 c0,0-0.7,0.1-1.4,0.1L18,19.3l1.2-4C19.7,13.6,20.1,12.4,20.1,11.4z"></path>
                            <path fill="currentColor"
                                  d="M12.2,13L8.6,23.5C9.7,23.8,10.8,24,12,24c1.4,0,2.7-0.2,4-0.7c0-0.1-0.1-0.1-0.1-0.2L12.2,13z"></path>
                            <path fill="currentColor"
                                  d="M22.5,6.2c0.1,0.4,0.1,0.8,0.1,1.2c0,1.2-0.2,2.6-0.9,4.3L18,22.4c3.6-2.1,6-5.9,6-10.4 C24,9.9,23.5,8,22.5,6.2z"></path>
                        </svg>
                        <span class="sr-only">WordPress</span>
                    </a>

                    <span class="mx-2 w-px h-5 bg-gray-200 dark:bg-gray-600 lg:inline"></span>

                    <a href="/dashboard/edd"
                       class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="210" height="210"
                             viewBox="0 0 210 210">
                            <path fill="#212121"
                                  d="M116.226 155.494c-2.052-1.334-4.651-2.533-7.787-3.574-2.398-.827-4.371-1.606-5.911-2.358-1.527-.744-2.656-1.571-3.377-2.441-.739-.888-1.085-1.951-1.085-3.172 0-.976.293-1.903.923-2.782.617-.875 1.584-1.606 2.896-2.157 1.326-.56 3.014-.862 5.11-.871 1.689.009 3.229.144 4.624.385 1.378.249 2.599.551 3.644.897 1.059.359 1.916.696 2.59 1.015l2.332-7.031c-1.409-.709-3.176-1.295-5.32-1.772-1.82-.402-3.903-.634-6.269-.713v-7.275h-6.409v7.639c-1.028.166-2.013.39-2.944.661-2.358.696-4.384 1.663-6.059 2.923-1.663 1.256-2.949 2.726-3.833 4.41-.888 1.684-1.326 3.539-1.343 5.534.013 2.31.617 4.344 1.811 6.103 1.194 1.759 2.896 3.286 5.093 4.594 2.188 1.304 4.799 2.428 7.818 3.373 2.266.726 4.113 1.483 5.521 2.262 1.409.774 2.441 1.628 3.084 2.559.656.932.98 2.012.967 3.22 0 1.326-.389 2.476-1.151 3.469-.752.98-1.864 1.75-3.325 2.297-1.461.551-3.246.823-5.337.84a30.776 30.776 0 0 1-4.961-.433 32.183 32.183 0 0 1-4.48-1.124c-1.396-.464-2.616-.967-3.675-1.531l-2.253 7.324c1.019.56 2.292 1.063 3.85 1.527 1.557.468 3.272.84 5.149 1.124a41.77 41.77 0 0 0 5.727.433l.341-.005v7.521h6.409v-8.124a24.452 24.452 0 0 0 2.323-.564c2.572-.774 4.707-1.829 6.396-3.181 1.702-1.339 2.962-2.892 3.797-4.642a12.811 12.811 0 0 0 1.247-5.574c0-2.31-.495-4.353-1.514-6.112-1.027-1.778-2.558-3.331-4.619-4.674z"></path>
                            <g fill="#212121">
                                <path d="M179.244 30.752C160.247 11.751 133.993 0 105.004 0 76.007 0 49.757 11.751 30.756 30.752 11.751 49.753 0 76.007 0 105s11.751 55.247 30.752 74.248C49.753 198.253 76.007 210 105.004 210c28.993 0 55.248-11.756 74.244-30.752C198.249 160.243 210 133.993 210 105s-11.756-55.247-30.756-74.248zm-3.465 145.027c-18.112 18.113-43.137 29.317-70.779 29.317s-52.671-11.204-70.783-29.317C16.105 157.666 4.9 132.641 4.9 105s11.205-52.666 29.317-70.779C52.329 16.109 77.355 4.904 104.996 4.904s52.666 11.205 70.779 29.317c18.113 18.113 29.317 43.138 29.317 70.779.004 27.641-11.201 52.666-29.313 70.779z"></path>
                                <path d="M195.326 104.125c-.472-49.486-40.727-89.456-90.322-89.456-49.599 0-89.858 39.974-90.322 89.46L56.1 62.711l13.891 13.891-30.31 30.31h130.646l-30.31-30.31 13.891-13.891 41.418 41.414zM105 88.603 66.513 48.217h25.576V28.311c0-5.167 5.81-9.402 12.911-9.402s12.911 4.231 12.911 9.402v19.906h25.576L105 88.603z"></path>
                            </g>
                        </svg>
                        <span class="sr-only">EDD Stores</span>
                    </a>

                    <span class="mx-2 w-px h-5 bg-gray-200 dark:bg-gray-600 lg:inline"></span>

                    <a href="/dashboard/envato"
                       class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300">
                        <svg class="w-4 h-4 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M19.4,0.1c1.1,0.5,5.5,10,1.7,18.2c-3,6.6-10.7,6.6-14.6,4.3c-3.3-2-8.4-8.2-2.8-15.9 c0.2-0.3,0.8-0.3,0.7,0.6c-0.1,0.6-0.9,5.1,0.6,7c0.7,1,0.9,0.3,0.9,0.3S5.9,8.1,10.9,3.2C14.1,0.2,18.6-0.3,19.4,0.1z"></path>
                        </svg>
                        <span class="sr-only">Envato</span>
                    </a>

                    <span class="mx-2 w-px h-5 bg-gray-200 dark:bg-gray-600 lg:inline"></span>

                    <a href="https://github.com/mono-ninja/WPMonitor" target="_blank"
                       class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300">
                    <svg class="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clip-rule="evenodd"/>
                    </svg>
                        <span class="sr-only">GitHub</span>
                    </a>


                </div>
            </div>


        </div>
    </nav>
</header>