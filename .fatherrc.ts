import { defineConfig } from "father"
import * as fs from "fs"

export default defineConfig({
  esm: {},
  umd: {
    name: "BiliUserLog",
    chainWebpack: memo => {
      memo.output.libraryExport("default")
      return memo
    }
  },
  cjs: {}
})
