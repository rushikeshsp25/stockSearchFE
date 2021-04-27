<template>
  <div>
    <div class="top-controls">
      <button class="export-button" v-on:click="handleDataExport">
        Export
      </button>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody class="body">
          <tr v-for="item in rows" :key="item.code">
            <td
              v-bind:class="{
                green: item.close >= item.open,
                red: item.close < item.open,
              }"
            >
              {{ item.code }}
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.open }}</td>
            <td>{{ item.high }}</td>
            <td>{{ item.low }}</td>
            <td>{{ item.close }}</td>
          </tr>
        </tbody>
      </table>
      <div class="table-footer">
        <div class="page-no-control">
          <div
            v-on:click="decrementPage"
            v-bind:class="{ disabled: disablePageDecrementBtn }"
            class="page-change-button"
          >
            &#8249;
          </div>
          <select
            v-model="pageNo"
            v-on:change="handlePageNoChange"
            name="page-no"
            id="page-no"
          >
            <option v-for="n in maxPageNo" v-bind:key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <div
            v-on:click="incrementPage"
            v-bind:class="{ disabled: disablePageIncrementBtn }"
            class="page-change-button"
          >
            &#8250;
          </div>
        </div>
        <div class="page-size-control-wrapper">
          <div class="page-size-control">
            <label for="page-size">Page Size: </label>
            <select
              v-model="pageSize"
              v-on:change="handlePageSizeChange"
              name="page-size"
              id="page-size"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <p>Total Count: {{ count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {exportToCSV} from '../../helpers';

export const defaultPageSize = 20;
export default {
  name: "Table",
  data: function () {
    return {
      pageNo: 1,
      pageSize: defaultPageSize,
      maxPageNo: 1,
      disablePageDecrementBtn: true,
      disablePageIncrementBtn: true,
    };
  },
  props: {
    rows: Array,
    count: Number,
    allRows: Array
  },
  methods: {
    handlePageNoChange() {
      this.$emit("pageChange", this.pageNo, this.pageSize);
      this.disablePageIncrementBtn = this.pageNo == this.maxPageNo;
      this.disablePageDecrementBtn = this.pageNo == 1;
    },
    handlePageSizeChange() {
      this.pageNo = 1;
      this.disablePageDecrementBtn = true;
      this.maxPageNo = Math.ceil(this.count / this.pageSize);
      if (this.maxPageNo > 1) this.disablePageIncrementBtn = false;
      this.$emit("pageChange", 1, this.pageSize);
    },
    incrementPage() {
      if (this.pageNo < this.maxPageNo) {
        this.pageNo = this.pageNo + 1;
        this.disablePageDecrementBtn = false;
        this.handlePageNoChange();
      } else {
        this.disablePageIncrementBtn = true;
      }
    },
    decrementPage() {
      if (this.pageNo > 1) {
        this.pageNo = this.pageNo - 1;
        this.disablePageIncrementBtn = false;
        this.handlePageNoChange();
      } else {
        this.disablePageDecrementBtn = true;
      }
    },
    handleDataExport() {
      exportToCSV(this.allRows);
    },
  },
  watch: {
    count: function (newCount) {
      this.pageNo = 1;
      this.disablePageDecrementBtn = true;
      this.maxPageNo = Math.ceil(newCount / this.pageSize);
      this.disablePageIncrementBtn = !(this.maxPageNo > 1);
    },
  },
};
</script>

<style scoped src='./Table.css'/>