const OFF = 0;
const ON = 1;
const ERROR = 2;

module.exports = {
  'extends': 'airbnb',
  'plugins': ['json'],
  "parser": "babel-eslint",
  'rules': {
    // override RIDI style guide
    'class-methods-use-this': OFF,
    'max-len': [1, 140],
    'no-underscore-dangle': OFF,
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],

    // Allow in RIDI Account Team
    'react/jsx-filename-extension': ['error', { 'extensions': ['.test.js', '.jsx'] }],
    'react/forbid-prop-types': OFF,
    'jsx-a11y/click-events-have-key-events': OFF,
    'arrow-parens': ['error', 'as-needed'],
    'jsx-a11y/href-no-hash': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,
    'jsx-a11y/anchor-is-valid': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,
    "react/no-access-state-in-setstate": OFF,
    "react/destructuring-assignment": OFF,
  },
  "settings": { "import/resolver": { "node": { "paths": ["src", 'src/main', 'src/renderer'] } } },
  'env': {
    'browser': true,
    'node': true
  }
};
