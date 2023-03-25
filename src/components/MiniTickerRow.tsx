import { useEffect, useMemo, useState } from 'react'

type TickerDataprops = {
  close: string
  open: string
  high: string
  low: string
}

type MiniTickerRowProps = {
  data: TickerDataprops
  symbol: string
}

export function MiniTickerRow({ data, symbol }: MiniTickerRowProps) {
  const [tickerData, setTickerData] = useState<TickerDataprops>({
    close: '0',
    open: '0',
    high: '0',
    low: '0',
  })

  useEffect(() => {
    if (!data) return

    if (tickerData.close !== data.close) {
      tickerData.close = data.close
    }
    if (tickerData.open !== data.open) {
      tickerData.open = data.open
    }
    if (tickerData.high !== data.high) {
      tickerData.high = data.high
    }
    if (tickerData.low !== data.low) {
      tickerData.low = data.low
    }

    setTickerData(tickerData)
  }, [data])

  const miniTickerRow = useMemo(
    () => (
      <tr className="border-b dark:border-gray-700">
        <td
          scope="row"
          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {symbol}
        </td>
        <td className="px-4 py-3">{`${tickerData.close}`.substring(0, 8)}</td>
        <td className="px-4 py-3">{`${tickerData.open}`.substring(0, 8)}</td>
        <td className="px-4 py-3">{`${tickerData.high}`.substring(0, 8)}</td>
        <td className="px-4 py-3">{`${tickerData.low}`.substring(0, 8)}</td>
      </tr>
    ),
    [tickerData.close, tickerData.open, tickerData.high, tickerData.low],
  )

  return miniTickerRow
}
