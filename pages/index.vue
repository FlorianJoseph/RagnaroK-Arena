<template>
    <div class="app-container">
        <Header />
        <div class="app-content">
            <Sidebar />
            <div class="projects-section">
                <div class="projects-section-header">
                    <p>Tournois</p>
                    <p class="time">December, 12</p>
                </div>
                <div class="project-boxes jsGridView">Page content
                </div>
            </div>
            <div class="messages-section">
                <div class="projects-section-header">
                    <p>Aside</p>
                </div>
                <div class="messages">
                    Aside content
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');

* {
    box-sizing: border-box;
}

body {
    font-family: "Germania One", sans-serif;
    overflow: hidden;
}

button,
a {
    cursor: pointer;
}

:root {
    --app-container: #f3f6fd;
    --main-color: #1f1c2e;
    --secondary-color: #4A4A4A;
    --link-color: #1f1c2e;
    --link-color-hover: #c3cff4;
    --link-color-active: #fff;
    --link-color-active-bg: #1f1c2e;
    --projects-section: #fff;
    --message-box-hover: #fafcff;
    --message-box-border: #e9ebf0;
    --more-list-bg: #fff;
    --more-list-bg-hover: #f6fbff;
    --more-list-shadow: rgba(209, 209, 209, 0.4);
    --button-bg: #1f1c24;
    --search-area-bg: #fff;
    --star: #1ff1c2e;
    --message-btn: #fff;
}

.app {
    &-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #f3f6fd;
        transition: .2s;

        button,
        input,
        optgroup,
        select,
        textarea {
            font-family: "Germania One", sans-serif;
        }
    }

    &-content {
        display: flex;
        height: 100%;
        overflow: hidden;
        padding: 16px 24px 24px 0;
    }
}

.page-content {
    flex: 1;
    width: 100%;
}

.app-sidebar {
    padding: 40px 16px;
}

.projects-section {
    flex: 2;
    background-color: #fff;
    border-radius: 32px;
    padding: 32px 32px 0 32px;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        color: var(--main-color);

        p {
            font-size: 24px;
            line-height: 32px;
            font-weight: 700;
            opacity: .9;
            margin: 0;
            color: var(--main-color);
        }

        .time {
            font-size: 20px;
        }
    }
}

.messages-section {
    flex-shrink: 0;
    padding-bottom: 32px;
    background-color: #fff;
    margin-left: 24px;
    flex: 1;
    width: 100%;
    border-radius: 30px;
    position: relative;
    overflow: auto;
    transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);


    .projects-section-header {
        position: sticky;
        top: 0;
        z-index: 1;
        padding: 32px 24px 0 24px;
        background-color: #fff;
    }
}


.message-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .name {
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
        color: var(--main-color);
        margin: 0;
    }
}

.message-content {
    padding-left: 16px;
    width: 100%;
}

.project-boxes {
    margin: 0 -8px;
    overflow-y: auto;

    &.jsGridView {
        display: flex;
        flex-wrap: wrap;
    }
}


@media screen and (max-width: 980px) {
    .project-boxes.jsGridView .project-box-wrapper {
        width: 50%;
    }

}

@media screen and (max-width: 880px) {
    .messages-section {
        transform: translateX(100%);
        position: absolute;
        opacity: 0;
        top: 0;
        z-index: 2;
        height: 100%;
        width: 100%;

    }

}

@media screen and (max-width: 720px) {

    .app-name,
    .profile-btn span {
        display: none;
    }

    .app-header-right button {
        margin-left: 4px;
    }
}

@media screen and (max-width: 520px) {
    .projects-section {
        overflow: auto;
    }

    .project-boxes {
        overflow-y: visible;
    }

    .app-sidebar,
    .app-icon {
        display: none;
    }

    .app-content {
        padding: 16px 12px 24px 12px;
    }


    .app-header {
        padding: 16px 10px;
    }

    .search-input {
        max-width: 120px;
    }

    .project-boxes.jsGridView {
        width: 100%;
    }

    .projects-section {
        padding: 24px 16px 0 16px;
    }

    .profile-btn img {
        width: 24px;
        height: 24px;
    }

    .app-header {
        padding: 10px;
    }

    .search-input {
        font-size: 14px;
    }


    .project-boxes.jsListView {
        font-size: 10px;
    }
}
</style>