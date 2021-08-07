module.exports = {
    'env': {
        'browser': true,
        'es6': true,
    },
    'extends': [
        'plugin:react/recommended',
        'google',
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
    },
    'plugins': [
        'react',
    ],
    'rules': {
        'object-curly-spacing': [2, 'always'],
        'space-before-function-paren': [2, 'always'],
        'indent': ['error', 4],
        'semi': [2, 'never'],
        'react/prop-types': 0,
        'require-jsdoc': [0, {
            'require': {
                'FunctionDeclaration': true,
                'MethodDefinition': false,
                'ClassDeclaration': false
            }
        }],
        'max-len': ['error', { 'code': 120 }]
    },
}
