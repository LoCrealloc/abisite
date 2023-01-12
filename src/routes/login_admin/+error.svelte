<script>
	import { page } from "$app/stores";
</script>

<div class="py-8 text-center dark:text-white">
	<div class="grid grid-cols-1 grid-rows-3 place-items-center">
		<div><h1 class="text-5xl text-red-500">Fehler!</h1></div>
		<div>
			<h2 class="text-lg">
				{#if $page.status === 404}
					Die Daten, die du uns übermittelt hast, sind fehlerhaft
				{:else if $page.status === 401}
					Ungültiges Admin-Passwort
				{:else}
					Du hast was falsch gemacht!
				{/if}
			</h2>
		</div>
		<div class="mx-auto w-56">
			<a href="/login_admin">
				<div class="rounded-xl bg-slate-900 p-5 text-center dark:bg-white">
					<h3 class="text-xl text-sky-500 hover:underline">Zurück zum Login</h3>
				</div></a
			>
		</div>
	</div>
</div>
