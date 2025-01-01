<script setup>
const route = useRoute();

// Récupère le titre défini dans chaque page ou un titre par défaut
const pageTitle = route.meta.title || 'Menu';
</script>

<template>
    <div class="flex flex-col min-h-screen bg-lightBg dark:bg-darkBg">
        <Header />

        <!-- Main content -->
        <div class="flex flex-1">
            <!-- Sidebar -->
            <Sidebar />
            <!-- Page content -->
            <main class="flex-1 p-6 bg-white dark:dark:bg-stone-500 shadow-md rounded-lg transition-all duration-300 ease-[cubic-bezier(0.19,1,0.56,1)]">
                <HeaderMain :title="pageTitle" />
                <NuxtPage />
            </main>
            <Aside />
        </div>

        <!-- Footer -->
        <Footer />
    </div>
</template>