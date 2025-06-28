import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

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