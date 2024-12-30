<script setup>
const title = ref('Classement');
</script>

<template>
    <div class="w-full flex flex-col h-full transition-all duration-200">
        <Header />
        <div class="flex h-full overflow-hidden">
            <Sidebar />
            <div class="flex h-full overflow-hidden p-8 pb-0 rounded-3xl flex-col flex-grow">
                <HeaderMain :title="title" />
                <div class="flex flex-wrap -mx-2 overflow-y-auto">Page content
                </div>
            </div>
            <Aside />
        </div>
    </div>
</template>
