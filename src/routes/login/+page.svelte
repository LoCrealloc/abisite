<div class="py-5 text-center dark:text-white ">
	<h1 class="my-5 text-3xl">Willkommen bei der Abizeitungs-Umfrage</h1>
	<h3 class="m-2 text-lg">Bitte gib unten den Code ein, den du von unserem Team erhalten hast</h3>
	<div class="my-9 grid grid-rows-4">
		<form method="POST">
			<div>
				<input
					class="my-1 w-80 rounded-xl rounded-xl border-2 border-solid border-sky-500 bg-white p-3 text-xl text-black"
					type="email"
					placeholder="Email-Adresse eingeben..."
					name="email"
					required
				/>
			</div>
			<div>
				<input
					class="my-1 w-80 rounded-xl rounded-xl border-2 border-solid border-sky-500 bg-white p-3 text-xl text-black"
					type="text"
					placeholder="Code eingeben.."
					name="code"
					required
				/>
			</div>
			<div>
				<input
					class="my-1 w-80 rounded-xl rounded-xl border-2 border-solid border-sky-500 bg-sky-500 p-3 text-xl text-slate-900"
					type="submit"
					value="Login"
				/>
			</div>
		</form>
		<div class="my-3 text-slate-900 dark:text-white">
			Kein Account? <a class="text-sky-500 hover:underline" href="/register">Registrieren</a>
		</div>
	</div>
</div>
