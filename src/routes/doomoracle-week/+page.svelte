<script>
    import Cookie from 'js-cookie';
    import { onMount } from 'svelte';

    let id = 0;
    let name = "";
    let server = "";
    const dungeonResult = {
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
    
    onMount(() => {
        const savedData = Cookie.get('adventureData');
        if (savedData) {
            try {
                tableData = JSON.parse(savedData);
                if (tableData.length > 0) {
                    id = tableData.reduce((max, p) => p.순서 > max ? p.순서 : max, tableData[0].순서) + 1;
                } else {
                    id = 0;
                }
                reNew();
            } catch (e) {
                tableData = [];
            }
        }
    });

    function addRow() {
        if (!apiResult["이름"]) {
            window.alert("먼저 캐릭터를 검색해주세요.");
            return;
        }
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
        updateTableData(tableData.length - 1, true);
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
    function doomOracleCalculator(row) {
        let doomOracle = 0;
        let hell = 0;
        let advancedDungeonClearCount = 0;
        let legionClearCount = 0;
        let raidClearCount = 0;
        for (let cell in row) {
            if (["순서", "캐릭터", "명성", "패스지정", "PC방", "종말의계시", "헬배율", "헬"].includes(cell)) {
                continue;
            }
            if (row[cell] == true) {
                if (["흉몽", "여신전", "매칭여신전", "애쥬어", "매칭애쥬어", "달잠호", "매칭달잠호", "꿈솔", "계곡"].includes(cell)) {
                    advancedDungeonClearCount += 1;
                }
                else if (["베누스1단", "베누스2단"].includes(cell)){
                    legionClearCount += 1;
                }
                else if (["싱글나벨", "매칭나벨", "레이드나벨"].includes(cell)){
                    raidClearCount += 1;
                }
                if (((cell == "여신전" || cell == "매칭여신전") && (row["여신전"] && row["매칭여신전"] == true)) ||
                        ((cell == "애쥬어" || cell == "매칭애쥬어") && (row["애쥬어"] && row["매칭애쥬어"] == true)) ||
                        ((cell == "달잠호" || cell == "매칭달잠호") && (row["달잠호"] && row["매칭달잠호"] == true))){
                    return [doomOracle, hell, "matching"];
                }
                doomOracle += dungeonResult[cell][0];
                hell += dungeonResult[cell][1];
            }
        }
        if (advancedDungeonClearCount > 2 || legionClearCount > 1 || raidClearCount > 1 ){
            return [doomOracle, hell, false];
        }
        let bonusDoomOracle = (doomOracle - (row["안개신"]? 160 : 0)) * 0.1;
        doomOracle = doomOracle + bonusDoomOracle * ((row["패스지정"]? 1 : 0) + (row["PC방"]? 1 : 0));
        return [doomOracle, hell, true];
    }
    function updateTableData(idx, check) {
        let checkValue = doomOracleCalculator(tableData[idx]);
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
        reNew();
    }
    function deleteRow(i) {
        tableData = tableData.filter(row => row.순서 !== i);
        reNew();
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
    function hellCalculator(row){
        let dungeonFee = 22;
        if (row["패스지정"] == true){
            dungeonFee -= 2;
        }
        if (row["PC방"] == true){
            dungeonFee -= 2;
        }
        let hell = parseInt(row["종말의계시"] / dungeonFee);
        hell = hell + row["헬배율"];
        return hell;
    }
    function averageCharacter(){
        if (tableData.length === 0) {
            tableSumData = {};
            return;
        }
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
            for (let row of tableData){
                sumCharacter["명성"] += row["명성"];
                sumCharacter["종말의계시"] += row["종말의계시"];
                sumCharacter["헬배율"] += row["헬배율"];
                sumCharacter["헬"] += row["헬"];
                for (let cell in row){
                    if (["순서", "캐릭터", "명성", "패스지정", "PC방", "종말의계시", "헬배율", "헬"].includes(cell)) {
                        continue;
                    }
                    if (row[cell] == true){
                        sumCharacter[cell] += 1;
                    }
                }
            }
            sumCharacter["명성"] = parseInt(sumCharacter["명성"] / tableData.length);
        tableSumData = sumCharacter;
    }
    function reNew(){
        averageCharacter();
        tableData = [...tableData];
        Cookie.set('adventureData', JSON.stringify(tableData), { expires:7});
    }
    function importTabledata(){
        let importData = prompt("복사한 값을 아래에 입력해주세요.");
        if (importData) {
            try {
                tableData = JSON.parse(importData);
                reNew();
            } catch (e) {
                window.alert("가져오기 데이터 형식이 잘못되었습니다.");
            }
        }
    }
    function exportTabledata(){
        reNew();
        let exportData = JSON.stringify(tableData);
        navigator.clipboard.writeText(exportData).then(() => {
            window.alert("클립보드에 복사되었습니다.");
        }).catch(err => {
            window.alert("복사에 실패했습니다.");
            console.error('Could not copy text: ', err);
        });
    }
    function checkKeydownEnter(event){
        if (event.key === 'Enter'){
            searchCharacter();
        }
    }
</script>

<div class="bg-gray-100 text-gray-800 min-h-screen p-4 sm:p-6 lg:p-8">
    <div class="max-w-full mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">주간 종말의 계시 계산기</h1>

        <div class="bg-white p-4 rounded-lg mb-6 shadow-md">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div class="flex flex-col">
                    <label for="server-select" class="mb-1 text-sm font-medium text-gray-600">서버</label>
                    <select id="server-select" bind:value={server} class="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                        <option value="">서버 선택</option>
                        <option value="anton">안톤</option>
                        <option value="bakal">바칼</option>
                        <option value="cain">카인</option>
                        <option value="casillas">카시야스</option>
                        <option value="diregie">디레지에</option>
                        <option value="hilder">힐더</option>
                        <option value="prey">프레이</option>
                        <option value="siroco">시로코</option>
                    </select>
                </div>
                <div class="flex flex-col">
                    <label for="char-name" class="mb-1 text-sm font-medium text-gray-600">캐릭터 이름</label>
                    <input id="char-name" type="text" bind:value={name} on:keydown={checkKeydownEnter} placeholder="캐릭터 이름 입력" class="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                </div>
                <div class="flex flex-col sm:col-span-2 md:col-span-1">
                    <button on:click={searchCharacter} class="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">검색</button>
                </div>
                <div class="flex flex-col sm:col-span-2 md:col-span-1">
                    <button on:click={addRow} class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">현재 캐릭터 추가</button>
                </div>
            </div>
        </div>

        {#if apiResult["이름"] != ""}
            <div class="bg-white p-4 rounded-lg mb-6 flex items-center space-x-4 shadow-md">
                <img src="https://img-api.neople.co.kr/df/servers/{server}/characters/{apiResult["ID"]}?zoom=1" alt="캐릭터 사진" class="w-24 h-24 rounded-md border-2 border-gray-200">
                <div>
                    <p class="text-xl font-semibold text-gray-900">{apiResult["이름"]}</p>
                    <p class="text-gray-500">서버: {servernameKorean(server)}</p>
                    <p class="text-gray-500">명성: {apiResult["명성"]}</p>
                </div>
            </div>
        {/if}

        <div class="flex space-x-4 mb-6">
            <button on:click={exportTabledata} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex-1">내보내기</button>
            <button on:click={importTabledata} class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex-1">가져오기</button>
        </div>

        <div class="overflow-x-auto shadow-md rounded-lg">
            <table class="w-full text-sm text-center text-gray-600">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                    <tr>
                        <th rowspan="2" class="px-4 py-3 border-b-2 border-r border-gray-200 w-32">캐릭터</th>
                        <th rowspan="2" class="px-4 py-3 border-b-2 border-r border-gray-200 w-24">명성</th>
                        <th colspan="9" class="px-4 py-3 border-b-2 border-r border-gray-200">상급던전</th>
                        <th rowspan="2" class="px-2 py-3 border-b-2 border-r border-gray-200 w-16">안개신<br/>하드</th>
                        <th colspan="3" class="px-4 py-3 border-b-2 border-r border-gray-200">나벨 레이드</th>
                        <th colspan="2" class="px-4 py-3 border-b-2 border-r border-gray-200">베누스</th>
                        <th colspan="2" class="px-4 py-3 border-b-2 border-r border-gray-200">보너스</th>
                        <th colspan="3" class="px-4 py-3 border-b-2 border-r border-gray-200">보상</th>
                        <th rowspan="2" class="px-4 py-3 border-b-2 border-gray-200 w-16">삭제</th>
                    </tr>
                    <tr>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">해방된<br/>흉몽</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">여신전</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">여신전<br/>(M)</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">애쥬어</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">애쥬어<br/>(M)</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">달잠호</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">달잠호<br/>(M)</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">솔리다<br>리스</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">흰구름<br/>계곡</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">싱글</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">매칭</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">레이드</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">1단</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">2단</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">패스<br/>지정</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">PC방</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-24">종말의<br/>계시</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">헬배율</th>
                        <th class="p-2 border-b-2 border-r border-gray-200 w-16">총합</th>
                    </tr>
                </thead>
                <tbody>
                    {#each tableData as row, i (row["순서"])}
                    <tr class="bg-white even:bg-gray-50 hover:bg-gray-100 border-b border-gray-200">
                        <td class="p-2 border-r border-gray-200 font-medium text-gray-900 whitespace-nowrap">{row["캐릭터"]}</td>
                        <td class="p-2 border-r border-gray-200">{row["명성"]}</td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["흉몽"]} on:change={() => updateTableData(i, "흉몽")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["여신전"]} on:change={() => updateTableData(i, "여신전")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["매칭여신전"]} on:change={() => updateTableData(i, "매칭여신전")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["애쥬어"]} on:change={() => updateTableData(i, "애쥬어")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["매칭애쥬어"]} on:change={() => updateTableData(i, "매칭애쥬어")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["달잠호"]} on:change={() => updateTableData(i, "달잠호")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["매칭달잠호"]} on:change={() => updateTableData(i, "매칭달잠호")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["계곡"]} on:change={() => updateTableData(i, "계곡")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["꿈솔"]} on:change={() => updateTableData(i, "꿈솔")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["안개신"]} on:change={() => updateTableData(i, "안개신")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["싱글나벨"]} on:change={() => updateTableData(i, "싱글나벨")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["매칭나벨"]} on:change={() => updateTableData(i, "매칭나벨")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["레이드나벨"]} on:change={() => updateTableData(i, "레이드나벨")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["베누스1단"]} on:change={() => updateTableData(i, "베누스1단")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["베누스2단"]} on:change={() => updateTableData(i, "베누스2단")} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["패스지정"]} on:change={() => updateTableData(i)} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-0 border-r border-gray-200"><label class="w-full h-12 flex items-center justify-center cursor-pointer"><input type="checkbox" bind:checked={row["PC방"]} on:change={() => updateTableData(i)} class="appearance-none w-6 h-6 bg-gray-200 checked:bg-cyan-400 rounded-md transition"></label></td>
                        <td class="p-2 border-r border-gray-200 whitespace-nowrap">{row["종말의계시"]}개</td>
                        <td class="p-2 border-r border-gray-200 whitespace-nowrap">{row["헬배율"]}판</td>
                        <td class="p-2 border-r border-gray-200 whitespace-nowrap">{row["헬"]}판</td>
                        <td class="p-2">
                            <button on:click={() => deleteRow(row["순서"])} class="text-red-500 hover:text-red-700 font-bold">X</button>
                        </td>
                    </tr>
                    {/each}
                </tbody>
                <tfoot class="bg-gray-100 font-medium">
                    <tr class="text-gray-800">
                        <td class="p-2 border-r border-gray-200">총합</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["명성"] || ''}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["흉몽"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["여신전"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["매칭여신전"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["애쥬어"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["매칭애쥬어"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["달잠호"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["매칭달잠호"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["계곡"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["꿈솔"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["안개신"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["싱글나벨"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["매칭나벨"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["레이드나벨"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["베누스1단"] || 0}</td>
                        <td class="p-2 border-r border-gray-200">{tableSumData["베누스2단"] || 0}</td>
                        <td class="p-2 border-r border-gray-200"></td>
                        <td class="p-2 border-r border-gray-200"></td>
                        <td class="p-2 border-r border-gray-200 whitespace-nowrap">{tableSumData["종말의계시"] || 0}개</td>
                        <td class="p-2 border-r border-gray-200 whitespace-nowrap">{tableSumData["헬배율"] || 0}판</td>
                        <td class="p-2 border-r border-gray-200 whitespace-nowrap">{tableSumData["헬"] || 0}판</td>
                        <td class="p-2"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>
