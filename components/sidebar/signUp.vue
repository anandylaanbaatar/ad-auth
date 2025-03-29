<template>
  <Drawer
    v-model:visible="active"
    position="right"
    class="sidebar accountSidebar"
    :header="$utils.t('Sign Up')"
    :blockScroll="true"
  >
    <!--Step 1-->
    <template v-if="step === 1">
      <h1 class="my-3 md:my-5 lg:my-6">{{ $utils.t("Welcome") }}</h1>

      <FormsAuthSignUp></FormsAuthSignUp>
    </template>

    <!--Step 2-->
    <!-- <FormsPhoneCode v-else-if="step === 2" :phone="form.phone"></FormsPhoneCode> -->

    <div class="bottom">
      <div @click="$bus.$emit('openSidebar', 'account')" class="btn">
        {{ $utils.t("Already have an account?") }}
        <strong>{{ $utils.t("Sign In") }}</strong>
      </div>
    </div>
  </Drawer>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      step: 1,
    }
  },
}
</script>
