module.exports = {
  "plugins": {
    "postcss-import": {
      path: ['./src', './']
    },
    "postcss-custom-properties": {
      "importFrom": "./src/assets/c/const.css"
    },
    "autoprefixer": {},
    "postcss-preset-env": {
      "stage": 0
    }
  }
}
