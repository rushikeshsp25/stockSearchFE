import axios from "axios";

export function fetchStocksResults(searchString) {
    return axios
        .get(
            `http://127.0.0.1:8000/api/v1/stock-search/?search_key=${searchString}`
        )
}