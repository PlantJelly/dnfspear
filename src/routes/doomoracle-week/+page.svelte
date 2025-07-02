<script>
    let check = false;
    let id = 0;
    let name = "";
    let server = "";
    const dungeonResult = { //던전 클리어 종말의 계시와 헬 배율
    안개신 : [160, 0],
    싱글나벨 : [80, 7],
    매칭나벨 : [100, 8],
    레이드나벨 : [160, 11],
    베누스1단 : [60, 5],
    베누스2단 : [100, 8],
    계곡 : [40, 3],
    꿈솔 : [60, 4],
    매칭달잠호 : [40, 6],
    달잠호 : [60, 7],
    매칭애쥬어 : [80, 9],
    애쥬어 : [100, 10],
    매칭여신전 : [100, 10],
    여신전 : [120, 11],
    흉몽 : [140, 12]
    };
    let apiResult = {
        이름 : "",
        명성 : 0,
        ID : ""
    };
    let tableData = [
    ];
    let tableSumData = {
    };
    function addRow() {
        const newRow = {
            순서 : id, 
            캐릭터 : apiResult["이름"],
            명성 : apiResult["명성"],
            흉몽 : (apiResult["명성"] >= 52952 ? true : false), 
            매칭여신전 : false,
            여신전 : (apiResult["명성"] >= 48988 ? true : false), 
            매칭애쥬어 : false,
            애쥬어 : (apiResult["명성"] >= 44929 && apiResult["명성"] < 52952 ? true : false), 
            매칭달잠호 : false,
            달잠호 : (apiResult["명성"] >= 34749 && apiResult["명성"] < 48988 ? true : false), 
            계곡 : (apiResult["명성"] >= 23016 && apiResult["명성"] < 44929 ? true : false), 
            꿈솔 : (apiResult["명성"] >= 16316 && apiResult["명성"] < 34749 ? true : false), 
            안개신 : (apiResult["명성"] >= 30135 ? true : false), 
            싱글나벨 : false, 
            매칭나벨 : (apiResult["명성"] >= 47684 && apiResult["명성"] < 61757 ? true : false), 
            레이드나벨 : (apiResult["명성"] >= 65000 ? true : false), 
            베누스1단 : (apiResult["명성"] >= 41929 && apiResult["명성"] < 52000 ? true : false), 
            베누스2단 : (apiResult["명성"] >= 52000 ? true : false), 
            패스지정 : false, 
            PC방 : false,
            종말의계시 : 0,
            헬배율 : 0,
            헬 : 0
        };
        tableData = [...tableData, newRow];
        updateHell(id, true);
        apiResult["이름"] = "";
        apiResult["명성"] = 0;
        apiResult["ID"] = "";
        id += 1;
    }
    async function searchCharacter() {
        if (name == ""){
            window.alert("캐릭터명을 입력해주세요");
            return;
        }
        else if (server == ""){
            window.alert("서버를 입력해주세요")
            return;
        }
        let type = "캐릭터검색";
        const res = await fetch(`/doomoracle-week?type=${type}&server=${server}&name=${name}`);
        apiResult = await res.json();
    }
    function apoCalculator(character) {
        let apo = 0;
        let hell = 0;
        let advancedDungeon = 0;
        let legion = 0;
        let raid = 0;
        for (let dungeon in character) {
            if (["순서", "캐릭터", "명성", "패스지정", "PC방", "종말의계시", "헬배율", "헬"].includes(dungeon)) {
                continue;
            }
            if (character[dungeon] == true) {
                if (["흉몽", "여신전", "매칭여신전", "애쥬어", "매칭애쥬어", "달잠호", "매칭달잠호", "꿈솔", "계곡"].includes(dungeon)) {
                    advancedDungeon += 1;
                }
                else if (["베누스1단", "베누스2단"].includes(dungeon)){
                    legion += 1;
                }
                else if (["싱글나벨", "매칭나벨", "레이드나벨"].includes(dungeon)){
                    raid += 1;
                }
                if (((dungeon == "여신전" || "매칭여신전") && (character["여신전"] && character["매칭여신전"] == true)) ||
                        ((dungeon == "애쥬어" || "매칭애쥬어") && (character["애쥬어"] && character["매칭애쥬어"] == true)) ||
                        ((dungeon == "달잠호" || "매칭달잠호") && (character["달잠호"] && character["매칭달잠호"] == true))){
                    return [apo, hell, "matching"];
                }
                apo += dungeonResult[dungeon][0];
                hell += dungeonResult[dungeon][1];
            }
        }
        if (advancedDungeon > 2 || legion > 1 || raid > 1 ){
            return [apo, hell, false];
        }
        let bonusApo = (apo - (character["안개신"]? 160 : 0)) * 0.1;
        apo = apo + bonusApo * ((character["패스지정"]? 1 : 0) + (character["PC방"]? 1 : 0));
        return [apo, hell, true];
    }
    function updateHell(idx, check) {
        let checkValue = apoCalculator(tableData[idx]);
        if (checkValue[2] == false){
            tableData[idx][check] = false;
            window.alert("방금 체크한값은 주간보상횟수를 초과했습니다.");
            return;
        }
        else if (checkValue[2] == "matching"){
            tableData[idx][check] = false;
            window.alert("방금 체크한값은 일반과 매칭을 동시에 체크했습니다.");
            return;
        }
        tableData[idx]["종말의계시"] = checkValue[0];
        tableData[idx]["헬배율"] = checkValue[1];
        tableData[idx]["헬"] = hellCalculator(tableData[idx]);
        averageCharacter();
        tableData = [...tableData];
    }
    function deleteRow(i) {
        tableData.splice(i, 1);
        for (let table of tableData){
            if (table["순서"] > i){
                table["순서"] -= 1;
            }
        }
        id = tableData.length;
        averageCharacter();
        tableData = [...tableData];
    }
    function servernameKorean(servername) {
        switch (servername){
            case "cain":
                return "카인";
            case "anton":
                return "안톤";
            case "bakal":
                return "바칼";
            case "casillas":
                return "카시야스";
            case "diregie":
                return "디레지에";
            case "hilder":
                return "힐더";
            case "prey":
                return "프레이";
            case "siroco":
                return "시로코";
        }
    }
    function hellCalculator(character){
        let dungeonFee = 22;
        if (character["패스지정"] == true){
            dungeonFee -= 2;
        }
        if (character["PC방"] == true){
            dungeonFee -= 2;
        }
        let hell = parseInt(character["종말의계시"] / dungeonFee);
        hell = hell + character["헬배율"];
        return hell;
    }
    function averageCharacter(){
        let sumCharacter = {
        명성 : 0,
        흉몽 : 0, 
        여신전 : 0, 
        매칭여신전 : 0,
        애쥬어 : 0, 
        매칭애쥬어 : 0,
        달잠호 : 0, 
        매칭달잠호 : 0,
        계곡 : 0, 
        꿈솔 : 0, 
        안개신 : 0, 
        싱글나벨 : 0, 
        매칭나벨 : 0, 
        레이드나벨 : 0, 
        베누스1단 : 0, 
        베누스2단 : 0, 
        패스지정 : 0, 
        종말의계시 : 0,
        헬배율 : 0,
        헬 : 0
        };
            for (let character of tableData){
                sumCharacter["명성"] += character["명성"];
                sumCharacter["종말의계시"] += character["종말의계시"];
                sumCharacter["헬배율"] += character["헬배율"];
                sumCharacter["헬"] += character["헬"];
                for (let dungeon in character){
                    if (["순서", "캐릭터", "명성", "패스지정", "PC방", "종말의계시", "헬배율", "헬"].includes(dungeon)) {
                        continue;
                    }
                    if (character[dungeon] == true){
                        sumCharacter[dungeon] += 1;
                    }
                }
            }
            sumCharacter["명성"] = parseInt(sumCharacter["명성"] / tableData.length);
        tableSumData = sumCharacter;
    }
