<script lang="ts">
    export let areas: string[][];
    export let getWeather: (area: string, timestamp?: number) => [string, number];

    let selectedZone = 0;
    let selectedArea = areas[selectedZone][1];
</script>

<div>
    <div class="weather-filter flex-list">
        <div class="weather-filter-item filter-type-name">
            <div class="weather-filter-item-name">地区</div>
            <div class="weather-filter-item-input">
                <select bind:value={selectedZone} on:change={() => (selectedArea = areas[selectedZone][1])}>
                    {#each areas as area, i}
                        <option value={i}>{area[0]}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="weather-filter-item filter-type-name">
            <div class="weather-filter-item-name">地点</div>
            <div class="weather-filter-item-input">
                <select bind:value={selectedArea}>
                    {#each areas[selectedZone].slice(1) as area}
                        <option value={area}>{area}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
</div>

<style>
</style>
