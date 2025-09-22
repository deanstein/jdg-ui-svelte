<script>
	import { JDG_INPUT_TYPES } from '$lib/schemas/timeline/jdg-input-types.js';

	export let fieldKey;
	export let fieldDef;
	export let value;
	export let onChange;

	const { label, inputType, options = [] } = fieldDef;
</script>

<div class="form-group">
	<label for={fieldKey}>{label}</label>

	{#if inputType === JDG_INPUT_TYPES.TEXT}
		<input id={fieldKey} type="text" bind:value on:input={onChange} />
	{:else if inputType === JDG_INPUT_TYPES.TEXTAREA}
		<textarea id={fieldKey} bind:value on:input={onChange} />
	{:else if inputType === JDG_INPUT_TYPES.DATE}
		<input id={fieldKey} type="date" bind:value on:input={onChange} />
	{:else if inputType === JDG_INPUT_TYPES.CHECKBOX}
		<input id={fieldKey} type="checkbox" bind:checked={value} on:change={onChange} />
	{:else if inputType === JDG_INPUT_TYPES.SELECT}
		<select id={fieldKey} bind:value on:change={onChange}>
			{#each options as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
	{:else}
		<input id={fieldKey} type="text" bind:value on:input={onChange} />
	{/if}
</div>
