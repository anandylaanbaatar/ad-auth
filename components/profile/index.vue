<template>
  <Loader v-if="loading"></Loader>

  <template v-else>
    <div v-if="account" class="profileArea">
      <ProfileInfo :account="account" @updated="updated"></ProfileInfo>

      <!--Shopify Only-->
      <template v-if="isShopify">
        <ProfileOrders :account="account"></ProfileOrders>
        <ProfileAddress
          ref="profileAddress"
          :account="account"
        ></ProfileAddress>
      </template>

      <!--Stripe Only-->
      <PlanSubscriptions
        v-if="isStripe && theme.type !== 'commerce'"
      ></PlanSubscriptions>

      <ProfileNotifications :account="account"></ProfileNotifications>
      <ProfileSettings></ProfileSettings>

      <Button
        :label="$utils.t('Logout')"
        block
        icon="pi pi-sign-out"
        iconPos="right"
        severity="secondary"
        class="w-full mb-6 p-3"
        @click="logout"
      ></Button>
    </div>
  </template>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      customerData: null,
    }
  },

  computed: {
    theme() {
      return useAppConfig().theme
    },
    account() {
      const store = useAuthStore()
      return store.user
    },
    isShopify() {
      return useRuntimeConfig().public.features.auth.type === "shopify"
    },
    isFirebase() {
      return useRuntimeConfig().public.features.auth.type === "firebase"
    },
    isStripe() {
      if (typeof this.$stripe !== "undefined") {
        return true
      }
      return false
    },
  },

  async created() {
    this.loading = false

    if (this.$route.query.sidebar === "account") {
      this.$router.push({
        path: this.$route.path,
      })
    }
  },

  methods: {
    logout() {
      this.$confirm.require({
        group: "global",
        message: this.$utils.t("Are you sure you want to Logout?"),
        header: this.$utils.t("Logout"),
        rejectLabel: this.$utils.t("Cancel"),
        acceptLabel: this.$utils.t("Confirm"),
        accept: async () => {
          await useAuthStore().logout()
        },
      })
    },
    newAddress() {
      if (!this.loading) {
        setTimeout(() => {
          this.$refs.profileAddress.newAddress()
        }, 1000)
      } else {
        setTimeout(() => {
          this.$refs.profileAddress.newAddress()
        }, 100)
      }
    },
    async updated() {
      console.log("Profile updated!")
      await useAuthStore().setUser()
    },
  },
}
</script>
