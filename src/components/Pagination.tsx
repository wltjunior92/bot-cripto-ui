import { useEffect, useState } from 'react'

type PaginationProps = {
  page: number
  itensByPage: number
  total: number
  onNavigate: (value: number) => void
}

export function Pagination({
  page,
  itensByPage,
  total,
  onNavigate,
}: PaginationProps) {
  const [current, setCurrent] = useState('')
  const [pages, setPages] = useState(0)

  useEffect(() => {
    let totalPages = total / itensByPage
    const haveDecimal = totalPages - Math.floor(totalPages) !== 0
    if (haveDecimal) totalPages = Math.floor(totalPages) + 1

    setPages(totalPages)

    const previous = page * itensByPage - itensByPage
    const first = previous + 1
    const last = page === totalPages ? total : previous + itensByPage
    setCurrent(`${first}-${last}`)
  }, [page, itensByPage, total])

  function iteratePages() {
    const items = []
    for (let index = 1; index <= pages; index++) {
      items.push(index)
    }
    return items
  }

  if (pages < 8) {
    return (
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Exibindo{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {current}{' '}
          </span>
          de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {total}
          </span>
        </span>
        {pages > 1 && (
          <ul className="inline-flex items-stretch -space-x-px overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            {page !== 1 && (
              <li>
                <button
                  type="button"
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white border-r border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => onNavigate(page - 1)}
                >
                  <span className="sr-only">Anterior</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            )}
            {iteratePages().map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === item
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(item)}
                >
                  {item}
                </button>
              </li>
            ))}
            {page !== pages && (
              <li>
                <button
                  type="button"
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white border-l border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => onNavigate(page + 1)}
                >
                  <span className="sr-only">Próxima</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            )}
          </ul>
        )}
      </nav>
    )
  }

  return (
    <nav
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Exibindo{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {current}{' '}
        </span>
        de{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {total}
        </span>
      </span>
      {pages > 1 && (
        <ul className="inline-flex items-stretch -space-x-px overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
          {page !== 1 && (
            <li>
              <button
                type="button"
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white border-r border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => onNavigate(page - 1)}
              >
                <span className="sr-only">Anterior</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          )}
          {page <= 4 ? (
            <>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === 1
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(1)}
                >
                  1
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === 2
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(2)}
                >
                  2
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === 3
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(3)}
                >
                  3
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === 4
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(4)}
                >
                  4
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === 1
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(1)}
                >
                  1
                </button>
              </li>
              <li>
                <div className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border-x border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                  ...
                </div>
              </li>
            </>
          )}
          {page > 4 && page <= pages - 4 && (
            <>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400 border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(page - 1)}
                >
                  {page - 1}
                </button>
              </li>
              <li>
                <div
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400 border-x border-gray-300 dark:border-gray-700`}
                >
                  {page}
                </div>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400 border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(page + 1)}
                >
                  {page + 1}
                </button>
              </li>
            </>
          )}
          {page > pages - 4 ? (
            <>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === pages - 3
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(pages - 3)}
                >
                  {pages - 3}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === pages - 2
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(pages - 2)}
                >
                  {pages - 2}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === pages - 1
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(pages - 1)}
                >
                  {pages - 1}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 ${
                    page === pages
                      ? 'bg-gray-200 hover:bg-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400'
                      : 'bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400'
                  }  border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(pages)}
                >
                  {pages}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <div className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border-x border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                  ...
                </div>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:text-gray-400 border-x border-gray-300 dark:border-gray-700`}
                  onClick={() => onNavigate(pages)}
                >
                  {pages}
                </button>
              </li>
            </>
          )}
          {page !== pages && (
            <li>
              <button
                type="button"
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white border-l border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => onNavigate(page + 1)}
              >
                <span className="sr-only">Próxima</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}
