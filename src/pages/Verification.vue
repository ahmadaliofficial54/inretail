<template>
  <q-page class="page-style">
    <div class="parent-div column">
      <div class="logo-div flex flex-center col-4">
        <q-img
          alt="Verification logo"
          class="logo"
          src="../statics/logos/verification.png"
        />
      </div>
      <div class="btn-div column q-pa-md col-7">
        <span class="q-pb-sm text-h6 flex flex-center">Verification</span>
        <span class="q-pb-sm flex flex-center"
          >OTP has been sent to your contact number</span
        >
        <div class="row justify-center">
          <q-input
            dense
            outlined
            class="col-5"
            v-model.trim="otp"
            mask="             #      #      #      #      #      #"
            fill-mask
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter contact number',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="las la-key" />
            </template>
          </q-input>
        </div>
        <div class="row justify-center">
          <q-btn
            class="col-5 verify-btn"
            @click="OTPValidation"
            label="Continue"
            text-color="white"
          />
        </div>
      </div>

      <div class=" col-1 flex flex-center text-black">
          Copyright @ Inaequo, all rights reserved 2020
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import router from "../router";
import notification from "../common/notificationsAndDialogues.js";
export default {
  mixins: [notification],
  data() {
    return {
      otp: null,
    };
  },
  computed: {
    ...mapGetters("authentication", ["getLoginResponse", "getImeiResponse"])
  },
  methods: {
    ...mapActions("authentication", ["validateOTP"]),
    OTPValidation(){
      let request = {};
      request.userId = this.getLoginResponse.id;
      let otpForRequest = this.otp.split(" ").join("");
      request.otp = otpForRequest;
      this.validateOTP(request).then(response => {
        if(response == true){
          if(this.getImeiResponse.organizationId == 0){
            this.$router.push("changePassword");
          }
          else{
            this.$router.push("mainPage")
          }
        }
        else{
          this.alertMessage("Error!", "Invalid OTP.");
        }
      })
    }
  },
};
</script>

<style scoped>
.page-style {
  height: 0px;
}
.logo {
  height: 250px;
  max-width: 200px;
}
.parent-div {
  height: 100%;
}
.powered-by-img {
  height: 40px;
  width: 40px;
  margin-left: 5px;
}
.text-tag {
  font-size: 15px;
}
.verify-btn{
  background:linear-gradient(to right, black , #0173bc)
}
</style>