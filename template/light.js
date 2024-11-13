/**
 * 打包出口
 * @param {string} name - 组件名称
 */
const entryTemplate = (name) => `import ${name} from './index.vue';
import panelComponent from './panel.js';
export {
    ${name},
    panelComponent
}`;

/**
 * Panel 配置模版
 * @param {string} name - 组件名称
 */
const panelTemplate = () => `
const panelComponent = [];
export default panelComponent;
`;


/**
 * vue 模版
 * @param {string} name - 组件名称
 * @param {string} content - AI 生成 HTML 内容
 */
const vueTemplate = (name, content) => `
<template>
${content}
</template>

<script>
import ${name}Panel from "./panel";
export default {
    name: '${name}',
    props: {
        options: {
            type: Object,
            default: () => ${name}Panel
        },
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {}
}
</script>
<style lang="scss" src="./index.scss" scoped></style>
`;

export { entryTemplate, panelTemplate, vueTemplate };

