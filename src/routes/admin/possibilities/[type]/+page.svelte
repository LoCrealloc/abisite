<script lang="ts">
	import { onMount } from "svelte";
	import { afterNavigate } from "$app/navigation";

	export let data;

	let possibilities = [];

	function loadCallback() {
		possibilities = data.possibilities.sort((a, b) => {
			return a.surname.localeCompare(b.surname);
		});
	}

	onMount(loadCallback);

	afterNavigate(loadCallback);

	let new_possibility_forename = "";
	let new_possibility_surname = "";

	function add_possibility() {
		possibilities.push({
			forename: new_possibility_forename,
			surname: new_possibility_surname,
		});
		possibilities = [...possibilities].sort((a, b) => {
			return a.surname.localeCompare(b.surname);
		});

		new_possibility_forename = new_possibility_surname = "";
	}

	function remove_possibility(index: number) {
		possibilities.splice(index, 1);
		possibilities = [...possibilities];
	}
</script>

<div class="m-5">
	<h1 class="text-5xl dark:text-white">
		Möglichkeiten-Manager |
		{#if data.type === "student"}
			Schüler
		{:else}
			Lehrer
		{/if}
	</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Möglichkeit hinzufügen</h2>
	<form on:submit|preventDefault={add_possibility}>
		<div
			class="grid grid-cols-5 grid-rows-1 place-items-stretch gap-3 rounded-xl bg-slate-500 p-5 text-white"
		>
			<div class="col-span-2">
				<input
					bind:value={new_possibility_forename}
					class="w-full rounded-lg p-3 text-black"
					type="text"
					placeholder="Vorname"
				/>
			</div>
			<div class="col-span-2">
				<input
					bind:value={new_possibility_surname}
					class="w-full rounded-lg p-3 text-black"
					type="text"
					placeholder="Nachname"
				/>
			</div>
			<div class="place-self-center">
				<input type="submit" value="Hinzufügen" class="rounded-xl bg-white p-3 text-slate-900" />
			</div>
		</div>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Aktuelle Möglichkeiten</h2>
	<form class="my-5" method="POST">
		{#if possibilities.length > 0}
			{#each possibilities as possibility, i}
				<div
					class="my-2 grid grid-cols-5 grid-rows-1 place-items-stretch gap-3 rounded-xl bg-slate-500 p-5 text-white"
				>
					<div class="col-span-2">
						<input
							on:input|preventDefault={(event) => {
								possibility.forename = event.target.value;
							}}
							value={possibility.forename}
							class="w-full rounded-lg p-3 text-black"
							type="text"
							placeholder="Vorname"
							name="forename"
						/>
					</div>
					<div class="col-span-2">
						<input
							on:input|preventDefault={(event) => {
								possibility.surname = event.target.value;
							}}
							value={possibility.surname}
							class="w-full rounded-lg p-3 text-black"
							type="text"
							placeholder="Nachname"
							name="surname"
						/>
					</div>
					<div class="place-self-center">
						<button
							class="rounded-xl bg-white p-3 text-slate-900 hover:bg-red-600"
							on:click|preventDefault={() => remove_possibility(i)}>Entfernen</button
						>
					</div>
					{#if possibility.personId}
						<input hidden name="personId" value={possibility.personId} />
					{/if}
					{#if possibility.id}
						<input hidden name="id" value={possibility.id} />
					{/if}
				</div>
			{/each}
		{:else}
			<h1 class="m-8 text-center text-black dark:text-white">
				Es sind noch keine Möglichkeiten vorhanden.
			</h1>
		{/if}
		<input
			class="mt-8 w-full rounded-xl bg-slate-500 p-4 text-lg text-white"
			type="submit"
			value="Möglichkeiten aktualisieren"
		/>
	</form>
</div>
