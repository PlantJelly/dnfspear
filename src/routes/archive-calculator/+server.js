// @ts-nocheck
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

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

export async function GET({ url }) {
    let valueToggle = url.searchParams.get('toggle'); 
    let itemResult = await auctionAverage(itemIdJson); 
    let itemApoResult = await apoResult(itemIdApoJson); 

    async function auctionSearch(itemId) {
        let apiKey = env.API_KEY; 
        let limit = 50; 
        let dnfApiUrl = `https://api.neople.co.kr/df/auction-sold?limit=${limit}&itemId=${itemId}&apikey=${apiKey}`;
        const fetched = await fetch(dnfApiUrl); 
        const data = await fetched.json(); 
        return data;
    }

    async function auctionAverage(itemIdJson) {
        let itemResult = {};
        for (const [key, itemId] of Object.entries(itemIdJson)) {
            let data = await auctionSearch(itemId); 
            let sum = sumAverage(data); 
            itemResult[key] = sum;
        }
        return itemResult;
    }

    async function apoResult(itemIdApoJson) {
        let result = -1;
        for (const [key, itemId] of Object.entries(itemIdApoJson)) {
            let data = await auctionSearch(itemId);
            let value = sumAverage(data);
            let cal = -1;
            switch (key) {
                case "레어소울결정":
                    cal = value / 2;
                    break;
                case "유니크소울결정":
                    cal = value / 4;
                    break;
                case "레전더리소울결정":
                    cal = value / 30;
                    break;
                case "에픽소울결정":
                    cal = value / 90;
                    break;
                case "태초소울결정":
                    cal = value / 1000;
                    break;
            }
            if (result > cal || result == -1) {
                result = cal;
            }
        }
        return result; 
    }

    function sumAverage(data) {
        let sum = 0;
        for (let i = 0; i < data.rows.length; i++) {
            sum += data.rows[i].unitPrice;
        }
        sum = sum / data.rows.length; 
        sum = Math.floor(sum); 
        return sum;
    }

    function equipmentCal() {
        let equipmentResult = {};
        for (const [name, value] of Object.entries(equipmentInf)) {
            let cal = 0;
            if (name.indexOf("융합석") == -1) {
                cal = value[0] + 2228 - (value[1] + 29) * itemResult["무색큐브조각"] * 0.97 - (valueToggle == "힘의 정수" ? itemResult["힘의정수1개상자"] * 0.97 : itemApoResult);
            } else if (name.indexOf("레전") == 0) {
                cal = value[0] + itemResult["황금큐브조각"] * 0.97 - 500 - value[1] * itemResult["무색큐브조각"] * 0.97 - (itemResult["힘의정수1개상자"] * 0.97) / 3;
            } else if (name.indexOf("에픽") == 0) {
                cal = value[0] - value[1] * itemResult["무색큐브조각"] * 0.97 - (valueToggle == "힘의 정수" ? itemResult["힘의정수1개상자"] * 0.97 : itemApoResult);
            } else if (name.indexOf("태초") == 0) {
                cal = value[0] - value[1] * itemResult["무색큐브조각"] * 0.97;
            }
            equipmentResult[name] = Math.floor(cal); 
        }
        equipmentResult["레전밀봉"] = equipmentResult["레전융합석"] * 36 + equipmentInf["레전융합석"][0]; 
        return equipmentResult;
    }

    return new Response(String(JSON.stringify(equipmentCal())));
}
