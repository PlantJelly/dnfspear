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
        try {
            let apiKey = env.API_KEY;
            let dnfApiUrl = `https://api.neople.co.kr/df/servers/${funServer}/characters?characterName=${funName}&apikey=${apiKey}`
            const fetched = await fetch(dnfApiUrl);

            if (!fetched.ok) {
                throw error(fetched.status, `API 요청 실패: ${fetched.statusText}`);
            }

            const data = await fetched.json(); 

            if (!data.rows || data.rows.length === 0) {
                throw error(404, "해당하는 캐릭터를 찾을 수 없습니다.");
            }

            let result = {
                이름 : data.rows[0]["characterName"],
                명성 : data.rows[0]["fame"],
                ID : data.rows[0]["characterId"]
            }
            return result;
        } catch (err) {
            if (err.status) {
                throw err;
            }
            throw error(500, `서버 오류가 발생했습니다: ${err.message}`);
        }
    }

    return new Response(String(JSON.stringify(result)));
}