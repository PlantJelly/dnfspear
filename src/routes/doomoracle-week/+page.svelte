<script>
    let check = false;
    let id = 0;
    let name = "";
    let server = "cain";
    const dungeonResult = { //던전 클리어 종말의 계시와 헬 배율
    안개신 : [160, 0],
    싱글나벨 : [80, 7],
    매칭나벨 : [100, 8],
    레이드나벨 : [160, 11],
    베누스1단 : [60, 5],
    베누스2단 : [100, 8],
    계곡 : [40, 3],
    꿈솔 : [60, 4],
    달잠호 : [60, 7],
    애쥬어 : [100, 10],
    여신전 : [120, 11],
    흉몽 : [140, 12]
    };
    let apiResult = {
        이름 : "",
        명성 : 0
    };
    let tableData = [
    ];
    function addRow() {
        const newRow = {
            순서 : id, 
            캐릭터 : apiResult["이름"],
            명성 : apiResult["명성"],
            흉몽 : (apiResult["명성"] >= 52952 ? true : false), 
            여신전 : (apiResult["명성"] >= 48988 ? true : false), 
            애쥬어 : (apiResult["명성"] >= 44929 && apiResult["명성"] < 52952 ? true : false), 
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
            헬 : 0
        };
        tableData = [...tableData, newRow];
        let [apo, hell] = hellCalculator(tableData[id]);
        tableData[id]["종말의계시"] = apo;
        tableData[id]["헬"] = hell;
        id = id + 1;
    }
    async function searchCharacter() {
        let type = "캐릭터검색";
        const res = await fetch(`/doomoracle-week?type=${type}&server=${server}&name=${name}`);
        apiResult = await res.json();
    }
    function hellCalculator(character) {
        let apo = 0;
        let hell = 0;
        for (let dungeon in character) {
            if (["순서", "캐릭터", "명성", "패스지정", "PC방", "종말의계시", "헬"].includes(dungeon)) {
                continue;
            }
            if (character[dungeon] == true) {
                apo += dungeonResult[dungeon][0];
                hell += dungeonResult[dungeon][1];
            }
        }   
        let bonusApo = (apo - (character["안개신"]? 160 : 0)) * 0.1;
        apo = apo + bonusApo * ((character["패스지정"]? 1 : 0) + (character["PC방"]? 1 : 0));
        return [apo, hell];
    }
    function updateHell(idx) {
        const [apo, hell] = hellCalculator(tableData[idx]);
        tableData[idx]["종말의계시"] = apo;
        tableData[idx]["헬"] = hell;
        tableData = [...tableData];
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
<table>
    <thead>
        <tr>
            <th rowspan="2">캐릭터</th>
            <th rowspan="2">명성</th>
            <th colspan="6">상급던전</th>
            <th colspan="4">레이드</th>
            <th colspan="2">베누스</th>
            <th colspan="2">보너스</th>
            <th colspan="2">보상</th>
        </tr>
        <tr>
            <td>해방된 흉몽</td>
            <td>죽음의 여신전</td>
            <td>애쥬어 메인</td>
            <td>달이 잠긴 호수</td>
            <td>꿈결 속 솔리다리스</td>
            <td>꿈결 속 흰 구름 계곡</td>
            <td>안개신 하드</td>
            <td>나벨 싱글</td>
            <td>나벨 매칭</td>
            <td>나벨 레이드</td>
            <td>베누스 1단</td>
            <td>베누스 2단</td>
            <td>패스 지정</td>
            <td>PC방</td>
            <td>종말의 계시</td>
            <td>헬</td>
        </tr>
    </thead>
    <tbody>
        {#each tableData as row, i (row["순서"])}
<tr>
    <td>{row["캐릭터"]}</td>
    <td>{row["명성"]}</td>
    <td><input type="checkbox" bind:checked={row["흉몽"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["여신전"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["애쥬어"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["달잠호"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["계곡"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["꿈솔"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["안개신"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["싱글나벨"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["매칭나벨"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["레이드나벨"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["베누스1단"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["베누스2단"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["패스지정"]} on:change={() => updateHell(i)}></td>
    <td><input type="checkbox" bind:checked={row["PC방"]} on:change={() => updateHell(i)}></td>
    <td>{row["종말의계시"]}</td>
    <td>{row["헬"]}</td>
</tr>
        {/each}
    </tbody>
</table>