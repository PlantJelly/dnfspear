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

/** @type {import('./$types').RequestHandler} */
export async function GET({ req }) {
    let valueToggle = "힘의 정수"; // 힘의 정수로 판단할지, 종말의 계시로 판단할지 토글용
    let itemResult = await auctionAverage(itemIdJson); // 무색큐브조각, 황금큐브조각, 힘의정수1개상자 가격 객체
    let itemApoResult = await apoResult(itemIdApoJson); // 종말의 계시 1개 가격 계산

    async function auctionSearch(itemId) {
        // 경매장 api 검색 함수
        let apiKey = env.API_KEY; //apikey
        let limit = 50; // 몇개 검색할건지
        let url = `https://api.neople.co.kr/df/auction-sold?limit=${limit}&itemId=${itemId}&apikey=${apiKey}`;
        const fetched = await fetch(url); // api 호출
        const data = await fetched.json(); // 원하는 값을 객체로 변환
        return data;
    }

    async function auctionAverage(itemIdJson) {
        // 경매장 검색 후 평균값 객체로 저장하기
        let itemResult = {};
        for (const [key, itemId] of Object.entries(itemIdJson)) {
            // 경매장 펑균 시세 조사해서 itemResult 객체에 넣기
            let data = await auctionSearch(itemId); // api 호출
            let sum = sumAverage(data); // 경매장 평균 시세 버림 함수 호출
            itemResult[key] = sum;
        }
        return itemResult;
    }

    async function apoResult(itemIdApoJson) {
        // 종말의 계시 1개 가격 계산
        let result = -1;
        for (const [key, itemId] of Object.entries(itemIdApoJson)) {
            // 소울결정 하나씩 가격 검색하기
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
                // 만약 방금 계산한게 저장한 값보다 작으면 교체 혹은 첫값(-1) 이면 교체
                result = cal;
            }
        }
        return result; // 최소값 반환
    }

    function sumAverage(data) {
        //경매장 평균 시세 버림 함수
        let sum = 0;
        for (let i = 0; i < data.rows.length; i++) {
            // 시세 검색 후 전부 더하기(limit 변수값)
            sum += data.rows[i].unitPrice;
        }
        sum = sum / data.rows.length; // 평균내기
        sum = Math.floor(sum); // 소수점 버림
        return sum;
    }

    function equipmentCal() {
        //판매 - 해체 효율 계산 함수, 양수면 판매가 이득
        let equipmentResult = {};
        for (const [name, value] of Object.entries(equipmentInf)) {
            let cal = 0;
            if (name.indexOf("융합석") == -1) {
                // 기억 장비일 때
                cal = value[0] + 2228 - (value[1] + 29) * itemResult["무색큐브조각"] * 0.97 - (valueToggle == "힘의 정수" ? itemResult["힘의정수1개상자"] * 0.97 : itemResult[itemApoResult]);
            } else if (name.indexOf("레전") == 0) {
                // 레전융합석일 때
                cal = value[0] + itemResult["황금큐브조각"] * 0.97 - 500 - value[1] * itemResult["무색큐브조각"] * 0.97 - (itemResult["힘의정수1개상자"] * 0.97) / 3; // 500은 유저 해체기 가격, 나중에 프론트엔드에서 받기
            } else if (name.indexOf("에픽") == 0) {
                // 에픽융합석일 때
                cal = value[0] - value[1] * itemResult["무색큐브조각"] * 0.97 - itemResult["힘의정수1개상자"] * 0.97;
            } else if (name.indexOf("태초") == 0) {
                // 태초융합석일 때
                cal = value[0] - value[1] * itemResult["무색큐브조각"] * 0.97;
            }
            equipmentResult[name] = Math.floor(cal); // 소수점 버리고 객체에 이름이랑 판매 - 해체 값 저장
        }
        equipmentResult["레전밀봉"] = equipmentResult["레전융합석"] * 36 + equipmentInf["레전융합석"][0]; // 밀봉한게 이거 이상 팔려야 이득
        return equipmentResult;
    }

    return new Response(String(JSON.stringify(equipmentCal())));
}
