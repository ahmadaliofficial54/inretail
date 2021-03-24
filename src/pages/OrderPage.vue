<template>
  <q-page class="page-style">
    <div class="parent-div column">
      <div class="col-5 q-pa-md">
        <div class="row justify-between">
          <span class="item-text"> Current Order </span>
          <q-btn
            :disable="rows.length <= 0"
            no-caps
            @click="openPrompt"
            icon="las la-shopping-bag"
            class="btn-color"
            text-color="white"
            dense
          />
        </div>
        <q-table
          class="q-mt-sm"
          hide-pagination
          :data="rows"
          :columns="columns"
          virtual-scroll
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          :style="'height: 100%'"
          row-key="index"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span class="text-bold"> {{ col.label }} </span></q-th
              >
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                :style="col.name !== 'qty' ? '' : 'text-align: -webkit-right;'"
              >
                <span v-if="col.name !== 'qty' && col.name !== 'action'">
                  {{ col.value }}
                </span>
                <q-input
                  dense
                  :value="col.value"
                  style="max-width: 30px; text-align-last: center"
                  v-else-if="col.name == 'qty'"
                  @input="setAmount($event, props.pageIndex)"
                />
                <q-btn
                  v-else-if="col.name == 'action'"
                  size="10px"
                  rounded
                  dense
                  @click="deleteRow(props.pageIndex)"
                  color="red"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="q-pa-md q-pt-xl col-6">
        <div class="row justify-between">
          <div class="col-6">
            <span class="item-text"> Select Item </span>
            <q-breadcrumbs class="text-grey" active-color="black">
              <template v-slot:separator>
                <q-icon size="1.2em" name="arrow_forward" color="blue" />
              </template>
              <q-breadcrumbs-el
                v-for="(data, index) in breadcrumbs"
                :key="index"
                @click="changeState(data.label)"
                :label="data.label"
              />
            </q-breadcrumbs>
          </div>
          <div class="col-6">
            <q-input
              outlined
              rounded
              v-model="searchQuery"
              @input="searchProducts"
              dense
              placeholder="Search item here..."
            >
              <template v-slot:append>
                <q-icon size="15px" name="search" />
              </template>
            </q-input>
          </div>
        </div>
        <q-scroll-area
          :thumb-style="thumbStyle"
          style="height: 100%; width: 100%"
        >
          <div class="q-mt-sm row">
            <div
              v-for="(data, index) in itemList"
              :key="index"
              class="col-2 q-pl-sm q-pr-sm"
              @click="requestItem(data)"
              v-longclick="() => requestItemAtDoubleClick(index)"
            >
              <div class="shadow-3 q-mb-md menu-div text-center">
                <div class="q-pt-xs item-name-div">{{ data.name }}</div>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>
    <q-dialog v-model="prompt">
      <q-card style="min-width: 350px">
        <q-card-section class="q-pb-sm">
          <div class="text-bold">Customer Info</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-pb-sm">
          <q-input
            dense
            v-model="cName"
            outlined
            placeholder="Enter customer name"
            autofocus
          />
          <q-input
            dense
            class="q-pt-sm"
            outlined
            v-model="cContact"
            placeholder="Enter customer contact"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pt-none q-pr-md">
          <q-btn
            no-caps
            label="Add"
            class="btn-color"
            text-color="white"
            @click="placeOrder"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section class="q-pb-xs q-pt-sm">
          <div class="text-h6">Order placed successfully!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row justify-center">
            <span class="text-bold">Order No: </span>
            <span>{{orderResponse.orderNo}}</span>
          </div>
          <div class="row justify-center">
            <span class="text-bold">Order Amount: </span>
            <span>{{orderResponse.amount}}</span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            dense
            label="Print Order"
            no-caps
            @click="printOrder"
            class="btn-color"
            text-color="white"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { longClickDirective, P } from "vue-long-click";
