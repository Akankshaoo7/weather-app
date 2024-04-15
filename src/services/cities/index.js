import { cityAPI } from "../http-client";

const getCities = (offset, sorting, columnFilters, globalFilter) => {
  const recordPerPage = 100;
  const queryParameter = {
    params: {
      offset: `${offset * recordPerPage}`,
      limit: `${recordPerPage}`,
    },
  };
  if (sorting.length) {
    sorting.forEach((item) => {
      queryParameter.params["order_by"] = `${item.id} ${
        item.desc ? "DESC" : "ASC"
      }`;
    });
  }
  if (columnFilters.length) {
    queryParameter.params["where"] = "";
    columnFilters.forEach((item, index) => {
      if (index != 0) {
        queryParameter.params["where"] += " and ";
      }
      queryParameter.params["where"] += `search(${item.id},"${item.value}")`;
    });
  }
  if (globalFilter) {
    if (queryParameter.params["where"]) {
      queryParameter.params["where"] += ` or search(*,"${globalFilter}")`;
    } else {
      queryParameter.params["where"] = `search(*,"${globalFilter}")`;
    }
  }
  return cityAPI.get(
    `/catalog/datasets/geonames-all-cities-with-a-population-1000/records`,
    queryParameter
  );
};

export { getCities };
