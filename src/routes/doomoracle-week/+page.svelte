<script>
    let check = false;
    let id = 1;
    let name = "";
    let tableData = [
        {순서 : 1, 
        캐릭터 : '캐릭터이름',
        흉몽 : false, 
        여신전 : false, 
        애쥬어 : false, 
        달잠호 : false, 
        계곡 : false, 
        꿈솔 : false, 
        안개신 : false, 
        싱글나벨 : false, 
        매칭나벨 : false, 
        레이드나벨 : false, 
        베누스1단 : false, 
        베누스2단 : false, 
        패스지정 : false, 
        PC방 : false, 
        종말의계시 : 0,
        헬 : 0}
    ];
    function addRow() {
        id = id + 1;
        const newRow = {
            순서 : id, 
            캐릭터 : '캐릭터이름',
            흉몽 : false, 
            여신전 : false, 
            애쥬어 : false, 
            달잠호 : false, 
            계곡 : false, 
            꿈솔 : false, 
            안개신 : false, 
            싱글나벨 : false, 
            매칭나벨 : false, 
            레이드나벨 : false, 
            베누스1단 : false, 
            베누스2단 : false, 
            패스지정 : false, 
            PC방 : false,
            종말의계시 : 0,
            헬 : 0
        };
        tableData = [...tableData, newRow];
    }
    function searchCharacter() {
        
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
<select>
    <option value="1">안톤</option>
    <option value="2">바칼</option>
    <option value="3">카인</option>
    <option value="4">카시야스</option>
    <option value="5">디레지에</option>
    <option value="6">힐더</option>
    <option value="7">프레이</option>
    <option value="8">시로코</option>
</select>
<input type="text" name="캐릭터이름" bind:value={name} placeholder="캐릭터 이름 입력">
<button on:click={searchCharacter}>검색</button>
<button on:click={addRow}>행 추가</button>
<table>
    <thead>
        <tr>
            <th rowspan="2">캐릭터</th>
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
        {#each tableData as row (row["순서"])}
        <tr>
            <td>{row["캐릭터"]}</td>
            <td><input type="checkbox" bind:checked={row["흉몽"]}></td>
            <td><input type="checkbox" bind:checked={row["여신전"]}></td>
            <td><input type="checkbox" bind:checked={row["애쥬어"]}></td>
            <td><input type="checkbox" bind:checked={row["달잠호"]}></td>
            <td><input type="checkbox" bind:checked={row["계곡"]}></td>
            <td><input type="checkbox" bind:checked={row["꿈솔"]}></td>
            <td><input type="checkbox" bind:checked={row["안개신"]}></td>
            <td><input type="checkbox" bind:checked={row["싱글나벨"]}></td>
            <td><input type="checkbox" bind:checked={row["매칭나벨"]}></td>
            <td><input type="checkbox" bind:checked={row["레이드나벨"]}></td>
            <td><input type="checkbox" bind:checked={row["베누스1단"]}></td>
            <td><input type="checkbox" bind:checked={row["베누스2단"]}></td>
            <td><input type="checkbox" bind:checked={row["패스지정"]}></td>
            <td><input type="checkbox" bind:checked={row["PC방"]}></td>
            <td>{row["종말의계시"]}</td>
            <td>{row["헬"]}</td>
        </tr>
        {/each}
    </tbody>
</table>