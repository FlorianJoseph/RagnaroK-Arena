<template>
    <div class="flex flex-col min-h-screen bg-lbg dark:bg-dbg ">
        <Navbar />
        <main
            class="flex-1 mx-8 p-6 bg-white dark:bg-dcardbg shadow-md rounded mt-8 border border-lborder dark:border-dborder ">
            <NuxtPage />
        </main>
        <Footer />
    </div>
</template>