<template>
  <q-page class="page-style">
    <div class="parent-div">
      <div class="q-ma-sm">
        <div class="row justify-between">
          <span class="item-text q-pa-sm"> Sale Orders </span>
        </div>
        <div class="row justify-between">
          <!-- <q-card class="q-ma-sm q-pa-md card-class col-3 column">
              <q-icon color="blue" size="40px" name="lab la-first-order" />
              <span class="text-blue text-bold"> Today's Orders </span>
              <span>1,000</span>
            </q-card> -->
          <div class="row col-7">
            <q-card class="q-ma-sm q-pa-md card-class col-5 column">
              <q-icon color="blue" size="40px" name="lab la-first-order-alt" />
              <div class="text-blue text-bold row">
                <span class="col-12 glance-text"> Last Week </span>
              </div>
              <span class="text-bold">1,000</span>
            </q-card>
            <q-card class="q-ma-sm q-pa-md card-class col-5 column">
              <q-icon color="blue" size="40px" name="las la-boxes" />
              <span class=" text-bold glance-text"> All Orders </span>
              <span class="text-bold">1,000</span>
            </q-card>
          </div>
          <div class="col-5">
            <q-card class="q-ma-sm q-pa-sm">
              <div class="row">
                <q-input
                  dense
                  class="q-pl-sm col-8"
                  v-model="fromDate"
                  placeholder="From Date"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="fromDate"
                          mask="MM-DD-YYYY"
                          @input="() => $refs.qDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="row">
                <q-input
                  dense
                  class="q-pl-sm col-8"
                  v-model="toDate"
                  placeholder="To Date"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy1"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="toDate"
                          mask="MM-DD-YYYY"
                          @input="() => $refs.qDateProxy1.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="search-btn row justify-end">
                <q-btn
                  dense
                  no-caps
                  size="12px"
                  class="q-pl-sm q-pr-sm col-3 btn-color"
                  label="Search"
                  text-color="white"
                  @click="fetchAllOrders"
                />
              </div>
            </q-card>
          </div>
        </div>
      </div>
      <div class="q-pa-md">
        <q-table :data="rows" :columns="columns" :pagination.sync="pagination">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-bold"
                >{{ col.label }}</q-th
              >
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <span v-if="col.name !== 'action'">
                  {{ col.value }}
                </span>
                <div
                  class="text-blue action"
                  @click="viewOrder(props.row)"
                  v-if="col.name == 'action'"
                >
                  View
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { longClickDirective } from "vue-long-click";
import Vue from "vue";
import { date } from "quasar";
const longClickInstance = longClickDirective({ delay: 800, interval: 0 });
Vue.directive("longclick", longClickInstance);
import notification from "../common/notificationsAndDialogues.js";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  mixins: [notification],
  data() {
    return {
      fromDate: new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .join("-"),
      toDate: new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .join("-"),
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },
      columns: [
        {
          name: "sr",
          label: "Sr. No.",
          align: "left",
          field: "sr",
        },
        {
          name: "orderNo",
          align: "left",
          label: "Order No.",
          field: "orderNo",
        },
        { name: "createdOn", align: "left", label: "Date", field: "createdOn" },
        {
          name: "customerName",
          align: "left",
          label: "Customer Name",
          field: "customerName",
        },
        { name: "total", align: "right", label: "Amount", field: "total" },
        {
          name: "action",
          align: "center",
          label: "Action",
          field: "action",
        },
      ],
      rows: [],
    };
  },
  computed: {
    ...mapGetters("saleOrder", ["getOrders", "getOrder"]),
    ...mapGetters("authentication", ["getLoginResponse"]),
  },
  methods: {
    ...mapActions("saleOrder", [
      "getAllOrders",
      "getOrderById",
      "printSaleOrder",
    ]),
    ...mapActions("authentication", ["fetchNewToken", "logout"]),
    async viewOrder(data) {
      this.$q.loading.show();
      await this.printSaleOrder(data.id).then((response) => {
        this.$q.loading.hide();
        window.open(response, "_blank");
      });
      // console.log(data);
    },
    async fetchAllOrders() {
      this.$q.loading.show();
      let request = [];
      request.branchId = this.getLoginResponse.branchId;
      request.toDate = this.toDate + " 00:00:00.000";
      request.fromDate = this.fromDate + " 00:00:00.000";
      await this.getAllOrders(request).then(() => {
        this.$q.loading.hide();
        this.checkApiResponse();
      });
    },
    async checkApiResponse() {
      // console.log(this.getOrders);
      if (this.getOrders != undefined) {
        this.rows = _.cloneDeep(this.getOrders);
        this.addSerialNumber();
      } else {
        if (this.getLoginResponse.refreshToken != undefined) {
          let request = {};
          request.token = this.getLoginResponse.refreshToken;
          await this.fetchNewToken(request).then(() => {
            this.fetchAllOrders();
          });
        } else {
          this.logout().then(() => {
            this.$router.push("/");
          });
        }
      }
    },
    addSerialNumber() {
      this.rows.forEach((row, index) => {
        row.sr = index + 1;
        row.createdOn = date.formatDate(row.createdOn, "DD-MMM-YYYY");
      });
    },
  },
  created() {
    this.fetchAllOrders();
  },
};
</script>

<style scoped>
.page-style {
  height: 0px;
}
.parent-div {
  height: 100%;
}
.item-text {
  font-weight: bold;
  font-size: 20px;
  background-image: linear-gradient(to right, black , #0173bc); /* Standard syntax; must be last */
  color:transparent;
  -webkit-background-clip: text;
  background-clip: text;
}
.card-class {
  align-items: center;
}
.col-1 {
  width: 200px;
}
.search-btn {
  text-align: end;
}
.btn-color{
  background:linear-gradient(to right, black , #0173bc);
}
.action {
  cursor: pointer;
}
.glance-text {
  /* width: 150px; */
  /* text-align-last: center; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-image: linear-gradient(to right, black , #0173bc); /* Standard syntax; must be last */
  color:transparent;
  -webkit-background-clip: text;
  background-clip: text;
}
</style>