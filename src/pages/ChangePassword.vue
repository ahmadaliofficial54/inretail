<template>
  <q-page class="page-style">
    <div class="parent-div column">
      <div class="col-11 self-center row items-center">
        <div>
          <div class="logo-div">
            <q-img
              alt="In retail logo"
              class="logo"
              src="../statics/logos/logo.png"
            />
          </div>
          <div class="fields-div column">
            <span class="q-pb-sm text-tag">Change Password</span>
            <q-input
              dense
              outlined
              v-model="oldPassword"
              type="password"
              placeholder="Old Password"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter password',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-lock" />
              </template>
            </q-input>
            <q-input
              dense
              outlined
              v-model="password"
              @input="password == confirmPassword ? btnFlg=false: btnFlg=true"
              type="password"
              placeholder="New Password"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter password',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-lock" />
              </template>
            </q-input>
            <q-input
              dense
              outlined
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              @input="password == confirmPassword ? btnFlg=false: btnFlg=true"
              lazy-rules
              :rules="[
                (val) => (val == password) || 'Passwords are not same',
                (val) => (val && val.length > 0) || 'Please enter password',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-lock" />
              </template>
            </q-input>
            <q-btn
              label="Continue"
              class="cp-btn"
              :disable="btnFlg"
              text-color="white"
              @click="savePassword"
            />
          </div>
        </div>
      </div>

      <div class="col-1 flex flex-center text-black">
        Copyright @ Inoequo, all rights reserved 2020
      </div>
    </div>
  </q-page>
</template>

<script>
import { Device } from "@ionic-native/device";
import notification from "../common/notificationsAndDialogues.js";
import { mapGetters, mapActions } from "vuex";
export default {
  mixins: [notification],
  data() {
    return {
      oldPassword: "",
      password: "",
      confirmPassword: "",
      IMEI: Device.uuid,
      btnFlg: true
      // IMEI: "b4203a693d86e42e",
    };
  },
  computed: {
    ...mapGetters("authentication", ["getLoginResponse"]),
  },
  methods: {
    ...mapActions("authentication", ["changePasswordAfterOtp"]),
    ...mapActions("categories", ["fetchAllItems"]),
    async getAllItems() {
      this.$q.loading.show();
      await this.fetchAllItems(this.getLoginResponse.branchId).then(() => {
        this.$q.loading.hide();
      });
    },
    async savePassword() {
      let request = {};
      request.id = this.getLoginResponse.id;
      request.password = this.oldPassword;
      request.newPassword = this.password;
      request.imei = this.IMEI;
      await this.changePasswordAfterOtp(request).then(async response=>{
        if (response.errorMessage == "SUCCESS") {
          await this.getAllItems();
          this.$router.push("mainPage");
        } else {
          this.alertMessage("Error!", "Invalid old passwrod.");
        }
      })
    },
  },
};
</script>

<style scoped>
.logo {
  height: 300px;
  max-width: 310px;
}
.logo-div {
  text-align: center;
}
.page-style {
  height: 0px;
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
.forgot-text {
  margin-top: -10px;
  align-self: flex-end;
}
.signup-text {
  color: blue;
}
.fields-div {
  min-width: 300px;
  margin-top: -30px;
}
.cp-btn{
  background:linear-gradient(to right, black , #0173bc)
}
</style>