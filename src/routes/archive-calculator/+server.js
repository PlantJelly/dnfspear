import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

let cachedApiData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;
let disassemblerPrice = 500;

const itemIdJson = {
    무색큐브조각: "785e56a0ed4e3efd573da1f56a45217d",
    힘의정수1개상자: "aabeb527c4e5d3b2cf2fba8a9cb8bbe7",
    황금큐브조각: "fbdf88559ec0414339d1b4d089b6bd62",
};
const itemIdApoJson = {
    레어소울결정: "c4816db14d145416921f0210063cb014",
    유니크소울결정: "0620c107b1aae1f3a6cf9eee3aaf43d7",
    레전더리소울결정: "c6947ff630cc59aebdcbabfb449258d1",
    에픽소울결정: "c7d845c65ab9dbcff6e55dc910fbea87",
    태초소울결정: "d288ebf406a65f4ec23d1f9c33227888",
};
const equipmentInf = {
    상의: [24864, 328],
    하의: [21312, 281],
    어깨: [17760, 234],
    벨트: [15984, 210],
    신발: [15984, 210],
    장신구: [24864, 328],
    특수장비: [24864, 328],
    레전융합석: [16560, 196],
    에픽융합석: [25984, 342],
    태초융합석: [29952, 395],
};

async function auctionSearch(itemId) {
    try {
        let apiKey = env.API_KEY; 
        let limit = 50; 
        let dnfApiUrl = `https://api.neople.co.kr/df/auction-sold?limit=${limit}&itemId=${itemId}&apikey=${apiKey}`;
        const fetched = await fetch(dnfApiUrl); 

        if (!fetched.ok) {
            throw error(fetched.status, `API 요청 실패: ${fetched.statusText}`);
        }

        const data = await fetched.json(); 

        if (!data.rows || data.rows.length === 0) {
            return { rows: [] }; 
        }

        return data;
    } catch (err) {
        if (err.status) {
            throw err;
        }
        throw error(500, `서버 오류가 발생했습니다: ${err.message}`);
    }
}

function sumAverage(data) {
    if (!data.rows || data.rows.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < data.rows.length; i++) {
        sum += data.rows[i].unitPrice;
    }
    sum = sum / data.rows.length; 
    sum = Math.floor(sum); 
    return sum;
}

async function fetchAndCacheApiData() {
    const now = Date.now();
    if (cachedApiData && (now - lastFetchTime < CACHE_DURATION)) {
        return cachedApiData;
    }

    let itemResult = {};
    for (const [key, itemId] of Object.entries(itemIdJson)) {
        let data = await auctionSearch(itemId); 
        itemResult[key] = sumAverage(data);
    }

    let itemApoResult = -1;
    for (const [key, itemId] of Object.entries(itemIdApoJson)) {
        let data = await auctionSearch(itemId);
        let value = sumAverage(data);
        if (value === 0) continue;

        let cal = -1;
        switch (key) {
            case "레어소울결정": cal = value / 2; break;
            case "유니크소울결정": cal = value / 4; break;
            case "레전더리소울결정": cal = value / 30; break;
            case "에픽소울결정": cal = value / 90; break;
            case "태초소울결정": cal = value / 1000; break;
        }
        if (itemApoResult === -1 || cal < itemApoResult) {
            itemApoResult = cal;
        }
    }
    
    cachedApiData = { itemResult, itemApoResult };
    lastFetchTime = now;

    return cachedApiData;
}

function calculateEquipment(itemResult, itemApoResult, valueToggle) {
    let equipmentResult = {};
    for (const [name, value] of Object.entries(equipmentInf)) {
        let cal = 0;
        if (name.indexOf("융합석") == -1) {
            cal = value[0] + 2228 - (value[1] + 29) * (itemResult["무색큐브조각"] * 0.97) - (valueToggle == "힘의 정수" ? itemResult["힘의정수1개상자"] * 0.97 : itemApoResult);
        } else if (name.indexOf("레전") == 0) {
            cal = value[0] - (itemResult["황금큐브조각"] * 0.97) + disassemblerPrice - value[1] * (itemResult["무색큐브조각"] * 0.97) - ((itemResult["힘의정수1개상자"] * 0.97) / 3);
        } else if (name.indexOf("에픽") == 0) {
            cal = value[0] - value[1] * (itemResult["무색큐브조각"] * 0.97) - (valueToggle == "힘의 정수" ? itemResult["힘의정수1개상자"] * 0.97 : itemApoResult);
        } else if (name.indexOf("태초") == 0) {
            cal = value[0] - value[1] * (itemResult["무색큐브조각"] * 0.97);
        }
        equipmentResult[name] = Math.floor(cal); 
    }
    equipmentResult["레전밀봉"] = equipmentResult["레전융합석"] * 36 + equipmentInf["레전융합석"][0]; 
    return equipmentResult;
}

export async function GET({ url }) {
    let valueToggle = url.searchParams.get('toggle'); 
    disassemblerPrice = Number(url.searchParams.get('disassemblerPrice'));
    
    const { itemResult, itemApoResult } = await fetchAndCacheApiData();
    
    const finalResult = calculateEquipment(itemResult, itemApoResult, valueToggle);

    return new Response(JSON.stringify(finalResult));
}