<script>
// @ts-nocheck

  let apiResult = null;
  let errorMsg = '';

  async function fetchTest() {
    errorMsg = '';
    try {
      const res = await fetch(`/test`);
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

<h1>테스트 페이지</h1>
<p>아래 버튼을 누르면 서버에서 api 값을 받아옵니다.</p>

<button on:click={fetchTest}>요청</button>

{#if apiResult !== null}
  <p>{apiResult}</p>
{/if}

{#if errorMsg}
  <p style="color:red">{errorMsg}</p>
{/if}