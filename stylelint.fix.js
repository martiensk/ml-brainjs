const stylelint = require('stylelint');
const path = require('path');

stylelint.lint({
    files: path.join(__dirname, 'styles', '*'),
    fix: true,
    configOverrides: {
        "rules": {
            "order/order": [
                "dollar-variables",
                "declarations",
                "at-rules",
                "rules"
            ],
            "order/properties-alphabetical-order": true
        }
    }
});