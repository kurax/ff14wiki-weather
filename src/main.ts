import data from './data.json';
import App from './App.svelte';

const areas = [
    [
        '拉诺西亚',
        '利姆萨·罗敏萨上层甲板',
        '中拉诺西亚',
        '拉诺西亚低地',
        '东拉诺西亚',
        '西拉诺西亚',
        '拉诺西亚高地',
        '拉诺西亚外地',
        '狼狱停船场',
        '海雾村'
    ],
    [
        '黑衣森林',
        '格里达尼亚新街',
        '黑衣森林中央林区',
        '黑衣森林东部林区',
        '黑衣森林南部林区',
        '黑衣森林北部林区',
        '薰衣草苗圃'
    ],
    ['萨纳兰', '乌尔达哈现世回廊', '西萨纳兰', '中萨纳兰', '东萨纳兰', '南萨纳兰', '北萨纳兰', '高脚孤丘'],
    ['库尔札斯', '伊修加德基础层', '库尔札斯中央高地', '库尔札斯西部高地'],
    ['阿巴拉提亚', '阿巴拉提亚云海', '魔大陆阿济兹拉'],
    ['龙堡', '田园郡', '龙堡参天高地', '龙堡内陆低地', '翻云雾海'],
    ['基拉巴尼亚', '神拳痕', '基拉巴尼亚边区', '基拉巴尼亚山区', '基拉巴尼亚湖区'],
    ['远东之国', '黄金港', '白银乡'],
    ['奥萨德', '红玉海', '延夏', '太阳神草原'],
    ['诺弗兰特', '水晶都', '游末邦', '雷克兰德', '珂露西亚岛', '安穆·艾兰', '伊尔美格', '拉凯提卡大森林', '黑风海'],
    ['其他', '摩杜纳'],
    ['优雷卡', '优雷卡常风之地', '优雷卡恒冰之地', '优雷卡涌火之地', '优雷卡丰水之地'],
    ['博兹雅', '南方博兹雅战线', '扎杜诺尔高原']
];

const abbr = {
    利姆萨·罗敏萨上层甲板: '利姆萨·罗敏萨',
    格里达尼亚新街: '格里达尼亚',
    乌尔达哈现世回廊: '乌尔达哈',
    伊修加德基础层: '伊修加德'
};

const getArea = (area: string): string => {
    for (const key of Object.keys(abbr)) if (abbr[key] === area) return key;
    return area;
};

const getRate = (timestamp: number) => {
    const unix = Math.trunc(timestamp / 1000);
    const bell = Math.trunc(unix / 175);
    const increment = (bell + 8 - (bell % 8)) % 24;
    const totalDays = Math.trunc(unix / 4200) >>> 0;
    const calcBase = totalDays * 0x64 + increment;
    const step1 = ((calcBase << 0xb) ^ calcBase) >>> 0;
    const step2 = ((step1 >>> 8) ^ step1) >>> 0;
    return step2 % 0x64;
};

const getWeather = (area: string, timestamp?: number): [string, number] => {
    area = getArea(area);
    const rates = data.rates[area];
    if (rates == null) return ['', 0];

    const rate = getRate(timestamp ?? Date.now());
    // console.log(area, rate, rates);

    for (let i = 0; ; i++) {
        const num = i * 2 + 1;
        if (num >= rates.length) break;
        if (rate < rates[num]) {
            const weather = rates[i * 2];
            return [weather, data.icons[weather]];
        }
    }

    const weather = rates[rates.length - 1];
    return [weather, data.icons[weather]];
};

const app = new App({
    target: document.getElementById('ff14-weather'),
    props: { areas: areas.map(item => item.map(name => abbr[name] ?? name)), getWeather }
});

export default app;
