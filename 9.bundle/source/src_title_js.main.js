window["someName"].push([
  ["src_title_js"],
  {
    "./src/title.js": (module, exports, require) => {
      require.r(exports)
      require.d(exports, {
        default: () => _DEFAULT_EXPORT__,
      })
      const _DEFAULT_EXPORT__ = "title"
    },
  },
])
