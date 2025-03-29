<template>
  <div v-if="user" class="c-block verifyEmailBlock">
    <i class="pi pi-envelope text-2xl mb-4"></i>
    <h3 class="mb-2">Verify Email</h3>
    <p class="mb-3">We have sent you a verification email to:</p>
    <div class="mb-4">
      <Tag severity="warn">{{ user.email }}</Tag>
    </div>
    <div>
      <Loader v-if="sendingEmail" type="none" class="my-auto"></Loader>

      <template v-else>
        <Button
          label="Check Verification"
          severity="secondary"
          icon="pi pi-refresh"
          class="mr-3"
          @click="checkVerification"
        ></Button>
        <Button
          label="Resend Email"
          severity="secondary"
          icon="pi pi-envelope"
          @click="sendEmailVerification"
        ></Button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sendingEmail: false,
    }
  },

  computed: {
    user() {
      return useAuthStore().user
    },
  },

  methods: {
    async checkVerification() {
      console.log("[User] ::: Email Verification Check ::")
    },
    async sendEmailVerification() {
      this.sendingEmail = true
      await this.$fire.actions.resendEmailVerification()

      this.$bus.$emit("toast", {
        severity: "success",
        summary: "Email Sent",
        detail: "Successfully sent verification email.",
      })

      setTimeout(() => {
        this.sendingEmail = false
      }, 3000)
    },
  },
}
</script>
