// 간단한 테스트 컨트롤러 예시
const itemIdJson = {
    무색큐브조각 : "785e56a0ed4e3efd573da1f56a45217d",
    힘의정수1개상자 : "aabeb527c4e5d3b2cf2fba8a9cb8bbe7",
    황금큐브조각 : "fbdf88559ec0414339d1b4d089b6bd62",
};
const itemIdApoJson = {
    레어소울결정 : "c4816db14d145416921f0210063cb014",
    유니크소울결정 : "0620c107b1aae1f3a6cf9eee3aaf43d7",
    레전더리소울결정 : "c6947ff630cc59aebdcbabfb449258d1",
    에픽소울결정 : "c7d845c65ab9dbcff6e55dc910fbea87",
    태초소울결정 : "d288ebf406a65f4ec23d1f9c33227888"
};
async function test(req, res) {
    let apiKey = process.env.API_KEY;  //apikey
    let limit = 50; // 몇개 검색할건지
    let itemResult = await auctionAverage(itemIdJson);
    let itemApoResult = await apoResult(itemIdApoJson);

    async function auctionSearch(itemId){ // 경매장 api 검색 함수
        let url = `https://api.neople.co.kr/df/auction-sold?limit=${limit}&itemId=${itemId}&apikey=${apiKey}`;
        const fetched = await fetch(url);
        const data = await fetched.json();
        return data;
    };

    async function auctionAverage(itemIdJson){ // 경매장 검색 후 평균값 객체로 저장하기
        let itemResult = {};
        for(const [key, itemId] of Object.entries(itemIdJson)){ // 경매장 펑균 시세 조사해서 itemResult 객체에 넣기
            let data = await auctionSearch(itemId);
            let sum = sumAverage(data);
            itemResult[key] = sum;
        };
        return itemResult;
    };

    async function apoResult(itemIdApoJson){ // 종말의 계시 1개 가격 계산
        let result = -1;
        for(const [key, itemId] of Object.entries(itemIdApoJson)){
            let data = await auctionSearch(itemId);
            let value = sumAverage(data);
            let cal = -1;
            switch(key){
                case "레어소울결정" : cal = value/2;
                break;
                case "유니크소울결정" : cal = value/4;
                break;
                case "레전더리소울결정" : cal = value/30;
                break;
                case "에픽소울결정" : cal = value/90;
                break;
                case "태초소울결정" : cal = value/1000;
                break;
            }
            if (result > cal || result == -1){
                result = cal;
            }
        };
        return result;
    };

    function sumAverage(data) { //경매장 평균 시세 버림 함수
        let sum = 0;
        for (let i = 0; i < data.rows.length; i++) { // 전부 더하기
            sum += data.rows[i].unitPrice;
        }
        sum = sum / data.rows.length; // 평균내기
        sum = Math.floor(sum); // 소수점 버림
        return sum;
    };
    
    res.send(JSON.stringify(itemResult));
};
module.exports = {
    test,
};