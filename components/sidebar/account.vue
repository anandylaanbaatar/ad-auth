<template>
  <Drawer
    v-model:visible="active"
    position="right"
    class="sidebar accountSidebar"
    :header="title"
    :blockScroll="true"
  >
    <Profile v-if="isLoggedIn" :key="profileKey" ref="profile"></Profile>

    <template v-else>
      <h1 class="mt-5 mb-6">{{ $utils.t("Hello") }}</h1>

      <FormsAuthLogin></FormsAuthLogin>

      <div class="bottom">
        <div @click="$bus.$emit('openSidebar', 'signUp')" class="btn">
          {{ $utils.t("Don't have an account yet?") }}
          <strong>{{ $utils.t("Sign Up") }}</strong>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      profileKey: 0,
    }
  },

  computed: {
    title() {
      if (this.isLoggedIn) {
        return this.$utils.t("Profile")
      } else {
        return this.$utils.t("Sign In")
      }
    },
    isLoggedIn() {
      const store = useAuthStore()
      return store.userLoggedIn
    },
  },

  methods: {
    newAddress() {
      setTimeout(() => {
        this.$refs.profile.newAddress()
      }, 500)
    },
  },
}
</script>
