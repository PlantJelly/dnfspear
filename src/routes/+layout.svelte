<script>
    import '../app.css';
    import { page } from '$app/stores';
</script>
<title>DNF Spear</title>
<div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-md sticky top-0 z-50">
        <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-center h-16">
                <div class="flex items-center space-x-4">
                    <a href="/archive-calculator"
                        class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        class:text-cyan-600={$page.url.pathname.startsWith('/archive-calculator')}
                        class:text-gray-600={!$page.url.pathname.startsWith('/archive-calculator')}
                        class:hover:bg-gray-200={!$page.url.pathname.startsWith('/archive-calculator')}>
                        기록실 효율 계산기
                    </a>
                    <a href="/doomoracle-week"
                        class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        class:text-cyan-600={$page.url.pathname.startsWith('/doomoracle-week')}
                        class:text-gray-600={!$page.url.pathname.startsWith('/doomoracle-week')}
                        class:hover:bg-gray-200={!$page.url.pathname.startsWith('/doomoracle-week')}>
                        주간 계시 계산기
                    </a>
                </div>
            </div>
        </nav>
    </header>

    <main>
        <slot />
    </main>

<footer class="flex flex-col items-center py-4 space-y-2">
    <a href="http://developers.neople.co.kr" target="_blank">
    <img src="/neopleBrandIdentity.png" alt="Neople 오픈 API">
    </a>
    <a href="https://open.kakao.com/o/slgSXyIh" target="_blank">
    <img src="/kakaotalk.png" alt="오픈채팅" class="w-10">
    </a>
    <p>©DNFSpear. All Rights Reserved.</p>
</footer>
</div>
