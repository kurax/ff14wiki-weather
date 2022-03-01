import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

const readCsv = (filename: string): Array<Record<string, string>> => {
    return parse(
        fs
            .readFileSync(path.join(__dirname, `${filename}.csv`))
            .toString()
            .replace(/^\uFEFF/, ''),
        {
            columns: true,
            skip_empty_lines: true
        }
    );
};

const places = (() => {
    const result: string[] = [];
    readCsv('PlaceName').forEach(item => {
        const index = Number(item['key']);
        if (isNaN(index)) return;
        result[index] = item['0'].replace(/\r\n/g, ' ');
    });
    return result;
})();

const weathers = (() => {
    const result: [string, number, number[]][] = [];
    readCsv('Weather').forEach(item => {
        const key = Number(item['key']);
        if (isNaN(key)) return;

        const icon = Number(item['0']);
        const name = item['1'];
        if (icon === 0 || name === '') return;

        const item1 = result.find(item => item[0] === name && item[1] === icon);
        if (item1 == null) result.push([name, icon, [key]]);
        else item1[2].push(key);
    });
    return result;
})();

const rates = (() => {
    const result: number[][] = [];
    readCsv('WeatherRate').forEach(item => {
        const index = Number(item['key']);
        if (isNaN(index)) return;

        result[index] = [];
        let percent = 0;
        for (let i = 0; ; i += 2) {
            const weather = item[i.toString()];
            if (weather == null || weather === '0') break;
            const weatherIndex = weathers.findIndex(item => item[2].includes(Number(weather)));
            if (weatherIndex === -1) throw new Error(`Weather ${weather} not found`);
            result[index].push(weatherIndex);
            percent += Number(item[(i + 1).toString()]);
            if (percent < 100) result[index].push(percent);
        }
    });
    return result;
})();

const getTerritories = () => {
    const result: Record<string, any> = {};
    readCsv('TerritoryType').forEach(item => {
        const key = Number(item['key']);
        if (isNaN(key)) return;

        const rate = Number(item['12']);
        if (rate === 0) return;

        const name = places[Number(item['5'])];
        if (rates[rate].length > 2) result[name] = rates[rate];
    });
    return result;
};

const data: Record<string, any> = {
    icons: {},
    weathers: weathers.map(item => [item[0], item[1]]),
    rates: getTerritories()
};

(() => {
    const icons: Record<string, number> = {};
    for (const name of Object.keys(data.rates))
        for (let i = 0; i < data.rates[name].length; i += 2) {
            const weather = data.weathers[data.rates[name][i]];
            icons[weather[0]] = weather[1];
        }
    data.icons = icons;
    for (const name of Object.keys(data.rates))
        for (let i = 0; i < data.rates[name].length; i += 2) {
            const weather = data.weathers[data.rates[name][i]];
            data.rates[name] = [...data.rates[name]];
            data.rates[name][i] = weather[0];
        }
    delete data.weathers;
})();

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data.json'), JSON.stringify(data, null, 2));
