<template>
  <q-page class="page-style">
    <div class="parent-div column">
      <div class="col-10 self-center row items-center">
        <div>
          <div class="logo-div">
            <q-img
              alt="School care logo"
              class="logo"
              src="../statics/logos/logo.png"
            />
          </div>
          <div class="column fields-div">
            <span class="q-pb-sm text-tag">Login to your Account</span>

            <q-input
              dense
              v-if="imeiFlag"
              outlined
              v-model="orgId"
              placeholder="Oranization Code"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter organization id'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-user" />
              </template>
            </q-input>

            <q-input
              dense
              outlined
              v-model="userName"
              placeholder="User Name"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter user name'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-user" />
              </template>
            </q-input>

            <q-input
              dense
              outlined
              v-model="password"
              type="password"
              placeholder="Password"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter password'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="las la-lock" />
              </template>
            </q-input>
            <!-- <span class="text-tag q-pt-sm forgot-text">Forgot Password?</span> -->
            <q-btn
              @click="validateUser"
              :disable="
                password.length > 0 && userName.length > 0 ? false : true
              "
              label="Login"
              no-caps
              text-color="white"
              class="login-button"
            />
            <!-- <div class="q-pt-lg flex flex-center">
          Don't have an Account?
          <span @click="signup" class="text-tag q-ml-sm signup-text">Signup</span>
        </div> -->
          </div>
        </div>
      </div>

      <!-- <div class="col-1 flex flex-center text-black">
        
      </div> -->
    </div>
    <!-- <q-footer class="flex flex-center text-black footer-class">
      Copyright @ Inaequo, all rights reserved 2020
    </q-footer> -->
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
      orgId: "",
      userName: "",
      password: "",
      // IMEI: window.device === void 0
      //   ? 'Run this on a mobile/tablet device'
      //   : window.device,
      IMEI: Device.uuid,
      // IMEI: "b4203a693d86e42e",
      imeiFlag: false,
      encryptedPassword: ""
    };
  },
  computed: {
    ...mapGetters("authentication", [
      "getLoginResponse",
      "getHandShake",
      "getImeiResponse"
    ])
  },
  methods: {
    ...mapActions("authentication", [
      "test",
      "loginUser",
      "getIMEIIsRegistered",
      "getHandShakeResponse",
      "getEncrptedMessage",
      "signUp",
      "fetchNewToken"
    ]),
    ...mapActions("categories", ["fetchAllItems"]),
    signup() {
      this.$router.push("signup");
    },
    async getAllItems() {
      this.$q.loading.show();
      await this.fetchAllItems(this.getLoginResponse.branchId).then(() => {
        this.$q.loading.hide();
      });
    },
    forgotPassword() {
      this.$router.push("forgotPassword");
    },
    async checkImeiRegistered() {
      this.$q.loading.show();
      await this.getIMEIIsRegistered(this.IMEI).then(() => {
        this.$q.loading.hide();
        if (this.getImeiResponse.organizationId == 0) {
          this.imeiFlag = true;
        } else {
          if (this.getLoginResponse.refreshToken != undefined) {
            this.$router.push("mainPage");
          }
        }
      });
    },
    async getEncryptedPaasword() {
      let request = this.password + ", " + this.getHandShake;
      await this.getEncrptedMessage(request).then(response => {
        this.encryptedPassword = response;
      });
    },
    async validateUser() {
      // this.fetchNewToken();
      this.$q.loading.show();
      await this.getEncryptedPaasword();
      let request = {};
      request.Username = this.userName;
      // request.Password = this.encryptedPassword;
      request.Password = this.password;
      if (this.imeiFlag) {
        request.OrgnanizationNo = this.orgId;
        request.IMEI = this.IMEI;
        await this.signUp(request);
      } else {
        request.OrgnanizationNo = this.getImeiResponse.organizationId;
        await this.loginUser(request);
      }
      if (this.getLoginResponse.token == undefined) {
        this.$q.loading.hide();
        this.alertMessage("Error!", "Invalid username or password.");
      } else {
        if (this.imeiFlag) {
          this.$q.loading.hide();
          this.$router.push("verification");
        } else {
          this.$q.loading.hide();
          await this.getAllItems();
          this.$router.push("mainPage");
        }
      }
    }
  },
  async created() {
    await this.checkImeiRegistered();
    await this.getHandShakeResponse();
  }
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
.footer-class {
  background-color: white;
}
.login-button{
  /* background-color: #0173bc; */
  background:linear-gradient(to right, black , #0173bc)
}
</style>
