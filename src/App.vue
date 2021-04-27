<template>
  <div id="app">
    <div class="search-bar">
      <div class="search-wrapper">
        <input
          v-model="searchString"
          type="text"
          class="search-box"
          placeholder="Search Stocks"
        />
        <img class="search-icon" src="./assets/search.png" />
      </div>
    </div>
    <Table
      v-bind:rows="pageData"
      v-bind:count="resultCount"
      v-bind:allRows="result"
      @pageChange="handlePageChange"
    />
  </div>
</template>

<script>
import Table, { defaultPageSize } from "./components/Table/Table";
import { fetchStocksResults } from "./services";
import { debounce } from "./helpers";

export default {
  data: function () {
    return {
      result: [],
      resultCount: 0,
      pageData: [],
      searchString: "",
    };
  },
  mounted: function () {
    this.handleSearch();
  },
  created() {
    this.handleSearch = debounce(() => {
      fetchStocksResults(this.searchString)
        .then((response) => {
          this.result = response["data"]["data"] || [];
          this.resultCount = this.result.length;
          this.handlePageChange(1, defaultPageSize);
        })
        .catch(() => {
          this.result = [];
          this.resultCount = 0;
          this.handlePageChange(1, defaultPageSize);
        });
    }, 500);
  },
  methods: {
    handlePageChange(pageNo, pageSize) {
      const startIndex = (pageNo - 1) * pageSize;
      const endIndex = pageNo * pageSize;
      const resLen = this.result.length;
      if (resLen > startIndex)
        this.pageData = this.result.slice(
          startIndex,
          endIndex > resLen ? resLen : endIndex
        );
      else this.pageData = [];
    },
  },
  name: "App",
  components: {
    Table,
  },
  watch: {
    searchString: function () {
      this.handleSearch();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
#app .search-bar {
  display: flex;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
}
#app .search-wrapper {
  position: relative;
  width: 500px;
  height: 50px;
}
#app .search-wrapper .search-box {
  width: 500px;
  height: 50px;
  border-radius: 10px;
  padding-left: 50px;
  border: 1px solid gray;
  font-size: 14px;
  box-sizing: border-box;
}
#app .search-wrapper .search-box:focus {
  outline: none !important;
  border: 1px solid rgb(2, 2, 36);
  box-shadow: 0 0 10px #719ece;
}

#app .search-wrapper .search-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 30px;
  height: 30px;
}
</style>