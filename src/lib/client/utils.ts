import type { gender } from "$lib/common_types";

export function downloadText(text: string, name: string) {
	/*
	 *  This is probably a shitty solution,
	 *  but I don't know if you can do things in JS that are not shitty,
	 *  so this will probably stay here
	 */

	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

	const link = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.setAttribute("download", name);
	a.setAttribute("href", link);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(link);
}

export function validateGender(maybeGender: string): maybeGender is gender {
	return ["m", "w", "d"].includes(maybeGender);
}
