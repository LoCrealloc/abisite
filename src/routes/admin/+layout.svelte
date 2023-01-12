<script lang="ts">
	import { isLoggedInAdmin } from "$lib/client/stores/auth";
	export let data;

	$: isLoggedInAdmin.set(data.loggedInAdmin);

	let show_dropdown = false;
</script>

{#if data.loggedInAdmin}
	<nav class="flex w-full items-center justify-start bg-slate-800 p-9 text-white">
		<a class="p-5 hover:text-sky-500 hover:underline" href="/admin">Home</a>
		<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/questions">Fragen</a>
		<div
			on:click={() => {
				show_dropdown = !show_dropdown;
			}}
			on:keydown={() => {
				[];
			}}
			class="relative inline-block cursor-pointer p-5 text-left"
		>
			<div class="flex justify-center hover:text-sky-500 hover:underline">
				<p>Antwortmöglichkeiten</p>
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			{#if show_dropdown}
				<div class="absolute right-5 z-10 w-56 origin-top-right rounded-md bg-slate-700">
					<div class="py-1">
						<a class="block py-2 hover:bg-slate-500" href="/admin/possibilities/student">Schüler</a>
						<a class="block py-2 hover:bg-slate-500" href="/admin/possibilities/teacher">Lehrer</a>
					</div>
				</div>
			{/if}
		</div>
		<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/users">Users</a>
		<a class="p-5 hover:text-sky-500 hover:underline" href="/admin/logout">Logout</a>
	</nav>
	<slot />
{:else}
	<div class="absolute flex h-full w-full items-center justify-center overflow-hidden">
		<a href="/login_admin">
			<div class=" rounded-xl bg-slate-900 p-8 text-center dark:bg-white">
				<h3 class="text-xl text-white dark:text-black">Du bist nicht eingelogt!</h3>
				<h3 class="text-lg text-sky-500 hover:underline">Login</h3>
			</div></a
		>
	</div>
{/if}
