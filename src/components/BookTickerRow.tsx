import { useEffect, useMemo, useState } from 'react'

type BookTickerDataprops = {
  bestBid: string
  bestAsk: string
}

type BookTickerRowProps = {
  data: BookTickerDataprops
  symbol: string
}

export function BookTickerRow({ data, symbol }: BookTickerRowProps) {
  const [bookData, setBookData] = useState<BookTickerDataprops>({
    bestBid: '0',
    bestAsk: '0',
  })

  useEffect(() => {
    if (!data) return

    if (bookData.bestBid !== data.bestBid) {
      bookData.bestBid = data.bestBid
    }
    if (bookData.bestAsk !== data.bestAsk) {
      bookData.bestAsk = data.bestAsk
    }

    setBookData(bookData)
  }, [data])

  const bookTickerRow = useMemo(
    () => (
      <tr className="border-b dark:border-gray-700">
        <td
          scope="row"
          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {symbol}
        </td>
        <td className="px-4 py-3">{`${bookData.bestBid}`.substring(0, 8)}</td>
        <td className="px-4 py-3">{`${bookData.bestAsk}`.substring(0, 8)}</td>
      </tr>
    ),
    [bookData.bestBid, bookData.bestAsk],
  )

  return bookTickerRow
}
