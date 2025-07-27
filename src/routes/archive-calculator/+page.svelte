<script>
// @ts-nocheck
import { onMount, tick } from 'svelte';

let apiResult = {};
let errorMsg = '';
let isPowerOfEssence = false;
let isLoading = false;
let selectedPart = null;
let dialogElement;
let disassemblerPrice = 500;

const equipmentParts = [
    { id: '상의', name: '상의', images: ['coat1.png', 'coat2.png', 'coat3.png'] },
    { id: '하의', name: '하의', images: ['pants1.png', 'pants2.png', 'pants3.png'] },
    { id: '어깨', name: '머리어깨', images: ['shoulder1.png', 'shoulder2.png', 'shoulder3.png'] },
    { id: '벨트', name: '벨트', images: ['belt1.png', 'belt2.png', 'belt3.png'] },
    { id: '신발', name: '신발', images: ['shoes1.png', 'shoes2.png', 'shoes3.png'] },
    { id: '장신구', name: '장신구', images: ['bracelet.png', 'necklace.png', 'ring.png'] },
    { id: '특수장비', name: '특수장비', images: ['subequipment.png', 'magicstone.png', 'earrings.png'] },
    { id: '레전융합석', name: '레전융합석', images: ['legendaryfusionstone1.png', 'legendaryfusionstone2.png', 'legendaryfusionstone3.png'] },
    { id: '에픽융합석', name: '에픽융합석', images: ['epicfusionstone1.png', 'epicfusionstone2.png', 'epicfusionstone3.png'] },
    { id: '태초융합석', name: '태초융합석', images: ['primevalfusionstone1.png', 'primevalfusionstone2.png'] },
    { id: '레전밀봉', name: '레전융합석(밀봉)', images: ['sealedlegendaryfusionstone1.png', 'sealedlegendaryfusionstone2.png', 'sealedlegendaryfusionstone3.png'] }
];

const CACHE_DURATION = 60 * 1000; 
let cachedResults = {};

onMount(() => {
    fetchData();
});

$: if (selectedPart && dialogElement) {
  tick().then(() => {
    dialogElement.focus();
  });
}

async function fetchData(fetchType) {
  isLoading = true;
  const toggle = isPowerOfEssence ? '힘의 정수' : '종말의 계시';
  const now = Date.now();
  const cached = cachedResults[toggle];

  if ((cached && (now - cached.timestamp < CACHE_DURATION)) && fetchType != "refresh") {
    apiResult = cached.data;
    errorMsg = '';
    isLoading = false;
    return; 
  }

  errorMsg = '';
  try {
    const res = await fetch(`/archive-calculator?toggle=${toggle}&disassemblerPrice=${disassemblerPrice}`);
    if (!res.ok) {
      errorMsg = await res.text();
      apiResult = {};
    } else {
    const newData = await res.json();
    apiResult = newData;
    cachedResults[toggle] = {
      data: newData,
      timestamp: Date.now()
    };
    }
  } catch (e) {
    errorMsg = '서버 요청 중 오류 발생';
    apiResult = {};
  } finally {
    isLoading = false;
  }
}

function handleToggle() {
  isPowerOfEssence = !isPowerOfEssence;
  fetchData();
}

