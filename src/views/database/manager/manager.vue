<style lang="less">
    @import "./manager.less";
    @import '../../../styles/common.less';
</style>

<template>
    <div class="database-manager">
        <setting-database-modal :title="modal.settingDatabaseModal.title" @close="closeModal" :data="modal.settingDatabaseModal.data" v-model="modal.settingDatabaseModal.trigger"></setting-database-modal>
        <Row class="margin-bottom-10">
            <Col>
            <Card>
                <p slot="title">
                    <Row type="flex" align="middle">
                        <icon-awesome :width="14" :heigt="14" name="cogs"></icon-awesome>
                        <span class="padding-left-6">数据库</span>
                    </Row>
                </p>
                <a href="#" slot="extra" @click="addDatabase">
                    <Icon type="plus"></Icon>
                    添加
                </a>
                <div>数据库添加/删除</div>
            </Card>
            </Col>
        </Row>
        <Row :gutter="10">
            <Col span="8" class="margin-bottom-10" v-for="database in databaseList" :key="database.id">
            <Card>
                <p slot="title">
                    <Row type="flex" align="middle">
                        <icon-awesome :width="14" :heigt="14" name="database"></icon-awesome>
                        <span class="padding-left-6" v-text="database.name"></span>
                    </Row>
                </p>
                <a href="#" slot="extra" class="color-error-important" @click.prevent="deleteDatabase(database)">
                    <Icon type="trash-b"></Icon>
                    删除
                </a>
                <div v-text="`${database.type} 数据库`"></div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import settingDatabaseModal from './modals/settingDatabaseModal/settingDatabaseModal.vue';
    import { getDatabaseList, deleteDatabase } from '@/services/database';

    export default {
        name: 'entity-fresh',
        components: {
            settingDatabaseModal
        },
        data () {
            return {
                databaseList: [],
                modal: {
                    settingDatabaseModal: {
                        trigger: false,
                        title: '添加数据库',
                        data: {}
                    }
                }
            };
        },
        methods: {
            getList () {
                getDatabaseList().then(result => {
                    this.databaseList = result.data.data;
                }).catch(error => {
                    throw error;
                });
            },
            closeModal () {
                this.getList();
            },
            deleteDatabase (database) {
                deleteDatabase({id: database.id}).then(result => {
                    this.getList();
                }).catch(error => {
                    throw error;
                });
            },
            addDatabase (event) {
                event.preventDefault();
                this.modal.settingDatabaseModal.title = '添加数据库';
                this.modal.settingDatabaseModal.trigger = true;
            }
        }
    };
</script>