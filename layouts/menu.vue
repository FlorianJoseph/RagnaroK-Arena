<template>
    <div class="flex flex-col min-h-screen bg-lbg dark:bg-dbg">
        <Navbar />
        <main class="flex-1">
            <NuxtPage />
        </main>
        <Footer />
    </div>
</template>

<!-- <template>
    <div class="flex flex-col min-h-screen bg-lbg dark:bg-dbg bg-[url('/assets/images/bg.jpg')] bg-repeat bg-[size:100px] bg-opacity-50"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
        <Navbar />
        <main class="flex-1">
            <NuxtPage />
        </main>
        <Footer />
    </div>
</template> -->