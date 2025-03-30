// import { defu } from "defu"
// import { createResolver } from "@nuxt/kit"
// import { defineNuxtConfig } from "nuxt/config"
// const { resolve } = createResolver(import.meta.url)

let remote = process.env.NODE_ENV === "development" ? "Local" : "Production"

console.log(`[Layer] :: Adding AD Auth [${remote}] - v1.2.0`)

/**
 * Config
 */

// const config = defineNuxtConfig({
//   components: true,
// })

/**
 * Middleware
 */

// const middlewares = defineNuxtConfig({
//   middleware: [resolve("./middleware/auth.global.js")],
// })

/**
 * Modules
 */

// const modules = defineNuxtConfig({
//   pinia: {
//     storesDirs: [resolve("stores/**")],
//   },
// })

// export default defu(config, middlewares, modules)

export default defineNuxtConfig({
  components: {
    path: "components",
    pathPrefix: true,
    global: true,
  },

  middleware: ["./middleware/auth.global.js"],
})
