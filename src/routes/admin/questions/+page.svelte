<script lang="ts">
	import { onMount } from "svelte";

	export let data;

	let questions = [];

	onMount(() => {
		questions = data.questions
			.map((question) => {
				return {
					id: question.id,
					question: question.question,
					teacherQuestion: question.teacherQuestion,
					pair: question.pair,
				};
			})
			.sort((a) => {
				return a.teacherQuestion;
			});
	});

	let new_question_question = "";
	let new_question_teacherQuestion = false;
	let new_question_pair = false;

	$: new_question = {
		question: new_question_question,
		teacherQuestion: new_question_teacherQuestion,
		pair: new_question_pair,
	};

	function add_question() {
		questions.push(new_question);
		new_question_question = "";
		new_question_teacherQuestion = new_question_pair = false;
		questions = [...questions].sort((a) => {
			return a.teacherQuestion;
		});
	}

	function remove_question(event, index: number) {
		event.preventDefault();
		questions.splice(index, 1);
		questions = [...questions];
	}
</script>

<div class="m-5">
	<h1 class="text-5xl dark:text-white">Fragen-Manager</h1>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Fragen hinzufügen</h2>
	<form on:submit|preventDefault={add_question}>
		<div
			class="grid grid-cols-5 grid-rows-1 place-items-stretch rounded-xl bg-slate-500 p-5 text-white"
		>
			<div class="col-span-2">
				<input
					bind:value={new_question_question}
					class="w-full rounded-lg p-3 text-black"
					type="text"
					placeholder="Neue Frage.."
				/>
			</div>
			<div class="place-self-center p-3">
				<label class="mr-2" for="pair">Paarfrage</label><input
					bind:checked={new_question_pair}
					class="scale-150"
					id="pair"
					type="checkbox"
				/>
			</div>
			<div class="place-self-center p-3">
				<label class="mr-2" for="teacherquestion">Lehrer-Frage</label><input
					bind:checked={new_question_teacherQuestion}
					class="scale-150"
					id="teacherquestion"
					type="checkbox"
				/>
			</div>
			<div class="place-self-center">
				<input type="submit" value="Hinzufügen" class="rounded-xl bg-white p-3 text-slate-900" />
			</div>
		</div>
	</form>
	<h2 class="mt-8 mb-3 text-2xl dark:text-white">Aktuelle Fragen</h2>
	<form class="my-5" method="POST">
		{#if questions.length > 0}
			{#each questions as question, i}
				<div
					class="my-2 grid grid-cols-5 grid-rows-1 place-items-stretch rounded-xl bg-slate-500 p-5 text-white"
				>
					<div class="col-span-2">
						<input
							on:input|preventDefault={(event) => {
								question.question = event.target.value;
							}}
							value={question.question}
							class="w-full rounded-lg p-3 text-black"
							type="text"
							placeholder="Neue Frage.."
							name="question"
						/>
					</div>
					<div class="place-self-center p-3">
						<label class="mr-2" for={`pair-${i}`}>Paarfrage</label>
						<input
							on:input|preventDefault={() => {
								question.pair = !question.pair;
							}}
							checked={question.pair}
							value={question.pair}
							class="scale-150"
							id={`pair-${i}`}
							type="checkbox"
							name="pair"
						/>
					</div>
					<div class="place-self-center p-3">
						<label class="mr-2" for={`teacherquestion-${i}`}>Lehrer-Frage</label>
						<input
							on:input|preventDefault={() => {
								question.teacherQuestion = !question.teacherQuestion;
							}}
							checked={question.teacherQuestion}
							value={question.teacherQuestion}
							class="scale-150"
							id={`teacherquestion-${i}`}
							type="checkbox"
							name="teacherQuestion"
						/>
					</div>
					<div class="place-self-center">
						<button
							class="rounded-xl bg-white p-3 text-slate-900"
							on:click={(event) => remove_question(event, i)}>Entfernen</button
						>
					</div>
					{#if question.id}
						<input hidden name="id" value={question.id} />
					{/if}
				</div>
			{/each}
		{:else}
			<h1 class="m-8 text-center text-white">Es sind noch keine Fragen vorhanden.</h1>
		{/if}
		<input
			class="mt-8 w-full rounded-xl bg-slate-500 p-4 text-lg text-white"
			type="submit"
			value="Fragen aktualisieren"
		/>
	</form>
</div>
