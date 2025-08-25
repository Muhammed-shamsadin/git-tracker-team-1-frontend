// "use client"

// import { useState, useEffect, useCallback } from "react"
// import type {
//   UseDataTableOptions,
//   UseDataTableReturn,
//   ApiError,
//   ApiParams,
//   PaginationState,
//   SortingState,
//   FilterState,
// } from "@/components/data-table/types"
// import { apiClient, dummyJsonApiClient, buildQueryParams, buildDummyJsonParams } from "@/lib/api"

// export function useDataTable<T>(options: UseDataTableOptions<T>): UseDataTableReturn<T> {
//   const {
//     apiEndpoint,
//     initialPageSize = 10,
//     searchableFields = [],
//     defaultFilters = {},
//     defaultSort,
//     refetchInterval,
//   } = options

//   // State
//   const [data, setData] = useState<T[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<ApiError | null>(null)
//   const [total, setTotal] = useState(0)

//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: initialPageSize,
//   })

//   const [sorting, setSorting] = useState<SortingState[]>(
//     defaultSort ? [{ id: String(defaultSort.field), desc: defaultSort.order === "desc" }] : [],
//   )

//   const [globalFilter, setGlobalFilter] = useState("")
//   const [filters, setFilters] = useState<FilterState[]>(
//     Object.entries(defaultFilters).map(([key, value]) => ({ id: key, value })),
//   )

//   // Determine which API client and param builder to use
//   const isDummyJson = apiEndpoint.includes("dummyjson.com")
//   const currentApiClient = isDummyJson ? dummyJsonApiClient : apiClient
//   const currentParamBuilder = isDummyJson ? buildDummyJsonParams : buildQueryParams

//   // Build API parameters
//   const buildApiParams = useCallback((): ApiParams => {
//     const params: ApiParams = {
//       page: pagination.pageIndex + 1, // API usually expects 1-based pagination
//       pageSize: pagination.pageSize,
//     }

//     if (globalFilter) {
//       params.search = globalFilter
//     }

//     if (sorting.length > 0) {
//       params.sortBy = sorting[0].id
//       params.sortOrder = sorting[0].desc ? "desc" : "asc"
//     }

//     if (filters.length > 0) {
//       params.filters = filters.reduce(
//         (acc, filter) => {
//           acc[filter.id] = filter.value
//           return acc
//         },
//         {} as Record<string, any>,
//       )
//     }

//     return params
//   }, [pagination, sorting, globalFilter, filters])

//   // Fetch data function
//   const fetchData = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const params = buildApiParams()
//       const queryString = currentParamBuilder(params)

//       // For DummyJSON, the endpoint is relative to its base URL (e.g., "/users")
//       // For custom API, the endpoint is relative to its base URL (e.g., "/api/developers")
//       const fullEndpoint = isDummyJson ? apiEndpoint.replace(dummyJsonApiClient.config.baseUrl, "") : apiEndpoint

//       const result = await currentApiClient.get<any>(fullEndpoint, params)

//       // Handle DummyJSON API response format
//       if (isDummyJson) {
//         setData(result.users || result.data || [])
//         setTotal(result.total || 0)
//       } else {
//         // Original API format
//         setData(result.data)
//         setTotal(result.total)
//       }
//     } catch (err) {
//       const apiError: ApiError = {
//         message: err instanceof Error ? err.message : "An unknown error occurred",
//         code: "FETCH_ERROR",
//         details: err,
//       }
//       setError(apiError)
//       setData([])
//       setTotal(0)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [apiEndpoint, buildApiParams, currentApiClient, currentParamBuilder, isDummyJson])

//   // Initial fetch and refetch on parameter changes
//   useEffect(() => {
//     fetchData()
//   }, [fetchData])

//   // Auto-refetch interval
//   useEffect(() => {
//     if (refetchInterval) {
//       const interval = setInterval(fetchData, refetchInterval)
//       return () => clearInterval(interval)
//     }
//   }, [fetchData, refetchInterval])

//   // Refresh function
//   const refresh = useCallback(() => {
//     fetchData()
//   }, [fetchData])

//   return {
//     data,
//     isLoading,
//     error,
//     total,
//     pagination,
//     sorting,
//     globalFilter,
//     filters,
//     setPagination,
//     setSorting,
//     setGlobalFilter,
//     setFilters,
//     refresh,
//   }
// }
