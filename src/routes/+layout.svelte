<script>
	import { userId } from "$lib/client/stores/auth";
	export let data;

	import "../app.css";

	$: userId.set(data.userId);
</script>

<div class="min-h-full">
	<slot />
</div>
<footer class="mt-9 grid w-full bg-slate-900 object-bottom p-9 text-white dark:bg-sky-700">
	<h3 class="text-center">
		Diese Webseite ist freie und quelloffene Software! <a
			class="text-blue-500 hover:underline dark:text-slate-900"
			href="https://github.com/LoCrealloc/abisite">Schau dir unseren Code an!</a
		>
	</h3>
	<h3 class="mt-2 text-center text-sm text-slate-400">
		Developed by LoC | Paul Scheurmann-Kettner
	</h3>
</footer>