</script>

<style>
    table{
        border-collapse: collapse;
        text-align: center;
    }
    th, td{
        border: 1px solid black;
        padding: 8px;
    }
</style>

<h1>주간 종말의 계시</h1>
<select bind:value={server}>
    <option value=""></option>
    <option value="anton">안톤</option>
    <option value="bakal">바칼</option>
    <option value="cain">카인</option>
    <option value="casillas">카시야스</option>
    <option value="diregie">디레지에</option>
    <option value="hilder">힐더</option>
    <option value="prey">프레이</option>
    <option value="siroco">시로코</option>
</select>
<input type="text" name="캐릭터이름" bind:value={name} placeholder="캐릭터 이름 입력">
<button on:click={searchCharacter}>검색</button>
<button on:click={addRow}>행 추가</button>
{#if apiResult["이름"] != ""}
    <div>
    <img src="https://img-api.neople.co.kr/df/servers/{server}/characters/{apiResult["ID"]}?zoom=1" alt="캐릭터 사진" style="width: 150px;">
    <p style="display:inline-block;">서버 : {servernameKorean(server)} 캐릭터 : {apiResult["이름"]}</p>
    </div>
{/if}
<table>
    <thead>
        <tr>
            <th rowspan="2">캐릭터</th>
            <th rowspan="2">명성</th>
            <th colspan="9">상급던전</th>
            <th>레이드</th>
            <th colspan="3">나벨 레이드</th>
            <th colspan="2">베누스</th>
            <th colspan="2">보너스</th>
            <th colspan="3">보상</th>
            <th rowspan="2">삭제</th>
        </tr>
        <tr>
            <td>해방된 흉몽</td>
            <td colspan="2">죽음의 여신전</td>
            <td colspan="2">애쥬어 메인</td>
            <td colspan="2">달이 잠긴 호수</td>
            <td>꿈결 속 솔리다리스</td>
            <td>꿈결 속 흰 구름 계곡</td>
            <td>안개신 하드</td>
            <td>싱글</td>
            <td>매칭</td>
            <td>레이드</td>
            <td>1단</td>
            <td>2단</td>
            <td>패스 지정</td>
            <td>PC방</td>
            <td>종말의 계시</td>
            <td>헬배율</td>
            <td>총합</td>
        </tr>
    </thead>
    <tbody>
        {#each tableData as row, i (row["순서"])}
        <tr>
            <td>{row["캐릭터"]}</td>
            <td>{row["명성"]}</td>
            <td><input type="checkbox" bind:checked={row["흉몽"]} on:change={() => updateHell(i, "흉몽")}></td>
            <td><input type="checkbox" bind:checked={row["여신전"]} on:change={() => updateHell(i, "여신전")}></td>
            <td><input type="checkbox" bind:checked={row["매칭여신전"]} on:change={() => updateHell(i, "매칭여신전")}><sub style="font-size: small;">(M)</sub></td>
            <td><input type="checkbox" bind:checked={row["애쥬어"]} on:change={() => updateHell(i, "애쥬어")}></td>
            <td><input type="checkbox" bind:checked={row["매칭애쥬어"]} on:change={() => updateHell(i, "매칭애쥬어")}><sub style="font-size: small;">(M)</sub></td>
            <td><input type="checkbox" bind:checked={row["달잠호"]} on:change={() => updateHell(i, "달잠호")}></td>
            <td><input type="checkbox" bind:checked={row["매칭달잠호"]} on:change={() => updateHell(i, "매칭달잠호")}><sub style="font-size: small;">(M)</sub></td>
            <td><input type="checkbox" bind:checked={row["계곡"]} on:change={() => updateHell(i, "계곡")}></td>
            <td><input type="checkbox" bind:checked={row["꿈솔"]} on:change={() => updateHell(i, "꿈솔")}></td>
            <td><input type="checkbox" bind:checked={row["안개신"]} on:change={() => updateHell(i, "안개신")}></td>
            <td><input type="checkbox" bind:checked={row["싱글나벨"]} on:change={() => updateHell(i, "싱글나벨")}></td>
            <td><input type="checkbox" bind:checked={row["매칭나벨"]} on:change={() => updateHell(i, "매칭나벨")}></td>
            <td><input type="checkbox" bind:checked={row["레이드나벨"]} on:change={() => updateHell(i, "레이드나벨")}></td>
            <td><input type="checkbox" bind:checked={row["베누스1단"]} on:change={() => updateHell(i, "베누스1단")}></td>
            <td><input type="checkbox" bind:checked={row["베누스2단"]} on:change={() => updateHell(i, "베누스2단")}></td>
            <td><input type="checkbox" bind:checked={row["패스지정"]} on:change={() => updateHell(i)}></td>
            <td><input type="checkbox" bind:checked={row["PC방"]} on:change={() => updateHell(i)}></td>
            <td>{row["종말의계시"]}개</td>
            <td>{row["헬배율"]}판</td>
            <td>{row["헬"]}판</td>
            <td><button on:click={() => deleteRow(row["순서"])}>X</button></td>
        </tr>
        {/each}
        <tr>
            <td>총합</td>
            <td>{tableSumData["명성"]}</td>
            <td>{tableSumData["흉몽"]}</td>
            <td>{tableSumData["여신전"]}</td>
            <td>{tableSumData["매칭여신전"]}</td>
            <td>{tableSumData["애쥬어"]}</td>
            <td>{tableSumData["매칭애쥬어"]}</td>
            <td>{tableSumData["달잠호"]}</td>
            <td>{tableSumData["매칭달잠호"]}</td>
            <td>{tableSumData["계곡"]}</td>
            <td>{tableSumData["꿈솔"]}</td>
            <td>{tableSumData["안개신"]}</td>
            <td>{tableSumData["싱글나벨"]}</td>
            <td>{tableSumData["매칭나벨"]}</td>
            <td>{tableSumData["레이드나벨"]}</td>
            <td>{tableSumData["베누스1단"]}</td>
            <td>{tableSumData["베누스2단"]}</td>
            <td>{tableSumData["패스지정"]}</td>
            <td></td>
            <td>{tableSumData["종말의계시"]}{#if tableSumData["종말의계시"] != null}개{/if}</td>
            <td>{tableSumData["헬배율"]}{#if tableSumData["헬배율"] != null}판{/if}</td>
            <td>{tableSumData["헬"]}{#if tableSumData["헬"] != null}판{/if}</td>
            <td></td>
        </tr>
    </tbody>
</table>