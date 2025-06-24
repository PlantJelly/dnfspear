<script>
// @ts-nocheck

  let apiResult = null;
  let errorMsg = '';

  async function fetchTest() {
    errorMsg = '';
    try {
      const res = await fetch(`/archive-calculator`);
      if (!res.ok) {
        errorMsg = await res.text();
        apiResult = null;
        return;
      }
      apiResult = await res.text();
    } catch (e) {
      errorMsg = '서버 요청 중 오류 발생';
      apiResult = null;
    }
  }
</script>

<h1>기록실 효율 계산기</h1>

<button on:click={fetchTest}>요청</button>
<br>

{#if apiResult !== null}
  <p>{apiResult}</p>
{/if}

{#if errorMsg}
  <p style="color:red">{errorMsg}</p>
{/if}