<script setup lang="ts">
const links = [
    [{
        label: 'Profile',
        avatar: {
            src: 'https://avatars.githubusercontent.com/u/739984?v=4'
        },
        badge: 0
    }, {
        label: 'Menu',
        icon: 'i-heroicons-home',
        to: '/'
    }, {
        label: 'Connexion',
        icon: 'i-heroicons-user',
        to: '/login'
    }]
]
</script>

<template>
    <UHorizontalNavigation  :links="links" class="border-b border-gray-200 dark:border-gray-800" />
</template>