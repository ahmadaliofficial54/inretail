<template>
  <q-page class="page-style">
    <div class="parent-div">
      <div class="q-ma-md">
        <div class="row justify-between">
          <span class="item-text"> Products </span>
        </div>
        <div class="row justify-between q-mt-sm">
          <!-- <q-card class="q-ma-sm q-pa-md card-class col-3 column">
              <q-icon color="blue" size="40px" name="lab la-first-order" />
              <span class="text-blue text-bold"> Today's Orders </span>
              <span>1,000</span>
            </q-card> -->
          <div class="col-4">
            <q-card
              @click="addCategory"
              class="q-mr-md q-pa-md card-class col-5 column"
            >
              <q-icon color="blue" size="40px" name="add" />
              <span class=" text-bold q-pb-xs glance-text"> Add Category</span>
            </q-card>
          </div>
          <div class="col-4">
            <q-card
              @click="addItem"
              class="q-mr-md q-pa-md card-class col-5 column"
            >
              <q-icon color="blue" size="40px" name="add" />
              <span class="glance-text text-bold q-pb-xs"> Add Product </span>
            </q-card>
          </div>
          <div class="col-4">
            <q-card class="q-pa-sm card-class column">
              <q-icon color="blue" size="40px" name="las la-boxes" />
              <span class="glance-text text-bold"> Total Products </span>
              <span class="text-bold">{{ this.getAllItems.length }}</span>
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
                <span
                  @click="editItem(props.row)"
                  class="text-blue action"
                  v-if="col.name == 'action'"
                >
                  Edit
                </span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <q-dialog v-model="addFlag" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="q-pb-sm">
          <div class="text-bold">{{ DialogHeading }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-pb-sm">
          <q-select
            dense
            outlined
            class=""
            :disable="tempCategory == null ? false : true"
            v-model="categoryName"
            :options="categoryOptions"
            label="Select Category"
            option-label="name"
          />
          <q-input
            dense
            class="q-pt-sm"
            outlined
            v-model="itemName"
            placeholder="Enter Item Name"
          />
          <q-input
            v-if="this.priceFlag"
            dense
            class="q-pt-sm"
            outlined
            v-model="price"
            placeholder="Enter Price"
            type="numbers"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pt-none q-pr-md">
          <q-btn
            no-caps
            label="Ok"
            text-color="white"
            class="btn-color"
            @click="saveItem"
            v-close-popup
          />
          <q-btn
            no-caps
            label="Cancel"
            text-color="white"
            class="btn-color"
            @click="cancelItem"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import notification from "../common/notificationsAndDialogues.js";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  mixins: [notification],
  data() {
    return {
      categoryName: "",
      itemName: "",
      price: 0,
      tempCategory: null,
      priceFlag: true,
      categoryOptions: [{ id: 0, name: "Main Category" }],
      addFlag: false,
      DialogHeading: "",
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
          name: "parentName",
          align: "left",
          label: "Category",
          field: "parentName",
        },
        { name: "name", align: "left", label: "Name", field: "name" },
        { name: "price", align: "right", label: "Price", field: "price" },
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
        //   Name: "Samosa",
        //   Date: "17-jan-2021",
        //   CustomerName: "Ahmad",
        //   amount: 60,
        //   action: "View",
        // },
      ],
    };
  },
  computed: {
    ...mapGetters("categories", ["getAllItems"]),
    ...mapGetters("authentication", ["getLoginResponse"]),
  },
  methods: {
    ...mapActions("categories", [
      "fetchAllItems",
      "addNewCategory",
      "addNewItem",
      "updateItem",
    ]),
    ...mapActions("authentication", ["fetchNewToken"]),
    // setTempCaegory() {
    //   this.tempCategory = this.categoryName;
    // },
    cancelItem() {
      this.categoryName = "";
      this.tempCategory = null;
      this.itemName = "";
      this.price = 0;
    },
    editItem(object) {
      this.addFlag = true;
      this.priceFlag = true;
      this.categoryName = object.parentName;
      this.price = object.price;
      this.tempCategory = object;
      this.itemName = object.name;
      this.DialogHeading = "Edit Item";
    },
    addItem() {
      this.addFlag = true;
      this.priceFlag = true;
      this.DialogHeading = "Add Item";
    },
    addCategory() {
      this.priceFlag = false;
      this.addFlag = true;
      this.DialogHeading = "Add Category";
    },
    async saveItem() {
      this.$q.loading.show();
      var request = {};
      request.name = this.itemName;
      request.description = "";
      request.branchId = this.getLoginResponse.branchId;
      request.createdBy = 1;
      if (this.priceFlag == false) {
        request.parentId = 0;
        await this.addNewCategory(request).then((response) => {
          this.$q.loading.hide();
          if (response.errorMessage == "SUCCESS") {
            this.fetchItems();
            this.clearValues();
          } else if (response.errorMessage == undefined) {
            this.fetchToken();
          }
        });
      } else if (this.tempCategory != null) {
        request.id = this.tempCategory.id;
        request.price = this.price;
        request.parentId = this.tempCategory.parentId;
        await this.updateItem(request).then((response) => {
          this.$q.loading.hide();
          if (response.errorMessage == "SUCCESS") {
            this.tempCategory = null;
            this.fetchItems();
            this.clearValues();
          } else if (response.errorMessage == undefined) {
            this.fetchToken();
          }
        });
      } else {
        request.parentId = this.categoryName.id;
        request.price = this.price;
        await this.addNewItem(request).then((response) => {
          this.$q.loading.hide();
          if (response.errorMessage == "SUCCESS") {
            this.fetchItems();
            this.clearValues();
          } else if (response.errorMessage == undefined) {
            this.fetchToken();
          }
        });
      }
    },
    clearValues(){
      this.price = 0;
      this.categoryName = "";
      this.itemName = "";
    },
    async fetchToken() {
      let request = {};
      request.token = this.getLoginResponse.refreshToken;
      await this.fetchNewToken(request).then(() => {
        this.saveItem();
      });
    },
    async fetchItems() {
      await this.fetchAllItems(this.getLoginResponse.branchId).then(() => {
        this.fetchProducts();
      });
    },
    async fetchProducts() {
      if (this.getAllItems == undefined) {
        let request = {};
        request.token = this.getLoginResponse.refreshToken;
        await this.fetchNewToken(request).then(() => {
          this.fetchItems();
        });
      } else {
        this.rows = this.getAllItems;
        this.addSerialNumber();
        this.setCategoryOption();
      }
    },
    addSerialNumber() {
      var tempList = [];
      var index = 1;
      this.rows.forEach((row) => {
        if (row.type != 1) {
          row.sr = index;
          tempList.push(row);
          index++;
        }
      });
      this.rows = tempList;
    },
    setCategoryOption() {
      this.getAllItems.forEach((row) => {
        if (row.type == 1) {
          this.categoryOptions.push(row);
        }
      });
    },
  },
  created() {
    this.fetchProducts();
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
.border-css {
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
.glance-text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-image: linear-gradient(to right, black , #0173bc); /* Standard syntax; must be last */
  color:transparent;
  -webkit-background-clip: text;
  background-clip: text;
}
</style>