import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Text } from "@mantine/core";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getCities } from "../services/cities";
import { Link } from "react-router-dom";

const Home = () => {
  const tableContainerRef = useRef(null); //we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef = useRef(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [sorting, setSorting] = useState([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["table-data", columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam = 0 }) => {
        console.log(globalFilter);
        const { data } = await getCities(
          pageParam,
          sorting,
          columnFilters,
          globalFilter
        );
        return data;
      },
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "City Name",
        Cell: ({ cell }) => <Link to={`/weather/${cell.getValue()}`}>{cell.getValue()}</Link>
      },
      {
        accessorKey: "cou_name_en",
        header: "Country Name",
      },
      {
        accessorKey: "timezone",
        header: "Timezone",
      },
    ],
    []
  );

  const totalDBRowCount = data?.pages?.[0]?.total_count ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  //scroll to top of table when sorting or filters change
  useEffect(() => {
    if (rowVirtualizerInstanceRef.current) {
      try {
        rowVirtualizerInstanceRef.current.scrollToIndex(0);
      } catch (e) {
        console.error(e);
      }
    }
  }, [sorting, columnFilters, globalFilter]);

  //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useMantineReactTable({
    columns,
    data: flatData,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true, //optional, but recommended if it is likely going to be more than 100 rows
    manualFiltering: true,
    manualSorting: true,
    mantineTableContainerProps: {
      ref: tableContainerRef, //get access to the table container element
      sx: { maxHeight: "600px" }, //give the table a max height
      onScroll: (
        event //add an event listener to the table container element
      ) => fetchMoreOnBottomReached(event.target),
    },
    mantineToolbarAlertBannerProps: {
      color: "red",
      children: "Error loading data",
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    renderBottomToolbarCustomActions: () => (
      <Text>
        Fetched {totalFetched} of {totalDBRowCount} total rows.
      </Text>
    ),
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    rowVirtualizerInstanceRef, //get access to the virtualizer instance
    rowVirtualizerProps: { overscan: 10 },
  });

  return <MantineReactTable table={table} />;
};

const queryClient = new QueryClient();

const HomeWithReactQueryProvider = () => (
  <QueryClientProvider client={queryClient}>
    <Home />
  </QueryClientProvider>
);

export default HomeWithReactQueryProvider;
