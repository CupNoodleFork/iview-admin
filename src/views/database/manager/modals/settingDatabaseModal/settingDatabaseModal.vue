<style lang="less">
    @import "./settingDatabaseModal.less";
    @import "../../../../../styles/common.less";
</style>

<template>
    <Modal v-model="trigger" ref="modal" :mask-closable="false" :title="title" width="600" @on-visible-change="afterClose" class-name="setting-database-modal">
        <div>
            <Steps :current="step" style="margin-bottom: 30px">
                <Step title="设置" content="设置数据库信息"></Step>
                <Step title="连接" content="连接测试"></Step>
                <Step title="保存" content="保存数据库信息"></Step>
            </Steps>
            <div v-if="step === 0">
                <Form ref="form" :model="form" :rules="formValidate" :label-width="80" class="form-wrap">
                    <FormItem label="类型" prop="type">
                        <Select v-model="form.type" placeholder="数据库类型...">
                            <Option value="oracle">Oracle</Option>
                            <Option value="mysql">MySql</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="地址" prop="host">
                        <Input v-model="form.host" placeholder="数据库地址..."></Input>
                    </FormItem>
                    <FormItem label="端口号" prop="port">
                        <Input v-model="form.port" placeholder="数据库端口号..."></Input>
                    </FormItem>
                    <FormItem label="实例名" v-if="form.type === 'oracle'" prop="serviceName">
                        <Input v-model="form.serviceName" placeholder="数据库实例名..."></Input>
                    </FormItem>
                    <FormItem label="用户名" prop="username">
                        <Input v-model="form.username" placeholder="数据库用户名..."></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="数据库密码..." :icon="showPassword ? 'eye-disabled' : 'eye'" @on-click="showPassword = !showPassword"></Input>
                    </FormItem>
                </Form>
            </div>
            <div v-if="step === 1">
                <Row type="flex" align="middle" justify="center" style="height: 100px;" v-if="linkSuccess === undefined">
                    <Icon type="link" :size="20"></Icon>
                    <span class="margin-left-10">请进行数据库连接测试</span>
                </Row>
                <Row type="flex" align="middle" justify="center" style="height: 100px;" v-if="linkSuccess === false" class="color-error">
                    <Icon type="close-round" :size="16"></Icon>
                    <span class="margin-left-10">连接测试失败</span>
                </Row>
                <Row type="flex" align="middle" justify="center" style="height: 100px;" v-if="linkSuccess === true" class="color-success">
                    <Icon type="checkmark-round" :size="16"></Icon>
                    <span class="margin-left-10">连接测试成功</span>
                </Row>
            </div>
            <div v-if="step === 2">
                <Form ref="infoForm" :model="form" :rules="formValidate" :label-width="80" class="form-wrap">
                    <FormItem label="名称" prop="name">
                        <Input v-model="form.name" placeholder="数据库名称..."></Input>
                    </FormItem>
                    <FormItem label="描述">
                        <Input type="textarea" :autosize="true" :rows="5" v-model="form.description" placeholder="数据库描述..."></Input>
                    </FormItem>
                </Form>
            </div>
        </div>
        <Row type="flex" justify="end" slot="footer">
            <Button type="primary" v-if="step === 0" @click.native="toLinkTest">
                <span>下一步</span>
            </Button>
            <Button type="text" v-if="step === 1" @click.native="step = 0; linkSuccess = undefined;">
                <span>上一步</span>
            </Button>
            <Button type="primary" v-if="step === 1" @click.native="linkDatabase">
                <span v-text="linkSuccess ? '下一步' : '连接'"></span>
            </Button>
            <Button type="primary" v-if="step === 2" @click.native="save">
                <span>完成</span>
            </Button>
        </Row>
    </Modal>
</template>

<script>
import { testDatabase, saveDatabase } from '@/services/database';

export default {
    name: 'settingDatabaseModal',
    props: {
        value: Boolean,
        title: String
    },
    created () {
        this.trigger = this.value;
    },
    watch: {
        value (newValue) {
            this.trigger = newValue;
            if (newValue) { // open
                this.init();
            }
        },
        trigger (newValue) {
            this.$emit('input', newValue);
            if (!newValue) {
                this.$emit('close', newValue);
            }
        }
    },
    data () {
        const validateHost = (rule, value, callback) => {
            const rep = /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;

            rep.test(value) ? callback() : callback(new Error('请填写正确的地址'));
        };

        return {
            trigger: false,
            step: 0,
            showPassword: false,
            linkSuccess: undefined,
            form: {
                name: '',
                description: '',
                serviceName: '',
                dbName: '',
                type: 'oracle',
                host: '0.0.0.0',
                port: '1433',
                username: '',
                password: ''
            },
            formValidate: {
                name: [
                    { required: true, message: '数据库名称不能为空', trigger: 'blur' }
                ],
                host: [
                    { required: true, message: '数据库地址不能为空', trigger: 'blur' },
                    { validator: validateHost, trigger: 'blur' }
                ],
                serviceName: [
                    { required: true, message: '数据库实例名不能为空', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '数据库端口号不能为空', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        init () {
            this.step = 0;
        },
        afterClose (value) {
            if (!value) {
                this.linkSuccess = undefined;
                this.showPassword = false;

                Object.assign(this.form, {
                    name: '',
                    description: '',
                    serviceName: '',
                    dbName: '',
                    type: 'oracle',
                    host: '0.0.0.0',
                    port: '1433',
                    username: '',
                    password: ''
                });
            }
        },
        toLinkTest () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.step = 1;
                }
            });
        },
        linkDatabase () {
            if (this.linkSuccess) {
                this.step = 2;
            } else {
                const params = {
                    dataBaseType: this.form.type,
                    username: this.form.username,
                    password: this.form.password,
                    url: this.form.host,
                    port: this.form.port
                };
                if (params.type === 'oracle') {
                    params.serviceName = this.form.serviceName;
                }
                testDatabase(params).then(result => {
                    if (result.data.status !== 0) {
                        this.linkSuccess = true;
                    } else {
                        this.linkSuccess = false;
                    }
                }).catch(error => {
                    this.linkSuccess = false;
                    throw error;
                });
            }
        },
        save () {
            this.$refs['infoForm'].validate(valid => {
                if (valid) {
                    return;
                    const params = {
                        name: this.form.name,
                        dataBaseType: this.form.type,
                        username: this.form.username,
                        password: this.form.password,
                        url: this.form.host,
                        port: this.form.port
                    };
                    if (params.type === 'oracle') {
                        params.serviceName = this.form.serviceName;
                    }
                    saveDatabase(params).then(result => {
                        if (result.data.status !== 0) {
                            this.trigger = false;
                        } else {
                            this.$Message.error({content: result.data.msg});
                        }
                    }).catch(error => {
                        throw error;
                    });
                }
            });
        }
    }
};
</script>
