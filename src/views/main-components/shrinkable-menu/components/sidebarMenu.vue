<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.children.length < 1" :name="item.name" :key="'menuitem' + item.name">
                <icon-awesome v-if="item.iconType === 'font-awesome'" :width="iconSize" :height="iconSize" :name="item.icon" :key="'menuicon' + item.name"></icon-awesome>
                <Icon v-else :type="item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item) }}</span>
            </MenuItem>

            <MenuItem v-if="item.children.length === 1" :name="item.children[0].name" :key="'menuitem' + item.children[0].name">
                <icon-awesome v-if="item.children[0].iconType === 'font-awesome'" :width="iconSize" :height="iconSize" :name="item.children[0].icon" :key="'menuicon' + item.children[0].name"></icon-awesome>
                <Icon v-else :type="item.children[0].icon" :size="iconSize" :key="'menuicon' + item.children[0].name"></Icon>
                <span class="layout-text" :key="'title' + item.children[0].name">{{ itemTitle(item.children[0]) }}</span>
            </MenuItem>

            <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.name">
                <template slot="title">
                    <Row type="flex" align="middle" style="flex-wrap: nowrap">
                        <icon-awesome v-if="item.iconType === 'font-awesome'" :name="item.icon" :width="iconSize" :height="iconSize"></icon-awesome>
                        <Icon v-else :type="item.icon" :size="iconSize"></Icon>
                        <span style="margin-left: 6px;" class="layout-text">{{ itemTitle(item) }}</span>
                    </Row>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="'menuitem' + child.name">
                        <icon-awesome v-if="child.iconType === 'font-awesome'" :name="child.icon" :width="iconSize" :height="iconSize"></icon-awesome>
                        <Icon v-else :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
