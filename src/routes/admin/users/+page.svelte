<script lang="ts">
	import { onMount } from "svelte";
	import { downloadText } from "$lib/client/utils";

	export let data;

	let users = [];

	onMount(() => {
		users = data.users.sort((a, b) => {
			return a.surname.localeCompare(b.surname);
		});
	});

	function remove_user(index: number) {
		users.splice(index, 1);
		users = [...users].sort((a, b) => {
			return a.surname.localeCompare(b.surname);
		});
	}
</script>

<div class="m-5">
	<h1 class="text-5xl dark:text-white">User-Manager</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">User hinzufügen</h2>
	<form method="POST" action="?/generate">
		<button class="mt-8 w-full rounded-xl bg-slate-500 p-4 text-lg text-white"
			>User aus den Antwortmöglichkeiten (Schüler) generieren</button
		>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Aktuelle User</h2>
	<form class="mt-5" method="POST" action="?/users">
		{#if users.length > 0}
			{#each users as user, i}
				<div
					class="my-2 grid grid-cols-10 grid-rows-1 place-items-stretch gap-3 rounded-xl bg-slate-500 p-5 text-white"
				>
					<div class="col-span-1">
						<input
							on:input|preventDefault={(event) => {
								user.forename = event.target.value;
							}}
							value={user.forename}
							class="w-full rounded-lg p-3 text-black"
							type="text"
							name="forename"
						/>
					</div>
					<div class="col-span-2">
						<input
							on:input|preventDefault={(event) => {
								user.surname = event.target.value;
							}}
							value={user.surname}
							class="w-full rounded-lg p-3 text-black"
							type="text"
							name="surname"
						/>
					</div>
					<div class="col-span-2 place-self-center">
						<label class="mr-3" for={`gender-${i}`}>Geschlecht</label>
						<select
							value={user.gender}
							class="w-36 rounded-xl bg-white p-3 text-slate-900"
							id={`gender-${i}`}
							name="gender"
							required
							disabled
						>
							<option value="m"> Männlich </option>
							<option value="w"> Weiblich </option>
							<option value="d"> Divers </option>
						</select>
					</div>
					<div class="col-span-2">
						<input
							on:click|preventDefault={async () => {
								await navigator.clipboard.writeText(user.mail);
							}}
							value={user.mail}
							class="w-full rounded-lg p-3 text-black"
							type="email"
							name="mail"
							placeholder="Email"
							required
							readonly
						/>
					</div>
					<div class="col-span-2">
						<input
							on:click|preventDefault={() => {
								if (
									confirm(
										`Bist du dir sicher, dass du den Code für ${user.forename} ${user.surname} erneuern möchtest? Diese Aktion ist unumkehrbar und kann möglicherweise dafür sorgen, dass der Nutzer sich nicht mehr einloggen kann!`,
									)
								) {
									user.code = "---";
								}
							}}
							value={user.code}
							class="w-36 rounded-lg p-3 text-black hover:cursor-pointer hover:bg-red-600"
							type="text"
							name="code"
							required
							readonly
						/>
						<button
							class="rounded-lg bg-white p-1 hover:bg-sky-500"
							on:click|preventDefault={async () => {
								await navigator.clipboard.writeText(user.code);
							}}
						>
							<svg
								fill="#000000"
								height="1em"
								width="1em"
								id="XMLID_154_"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								xml:space="preserve"
							>
								<g id="copy">
									<g>
										<path
											d="M19,24H1V4h4V0h12.4L23,5.6V20h-4V24z M3,22h14v-2H5V6H3V22z M7,18h14V8h-6V2H7V18z M17,6h3.6L17,2.4V6z M17,16H9v-2h8V16^M
                        z M19,12H9v-2h10V12z M13,8H9V6h4V8z"
										/>
									</g>
								</g>
							</svg>
						</button>
					</div>
					<div class="place-self-center">
						<button
							class="rounded-xl bg-white p-3 text-slate-900 hover:bg-red-600"
							on:click|preventDefault={() => remove_user(i)}>Entfernen</button
						>
					</div>
					{#if user.personId}
						<input hidden name="personId" value={user.personId} />
					{/if}
					{#if user.id}
						<input hidden name="id" value={user.id} />
					{/if}
				</div>
			{/each}
		{:else}
			<h1 class="m-8 text-center text-black">Es sind noch keine User vorhanden.</h1>
		{/if}
		<input
			class="mt-8 w-full rounded-xl bg-slate-500 p-4 text-lg text-white hover:cursor-pointer"
			type="submit"
			value="User aktualisieren"
		/>
	</form>
	<button
		class="mt-2 w-full rounded-xl bg-slate-500 p-4 text-lg text-white hover:cursor-pointer"
		type="submit"
		on:click={() => {
			downloadText(
				JSON.stringify(
					users.map((user) => {
						return { name: `${user.forename} ${user.surname}`, code: user.code };
					}),
				),
				"users.txt",
			);
		}}
	>
		User exportieren
	</button>
</div>
