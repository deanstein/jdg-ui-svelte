<script>
	import { css } from '@emotion/css';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { JDGButton } from '$lib/index.js';

	export let missingImageKeys = [];
	export let onRemoveImage = (key) => {};

	const missingImagesPlaceholderCss = css`
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 16px;
		border: 2px dashed #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
		margin-top: 12px;
	`;

	const missingImageIconCss = css`
		font-size: 2rem;
		color: #999;
		flex-shrink: 0;
	`;

	const missingImageTextCss = css`
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	`;

	const missingImageMessageCss = css`
		font-size: 0.9rem;
		color: #666;
		font-weight: 500;
	`;

	const missingImageKeysCss = css`
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	`;

	const missingImageKeyWrapperCss = css`
		display: flex;
		align-items: center;
		gap: 6px;
	`;

	const missingImageKeyCss = css`
		font-weight: 500;
		color: #666;
		font-family: monospace;
		font-size: 0.85rem;
		padding: 4px 8px;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 4px;
	`;
</script>

{#if missingImageKeys.length > 0}
	<div class={missingImagesPlaceholderCss}>
		<div class={missingImageIconCss}>
			<i class="fa-solid fa-image"></i>
		</div>
		<div class={missingImageTextCss}>
			<div class={missingImageMessageCss}>Images not found in registry:</div>
			<div class={missingImageKeysCss}>
				{#each missingImageKeys as missingKey}
					<div class={missingImageKeyWrapperCss}>
						<span class={missingImageKeyCss}>{missingKey}</span>
						<JDGButton
							faIcon="fa-trash"
							label={null}
							onClickFunction={() => onRemoveImage(missingKey)}
							paddingLeftRight="6px"
							paddingTopBottom="4px"
							fontSize="12px"
							backgroundColor={jdgColors.delete}
							tooltip="Remove this image from the timeline event"
							doForceSquareAspect
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
