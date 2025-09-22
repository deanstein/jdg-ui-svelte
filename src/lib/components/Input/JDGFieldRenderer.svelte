<script>
	import { JDGCheckbox, JDGDatePicker, JDGTextArea, JDGTextInput } from '$lib/index.js';
	import { JDG_INPUT_TYPES } from '$lib/schemas/timeline/jdg-input-types.js';

	export let fieldKey;
	export let fieldDef;
	export let value;

	const { label, inputType, options = [] } = fieldDef;
</script>

<div class="form-group">
	<label for={fieldKey}>{label}</label>

	{#if inputType === JDG_INPUT_TYPES.TEXT}
		<JDGTextInput bind:inputValue={value} />
	{:else if inputType === JDG_INPUT_TYPES.TEXTAREA}
		<JDGTextArea />
	{:else if inputType === JDG_INPUT_TYPES.DATE}
		<JDGDatePicker />
	{:else if inputType === JDG_INPUT_TYPES.CHECKBOX}
		<JDGCheckbox />
	{:else if inputType === JDG_INPUT_TYPES.SELECT}
		<select id={fieldKey} bind:value>
			{#each options as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
	{:else if inputType === JDG_INPUT_TYPES.IMAGE_LIST}
		<div>[...]</div>
	{:else}
		<input id={fieldKey} type="text" bind:value />
	{/if}
</div>
