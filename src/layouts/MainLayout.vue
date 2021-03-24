<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="in-white-color" elevated>
      <q-toolbar>
        <q-img alt="School care logo" class="logo" src="../statics/logos/logo.png" />

        <q-toolbar-title class="title ">
          <span class="text-color">
          Sab FtaFat
          </span>
        </q-toolbar-title>

        <div class="text-black q-pt-xs">
        <span class="userName q-pr-xs">Hi, {{getLoginResponse.userName}}</span>
        </div>
        <div class="text-black">
          
          <!-- <span>Hi, {{getLoginUser.Name}}</span> -->
          <q-icon size="md" color="blue" @click="goToMainPage" class="q-pl=sm q-pr-sm" name="home"/>
          <q-icon size="md" @click="logoutUser" name="fas fa-sign-out-alt"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters("authentication", ["getLoginResponse"])
  },
  methods:{
    ...mapActions("authentication", ["logout"]),
    logoutUser(){
      this.logout().then(()=>{
        this.$router.push("/")
      });
      
    },
    goToMainPage(){
      this.$router.push("mainPage")
    }
  }
}
</script>
<style scoped>
.logo {
  margin:-10px 0px 0px -30px;
  height: 50px;
  width: 100px;
}
.title{
  margin-top: 5px;
  margin-left: -40px;
  /* font-family: Edwardian Script ITC; */
  font-weight: bold;
  font-size: 25px;
}
.userName{
  /* font-family: Blackadder ITC; */
  font-size: 13px;
}
.text-color{
  background-image: linear-gradient(to right, black , #0173bc); /* Standard syntax; must be last */
  color:transparent;
  -webkit-background-clip: text;
  background-clip: text;
}
</style>