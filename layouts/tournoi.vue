<template>
    <div class="flex flex-col min-h-screen bg-lbg dark:bg-dbg">
        <Navbar />
        <div class="flex-1 grid grid-cols-3 gap-6 mx-8 mt-8">
            <main
                class="p-6 bg-white dark:bg-dcardbg shadow-md rounded col-span-2 flex flex-col border border-lborder dark:border-dborder">
                <HeaderMain />
                <NuxtPage />
            </main>
            <FormTournament />
        </div>
        <Footer />
    </div>
</template>