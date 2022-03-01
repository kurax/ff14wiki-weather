<script lang="ts">
    export let areas: string[][];
    export let getWeather: (area: string, timestamp?: number) => [string, number];
</script>

<pre>{getWeather('南萨纳兰')}</pre>

<style>
</style>
