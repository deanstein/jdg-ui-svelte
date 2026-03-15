<script>
	import { onDestroy } from 'svelte';
	import { listPackageVersions } from '$lib/tools/list-versions/list-package-versions-client.js';
	import { allowTextSelection } from '$lib/stores/jdg-ui-store.js';
	import imageMetaRegistry from '../image-meta-registry.js';
	import {
		JDGBodyCopy,
		JDGButton,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGH3H4,
		JDGInputContainer,
		JDGJumpTo
	} from '$lib/index.js';

	allowTextSelection.set(true);

	// --- NPM + GitHub Version Sync ---
	let listOutput = '';
	let listRunning = false;
	async function runListVersions() {
		listRunning = true;
		listOutput = '';
		try {
			const log = [];
			await listPackageVersions({ log });
			listOutput = log.join('\n');
		} catch (e) {
			listOutput = 'Error: ' + (e?.message ?? String(e));
		} finally {
			listRunning = false;
		}
	}

	// --- Apply Watermark to Images ---
	const defaultWatermarkUrl = imageMetaRegistry?.ccp_watermark?.src ?? '';
	const VERTICAL_OPTIONS = [
		{ value: 'top', label: 'Top' },
		{ value: 'center', label: 'Center' },
		{ value: 'bottom', label: 'Bottom' }
	];
	const HORIZONTAL_OPTIONS = [
		{ value: 'left', label: 'Left' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' }
	];
	const BLEND_OPTIONS = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'overlay', label: 'Overlay' },
		{ value: 'soft-light', label: 'Soft light' },
		{ value: 'multiply', label: 'Multiply' },
		{ value: 'screen', label: 'Screen' }
	];
	const WATERMARK_FONTS = [
		{ value: 'REM', label: 'REM' },
		{ value: 'Righteous', label: 'Righteous' },
		{ value: 'Arial', label: 'Arial' },
		{ value: 'Helvetica', label: 'Helvetica' },
		{ value: 'Georgia', label: 'Georgia' },
		{ value: 'Times New Roman', label: 'Times New Roman' },
		{ value: 'system-ui', label: 'System UI' }
	];

	let fileInput;
	let images = /** @type {{ id: string; file: File; objectUrl: string }[]} */ ([]);
	let watermarkType = 'text'; // 'image' | 'text'
	let watermarkUrl = defaultWatermarkUrl;
	let watermarkText = 'The Cinderella City Project';
	let watermarkTextSize = 2;
	let watermarkTextSizeUnit = '%'; // 'px' | '%'
	let watermarkTextFont = 'Righteous';
	let opacity = 0.4;
	let blendMode = 'normal';
	let verticalPlacement = 'bottom';
	let horizontalPlacement = 'left';
	let paddingPx = 24;
	let selectedId = null;
	let dragActive = false;
	let watermarkImgEl = null;

	$: selectedImage = images.find((img) => img.id === selectedId) ?? images[0] ?? null;

	// For preview, % is interpreted relative to 600px preview height so it matches export scale
	$: textPreviewFontSize =
		watermarkTextSizeUnit === '%'
			? `${(600 * watermarkTextSize) / 100}px`
			: `${watermarkTextSize}px`;

	function addFiles(fileList) {
		if (!fileList?.length) return;
		const newImages = [];
		for (const file of fileList) {
			if (!file.type.startsWith('image/')) continue;
			const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
			newImages.push({ id, file, objectUrl: URL.createObjectURL(file) });
		}
		images = [...images, ...newImages];
		if (newImages.length && !selectedId) selectedId = newImages[0].id;
		else if (newImages.length && !images.find((i) => i.id === selectedId))
			selectedId = images[0].id;
	}

	function removeImage(id) {
		const img = images.find((i) => i.id === id);
		if (img) URL.revokeObjectURL(img.objectUrl);
		images = images.filter((i) => i.id !== id);
		if (selectedId === id) selectedId = images[0]?.id ?? null;
	}

	function clearAll() {
		images.forEach((img) => URL.revokeObjectURL(img.objectUrl));
		images = [];
		selectedId = null;
	}

	function handleDrop(e) {
		e.preventDefault();
		dragActive = false;
		addFiles(Array.from(e.dataTransfer?.files ?? []));
	}

	function handleDragover(e) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragleave() {
		dragActive = false;
	}

	function triggerFileInput() {
		fileInput?.click();
	}

	function handleFileChange(e) {
		addFiles(Array.from(e.target?.files ?? []));
		e.target.value = '';
	}

	function getWatermarkWrapperStyle() {
		const pad = `${paddingPx}px`;
		const parts = [
			'position: absolute',
			'display: flex',
			'align-items: center',
			'justify-content: center',
			'pointer-events: none'
		];
		if (verticalPlacement === 'top') parts.push(`top: ${pad}`);
		else if (verticalPlacement === 'bottom') parts.push(`bottom: ${pad}`);
		else parts.push('top: 50%');
		if (horizontalPlacement === 'left') parts.push(`left: ${pad}`);
		else if (horizontalPlacement === 'right') parts.push(`right: ${pad}`);
		else parts.push('left: 50%');
		const tx = horizontalPlacement === 'center' ? '-50%' : '0';
		const ty = verticalPlacement === 'center' ? '-50%' : '0';
		parts.push(`transform: translate(${tx}, ${ty})`);
		return parts.join('; ');
	}

	function drawWatermarkedCanvas(sourceImg, watermarkImg, canvas) {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const w = sourceImg.naturalWidth;
		const h = sourceImg.naturalHeight;
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(sourceImg, 0, 0);

		const maxWmWidth = Math.floor(w * 0.3);
		const maxWmHeight = Math.floor(h * 0.2);
		let wmW = watermarkImg.naturalWidth;
		let wmH = watermarkImg.naturalHeight;
		if (wmW > maxWmWidth || wmH > maxWmHeight) {
			const scale = Math.min(maxWmWidth / wmW, maxWmHeight / wmH);
			wmW = Math.floor(wmW * scale);
			wmH = Math.floor(wmH * scale);
		}

		let x = paddingPx;
		if (horizontalPlacement === 'center') x = (w - wmW) / 2;
		else if (horizontalPlacement === 'right') x = w - wmW - paddingPx;

		let y = paddingPx;
		if (verticalPlacement === 'center') y = (h - wmH) / 2;
		else if (verticalPlacement === 'bottom') y = h - wmH - paddingPx;

		ctx.globalAlpha = opacity;
		ctx.globalCompositeOperation = blendMode;
		ctx.drawImage(watermarkImg, x, y, wmW, wmH);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
	}

	function drawTextWatermarkedCanvas(sourceImg, canvas) {
		const ctx = canvas.getContext('2d');
		if (!ctx || !watermarkText.trim()) return;
		const w = sourceImg.naturalWidth;
		const h = sourceImg.naturalHeight;
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(sourceImg, 0, 0);

		const fontSizePx =
			watermarkTextSizeUnit === '%' ? Math.round((h * watermarkTextSize) / 100) : watermarkTextSize;
		ctx.font = `${fontSizePx}px ${watermarkTextFont}`;
		ctx.textAlign =
			horizontalPlacement === 'center'
				? 'center'
				: horizontalPlacement === 'right'
					? 'right'
					: 'left';
		ctx.textBaseline =
			verticalPlacement === 'center' ? 'middle' : verticalPlacement === 'bottom' ? 'bottom' : 'top';
		ctx.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
		ctx.strokeStyle = 'rgba(0, 0, 0, ' + opacity * 0.5 + ')';
		ctx.lineWidth = Math.max(1, Math.floor(fontSizePx / 20));

		let x = paddingPx;
		if (horizontalPlacement === 'center') x = w / 2;
		else if (horizontalPlacement === 'right') x = w - paddingPx;

		let y = paddingPx;
		if (verticalPlacement === 'center') y = h / 2;
		else if (verticalPlacement === 'bottom') y = h - paddingPx;

		ctx.strokeText(watermarkText, x, y);
		ctx.fillText(watermarkText, x, y);
	}

	function loadImage(src, crossOrigin = false) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			if (crossOrigin) img.crossOrigin = 'anonymous';
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	function hasWatermark() {
		if (watermarkType === 'image') return !!watermarkUrl;
		return !!watermarkText.trim();
	}

	async function downloadOne(item) {
		if (!item || !hasWatermark()) return;
		try {
			const sourceImg = await loadImage(item.objectUrl);
			const canvas = document.createElement('canvas');
			if (watermarkType === 'image') {
				const watermarkImg = await loadImage(watermarkUrl, true);
				drawWatermarkedCanvas(sourceImg, watermarkImg, canvas);
			} else {
				drawTextWatermarkedCanvas(sourceImg, canvas);
			}
			const name = item.file.name.replace(/\.[^/.]+$/, '') || 'image';
			const a = document.createElement('a');
			a.download = `watermarked-${name}.png`;
			a.href = canvas.toDataURL('image/png');
			a.click();
		} catch (e) {
			console.error(e);
			alert(
				watermarkType === 'image'
					? 'Download failed. If the watermark is from another domain, it may be blocked by CORS.'
					: 'Download failed.'
			);
		}
	}

	async function downloadAll() {
		if (!images.length || !hasWatermark()) return;
		for (const item of images) {
			await downloadOne(item);
		}
	}

	onDestroy(() => {
		images.forEach((img) => URL.revokeObjectURL(img.objectUrl));
	});
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGJumpTo />

	<JDGContentBoxFloating title="NPM + GitHub Version Sync">
		<JDGBodyCopy paddingTop="0" textAlign="center">
			Backfill GitHub releases and tags to match published npm versions.
			<br />
			Run these from the repo root (no env vars needed).
			<br />
			<div class="sync-instructions">
				<div class="sync-step">
					<p class="sync-step-title"><b>1. List versions</b></p>
					<p class="sync-step-desc">npm package versions and GitHub tags (read-only):</p>
					<div class="sync-step-actions">
						<JDGButton
							label={listRunning ? 'Running…' : 'List versions'}
							faIcon="fa-list"
							onClickFunction={runListVersions}
							isEnabled={!listRunning}
							paddingLeftRight="0.65rem"
							paddingTopBottom="0.35rem"
						/>
						<div class="sync-step-or">or:<br /><code>yarn list-versions</code></div>
					</div>
					{#if listOutput}
						<pre class="sync-output">{listOutput}</pre>
					{/if}
				</div>
				<div class="sync-step">
					<p class="sync-step-title"><b>2. Preview sync</b></p>
					<p class="sync-step-desc">
						Dry run, no tags/releases created.
						<br />
						<code>--hard-limit 1</code> only considers the newest version (fast when only the latest
						is missing).
						<code>--limit 10</code> caps how many would be tagged per run.
					</p>
					<pre class="cli-block">yarn backfill
yarn backfill --hard-limit 1
yarn backfill --limit 10</pre>
				</div>
				<div class="sync-step">
					<p class="sync-step-title"><b>3. Execute sync</b></p>
					<p class="sync-step-desc">
						Create tags and releases for real.
						<br />
						<code>--hard-limit 1</code> only considers the newest version.
						<code>--limit 10</code> tags at most 10 that need it per run; next run continues with the
						next batch.
					</p>
					<pre class="cli-block">yarn backfill --execute
yarn backfill --execute --hard-limit 1
yarn backfill --execute --limit 10</pre>
				</div>
			</div>
		</JDGBodyCopy>
	</JDGContentBoxFloating>

	<JDGContentBoxFloating title="Convert Image Registry to JSON">
		<JDGBodyCopy paddingTop="0" textAlign="center">
			One-time migration: reads the imageMetaRegistry object from a JS file and writes it as
			pretty-printed JSON. Run from repo root. Defaults: <code>src/lib/image-meta-registry.js</code>
			→
			<code>src/lib/image-meta-registry.json</code>.
			<pre class="cli-block">yarn convert-image-registry-to-json
yarn convert-image-registry-to-json --input path/to/registry.js --output path/to/registry.json
yarn convert-image-registry-to-json --help</pre>
		</JDGBodyCopy>
	</JDGContentBoxFloating>

	<JDGContentBoxFloating title="Apply Watermark to Images">
		<JDGBodyCopy paddingTop="0">
			Drag and drop images or use the drop zone to add files. Set your watermark URL (e.g.
			Cloudinary), opacity, blend mode, and placement. Download a single image or all at once.
		</JDGBodyCopy>

		<div class="watermark-options">
			<JDGInputContainer label="Watermark type">
				<div class="radio-group">
					<label class="radio-label">
						<input type="radio" name="watermarkType" value="image" bind:group={watermarkType} />
						Image
					</label>
					<label class="radio-label">
						<input type="radio" name="watermarkType" value="text" bind:group={watermarkType} />
						Text
					</label>
				</div>
			</JDGInputContainer>

			{#if watermarkType === 'image'}
				<JDGInputContainer label="Watermark image URL">
					<input
						type="url"
						class="text-input"
						bind:value={watermarkUrl}
						placeholder="https://res.cloudinary.com/..."
					/>
				</JDGInputContainer>
				<JDGInputContainer label="Blend mode">
					<select class="select-input" bind:value={blendMode}>
						{#each BLEND_OPTIONS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>
			{:else}
				<JDGInputContainer label="Watermark text">
					<input
						type="text"
						class="text-input"
						bind:value={watermarkText}
						placeholder="e.g. © Your Name"
					/>
				</JDGInputContainer>
				<JDGInputContainer label="Text size">
					<div class="size-row">
						<input
							type="number"
							class="number-input"
							min="1"
							max={watermarkTextSizeUnit === '%' ? 100 : 200}
							bind:value={watermarkTextSize}
						/>
						<select class="select-input size-unit" bind:value={watermarkTextSizeUnit}>
							<option value="px">px</option>
							<option value="%">%</option>
						</select>
					</div>
				</JDGInputContainer>
				<JDGInputContainer label="Font">
					<select class="select-input" bind:value={watermarkTextFont}>
						{#each WATERMARK_FONTS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>
			{/if}

			<JDGInputContainer label="Opacity">
				<input
					type="range"
					class="range-input"
					min="0.1"
					max="1"
					step="0.05"
					bind:value={opacity}
				/>
				<span class="range-value">{Math.round(opacity * 100)}%</span>
			</JDGInputContainer>
			<div class="row-inputs">
				<JDGInputContainer label="Vertical">
					<select class="select-input" bind:value={verticalPlacement}>
						{#each VERTICAL_OPTIONS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>
				<JDGInputContainer label="Horizontal">
					<select class="select-input" bind:value={horizontalPlacement}>
						{#each HORIZONTAL_OPTIONS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>
				<JDGInputContainer label="Padding (px)">
					<input type="number" class="number-input" min="0" max="200" bind:value={paddingPx} />
				</JDGInputContainer>
			</div>
		</div>

		<div
			class="drop-zone"
			class:active={dragActive}
			role="button"
			tabindex="0"
			on:click={triggerFileInput}
			on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
			on:drop={handleDrop}
			on:dragover={handleDragover}
			on:dragleave={handleDragleave}
		>
			<span>Drop images here or click to browse</span>
		</div>
		<input
			type="file"
			accept="image/*"
			multiple
			style="display: none;"
			bind:this={fileInput}
			on:change={handleFileChange}
		/>

		{#if images.length > 0}
			<div class="actions-bar">
				<JDGButton
					label="Download current"
					faIcon="fa-download"
					onClickFunction={() => downloadOne(selectedImage)}
					isEnabled={!!selectedImage && hasWatermark()}
					isPrimary={true}
				/>
				<JDGButton
					label="Download all"
					faIcon="fa-download"
					onClickFunction={downloadAll}
					isEnabled={hasWatermark()}
					isPrimary={false}
				/>
				<JDGButton
					label="Clear all"
					faIcon="fa-trash"
					onClickFunction={clearAll}
					isPrimary={false}
				/>
			</div>

			<div class="thumb-strip">
				{#each images as img (img.id)}
					<button
						class="thumb"
						class:selected={selectedId === img.id}
						type="button"
						on:click|stopPropagation={() => (selectedId = img.id)}
					>
						<img src={img.objectUrl} alt="" />
						<button
							class="thumb-remove"
							type="button"
							aria-label="Remove"
							on:click|stopPropagation={() => removeImage(img.id)}>×</button
						>
					</button>
				{/each}
			</div>

			{#if selectedImage}
				<div class="preview-wrapper">
					<div class="preview-inner" style="position: relative;">
						<img class="preview-base" src={selectedImage.objectUrl} alt="Preview" />
						{#if watermarkType === 'image' && watermarkUrl}
							<div class="watermark-wrapper" style={getWatermarkWrapperStyle()}>
								<img
									bind:this={watermarkImgEl}
									class="watermark-img"
									style="opacity: {opacity}; mix-blend-mode: {blendMode}; max-width: 30%; max-height: 20%; object-fit: contain;"
									src={watermarkUrl}
									alt="Watermark"
								/>
							</div>
						{:else if watermarkType === 'text' && watermarkText}
							<div
								class="watermark-wrapper watermark-text-preview"
								style={getWatermarkWrapperStyle()}
							>
								<span
									class="watermark-text"
									style="opacity: {opacity}; font-family: {watermarkTextFont}; font-size: {textPreviewFontSize}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
								>
									{watermarkText}
								</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</JDGContentBoxFloating>
</JDGContentContainer>

<style>
	.sync-instructions {
		text-align: center;
		max-width: 32em;
		margin: 1rem auto;
	}
	.sync-step {
		margin-top: 1rem;
	}
	.sync-step:first-child {
		margin-top: 0;
	}
	.sync-step-title {
		margin: 0;
	}
	.sync-step-desc {
		margin: 0.25rem 0 0;
		font-size: 0.95em;
	}
	.sync-step-actions {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.5rem 1rem;
		margin-top: 0.5rem;
	}
	.sync-step-or {
		font-size: 0.9em;
		color: var(--jdg-text-secondary, #666);
	}
	.sync-step-or code {
		background: var(--jdg-bg-secondary, #f5f5f5);
		padding: 0.1rem 0.3rem;
		border-radius: 4px;
	}
	.sync-output {
		text-align: left;
		white-space: pre-wrap;
		word-break: break-word;
		max-height: 400px;
		overflow: auto;
		font-size: 0.85rem;
		background: var(--jdg-bg-secondary, #f5f5f5);
		padding: 1rem;
		border-radius: 6px;
		margin: 0.5rem auto 0;
		display: block;
		width: 100%;
		max-width: 32em;
		box-sizing: border-box;
	}
	.cli-block {
		text-align: left;
		background: var(--jdg-bg-secondary, #f5f5f5);
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.9rem;
		overflow-x: auto;
		margin: 0.5rem auto 0;
		display: block;
		width: fit-content;
		min-width: 18em;
	}

	.watermark-options {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin-bottom: 1rem;
	}
	.radio-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.radio-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		cursor: pointer;
		font-weight: normal;
	}
	.size-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.size-row .number-input {
		width: 5rem;
	}
	.size-unit {
		width: 4rem;
	}
	.watermark-text-preview {
		white-space: nowrap;
	}
	.watermark-text {
		white-space: nowrap;
	}
	.row-inputs {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.text-input,
	.select-input,
	.number-input {
		width: 100%;
		min-width: 0;
		padding: 0.4rem 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.number-input {
		width: 5rem;
	}
	.range-input {
		vertical-align: middle;
		width: 12rem;
		margin-right: 0.5rem;
	}
	.range-value {
		font-size: 0.9rem;
		color: #555;
	}

	.drop-zone {
		border: 2px dashed #999;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		background: #f8f8f8;
		transition:
			background 0.15s,
			border-color 0.15s;
	}
	.drop-zone:hover,
	.drop-zone.active {
		background: #eee;
		border-color: #0b84cb;
	}

	.actions-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1rem;
		margin-bottom: 0.75rem;
	}

	.thumb-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.thumb {
		position: relative;
		width: 64px;
		height: 64px;
		padding: 0;
		border: 2px solid transparent;
		border-radius: 4px;
		overflow: hidden;
		background: #eee;
		cursor: pointer;
	}
	.thumb.selected {
		border-color: #0b84cb;
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.thumb-remove {
		position: absolute;
		top: 2px;
		right: 2px;
		width: 20px;
		height: 20px;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.thumb-remove:hover {
		background: #c00;
	}

	.preview-wrapper {
		margin-top: 1rem;
		height: 600px;
		max-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f0f0f0;
	}
	.preview-inner {
		position: relative;
		max-height: 100%;
		max-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.preview-base {
		display: block;
		max-height: 600px;
		max-width: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}
	.watermark-wrapper {
		position: absolute;
	}
	.watermark-img {
		display: block;
	}
</style>
