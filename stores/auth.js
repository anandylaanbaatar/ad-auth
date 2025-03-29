import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  id: "auth-store",

  state: () => ({
    user: null,
    userLoggedIn: false,
  }),

  actions: {
    set(key, data) {
      this[key] = data
    },

    async logout() {
      const config = useRuntimeConfig()
      const nuxtApp = useNuxtApp()

      if (config.public.features.auth.type === "shopify") {
        await nuxtApp.$shopify.logout()
      } else if (config.public.features.auth.type === "firebase") {
        await nuxtApp.$fire.actions.logout()
      }

      this.set("user", null)
      this.set("userLoggedIn", false)

      nuxtApp.$bus.$emit("closeSidebars")
      nuxtApp.$bus.$emit("toast", {
        summary: "Logout",
        detail: "Successfully logged out.",
      })

      if (window.location.pathname.includes("checkout")) {
        nuxtApp.$bus.$emit("goTo", "/")
      }
    },
    async setUser(user) {
      const config = useRuntimeConfig()

      if (config.public.features.auth.type === "shopify") {
        await this.setUserShopify(user)
      } else if (config.public.features.auth.type === "firebase") {
        await this.setUserFirebase(user)
      }
    },
    async setUserShopify(user) {
      if (user) {
        this.set("user", user)
        this.set("userLoggedIn", true)
        return
      }

      const nuxtApp = useNuxtApp()
      const userData = await nuxtApp.$shopify.customer({
        access_token: nuxtApp.$shopify.getUserToken(),
      })

      // Error
      if (userData && userData.error) {
        console.log("[Auth Store] ::: No Customer Found!", userData)

        // await nuxtApp.$shopify.logout()
        // nuxtApp.$bus.$emit("updateAccount")
        // window.location.href = "/"

        return
      }

      this.set("user", userData)
      this.set("userLoggedIn", true)

      console.log("[Auth Store] ::: User ::: ", userData)
    },
    async setUserFirebase(user) {
      if (user) {
        this.set("user", user)
        this.set("userLoggedIn", true)
        return
      }

      const nuxtApp = useNuxtApp()

      if (nuxtApp.$fire.actions.isLoggedIn()) {
        const userData = await nuxtApp.$fire.actions.user()

        if (userData) {
          this.set("user", userData)
          this.set("userLoggedIn", true)
        }
      }
    },
  },
})
