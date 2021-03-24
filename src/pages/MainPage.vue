<template>
  <q-page class="page-style">
    <div class="parent-div column">
      <div class="col-11 self-center row items-center">
        <div class="row">
          <div
            v-for="(data, index) in itemList"
            :key="index"
            class="col-6 row q-pl-sm q-pr-sm"
            @click="changeState(data.link)"
          >
            <div v-if="index % 2 == 0" class="col-6"></div>
            <div
              :class="data.link==null?'card-color':''"
              :style="
                index == 5
                  ? 'padding: 25px 0px 30px 0px'
                  : 'padding: 35px 0px 40px 0px'
              "
              class="shadow-3 col-6 q-mb-md menu-div text-center"
            >
              <div>{{ data.value }}</div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
    <q-footer class=" bg-white flex flex-center text-black">
        Copyright @ Inaequo, all rights reserved 2020
      </q-footer>
  </q-page>
</template>

<script>
import notification from "../common/notificationsAndDialogues.js";
import { mapGetters, mapActions } from "vuex";
export default {
  mixins: [notification],
  data() {
    return {
      itemList: [
        {
          value: "Sale",
          link: "/orderPage",
        },
        {
          value: "Import",
        },
        {
          value: "Sales Report",
          link: "/saleOrder",
        },
        {
          value: "Stock",
        },
        {
          value: "Products",
          link: "/products",
        },
        {
          value: "Notification Configuration",
        },
      ],
    };
  },
  computed: {
  },
  methods: {
    
    changeState(route) {
      this.$router.push(route);
    },
  },
  created() {
  },
};
</script>

<style scoped>
.card-color{
background-color: rgb(216, 216, 216);
}
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
.menu-div {
  border-radius: 8px;
}
</style>