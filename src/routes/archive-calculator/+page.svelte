<script>
// @ts-nocheck
import { onMount } from 'svelte';

let apiResult = {};
let errorMsg = '';
let isPowerOfEssence = false;
let isLoading = false;

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

async function fetchData() {
  isLoading = true;
  const toggle = isPowerOfEssence ? '힘의 정수' : '종말의 계시';
  const now = Date.now();
  const cached = cachedResults[toggle];

  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    apiResult = cached.data;
    errorMsg = '';
    isLoading = false;
    return; 
  }

  errorMsg = '';
  try {
    const res = await fetch(`/archive-calculator?toggle=${toggle}`);
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
</script>

<div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">기록실 효율 계산기</h1>

    <div class="flex items-center justify-center mb-8">
      <span class="mr-3 text-lg font-medium text-gray-900">종말의 계시</span>
      <label for="toggle" class="inline-flex relative items-center cursor-pointer">
        <input type="checkbox" id="toggle" class="sr-only peer" checked={isPowerOfEssence} on:change={handleToggle}>
        <div class="w-14 h-8 bg-gray-300 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 transition-colors"></div>
        <div class="absolute top-1 left-1 bg-white border-gray-300 border rounded-full h-6 w-6 transition-transform peer-checked:translate-x-full"></div>
      </label>
      <span class="ml-3 text-lg font-medium text-gray-900">힘의 정수</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {#each equipmentParts as part (part.id)}
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between transition-transform hover:scale-105">
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

    {#if errorMsg}
      <p class="text-center text-red-600 mt-8 font-semibold">{errorMsg}</p>
    {/if}
    </div>
</div>
