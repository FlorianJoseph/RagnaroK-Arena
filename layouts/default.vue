<template>
    <div class="flex flex-col min-h-screen bg-var(--custom-1) dark:bg-darkBg">
        <Navbar />
        <div class="flex-1 grid grid-cols-3 gap-6 px-6">
            <main class="ml-6 p-6 bg-white dark:bg-stone-500 shadow-md rounded col-span-2 flex flex-col">
                <HeaderMain />
                <NuxtPage />
            </main>
            <Aside />
        </div>
        <Footer />
    </div>
</template>