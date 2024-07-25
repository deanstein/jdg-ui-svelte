<script>
	import uiState from "$lib/states/ui-state.js";

    export let strokeColor = $uiState.accentColors[0];
</script>
<svg width="50" height="50" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="none" stroke={strokeColor} stroke-width="4">
        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="stroke-dasharray" values="100,150; 50,150; 100,150;" dur="1.5s" repeatCount="indefinite" />
    </circle>
</svg>
