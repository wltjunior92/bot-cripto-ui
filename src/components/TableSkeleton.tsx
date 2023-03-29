export function TableSkeleton() {
  return (
    <div role="status" className="w-full animate-pulse mt-1 px-2">
      <div className="h-16 rounded-md bg-gray-300 w-full dark:bg-gray-700 mb-1"></div>
      <div className="h-16 rounded-md bg-gray-300 w-full dark:bg-gray-700 mb-1"></div>
      <div className="h-16 rounded-md bg-gray-300 w-full dark:bg-gray-700 mb-1"></div>
      <div className="h-16 rounded-md bg-gray-300 w-full dark:bg-gray-700 mb-1"></div>
      <div className="h-16 rounded-md bg-gray-300 w-full dark:bg-gray-700 mb-1"></div>
      <div className="h-16 rounded-md bg-gray-300 w-full dark:bg-gray-700 mb-1"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
