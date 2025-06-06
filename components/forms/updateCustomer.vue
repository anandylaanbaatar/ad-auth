<template>
  <div class="c-form row">
    <!--First Name-->
    <div class="c-field col-xs-6 mb-3">
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

    <!--Last Name-->
    <div class="c-field col-xs-6 mb-3">
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

    <!--Email Address-->
    <div class="c-field col-xs-12 mb-3">
      <label for="emailAddress">{{ $utils.t("Email Address") }}</label>
      <InputText
        id="emailAddress"
        v-model="form.email"
        aria-describedby="emailAddress-help"
        :placeholder="$utils.t('Email Address')"
        :invalid="errors.email"
        @change="validation"
        :disabled="true"
      />
      <small v-if="errors.email" id="emailAddress-help" class="error">{{
        errors.email
      }}</small>
    </div>

    <!--Phone Number-->
    <div class="c-field col-xs-12 mb-3">
      <label for="phone">{{ $utils.t("Phone") }}</label>

      <InputGroup>
        <InputGroupAddon class="c-phoneDropdown-wrapper">
          <Select
            v-if="allCountries"
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

    <!--Action Btns-->
    <div class="c-field col-xs-12 mb-0">
      <div class="flex justify-content-end gap-2 w-full">
        <Loader v-if="updating" type="sm"></Loader>

        <template v-else>
          <Button
            type="button"
            :label="$utils.t('Cancel')"
            severity="secondary"
            @click="$emit('close')"
          ></Button>

          <Button
            type="button"
            :label="$utils.t('Save')"
            @click="updateCustomer"
            :disabled="!isValid"
          ></Button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      updating: false,

      form: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        phoneCode: null,
        selectedCountry: null,
        acceptsMarketing: true,
      },
      isValid: false,
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        acceptsMarketing: true,
      },
    }
  },

  computed: {
    allCountries() {
      return this.$forms.phoneCountries()
    },
    accountPhone() {
      if (this.account && this.account.phone) {
        return this.$utils.parsePhoneNumber(this.account.phone)
      } else {
        return null
      }
    },

    isShopify() {
      return useRuntimeConfig().public.features.auth.type === "shopify"
    },
    isFirebase() {
      return useRuntimeConfig().public.features.auth.type === "firebase"
    },
    userCountry() {
      const store = useAuthStore()

      if (store.userLocation) {
        if (store.userLocation.country) {
          return store.userLocation.country.toLowerCase()
        } else if (store.userLocation.country_code) {
          return store.userLocation.country_code.toLowerCase()
        }
      }

      return null
    },
  },

  mounted() {
    this.reset()
    this.fillForm()
  },

  methods: {
    reset() {
      this.isValid = false
      this.errors = {}
    },
    validation() {
      this.reset()

      const validation = this.$forms.validateForm(
        this.form,
        this.form.selectedCountry.code
      )

      console.log("Validation ::: ", validation)

      this.isValid = validation.isValid
      this.errors = validation.errors
    },
    editProfileInfo() {},

    fillForm() {
      let newForm = {
        acceptsMarketing: this.account.acceptsMarketing,
        firstName: this.account.firstName,
        lastName: this.account.lastName,
        email: this.account.email,
        phone: this.account.phone,
        phoneCode: null,
        selectedCountry: null,
      }

      if (this.isShopify) {
        newForm.id = this.account.id
      }

      if (this.account.phone) {
        const parsedPhone = this.accountPhone

        if (parsedPhone) {
          let selectedCountry = this.$forms.phoneCountryByCode(
            parsedPhone.country
          )

          newForm.selectedCountry = selectedCountry
          newForm.phoneCode = `+${parsedPhone.countryCallingCode}`
          newForm.phone = parsedPhone.nationalNumber
        }
      } else {
        if (this.userCountry) {
          let selectedCountry = this.$forms.phoneCountryByCode(this.userCountry)
          newForm.selectedCountry = selectedCountry
          newForm.phoneCode = selectedCountry.dialCode
        }
      }

      this.form = newForm
    },

    async updateCustomer() {
      this.validation()
      this.updating = true

      if (this.isValid) {
        if (this.isShopify) {
          await this.updateCustomerShopify()
        } else if (this.isFirebase) {
          await this.updateCustomerFirebase()
        }
      }

      this.updating = false
    },

    /**
     * Integrations
     */

    async updateCustomerShopify() {
      const accessToken = this.$shopify.getUserToken()

      if (!accessToken) {
        console.log("Account ::: User not logged in")
        return
      }

      // Form Data
      let formData = this.form
      let selectedCountry = this.form.selectedCountry

      // Modify Form Data
      delete formData.selectedCountry
      delete formData.phoneCode

      formData.phone = `${selectedCountry.dialCode}${this.form.phone}`

      const res = await this.$shopify.updateCustomer(formData)

      // Error
      if (res.error) {
        this.errors["system"] = res.error
        return
      }

      this.$bus.$emit("toast", {
        severity: "success",
        summary: this.$utils.t("Update"),
        detail: this.$utils.t("Successfully updated account information"),
      })

      this.$bus.$emit("updateAccount")
      this.reset()
      await useAuthStore().setUser()
      this.$emit("updated")
    },
    async updateCustomerFirebase() {
      const user = await getCurrentUser()

      if (!user) {
        console.log("[Firebase] ::: User not logged in!")
        return
      }

      // Form Data
      let formData = this.form
      let selectedCountry = this.form.selectedCountry

      // Modify Form Data
      delete formData.id
      delete formData.selectedCountry
      delete formData.phoneCode

      formData.phone = `${selectedCountry.dialCode}${this.form.phone}`

      try {
        let updates = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }
        await this.$fire.actions.update(`/users/${user.uid}`, updates)

        this.$bus.$emit("toast", {
          severity: "success",
          summary: this.$utils.t("Update"),
          detail: this.$utils.t("Successfully updated account information"),
        })

        this.reset()
        await useAuthStore().setUser()
        this.$emit("updated")
      } catch (err) {
        console.log("[Firebase] ::: Update Customer :: Error:", err)

        this.errors["system"] = err.message
      }
    },
  },
}
</script>
