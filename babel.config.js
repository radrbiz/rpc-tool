module.exports = {
  "presets": [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    [
      "transform-imports",
      {
        "vuetify": {
          "transform": "vuetify/es5/components/${member}",
          "preventFullImport": true
        }
      }
    ]
  ]

}
