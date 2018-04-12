<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index">
                <Dropdown transfer v-if="item.children.length !== 1" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <icon-awesome :width="20" :height="20" :style="`color: ${iconColor}`" v-if="item.iconType === 'font-awesome'" :name="item.icon"></icon-awesome>
                        <Icon v-else :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.name" :key="i">
                                <icon-awesome :width="12" :height="12" v-if="child.iconType === 'font-awesome'" :name="child.icon"></icon-awesome>
                                <Icon v-else :type="child.icon"></Icon>
                                <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">
                    <Button @click="changeMenu(item.children[0].name)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <icon-awesome :width="20" :height="20" :style="`color: ${iconColor}`" v-if="item.children[0].iconType === 'font-awesome'" :name="item.children[0].icon || item.icon"></icon-awesome>
                        <Icon v-else :size="20" :color="iconColor" :type="item.children[0].icon || item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem :name="item.children[0].name" :key="'d' + index">
                            <icon-awesome :width="12" :height="12" v-if="item.children[0].iconType === 'font-awesome'" :name="item.children[0].icon || item.icon"></icon-awesome>
                            <Icon v-else :type="item.children[0].icon || item.icon"></Icon>
                            <span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
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
    }
};
</script>