import Vue from "vue";
const longClickInstance = longClickDirective({ delay: 800, interval: 0 });
Vue.directive("longclick", longClickInstance);
import notification from "../common/notificationsAndDialogues.js";
import { mapGetters, mapActions } from "vuex";
export default {
  mixins: [notification],
  data() {
    return {
      prompt: false,
      alert: false,
      orderResponse: [],
      cName: "",
      cContact: "",
      searchQuery: "",
      pagination: {
        rowsPerPage: 0,
      },
      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },
      requestItemFlag: true,
      itemList: [],
      breadcrumbs: [
        {
          label: "Home",
        },
        {
          label: "Categories",
        },
      ],
      columns: [
        {
          name: "sr",
          label: "Sr. No.",
          align: "left",
          field: "sr",
        },
        { name: "name", align: "left", label: "Item", field: "name" },
        { name: "code", align: "left", label: "Code", field: "code" },
        { name: "price", align: "right", label: "Price", field: "price" },
        { name: "qty", align: "right", label: "Qty", field: "qty" },
        { name: "amount", align: "right", label: "Amount", field: "amount" },
        {
          name: "action",
          align: "center",
          label: "Action",
          field: "action",
        },
      ],
      rows: [
        // {
        //   sr: 1,
        //   item: "Samosa",
        //   code: "00001",
        //   price: 20,
        //   qty: 3,
        //   amount: 60,
        //   action: "Delete",
        // },
      ],
    };
  },
  computed: {
    ...mapGetters("categories", ["getAllItems"]),
    ...mapGetters("authentication", ["getLoginResponse"]),
    ...mapGetters("saleOrder", ["getOrder"]),
  },
  methods: {
    ...mapActions("saleOrder", ["placeAnOrder", "printSaleOrder"]),
    ...mapActions("authentication", ["fetchNewToken", "logout"]),
    openPrompt() {
      this.prompt = true;
    },
    async printOrder() {
      this.$q.loading.show();
      await this.printSaleOrder(this.orderResponse.id).then((response) => {
        this.$q.loading.hide();
        this.orderResponse = [];
        window.open(response, "_blank");
      });
    },
    async placeOrder() {
      this.$q.loading.show();
      this.prompt = false;
      var request = {};
      request.CustomerName = this.cName;
      request.ContactNo = this.cContact;
      request.BranchId = this.getLoginResponse.branchId;
      request.CreatedBy = 1;
      request.SaleOrderDetail = [];
      this.rows.forEach((row) => {
        let orderDetailObject = {};
        orderDetailObject.itemId = row.id;
        orderDetailObject.quantity = row.qty;
        orderDetailObject.price = row.price;
        request.SaleOrderDetail.push(orderDetailObject);
      });
      await this.placeAnOrder(request).then(async (response) => {
        this.$q.loading.hide();
        if (response.errorMessage == "SUCCESS") {
          this.orderResponse = response;
          // this.$q.loading.show();
          // this.alertMessage("Success!", "Order has been placed.");
          this.rows = [];
          this.cName = "";
          this.cContact = "";
          this.alert = true;
          // this.printSaleOrder(response.id);
        } else if (response.errorMessage == undefined) {
          if (this.getLoginResponse.refreshToken != undefined) {
            this.fetchToken();
          } else {
            this.logout().then(() => {
              this.$router.push("/");
            });
          }
        }
      });
      // this.rows = [];
    },
    async fetchToken() {
      let request = {};
      request.token = this.getLoginResponse.refreshToken;
      await this.fetchNewToken(request).then(() => {
        this.placeOrder();
      });
    },
    deleteRow(index) {
      this.rows.splice(index, 1);
      this.addSerialNumber();
    },
    setAmount(event, index) {
      this.rows[index].qty = event;
      this.rows[index].amount = event * this.rows[index].price;
    },
    changeState(value) {
      if (value == "Categories" && this.breadcrumbs.length > 2) {
        this.breadcrumbs = [
          {
            label: "Home",
          },
          {
            label: "Categories",
          },
        ];
        this.itemList = this.getAllItems;
        //request categories
      }
    },
    requestItemsForCategory(data) {
      if (data.type == 1) {
        var tempList = [];
        if (this.breadcrumbs[this.breadcrumbs.length - 1].label != data.name) {
          this.breadcrumbs.push({ label: data.name });
        }
        this.itemList.forEach((item) => {
          if (item.parentId == data.id) {
            tempList.push(item);
          }
        });
        this.itemList = tempList;
      }
    },
    async requestQuantity(data) {
      await this.$q
        .dialog({
          message: "Enter Quantity",
          prompt: {
            model: "",
            type: "number", // optional
          },
          ok: {
            push: true,
          },
          cancel: {
            push: true,
            color: "black",
          },
          persistent: true,
        })
        .onOk((qty) => {
          this.addItem(data, qty);
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    requestItemAtDoubleClick(index) {
      var data = this.itemList[index];
      this.requestItemsForCategory(data);
      if (data.type == 2) {
        this.requestQuantity(data);
      }
    },
    requestItem(data) {
      this.requestItemsForCategory(data);
      this.addItem(data, 1);
    },
    addItem(data, qty) {
      if (data.type == 2) {
        var id = null;
        this.rows.forEach((row, index) => {
          if (row.name == data.name) {
            id = index;
            return;
          }
        });
        if (id != null) {
          this.rows[id].qty = this.rows[id].qty + parseInt(qty);
          this.rows[id].amount = this.rows[id].qty * this.rows[id].price;
        } else {
          this.rows.push({
            id: data.id,
            name: data.name,
            code: data.code,
            price: data.price,
            qty: qty,
            amount: data.price * qty,
            action: "Delete",
          });
          this.addSerialNumber();
        }
      }
    },
    addSerialNumber() {
      this.rows.forEach((row, index) => {
        row.sr = index + 1;
      });
    },
    searchProducts() {
      if (this.searchQuery == "") {
        this.itemList = this.getAllItems;
      } else {
        this.itemList = [];
        this.getAllItems.forEach((item) => {
          if (
            item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          ) {
            this.itemList.push(item);
          }
        });
      }
    },
  },
  created() {
    // this.rows = this.getOrder;
    this.searchProducts();
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
.text-tag {
  font-size: 15px;
}
.fields-div {
  min-width: 300px;
  margin-top: -30px;
}
.item-text {
  font-weight: bold;
  font-size: 20px;
  background-image: linear-gradient(to right, black , #0173bc); /* Standard syntax; must be last */
  color:transparent;
  -webkit-background-clip: text;
  background-clip: text;
}
.menu-div {
  border-radius: 8px;
  padding: 35px 0px 40px 0px;
}
.item-name-div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-color{
  background:linear-gradient(to right, black , #0173bc)
}
</style>