<script setup>
const router = useRouter()
const loading = ref(false)

router.beforeEach(() => {
    loading.value = true
})

router.afterEach(() => {
    setTimeout(() => {
        loading.value = false
    }, 500)
})
</script>

<template>
    <div class="flex flex-col min-h-screen bg-lbg dark:bg-dbg ">
        <Navbar />
        <div class="flex flex-1">
            <SidebarNav />
            <main class="flex-1 p-6 overflow-hidden">
                <NuxtPage v-slot="{ Component, route }">
                    <Transition name="page-fade" mode="out-in">
                        <component :is="Component" :key="route.fullPath" />
                    </Transition>
                </NuxtPage>
            </main>
            <Toast />
        </div>
        <Footer />
    </div>
</template>

<style>
/* Transition de page avec Tailwind */
.page-fade-enter-active,
.page-fade-leave-active {
    @apply transition-opacity duration-500;
}

.page-fade-enter-from,
.page-fade-leave-to {
    @apply opacity-0;
}
</style>