import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const dungeonResult = { //던전 클리어 종말의 계시와 헬 배율
    안개신 : [160, 0],
    싱글나벨 : [80, 7],
    매칭나벨 : [100, 8],
    레이드나벨 : [160, 11],
    베누스1단 : [60, 5],
    베누스2단 : [100, 8],
    계곡 : [40, 3],
    꿈솔 : [60, 4],
    호수 : [60, 7],
    애쥬어 : [100, 10],
    여신전 : [120, 11],
    흉몽 : [140, 12]
};

export async function GET({url}){
    let result = {};
    let type = url.searchParams.get('type');
    switch (type){
        case "캐릭터검색":
        let name = url.searchParams.get('name');
        let server = url.searchParams.get('server');
        result = await searchChracter(server, name);
        break;
    }
    async function searchChracter(funServer, funName) {
        let apiKey = env.API_KEY;
        let dnfApiUrl = `https://api.neople.co.kr/df/servers/${funServer}/characters?characterName=${funName}&apikey=${apiKey}`
        const fetched = await fetch(dnfApiUrl); // api 호출
        const data = await fetched.json(); // 원하는 값을 객체로 변환
        let result = {
            이름 : data.rows[0]["characterName"],
            명성 : data.rows[0]["fame"]
        }
        return result;
    }

    return new Response(String(JSON.stringify(result)));
}