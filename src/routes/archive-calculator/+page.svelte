<script>
// @ts-nocheck

  let apiResult = {};
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
      apiResult = await res.json();
    } catch (e) {
      errorMsg = '서버 요청 중 오류 발생';
      apiResult = null;
    }
  }
</script>

<style>
  .box{
    width: 100px;
    height: auto;
    border: 1px solid black;
    text-align: center;
    display: inline-block;
  }
</style>

<h1>기록실 효율 계산기</h1>

<button  on:click={fetchTest}>갱신</button>
<br>

<div id="equipment">
<div class="box" id="coat">
  <p>상의</p>
  <img src="archive-calculator/coat1.png" alt="상의">
  <img src="archive-calculator/coat2.png" alt="상의">
  <img src="archive-calculator/coat3.png" alt="상의">
  {#if apiResult["상의"] !== null}
    <p>{apiResult["상의"]}</p>
  {/if}
  {#if apiResult["상의"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["상의"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="pants">
  <p>하의</p>
  <img src="archive-calculator/pants1.png" alt="하의">
  <img src="archive-calculator/pants2.png" alt="하의">
  <img src="archive-calculator/pants3.png" alt="하의">
  {#if apiResult["하의"] !== null}
    <p>{apiResult["하의"]}</p>
  {/if}
  {#if apiResult["하의"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["하의"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="shoulder">
  <p>머리어깨</p>
  <img src="archive-calculator/shoulder1.png" alt="머리어깨">
  <img src="archive-calculator/shoulder2.png" alt="머리어깨">
  <img src="archive-calculator/shoulder3.png" alt="머리어깨">
  {#if apiResult["어깨"] !== null}
    <p>{apiResult["어깨"]}</p>
  {/if}
  {#if apiResult["어깨"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["어깨"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="belt">
  <p>벨트</p>
  <img src="archive-calculator/belt1.png" alt="벨트">
  <img src="archive-calculator/belt2.png" alt="벨트">
  <img src="archive-calculator/belt3.png" alt="벨트">
  {#if apiResult["벨트"] !== null}
    <p>{apiResult["벨트"]}</p>
  {/if}
  {#if apiResult["벨트"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["벨트"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="shoes">
  <p>신발</p>
  <img src="archive-calculator/shoes1.png" alt="신발">
  <img src="archive-calculator/shoes2.png" alt="신발">
  <img src="archive-calculator/shoes3.png" alt="신발">
  {#if apiResult["신발"] !== null}
    <p>{apiResult["신발"]}</p>
  {/if}
  {#if apiResult["신발"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["신발"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="accessories">
  <p>장신구</p>
  <img src="archive-calculator/bracelet.png" alt="팔찌">
  <img src="archive-calculator/necklace.png" alt="목걸이">
  <img src="archive-calculator/ring.png" alt="반지">
  {#if apiResult["장신구"] !== null}
    <p>{apiResult["장신구"]}</p>
  {/if}
  {#if apiResult["장신구"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["장신구"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="specialequipment">
  <p>특수장비</p>
  <img src="archive-calculator/subequipment.png" alt="보조장비">
  <img src="archive-calculator/magicstone.png" alt="마법석">
  <img src="archive-calculator/earrings.png" alt="귀걸이">
  {#if apiResult["특수장비"] !== null}
    <p>{apiResult["특수장비"]}</p>
  {/if}
  {#if apiResult["특수장비"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["특수장비"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="legendaryfusionstone">
  <p>레전융합석</p>
  <img src="archive-calculator/legendaryfusionstone1.png" alt="레전융합석(보조장비)">
  <img src="archive-calculator/legendaryfusionstone2.png" alt="레전융합석(목걸이)">
  <img src="archive-calculator/legendaryfusionstone3.png" alt="레전융합석(반지)">
  {#if apiResult["레전융합석"] !== null}
    <p>{apiResult["레전융합석"]}</p>
  {/if}
  {#if apiResult["레전융합석"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["레전융합석"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="epicfusionstone">
  <p>에픽융합석</p>
  <img src="archive-calculator/epicfusionstone1.png" alt="에픽융합석(팔찌)">
  <img src="archive-calculator/epicfusionstone2.png" alt="에픽융합석(목걸이)">
  <img src="archive-calculator/epicfusionstone3.png" alt="에픽융합석(반지)">
  {#if apiResult["에픽융합석"] !== null}
    <p>{apiResult["에픽융합석"]}</p>
  {/if}
  {#if apiResult["에픽융합석"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["에픽융합석"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="primevalfusionstone">
  <p>태초융합석</p>
  <img src="archive-calculator/primevalfusionstone1.png" alt="태초융합석(목걸이)">
  <img src="archive-calculator/primevalfusionstone2.png" alt="태초융합석(반지)">
  {#if apiResult["태초융합석"] !== null}
    <p>{apiResult["태초융합석"]}</p>
  {/if}
  {#if apiResult["태초융합석"] > 0}
    <p>판매가 이득</p>
  {:else if apiResult["태초융합석"] < 0}
    <p>해체가 이득</p>
  {/if}
</div>

<div class="box" id="sealedlegendaryfusionstone">
  <p>레전융합석(밀봉)</p>
  <img src="archive-calculator/sealedlegendaryfusionstone1.png" alt="레전융합석(보조장비)(밀봉)">
  <img src="archive-calculator/sealedlegendaryfusionstone2.png" alt="레전융합석(마법석)(밀봉)">
  <img src="archive-calculator/sealedlegendaryfusionstone3.png" alt="레전융합석(귀걸이)(밀봉)">
  {#if apiResult["레전밀봉"] !== null}
    <p id="레전밀봉">{apiResult["레전밀봉"]}</p>
  {/if}
  {#if apiResult["레전밀봉"] > 0}
    <p>이상 판매해야 이득</p>
  {/if}
</div>
</div>

{#if errorMsg}
  <p style="color:red">{errorMsg}</p>
{/if}