<template>
  <div class="c-form row">
    <!--Email Login-->
    <div class="c-field col-xs-12">
      <label for="email">{{ $utils.t("Email Address") }}</label>
      <InputText
        id="email"
        v-model="form.email"
        aria-describedby="email-help"
        :placeholder="$utils.t('Email Address')"
        :invalid="errors.email"
        @change="validation"
      />
      <small v-if="errors.email" id="email-help" class="error">{{
        errors.email
      }}</small>
    </div>
    <div class="c-field col-xs-12">
      <label for="password">{{ $utils.t("Password") }}</label>
      <Password
        v-model="form.password"
        :feedback="false"
        aria-describedby="password-help"
        :placeholder="$utils.t('Password')"
        :invalid="errors.password"
        @change="validation"
        @keypress.enter="login"
      />
      <small
        v-if="errors.password"
        id="password-help"
        class="error"
        v-html="errors.password"
      ></small>
    </div>
    <div class="c-field col-xs-12">
      <div class="flex flex-wrap w-full">
        <Loader v-if="loading" type="none" class="mx-auto"></Loader>

        <template v-else>
          <Button
            :label="$utils.t('Sign In')"
            severity="contrast"
            class="blockBtn w-full"
            @click="login"
            :disabled="!isValid"
          ></Button>
          <Button
            link
            :label="$utils.t('Forgot Password')"
            icon="pi pi-key"
            class="ml-auto mt-3"
            @click="$bus.$emit('openSidebar', 'resetPassword')"
          ></Button>
        </template>
      </div>
    </div>

    <!--Social Login-->
    <div
      v-if="useRuntimeConfig().public.features.auth.socialLogins"
      class="c-field col-xs-12"
    >
      <div class="c-divider mt-2 mb-6"></div>

      <Button
        label="Login with Google"
        class="w-full"
        icon="pi pi-google"
        @click="loginWithGoogle"
      ></Button>
    </div>

    <!--Error Message-->
    <div class="col-xs-12">
      <Message
        v-if="errors['system']"
        severity="error"
        icon="pi pi-times"
        closable
        class="mt-3 c-message"
      >
        {{ errors["system"] }}
      </Message>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isValid: false,
      form: {
        email: null,
        password: null,
      },
      errors: {},
      loading: false,
    }
  },

  methods: {
    reset() {
      this.isValid = false
      this.errors = {}
    },
    validation() {
      this.reset()
      const validation = this.$forms.validateForm(this.form)
      this.isValid = validation.isValid
      this.errors = validation.errors
    },

    async login() {
      this.validation()

      if (this.isValid) {
        this.loading = true

        if (useRuntimeConfig().public.features.auth.type === "shopify") {
          await this.loginShopify()
        } else if (
          useRuntimeConfig().public.features.auth.type === "firebase"
        ) {
          await this.loginFirebase()
        }

        this.loading = false
      }
    },
    redirect() {
      // Redirect after login
      if (window.location.pathname === "/checkout/v2") {
        window.location.href = "/checkout/v2"
      } else {
        window.location.href = `/?sidebar=account`
      }
    },

    // Integrations
    async loginShopify() {
      console.log("[Shopify] Login!")

      let formData = this.form

      const accessToken = await this.$shopify.login(formData)

      console.log("[Shopify] ::: Access Token :: ", accessToken)

      // Error
      if (accessToken.error) {
        this.errors["system"] = accessToken.error
        return
      }

      // Save Access Token
      localStorage.setItem("accessToken", JSON.stringify(accessToken))

      // Save User Data
      await useAuthStore().setUser()

      this.$bus.$emit("toast", {
        severity: "success",
        summary: "Login",
        detail: "Successfully logged in.",
      })

      if (this.$route.path.includes("/checkout")) {
        this.$bus.$emit("closeSidebars")
      }
    },
    async loginFirebase() {
      let formData = this.form

      try {
        const loginData = await this.$fire.actions.login(formData)
        const userData = await this.$fire.actions.user()

        if (loginData) {
          await this.$fire.actions.update(`/users/${loginData.uid}`, {
            emailVerified: loginData.emailVerified,
            lastLoginAt: loginData.metadata.lastLoginAt,
          })
        }

        console.log("Login ::: Success ::", loginData, userData)

        await useAuthStore().setUser(userData)

        this.$bus.$emit("toast", {
          severity: "success",
          summary: "Login",
          detail: "Successfully logged in.",
        })

        // Close Sidebar
        if (this.$route.path.includes("/checkout")) {
          this.$bus.$emit("closeSidebars")
        }
        // Verify Email
        if (!loginData.emailVerified) {
          this.$bus.$emit("goTo", "/secure/verify-email")
        }
      } catch (err) {
        console.log("Login ::: Error ::", err)

        if (err.code === "auth/invalid-credential") {
          this.errors["system"] = this.$utils.t(
            "Email or password is incorrect"
          )
        } else if (err.code === "auth/user-not-found") {
          this.errors["system"] = this.$utils.t("User not found")
        } else {
          this.errors["system"] = err.msg
        }
      }
    },
    async loginWithGoogle() {
      try {
        const userData = await this.$fire.actions.loginWithGoogle()

        console.log("Login ::: Success :: ", userData)

        if (userData) {
          const authStore = useAuthStore()

          authStore.set("userLoggedIn", true)
          authStore.set("user", userData)

          this.$bus.$emit("toast", {
            severity: "success",
            summary: "Login",
            detail: "Successfully logged in.",
          })
        }
      } catch (err) {
        console.log("Login ::: Error :: ", err)
        this.errors["system"] = err.msg
      }
    },
  },
}
</script>
