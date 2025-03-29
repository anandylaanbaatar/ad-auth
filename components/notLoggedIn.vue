<template>
  <section class="d-block py-5 mb-5 text-center">
    <i class="pi pi-user text-xl mb-3"></i>

    <h3 class="mb-3">{{ $t("Account") }}</h3>
    <p>{{ $t("Please login or sign up.") }}</p>

    <Button
      :label="$t('Login')"
      severity="secondary"
      class="mt-3 mr-3"
      @click="$bus.$emit('openSidebar', 'account')"
    ></Button>
    <Button
      :label="$t('Sign Up')"
      class="mt-3 mr-3"
      @click="$bus.$emit('openSidebar', 'signUp')"
    ></Button>
  </section>
</template>
