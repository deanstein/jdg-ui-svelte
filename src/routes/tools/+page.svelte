<script>
	import { onDestroy } from 'svelte';
	import { listPackageVersions } from '$lib/tools/list-versions/list-package-versions-client.js';
	import { allowTextSelection } from '$lib/stores/jdg-ui-store.js';
	import imageMetaRegistry from '../image-meta-registry.js';
	import { addCloudinaryUrlWidth, isUrlCloudinary } from '$lib/jdg-utils.js';
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
	/** Preview + export: upscale photos smaller than this (short side px) for crisp watermarks. */
	const WATERMARK_MIN_SHORT_SIDE = 600;
	/** After upscale, clamp so one edge does not exceed this (memory / browser limits). */
	const WATERMARK_EXPORT_MAX_LONG_SIDE = 10000;

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
	let watermarkType = 'image+text'; // 'image' | 'text' | 'image+text'
	let watermarkUrl = defaultWatermarkUrl;
	let watermarkText = 'Englewood Public Library';
	let watermarkTextSize = 1.5;
	let watermarkTextSizeUnit = '%'; // 'px' | '%'
	let watermarkTextFont = 'REM';
	let logoOpacity = 0.6;
	let textOpacity = 0.5;
	let blendMode = 'normal';
	let logoOutline = true;
	let logoShadowBlur = 4; // px at ~600px reference; scales with export
	let logoShadowOpacity = 60; // 0–100
	let logoShadowOffsetX = 0; // px at reference
	let logoShadowOffsetY = 0;
	/** 1 = single soft shadow; 2–3 = stacked (reads stronger on flat / one-color PNGs). */
	let logoShadowLayers = 2;
	/** Text drop shadow (same canvas/CSS behavior as logo, independent knobs). */
	let textOutline = true;
	let textShadowBlur = 4;
	let textShadowOpacity = 60;
	let textShadowOffsetX = 0;
	let textShadowOffsetY = 0;
	let verticalPlacement = 'bottom';
	let horizontalPlacement = 'left';
	/** Inset from image edge; % is of image height (same basis as logo/text size). */
	let paddingSize = 1.25;
	let paddingSizeUnit = '%'; // 'px' | '%'
	let watermarkImageSize = 2.25;
	let watermarkImageSizeUnit = '%'; // 'px' | '%'
	let watermarkDivider = ' | ';
	let comboGapPx = 5; // padding between logo, divider, and text for Image + text
	/** Inline style for the preview overlay; kept in sync via reactive block below. */
	let watermarkWrapperStyle = '';
	let selectedId = null;
	let dragActive = false;
	let watermarkImgEl = null;
	let previewBaseRef = null;
	let previewImageHeight = 600; // fallback until we measure
	let previewNaturalDims = { w: 0, h: 0 };
	let resizeObserver = null;

	$: selectedImage = images.find((img) => img.id === selectedId) ?? images[0] ?? null;
	$: selectedId, (previewNaturalDims = { w: 0, h: 0 });
	// Reset when image changes so we recalc when new image is measured
	$: selectedImage && (previewImageHeight = 600);

	$: previewBaseDisplayStyle = (() => {
		const nw = previewNaturalDims.w;
		const nh = previewNaturalDims.h;
		if (!nw || !nh) {
			return `max-height: ${WATERMARK_MIN_SHORT_SIDE}px; max-width: 100%; width: auto; height: auto;`;
		}
		const minSide = Math.min(nw, nh);
		if (minSide >= WATERMARK_MIN_SHORT_SIDE) {
			return `max-height: ${WATERMARK_MIN_SHORT_SIDE}px; max-width: 100%; width: auto; height: auto;`;
		}
		const scale = WATERMARK_MIN_SHORT_SIDE / minSide;
		return `width: ${Math.round(nw * scale)}px; height: ${Math.round(
			nh * scale
		)}px; max-width: none; max-height: none;`;
	})();

	function updatePreviewImageHeight() {
		if (previewBaseRef) {
			const h = previewBaseRef.getBoundingClientRect().height;
			if (h > 0) previewImageHeight = h;
		}
	}

	function handlePreviewImageLoad() {
		if (previewBaseRef) {
			previewNaturalDims = {
				w: previewBaseRef.naturalWidth,
				h: previewBaseRef.naturalHeight
			};
		}
		// Read height after layout: load fires before layout is final, so defer
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				updatePreviewImageHeight();
				// Keep height in sync when preview resizes (e.g. window resize)
				if (previewBaseRef && resizeObserver) resizeObserver.disconnect();
				if (previewBaseRef) {
					resizeObserver = new ResizeObserver(updatePreviewImageHeight);
					resizeObserver.observe(previewBaseRef);
				}
			});
		});
	}

	// Image preview: when unit is %, use % of actual displayed preview image height
	$: imagePreviewMaxSize =
		watermarkImageSizeUnit === '%'
			? `${((previewImageHeight || 600) * watermarkImageSize) / 100}px`
			: `${watermarkImageSize}px`;

	// Placement + padding: depend on these reads so the preview updates as you type (not only
	// when vars happen to appear syntactically outside getWatermarkWrapperStyle).
	$: {
		paddingSize;
		paddingSizeUnit;
		previewImageHeight;
		verticalPlacement;
		horizontalPlacement;
		watermarkWrapperStyle = getWatermarkWrapperStyle();
	}
	function scaleRefPx(px, ref = 600) {
		const side = previewImageHeight || 600;
		return Math.max(0.25, (px * side) / ref);
	}

	$: logoShadowA = logoShadowOpacity / 100;
	function buildLogoImgDropShadowFilter() {
		const ox = scaleRefPx(logoShadowOffsetX);
		const oy = scaleRefPx(logoShadowOffsetY);
		const b = Math.max(0.5, scaleRefPx(logoShadowBlur));
		const a = logoShadowA;
		if (logoShadowLayers <= 1) {
			return `drop-shadow(${ox}px ${oy}px ${b}px rgba(0,0,0,${a}))`;
		}
		if (logoShadowLayers === 2) {
			return [
				`drop-shadow(${ox}px ${oy}px ${Math.max(0.5, b * 0.32)}px rgba(0,0,0,${Math.min(
					1,
					a * 1.2
				)}))`,
				`drop-shadow(${ox}px ${oy}px ${b}px rgba(0,0,0,${a * 0.78}))`
			].join(' ');
		}
		return [
			`drop-shadow(${ox}px ${oy}px ${Math.max(0.5, b * 0.26)}px rgba(0,0,0,${Math.min(
				1,
				a * 1.25
			)}))`,
			`drop-shadow(${ox}px ${oy}px ${Math.max(0.7, b * 0.52)}px rgba(0,0,0,${a * 0.92}))`,
			`drop-shadow(${ox}px ${oy}px ${Math.max(1, b * 1.2)}px rgba(0,0,0,${a * 0.42}))`
		].join(' ');
	}
	// No filter when shadow opacity 0 — drop-shadow(..., rgba(0,0,0,0)) still paints a halo in some browsers.
	$: watermarkImgFilter =
		logoOutline && Number(logoOpacity) > 0 && logoShadowOpacity > 0
			? buildLogoImgDropShadowFilter()
			: 'none';

	$: textShadowA = textShadowOpacity / 100;
	$: textWatermarkFilter =
		textOutline && Number(textOpacity) > 0 && textShadowOpacity > 0
			? `drop-shadow(${scaleRefPx(textShadowOffsetX)}px ${scaleRefPx(
					textShadowOffsetY
				)}px ${Math.max(0.5, scaleRefPx(textShadowBlur))}px rgba(0,0,0,${textShadowA}))`
			: 'none';

	// Text % matches displayed image height (same basis as logo %) so preview stays proportional
	$: textPreviewFontSize =
		watermarkTextSizeUnit === '%'
			? `${((previewImageHeight || 600) * watermarkTextSize) / 100}px`
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

	function sourcePixelSize(img) {
		const w = img.naturalWidth || img.width;
		const h = img.naturalHeight || img.height;
		return { w, h };
	}

	/**
	 * Canvas drawn at least WATERMARK_MIN_SHORT_SIDE on the short side (same basis as preview).
	 */
	function upscaledSourceForExport(sourceImg) {
		const { w, h } = sourcePixelSize(sourceImg);
		if (!w || !h) return sourceImg;
		const minSide = Math.min(w, h);
		if (minSide >= WATERMARK_MIN_SHORT_SIDE) return sourceImg;
		let outW = Math.max(1, Math.round((w * WATERMARK_MIN_SHORT_SIDE) / minSide));
		let outH = Math.max(1, Math.round((h * WATERMARK_MIN_SHORT_SIDE) / minSide));
		const longSide = Math.max(outW, outH);
		if (longSide > WATERMARK_EXPORT_MAX_LONG_SIDE) {
			const r = WATERMARK_EXPORT_MAX_LONG_SIDE / longSide;
			outW = Math.max(1, Math.round(outW * r));
			outH = Math.max(1, Math.round(outH * r));
		}
		const c = document.createElement('canvas');
		c.width = outW;
		c.height = outH;
		const x = c.getContext('2d');
		if (!x) return sourceImg;
		x.imageSmoothingEnabled = true;
		x.imageSmoothingQuality = 'high';
		x.drawImage(sourceImg, 0, 0, outW, outH);
		return c;
	}

	/** Canvas: stack shadow passes. Shadow alpha × watermarkOpacity so export matches Opacity slider. */
	function drawLogoShadowPassesCanvas(ctx, minSide, img, ix, iy, iw, ih, watermarkOpacity) {
		if (!logoOutline || logoShadowOpacity <= 0) return;
		const ref = WATERMARK_MIN_SHORT_SIDE;
		const ox = (logoShadowOffsetX * minSide) / ref;
		const oy = (logoShadowOffsetY * minSide) / ref;
		const baseBlur = (logoShadowBlur * minSide) / ref;
		const baseA = logoShadowOpacity / 100;
		const o = Math.max(0, Math.min(1, watermarkOpacity));
		const layers =
			logoShadowLayers <= 1
				? [{ blur: Math.max(0.5, baseBlur), alpha: baseA * o }]
				: logoShadowLayers === 2
					? [
							{ blur: Math.max(0.5, baseBlur * 0.32), alpha: Math.min(1, baseA * 1.2) * o },
							{ blur: Math.max(1, baseBlur), alpha: baseA * 0.78 * o }
						]
					: [
							{ blur: Math.max(0.5, baseBlur * 0.26), alpha: Math.min(1, baseA * 1.25) * o },
							{ blur: Math.max(0.7, baseBlur * 0.52), alpha: baseA * 0.92 * o },
							{ blur: Math.max(1, baseBlur * 1.2), alpha: baseA * 0.42 * o }
						];
		for (const L of layers) {
			ctx.shadowBlur = L.blur;
			ctx.shadowColor = `rgba(0, 0, 0, ${L.alpha})`;
			ctx.shadowOffsetX = ox;
			ctx.shadowOffsetY = oy;
			ctx.globalAlpha = 0;
			ctx.drawImage(img, ix, iy, iw, ih);
		}
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
	}

	/** Same pixel inset on horizontal and vertical axes from placement (preview or full-res `h`). */
	function getPaddingPxFromImageHeight(imageHeightPx) {
		const hPx = Number(imageHeightPx);
		if (!Number.isFinite(hPx) || hPx <= 0) return 0;
		const raw = Number(paddingSize);
		const n = Number.isFinite(raw) ? raw : 0;
		if (paddingSizeUnit === '%') {
			return Math.max(0, Math.round((hPx * n) / 100));
		}
		return Math.max(0, Math.round(n));
	}

	function getWatermarkWrapperStyle() {
		const pad = `${getPaddingPxFromImageHeight(previewImageHeight || 600)}px`;
		const align =
			verticalPlacement === 'top'
				? 'flex-start'
				: verticalPlacement === 'bottom'
					? 'flex-end'
					: 'center';
		const justify =
			horizontalPlacement === 'left'
				? 'flex-start'
				: horizontalPlacement === 'right'
					? 'flex-end'
					: 'center';
		const parts = [
			'position: absolute',
			'display: flex',
			`align-items: ${align}`,
			`justify-content: ${justify}`,
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
		const { w, h } = sourcePixelSize(sourceImg);
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(sourceImg, 0, 0);

		const minSide = Math.min(w, h);
		const effectivePadding = getPaddingPxFromImageHeight(h);

		// Logo sized by height only; width follows aspect ratio (wide marks stay readable)
		const targetLogoH =
			watermarkImageSizeUnit === '%'
				? Math.floor(h * (watermarkImageSize / 100))
				: Math.min(watermarkImageSize, h);
		let wmW = watermarkImg.naturalWidth;
		let wmH = watermarkImg.naturalHeight;
		const scale = wmH > 0 ? targetLogoH / wmH : 1;
		wmW = Math.floor(wmW * scale);
		wmH = Math.floor(wmH * scale);

		let x = effectivePadding;
		if (horizontalPlacement === 'center') x = (w - wmW) / 2;
		else if (horizontalPlacement === 'right') x = w - wmW - effectivePadding;

		let y = effectivePadding;
		if (verticalPlacement === 'center') y = (h - wmH) / 2;
		else if (verticalPlacement === 'bottom') y = h - wmH - effectivePadding;

		// High-quality scaling when drawing the logo (avoids pixelation)
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';

		const fillA = Number.isFinite(Number(logoOpacity))
			? Math.max(0, Math.min(1, Number(logoOpacity)))
			: 0.4;
		ctx.save();
		if (logoOutline) {
			drawLogoShadowPassesCanvas(ctx, Math.min(w, h), watermarkImg, x, y, wmW, wmH, fillA);
		}
		// Now draw the logo once at the user's opacity (no previous full-opacity draw under it)
		ctx.globalAlpha = fillA;
		// Canvas uses 'source-over' for normal blending; 'normal' is CSS-only and would be ignored
		ctx.globalCompositeOperation = blendMode === 'normal' ? 'source-over' : blendMode;
		ctx.drawImage(watermarkImg, x, y, wmW, wmH);
		ctx.restore();
	}

	/** Same soft drop shadow as logo: invisible fill so only shadow renders. */
	function drawTextShadowPass(ctx, minSide, drawTexts, textFillOpacity = 1) {
		if (!textOutline || textShadowOpacity <= 0) return;
		const o = Math.max(0, Math.min(1, textFillOpacity));
		ctx.save();
		ctx.shadowBlur = Math.max(0.5, (textShadowBlur * minSide) / WATERMARK_MIN_SHORT_SIDE);
		ctx.shadowColor = `rgba(0, 0, 0, ${(textShadowOpacity / 100) * o})`;
		ctx.shadowOffsetX = (textShadowOffsetX * minSide) / WATERMARK_MIN_SHORT_SIDE;
		ctx.shadowOffsetY = (textShadowOffsetY * minSide) / WATERMARK_MIN_SHORT_SIDE;
		ctx.globalAlpha = 0;
		ctx.fillStyle = '#ffffff';
		drawTexts();
		ctx.restore();
	}

	function drawTextWatermarkedCanvas(sourceImg, canvas) {
		const ctx = canvas.getContext('2d');
		if (!ctx || !watermarkText.trim()) return;
		const { w, h } = sourcePixelSize(sourceImg);
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(sourceImg, 0, 0);

		const minSide = Math.min(w, h);
		const effectivePadding = getPaddingPxFromImageHeight(h);

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
		const safeAlpha = Number.isFinite(Number(textOpacity))
			? Math.max(0, Math.min(1, Number(textOpacity)))
			: 0.4;

		let x = effectivePadding;
		if (horizontalPlacement === 'center') x = w / 2;
		else if (horizontalPlacement === 'right') x = w - effectivePadding;

		let y = effectivePadding;
		if (verticalPlacement === 'center') y = h / 2;
		else if (verticalPlacement === 'bottom') y = h - effectivePadding;

		drawTextShadowPass(ctx, minSide, () => ctx.fillText(watermarkText, x, y), safeAlpha);
		ctx.fillStyle = 'rgba(255, 255, 255, ' + safeAlpha + ')';
		ctx.fillText(watermarkText, x, y);
	}

	function drawImageTextWatermarkedCanvas(sourceImg, watermarkImg, canvas) {
		const ctx = canvas.getContext('2d');
		if (!ctx || !watermarkUrl || !watermarkText.trim()) return;
		const { w, h } = sourcePixelSize(sourceImg);
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(sourceImg, 0, 0);

		const minSide = Math.min(w, h);
		const effectivePadding = getPaddingPxFromImageHeight(h);
		const effectiveComboGap = Math.max(
			2,
			Math.round((comboGapPx * minSide) / WATERMARK_MIN_SHORT_SIDE)
		);

		// Logo sized by height only (same as image-only export)
		const targetLogoH =
			watermarkImageSizeUnit === '%'
				? Math.floor(h * (watermarkImageSize / 100))
				: Math.min(watermarkImageSize, h);
		let wmW = watermarkImg.naturalWidth;
		let wmH = watermarkImg.naturalHeight;
		const scale = wmH > 0 ? targetLogoH / wmH : 1;
		wmW = Math.floor(wmW * scale);
		wmH = Math.floor(wmH * scale);

		const fontSizePx =
			watermarkTextSizeUnit === '%' ? Math.round((h * watermarkTextSize) / 100) : watermarkTextSize;
		ctx.font = `${fontSizePx}px ${watermarkTextFont}`;
		const dividerWidth = ctx.measureText(watermarkDivider).width;
		const textWidth = ctx.measureText(watermarkText).width;
		const rowWidth = wmW + effectiveComboGap + dividerWidth + effectiveComboGap + textWidth;
		const rowHeight = Math.max(wmH, fontSizePx * 1.2);

		let startX = effectivePadding;
		if (horizontalPlacement === 'center') startX = (w - rowWidth) / 2;
		else if (horizontalPlacement === 'right') startX = w - rowWidth - effectivePadding;

		let startY = effectivePadding;
		if (verticalPlacement === 'center') startY = (h - rowHeight) / 2;
		else if (verticalPlacement === 'bottom') startY = h - rowHeight - effectivePadding;

		const logoY = startY + (rowHeight - wmH) / 2;
		// Use the logo's vertical center so image and text sit on the same horizontal line
		const centerY = logoY + wmH / 2;

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		const logoA = Number.isFinite(Number(logoOpacity))
			? Math.max(0, Math.min(1, Number(logoOpacity)))
			: 0.4;
		const textA = Number.isFinite(Number(textOpacity))
			? Math.max(0, Math.min(1, Number(textOpacity)))
			: 0.4;

		// Draw logo (shadow only then logo at opacity)
		ctx.save();
		if (logoOutline) {
			drawLogoShadowPassesCanvas(ctx, Math.min(w, h), watermarkImg, startX, logoY, wmW, wmH, logoA);
		}
		ctx.globalAlpha = logoA;
		ctx.globalCompositeOperation = blendMode === 'normal' ? 'source-over' : blendMode;
		ctx.drawImage(watermarkImg, startX, logoY, wmW, wmH);
		ctx.restore();

		// Draw divider and text (same style as text-only watermark)
		ctx.font = `${fontSizePx}px ${watermarkTextFont}`;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		const dividerX = startX + wmW + effectiveComboGap;
		const textX = dividerX + dividerWidth + effectiveComboGap;
		drawTextShadowPass(
			ctx,
			minSide,
			() => {
				ctx.fillText(watermarkDivider, dividerX, centerY);
				ctx.fillText(watermarkText, textX, centerY);
			},
			textA
		);
		ctx.fillStyle = 'rgba(255, 255, 255, ' + textA + ')';
		ctx.fillText(watermarkDivider, dividerX, centerY);
		ctx.fillText(watermarkText, textX, centerY);
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
		if (watermarkType === 'image+text') return !!watermarkUrl && !!watermarkText.trim();
		return !!watermarkText.trim();
	}

	async function downloadOne(item) {
		if (!item || !hasWatermark()) return;
		try {
			const sourceImg = await loadImage(item.objectUrl);
			const sourceForDraw = upscaledSourceForExport(sourceImg);
			const canvas = document.createElement('canvas');
			if (watermarkType === 'image') {
				const wmUrl = isUrlCloudinary(watermarkUrl)
					? addCloudinaryUrlWidth(watermarkUrl, 800)
					: watermarkUrl;
				const watermarkImg = await loadImage(wmUrl, true);
				drawWatermarkedCanvas(sourceForDraw, watermarkImg, canvas);
			} else if (watermarkType === 'image+text') {
				const wmUrl = isUrlCloudinary(watermarkUrl)
					? addCloudinaryUrlWidth(watermarkUrl, 800)
					: watermarkUrl;
				const watermarkImg = await loadImage(wmUrl, true);
				drawImageTextWatermarkedCanvas(sourceForDraw, watermarkImg, canvas);
			} else {
				drawTextWatermarkedCanvas(sourceForDraw, canvas);
			}
			const baseName = item.file.name.replace(/\.[^/.]+$/, '') || 'image';
			const a = document.createElement('a');
			a.download = `${baseName}_watermark.png`;
			a.href = canvas.toDataURL('image/png');
			a.click();
		} catch (e) {
			console.error(e);
			alert(
				watermarkType === 'image' || watermarkType === 'image+text'
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
		resizeObserver?.disconnect();
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
			Cloudinary), logo/text opacity, blend mode, and placement. Download a single image or all at
			once.
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
					<label class="radio-label">
						<input
							type="radio"
							name="watermarkType"
							value="image+text"
							bind:group={watermarkType}
						/>
						Image + text
					</label>
				</div>
			</JDGInputContainer>

			{#if watermarkType === 'image'}
				<JDGInputContainer label="Logo opacity">
					<input
						type="range"
						class="range-input"
						min="0"
						max="1"
						step="0.05"
						bind:value={logoOpacity}
					/>
					<span class="range-value">{Math.round(logoOpacity * 100)}%</span>
				</JDGInputContainer>
				<JDGInputContainer label="Watermark image URL">
					<input
						type="url"
						class="text-input"
						bind:value={watermarkUrl}
						placeholder="https://res.cloudinary.com/..."
					/>
				</JDGInputContainer>
				<JDGInputContainer label="Logo size">
					<div class="size-row">
						<input
							type="number"
							class="number-input"
							min="1"
							max={watermarkImageSizeUnit === '%' ? 100 : 800}
							step={watermarkImageSizeUnit === '%' ? 0.01 : 1}
							bind:value={watermarkImageSize}
						/>
						<select class="select-input size-unit" bind:value={watermarkImageSizeUnit}>
							<option value="%">%</option>
							<option value="px">px</option>
						</select>
						{#if watermarkImageSizeUnit === '%'}
							<span class="size-suffix">of image height</span>
						{/if}
					</div>
					{#if watermarkImageSizeUnit === 'px'}
						<span class="size-hint">Target logo height; width follows aspect ratio</span>
					{/if}
				</JDGInputContainer>
				<JDGInputContainer label="Blend mode">
					<select class="select-input" bind:value={blendMode}>
						{#each BLEND_OPTIONS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>
				<JDGH3H4
					h3String="Logo shadow"
					h4String="Drop shadow around the mark"
					paddingTop="0.5rem"
					paddingBottom="0.85rem"
				/>
				<JDGInputContainer label="Enable logo outline">
					<label class="radio-label">
						<input type="checkbox" bind:checked={logoOutline} />
						Drop shadow (reads as outline on light photos)
					</label>
				</JDGInputContainer>
				{#if logoOutline}
					<JDGInputContainer label="Blur / spread (ref. 600px edge)">
						<input
							type="range"
							class="range-input"
							min="0"
							max="28"
							step="0.5"
							bind:value={logoShadowBlur}
						/>
						<span class="range-value">{logoShadowBlur}px</span>
					</JDGInputContainer>
					<JDGInputContainer label="Shadow opacity">
						<input
							type="range"
							class="range-input"
							min="0"
							max="100"
							step="1"
							bind:value={logoShadowOpacity}
						/>
						<span class="range-value">{logoShadowOpacity}%</span>
					</JDGInputContainer>
					<JDGInputContainer label="Shadow layers">
						<input
							type="range"
							class="range-input"
							min="1"
							max="3"
							step="1"
							bind:value={logoShadowLayers}
						/>
						<span class="range-value">{logoShadowLayers}</span>
						<span class="size-hint"
							>Stacked halos: stronger on flat / one-color PNGs. 3 = max edge.</span
						>
					</JDGInputContainer>
					<div class="row-inputs">
						<JDGInputContainer label="Offset X">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={logoShadowOffsetX}
							/>
							<span class="range-value">{logoShadowOffsetX}px</span>
						</JDGInputContainer>
						<JDGInputContainer label="Offset Y">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={logoShadowOffsetY}
							/>
							<span class="range-value">{logoShadowOffsetY}px</span>
						</JDGInputContainer>
					</div>
				{/if}
			{:else if watermarkType === 'image+text'}
				<JDGH3H4
					h3String="Logo"
					h4String="Image URL, size, and blend"
					paddingTop="0.5rem"
					paddingBottom="0.85rem"
				/>
				<JDGInputContainer label="Logo opacity">
					<input
						type="range"
						class="range-input"
						min="0"
						max="1"
						step="0.05"
						bind:value={logoOpacity}
					/>
					<span class="range-value">{Math.round(logoOpacity * 100)}%</span>
				</JDGInputContainer>
				<JDGInputContainer label="Watermark image URL">
					<input
						type="url"
						class="text-input"
						bind:value={watermarkUrl}
						placeholder="https://res.cloudinary.com/..."
					/>
				</JDGInputContainer>
				<JDGInputContainer label="Logo size">
					<div class="size-row">
						<input
							type="number"
							class="number-input"
							min="1"
							max={watermarkImageSizeUnit === '%' ? 100 : 800}
							step={watermarkImageSizeUnit === '%' ? 0.01 : 1}
							bind:value={watermarkImageSize}
						/>
						<select class="select-input size-unit" bind:value={watermarkImageSizeUnit}>
							<option value="%">%</option>
							<option value="px">px</option>
						</select>
						{#if watermarkImageSizeUnit === '%'}
							<span class="size-suffix">of image height</span>
						{/if}
					</div>
					{#if watermarkImageSizeUnit === 'px'}
						<span class="size-hint">Target logo height; width follows aspect ratio</span>
					{/if}
				</JDGInputContainer>
				<JDGInputContainer label="Blend mode">
					<select class="select-input" bind:value={blendMode}>
						{#each BLEND_OPTIONS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>

				<JDGH3H4
					h3String="Logo shadow"
					h4String="Drop shadow around the logo"
					paddingTop="0.75rem"
					paddingBottom="0.85rem"
				/>
				<JDGInputContainer label="Enable logo outline">
					<label class="radio-label">
						<input type="checkbox" bind:checked={logoOutline} />
						Drop shadow around the logo
					</label>
				</JDGInputContainer>
				{#if logoOutline}
					<JDGInputContainer label="Blur / spread (scales with image)">
						<input
							type="range"
							class="range-input"
							min="0"
							max="28"
							step="0.5"
							bind:value={logoShadowBlur}
						/>
						<span class="range-value">{logoShadowBlur}px</span>
					</JDGInputContainer>
					<JDGInputContainer label="Shadow opacity">
						<input
							type="range"
							class="range-input"
							min="0"
							max="100"
							step="1"
							bind:value={logoShadowOpacity}
						/>
						<span class="range-value">{logoShadowOpacity}%</span>
					</JDGInputContainer>
					<JDGInputContainer label="Shadow layers">
						<input
							type="range"
							class="range-input"
							min="1"
							max="3"
							step="1"
							bind:value={logoShadowLayers}
						/>
						<span class="range-value">{logoShadowLayers}</span>
						<span class="size-hint"
							>Stacked halos: stronger on flat / one-color PNGs. 3 = max edge.</span
						>
					</JDGInputContainer>
					<div class="row-inputs">
						<JDGInputContainer label="Offset X">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={logoShadowOffsetX}
							/>
							<span class="range-value">{logoShadowOffsetX}px</span>
						</JDGInputContainer>
						<JDGInputContainer label="Offset Y">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={logoShadowOffsetY}
							/>
							<span class="range-value">{logoShadowOffsetY}px</span>
						</JDGInputContainer>
					</div>
				{/if}

				<JDGH3H4
					h3String="Text & divider"
					h4String="Copy, typography, spacing"
					paddingTop="1rem"
					paddingBottom="0.85rem"
				/>
				<JDGInputContainer label="Text opacity">
					<input
						type="range"
						class="range-input"
						min="0"
						max="1"
						step="0.05"
						bind:value={textOpacity}
					/>
					<span class="range-value">{Math.round(textOpacity * 100)}%</span>
				</JDGInputContainer>
				<JDGInputContainer label="Watermark text">
					<input
						type="text"
						class="text-input"
						bind:value={watermarkText}
						placeholder="e.g. The Cinderella City Project"
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
						{#if watermarkTextSizeUnit === '%'}
							<span class="size-suffix">of image height</span>
						{/if}
					</div>
				</JDGInputContainer>
				<JDGInputContainer label="Font">
					<select class="select-input" bind:value={watermarkTextFont}>
						{#each WATERMARK_FONTS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>
				<JDGInputContainer label="Divider">
					<input
						type="text"
						class="text-input divider-input"
						bind:value={watermarkDivider}
						placeholder=" | "
					/>
				</JDGInputContainer>
				<JDGInputContainer label="Gap between logo, divider, and text (px)">
					<input type="number" class="number-input" min="0" max="60" bind:value={comboGapPx} />
				</JDGInputContainer>

				<JDGH3H4
					h3String="Text shadow"
					h4String="Independent from logo contrast"
					paddingTop="0.75rem"
					paddingBottom="0.85rem"
				/>
				<JDGInputContainer label="Enable text shadow">
					<label class="radio-label">
						<input type="checkbox" bind:checked={textOutline} />
						Drop shadow behind divider and text
					</label>
				</JDGInputContainer>
				{#if textOutline}
					<JDGInputContainer label="Blur / spread (scales with image)">
						<input
							type="range"
							class="range-input"
							min="0"
							max="28"
							step="0.5"
							bind:value={textShadowBlur}
						/>
						<span class="range-value">{textShadowBlur}px</span>
					</JDGInputContainer>
					<JDGInputContainer label="Shadow opacity">
						<input
							type="range"
							class="range-input"
							min="0"
							max="100"
							step="1"
							bind:value={textShadowOpacity}
						/>
						<span class="range-value">{textShadowOpacity}%</span>
					</JDGInputContainer>
					<div class="row-inputs">
						<JDGInputContainer label="Offset X">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={textShadowOffsetX}
							/>
							<span class="range-value">{textShadowOffsetX}px</span>
						</JDGInputContainer>
						<JDGInputContainer label="Offset Y">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={textShadowOffsetY}
							/>
							<span class="range-value">{textShadowOffsetY}px</span>
						</JDGInputContainer>
					</div>
				{/if}
			{:else}
				<JDGInputContainer label="Text opacity">
					<input
						type="range"
						class="range-input"
						min="0"
						max="1"
						step="0.05"
						bind:value={textOpacity}
					/>
					<span class="range-value">{Math.round(textOpacity * 100)}%</span>
				</JDGInputContainer>
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
						{#if watermarkTextSizeUnit === '%'}
							<span class="size-suffix">of image height</span>
						{/if}
					</div>
				</JDGInputContainer>
				<JDGInputContainer label="Font">
					<select class="select-input" bind:value={watermarkTextFont}>
						{#each WATERMARK_FONTS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</JDGInputContainer>
				<JDGH3H4
					h3String="Text shadow"
					h4String="Drop shadow behind text"
					paddingTop="0.5rem"
					paddingBottom="0.85rem"
				/>
				<JDGInputContainer label="Enable text shadow">
					<label class="radio-label">
						<input type="checkbox" bind:checked={textOutline} />
						Soft drop shadow behind text
					</label>
				</JDGInputContainer>
				{#if textOutline}
					<JDGInputContainer label="Blur / spread (ref. 600px edge)">
						<input
							type="range"
							class="range-input"
							min="0"
							max="28"
							step="0.5"
							bind:value={textShadowBlur}
						/>
						<span class="range-value">{textShadowBlur}px</span>
					</JDGInputContainer>
					<JDGInputContainer label="Shadow opacity">
						<input
							type="range"
							class="range-input"
							min="0"
							max="100"
							step="1"
							bind:value={textShadowOpacity}
						/>
						<span class="range-value">{textShadowOpacity}%</span>
					</JDGInputContainer>
					<div class="row-inputs">
						<JDGInputContainer label="Offset X">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={textShadowOffsetX}
							/>
							<span class="range-value">{textShadowOffsetX}px</span>
						</JDGInputContainer>
						<JDGInputContainer label="Offset Y">
							<input
								type="range"
								class="range-input"
								min="-20"
								max="20"
								step="1"
								bind:value={textShadowOffsetY}
							/>
							<span class="range-value">{textShadowOffsetY}px</span>
						</JDGInputContainer>
					</div>
				{/if}
			{/if}

			<JDGH3H4
				h3String="Placement"
				h4String="Position on the photo"
				paddingTop="1rem"
				paddingBottom="0.85rem"
			/>
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
			</div>
			<JDGInputContainer label="Inset from image edge">
				<div class="size-row">
					<input
						type="number"
						class="number-input"
						min="0"
						max={paddingSizeUnit === '%' ? 50 : 400}
						bind:value={paddingSize}
					/>
					<select class="select-input size-unit" bind:value={paddingSizeUnit}>
						<option value="%">%</option>
						<option value="px">px</option>
					</select>
					{#if paddingSizeUnit === '%'}
						<span class="size-suffix">of image height</span>
					{/if}
				</div>
				{#if paddingSizeUnit === 'px'}
					<span class="size-hint">Same pixel distance from the image boundary on both axes</span>
				{/if}
			</JDGInputContainer>
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
					isPrimary={false}
				/>
				<JDGButton
					label="Download all"
					faIcon="fa-download"
					onClickFunction={downloadAll}
					isEnabled={hasWatermark()}
					isPrimary={true}
				/>
			</div>

			<div class="thumb-strip-row">
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
				<button type="button" class="thumb-strip-clear-all" on:click={clearAll}> Clear all </button>
			</div>

			{#if selectedImage}
				<div class="preview-wrapper">
					<div class="preview-inner" style="position: relative;">
						<img
							class="preview-base"
							bind:this={previewBaseRef}
							src={selectedImage.objectUrl}
							alt="Preview"
							style={previewBaseDisplayStyle}
							on:load={handlePreviewImageLoad}
						/>
						{#if watermarkType === 'image' && watermarkUrl}
							<div class="watermark-wrapper" style={watermarkWrapperStyle}>
								<img
									bind:this={watermarkImgEl}
									class="watermark-img"
									style="opacity: {logoOpacity}; mix-blend-mode: {blendMode}; filter: {watermarkImgFilter}; max-height: {imagePreviewMaxSize}; max-width: none; width: auto; height: auto; object-fit: contain;"
									src={watermarkUrl}
									alt="Watermark"
								/>
							</div>
						{:else if watermarkType === 'text' && watermarkText}
							<div class="watermark-wrapper watermark-text-preview" style={watermarkWrapperStyle}>
								<span
									class="watermark-text"
									style="opacity: {textOpacity}; font-family: {watermarkTextFont}; font-size: {textPreviewFontSize}; color: white; filter: {textWatermarkFilter};"
								>
									{watermarkText}
								</span>
							</div>
						{:else if watermarkType === 'image+text' && watermarkUrl && watermarkText}
							<div class="watermark-wrapper watermark-combo-preview" style={watermarkWrapperStyle}>
								<img
									class="watermark-combo-logo"
									style="opacity: {logoOpacity}; mix-blend-mode: {blendMode}; filter: {watermarkImgFilter}; max-height: {imagePreviewMaxSize}; max-width: none; width: auto; height: auto; object-fit: contain;"
									src={watermarkUrl}
									alt=""
								/>
								<span class="watermark-combo-gap" style="width: {comboGapPx}px;"></span>
								<span
									class="watermark-text"
									style="opacity: {textOpacity}; font-family: {watermarkTextFont}; font-size: {textPreviewFontSize}; color: white; filter: {textWatermarkFilter};"
								>
									{watermarkDivider}
								</span>
								<span class="watermark-combo-gap" style="width: {comboGapPx}px;"></span>
								<span
									class="watermark-text"
									style="opacity: {textOpacity}; font-family: {watermarkTextFont}; font-size: {textPreviewFontSize}; color: white; filter: {textWatermarkFilter};"
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
	.size-suffix {
		font-size: 0.9rem;
		color: #555;
		white-space: nowrap;
		align-self: center;
	}
	.size-unit {
		width: 4rem;
	}
	.size-hint {
		display: block;
		font-size: 0.85rem;
		color: #666;
		margin-top: 0.25rem;
	}
	.watermark-text-preview {
		white-space: nowrap;
	}
	.watermark-combo-preview {
		display: flex;
		flex-direction: row;
		align-items: center;
		white-space: nowrap;
	}
	.watermark-combo-preview .watermark-text {
		align-self: center;
	}
	.watermark-combo-logo {
		display: block;
		height: auto;
		vertical-align: middle;
		align-self: center;
	}
	.watermark-combo-gap {
		flex-shrink: 0;
	}
	.watermark-text {
		white-space: nowrap;
		line-height: 1;
		display: block;
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

	.thumb-strip-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	.thumb-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}
	.thumb-strip-clear-all {
		flex-shrink: 0;
		font-size: 0.75rem;
		padding: 0.35rem 0.65rem;
		line-height: 1.2;
		border: 1px solid #bbb;
		border-radius: 4px;
		background: #f5f5f5;
		color: #555;
		cursor: pointer;
	}
	.thumb-strip-clear-all:hover {
		background: #e8e8e8;
		border-color: #999;
		color: #333;
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

	/* Height follows the image — avoids a tall gray band below short photos (watermark
	   is pinned to the image; fixed 600px made bottom-to-frame look larger than left). */
	.preview-wrapper {
		margin-top: 1rem;
		max-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f0f0f0;
		padding: 6px;
		box-sizing: border-box;
	}
	.preview-inner {
		position: relative;
		max-width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
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
