<template>
  <div class="c-form row">
    <div class="c-field col-xs-6">
      <label for="firstName">{{ $utils.t("First Name") }}</label>
      <InputText
        id="firstName"
        v-model="form.firstName"
        aria-describedby="firstName-help"
        :placeholder="$utils.t('First Name')"
        :invalid="errors.firstName"
        @change="validation"
      />
      <small v-if="errors.firstName" id="firstName-help" class="error">{{
        errors.firstName
      }}</small>
    </div>

    <div class="c-field col-xs-6">
      <label for="lastName">{{ $utils.t("Last Name") }}</label>
      <InputText
        id="lastName"
        v-model="form.lastName"
        aria-describedby="lastName-help"
        :placeholder="$utils.t('Last Name')"
        :invalid="errors.lastName"
        @change="validation"
      />
      <small v-if="errors.lastName" id="lastName-help" class="error">{{
        errors.lastName
      }}</small>
    </div>

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

    <!--Phone Number-->
    <div class="c-field col-xs-12">
      <label for="phone">{{ $utils.t("Phone") }}</label>

      <InputGroup>
        <InputGroupAddon class="c-phoneDropdown-wrapper">
          <Select
            v-model="form.selectedCountry"
            :options="allCountries"
            optionLabel="name"
            :placeholder="$utils.t('Select')"
            class="c-phoneDropdown"
            @change="validation"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                <img
                  :alt="slotProps.value.label"
                  :src="`https://flagcdn.com/w20/${slotProps.value.code.toLowerCase()}.png`"
                  :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
                />
                <div>{{ slotProps.value.dialCode }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <img
                  :alt="slotProps.option.label"
                  :src="`https://flagcdn.com/w20/${slotProps.option.code.toLowerCase()}.png`"
                  :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
                />
                <div>
                  {{ slotProps.option.dialCode }} -
                  {{ slotProps.option.name }}
                </div>
              </div>
            </template>
          </Select>
        </InputGroupAddon>

        <InputText
          id="phone"
          class="c-phoneDropdown-input"
          v-model="form.phone"
          aria-describedby="phone-help"
          :placeholder="$utils.t('Phone')"
          autocomplete="off"
          :invalid="errors.phone"
          @change="validation"
        />
      </InputGroup>

      <small v-if="errors.phone" id="phone-help" class="error">{{
        errors.phone
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
      />
      <small
        v-if="errors.password"
        id="password-help"
        class="error"
        v-html="errors.password"
      ></small>
    </div>

    <div class="c-field col-xs-12">
      <div class="c-checkbox">
        <Checkbox
          v-model="acceptsMarketing"
          inputId="acceptsMarketing"
          name="acceptsMarketing"
          :binary="true"
          @change="validation"
        />
        <label for="acceptsMarketing">{{
          $utils.t("Subscribe to email marketing")
        }}</label>
      </div>
    </div>

    <div class="c-field col-xs-12">
      <Loader v-if="loading" type="none" class="mx-auto"></Loader>

      <template v-else>
        <Button
          :label="$utils.t('Sign Up')"
          severity="contrast"
          class="blockBtn w-full"
          @click="signUp"
          :disabled="!isValid"
        ></Button>
      </template>

      <template v-if="errors['system']">
        <Message
          v-for="error in errors['system']"
          :key="`error_${error}`"
          severity="error"
          icon="pi"
          closable
          class="mt-3 c-message"
        >
          {{ error.message }}
        </Message>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Forms
      form: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        phoneCode: null,
        selectedCountry: null,
        password: null,
      },
      isValid: false,
      acceptsMarketing: true,
      errors: {},
      loading: false,
    }
  },

  computed: {
    allCountries() {
      return this.$forms.phoneCountries()
    },
  },

  mounted() {
    this.setPhoneCountry()
  },

  methods: {
    setPhoneCountry() {
      const store = useAuthStore()

      // Set Phone Code User Location
      if (store.userLocation) {
        if (store.userLocation.country_code) {
          this.form.selectedCountry = this.allCountries.find(
            (i) => i.code === store.userLocation.country_code
          )
          this.form.phoneCode = this.form.selectedCountry.dialCode
        }
      }

      // Set From LocalStorage
      if (!this.form.selectedCountry) {
        const userLocationData = localStorage.getItem("userLocation")

        if (userLocationData) {
          const userLocation = JSON.parse(userLocationData)

          if (userLocation.country_code) {
            this.form.selectedCountry = this.$forms.phoneCountryByCode(
              userLocation.country_code
            )

            this.form.phoneCode = this.form.selectedCountry.dialCode
          }
        }
      }

      // Set Default Phone Code
      if (!this.form.selectedCountry) {
        this.form.selectedCountry = this.allCountries.find(
          (i) => i.code === useAppConfig().theme.country
        )
        this.form.phoneCode = this.form.selectedCountry.dialCode
      }
    },

    // Form
    reset() {
      this.isValid = false
      this.errors = {}
    },
    validation() {
      const validation = this.$forms.validateForm(
        this.form,
        this.form.selectedCountry.code
      )
      this.isValid = validation.isValid
      this.errors = validation.errors
    },

    async signUp() {
      this.validation()

      if (this.isValid) {
        this.loading = true

        if (useRuntimeConfig().public.features.auth.type === "shopify") {
          await this.signUpShopify()
        } else if (
          useRuntimeConfig().public.features.auth.type === "firebase"
        ) {
          await this.signUpFirebase()
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

    async signUpShopify() {
      let formData = this.form
      let selectedCountry = this.form.selectedCountry

      // Modify Form Data
      delete formData.selectedCountry

      formData.phoneCode = selectedCountry.dialCode
      formData.acceptsMarketing = this.acceptsMarketing

      const signUpData = await this.$shopify.signUp(formData)
      const errorMsgs = signUpData.error

      // Error Occurred
      if (signUpData.error) {
        for (let i = 0; i < signUpData.error.length; i++) {
          let error = signUpData.error[i]
          this.errors[error.field] = error.message
        }

        this.isValid = false
        return
      }

      this.$bus.$emit("toast", {
        severity: "success",
        summary: this.$utils.t("Sign Up"),
        detail: this.$utils.t("Successfully created account."),
      })

      await useAuthStore().setUser()

      if (this.$route.path.includes("/checkout")) {
        this.$bus.$emit("closeSidebars")
      }
    },
    async signUpFirebase() {
      let formData = this.form
      let selectedCountry = this.form.selectedCountry

      // Modify Form Data
      delete formData.selectedCountry

      formData.phoneCode = selectedCountry.dialCode
      formData.acceptsMarketing = this.acceptsMarketing

      try {
        const user = await this.$fire.actions.signUp(formData)

        console.log("SignUp ::: Success :: ", user)

        let updates = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: user.displayName,
          phone: `${formData.phoneCode}${formData.phone}`,
          createdAt: user.metadata.createdAt,
          lastLoginAt: user.metadata.lastLoginAt,
          acceptsMarketing: formData.acceptsMarketing,
        }
        await this.$fire.actions.update(`/users/${user.uid}`, updates)
        await this.$fire.actions.resendEmailVerification()
        await useAuthStore().setUser()

        this.$bus.$emit("toast", {
          severity: "success",
          summary: this.$utils.t("Sign Up"),
          detail: this.$utils.t("Successfully created account."),
        })
        this.$bus.$emit("goTo", "/secure/verify-email")
      } catch (err) {
        console.log("SignUp ::: Error :: ", err)

        this.errors["system"] = err.msg
        this.isValid = false
      }
    },
  },
}
</script>
