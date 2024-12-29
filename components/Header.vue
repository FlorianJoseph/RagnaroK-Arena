<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
    <div class="header">
        <div class="header-left">
            <span>Logo</span>
            <p class="header-name">RagnaröK Arena</p>
        </div>
        <div class="header-right">
            <ToggleTheme />
            <div v-if="!user">
                <Modal />
            </div>
            <div v-if="user">
                <button class="profile-btn">
                    <span>Aybüke C.</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 16px 24px;
    position: relative;

    &-left,
    &-right {
        display: flex;
        align-items: center;
    }

    &-left {
        flex-grow: 1;
    }

    &-right button {
        margin-left: 10px;
    }

    &-name {
        color: #1f1c2e;
        margin: 0;
        font-size: 20px;
        line-height: 24px;
        font-weight: 700;
        margin: 0 32px;
    }
}

.profile-btn {
    padding: 0;
    border: 0;
    background-color: transparent;
    display: flex;
    align-items: center;
    padding-left: 12px;
    border-left: 2px solid #ddd;


    span {
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
    }
}
</style>