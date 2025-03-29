export default defineNuxtRouteMiddleware(async (to, from) => {
  // Client Only
  if (import.meta.client) {
    console.log("[Middleware] ::: [Auth] ::: Initialized!")

    const config = useRuntimeConfig()
    const nuxtApp = useNuxtApp()
    const authStore = useAuthStore()

    // Shopify Auth
    if (config.public.features.auth.type === "shopify") {
      const accessToken = localStorage.getItem("accessToken")
      const userToken = accessToken ? JSON.parse(accessToken).accessToken : null

      if (userToken === null) return

      const userData = await nuxtApp.$shopify.customer({
        access_token: nuxtApp.$shopify.getUserToken(),
      })

      if (userData === null) return

      authStore.set("user", userData)
      authStore.set("userLoggedIn", true)

      console.log("[Middleware] ::: [Auth] ::: User Set!")
    }

    // Firebase Auth
    if (config.public.features.auth.type === "firebase") {
      const user = await getCurrentUser()

      // Logged In User
      if (user && !authStore.user) {
        const userData = await nuxtApp.$fire.actions.user()

        authStore.set("user", userData)
        authStore.set("userLoggedIn", true)

        console.log("[Middleware] ::: [Auth] ::: User Set! ", userData)
      }

      // Check if email verified!
      if (authStore.user) {
        if (!user.emailVerified) {
          if (to.path !== "/secure/verify-email") {
            return navigateTo({
              path: "/secure/verify-email",
            })
          }
        } else if (user.emailVerified && !authStore.user.emailVerified) {
          console.log(
            "[Auth] ::: Middleware :: Check User Email Verified! ",
            user.emailVerified,
            authStore.user.emailVerified
          )

          await nuxtApp.$fire.actions.update(`/users/${user.uid}`, {
            emailVerified: user.emailVerified,
          })
        }
      }

      // Logged Out User
      if (!user && authStore.user) {
        authStore.set("user", null)
        authStore.set("userLoggedIn", false)
      }

      // Redirect if user not logged in.
      if (to.path.includes("/secure") && !user) {
        return navigateTo({
          path: "/",
          query: {
            sidebar: "account",
          },
        })
      }
    }
  }
})