function handleKeydown(event) {
  if (selectedPart && event.key === 'Escape') {
    selectedPart = null;
  }
}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">기록실 효율 계산기</h1>

    <div class="flex items-center justify-between mb-8">
      <div class="w-40"></div>

      <div class="flex items-center justify-center">
        <span class="mr-3 text-lg font-medium text-gray-900">종말의 계시</span>
        <label for="toggle" class="inline-flex relative items-center cursor-pointer">
          <input type="checkbox" id="toggle" class="sr-only peer" checked={isPowerOfEssence} on:change={handleToggle}>
          <div class="w-14 h-8 bg-gray-300 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 transition-colors"></div>
          <div class="absolute top-1 left-1 bg-white border-gray-300 border rounded-full h-6 w-6 transition-transform peer-checked:translate-x-full"></div>
        </label>
        <span class="ml-3 text-lg font-medium text-gray-900">힘의 정수</span>
      </div>

      <div class="w-40 flex items-end justify-end space-x-2">
        <div>
          <label for="disassembler-price" class="block text-right text-sm font-medium text-gray-700">해체기 비용</label>
          <input
            type="number"
            id="disassembler-price"
            bind:value={disassemblerPrice}
            class="w-20 p-1 border border-gray-300 rounded-md shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
          />
        </div>
        <button 
          on:click={() => fetchData("refresh")}
          class="p-2 bg-cyan-500 text-white rounded-md shadow-sm hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
          aria-label="데이터 갱신"
        >
        <img src="refreshButton.png" alt="갱신" class="w-5">
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {#each equipmentParts as part (part.id)}
        <div 
          class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between transition-transform hover:scale-105 cursor-pointer"
          on:click={() => selectedPart = part}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === 'Enter' && (selectedPart = part)}
        >
          <div>
            <h2 class="text-xl font-semibold text-center mb-3 text-gray-700">{part.name}</h2>
            <div class="flex justify-center items-center space-x-2 mb-3 h-12">
              {#each part.images as image}
                <img src={`/archive-calculator/${image}`} alt={part.name} class="h-10 w-10 object-contain">
              {/each}
            </div>
          </div>
          
          <div class="text-center mt-2">
            {#if isLoading}
              <p class="text-lg font-bold text-gray-500 mb-1">갱신중...</p>
            {:else if apiResult[part.id] !== undefined && apiResult[part.id] !== null}
              <p class="text-lg font-bold text-gray-800 mb-1">{apiResult[part.id]}</p>
              {#if part.id === '레전밀봉'}
                {#if apiResult[part.id] > 0}
                  <p class="text-sm font-medium text-green-600">이상 판매해야 이득</p>
                {/if}
              {:else}
                {#if apiResult[part.id] > 0}
                  <p class="text-sm font-medium text-blue-600">판매가 이득</p>
                {:else if apiResult[part.id] < 0}
                  <p class="text-sm font-medium text-red-600">해체가 이득</p>
                {:else}
                  <p class="text-sm font-medium text-gray-500">동일</p>
                {/if}
              {/if}
            {/if}
          </div>
        </div>
      {/each}
    </div>

    {#if selectedPart}
      <div 
        bind:this={dialogElement}
        tabindex="-1" 
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 outline-none" 
        on:click|self={() => selectedPart = null} 
        on:keydown={handleKeydown}
        role="dialog" 
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative mx-4">
          <button on:click={() => selectedPart = null} class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl leading-none" aria-label="Close modal">&times;</button>
          <h2 class="text-2xl font-bold text-center mb-4 text-gray-800">{selectedPart.name}</h2>
          <div class="flex justify-center items-center space-x-2 mb-4">
            {#each selectedPart.images as image}
              <img src={`/archive-calculator/${image}`} alt={selectedPart.name} class="h-12 w-12 object-contain">
            {/each}
          </div>
          <div class="text-center">
            {#if isLoading}
              <p class="text-xl font-bold text-gray-500">갱신중...</p>
            {:else if apiResult[selectedPart.id] !== undefined && apiResult[selectedPart.id] !== null}
              <p class="text-2xl font-bold text-gray-800 mb-2">{apiResult[selectedPart.id]}</p>
              {#if selectedPart.id === '레전밀봉'}
                {#if apiResult[selectedPart.id] > 0}
                  <p class="text-md font-medium text-green-600">이상 판매해야 이득</p>
                {/if}
              {:else}
                {#if apiResult[selectedPart.id] > 0}
                  <p class="text-md font-medium text-blue-600">판매가 이득</p>
                {:else if apiResult[selectedPart.id] < 0}
                  <p class="text-md font-medium text-red-600">해체가 이득</p>
                {:else}
                  <p class="text-md font-medium text-gray-500">동일</p>
                {/if}
              {/if}
            {:else}
              <p class="text-lg text-gray-500">데이터가 없습니다.</p>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    {#if errorMsg}
      <p class="text-center text-red-600 mt-8 font-semibold">{errorMsg}</p>
    {/if}
    </div>
</div>
