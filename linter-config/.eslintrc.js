module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    globals: {
        uni: 'readonly',
        plus: 'readonly',
        wx: 'readonly',
    },
    extends: ['plugin:vue/essential', 'eslint:recommended'],
    rules: {
        eqeqeq: [
        'warn',
        'always',
        {
            null: 'ignore',
        },
        ],
        semi: ['error', 'never'],
        'no-unused-vars': 'off',
        'vue/no-v-text-v-html-on-component': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-multiple-template-root': 'off',
    },
}
  