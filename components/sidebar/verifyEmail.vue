<template>
  <Drawer
    v-model:visible="active"
    position="right"
    class="sidebar accountSidebar"
    :blockScroll="true"
    :showCloseIcon="false"
    :dismissable="false"
  >
    <FormsAuthVerifyEmail></FormsAuthVerifyEmail>

    <div class="bottom">
      <div @click="useAuthStore().logout()" class="btn">
        {{ $utils.t("Sign out from website?") }}
        <strong>{{ $utils.t("Logout") }}</strong>
      </div>
    </div>
  </Drawer>
</template>

<script>
export default {
  computed: {
    user() {
      return useAuthStore().user
    },
    active() {
      const config = useRuntimeConfig()

      if (config.public.features.auth.type === "shopify") {
        return false
      } else if (config.public.features.auth.type === "firebase") {
        if (this.user && !this.user.emailVerified) {
          return true
        }
      }

      return false
    },
  },
}
</script>
