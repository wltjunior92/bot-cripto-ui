import { SymbolDTO } from '../dtos/userDTO'
import { WalletProp } from '../hooks/useWallet'

type WalletSummaryProps = {
  symbol: SymbolDTO | undefined
  showLabel?: boolean
  wallet: WalletProp[]
}

export function WalletSummary({
  symbol,
  showLabel = false,
  wallet,
}: WalletSummaryProps) {
  function getBaseAsset() {
    if (!wallet) return 0
    if (!symbol) return 0

    const baseAsset = wallet.find((w) => w.symbol === symbol.base_asset)
    if (!baseAsset) return 0

    return `${symbol.base_asset}: ${baseAsset.available.substring(0, 8)}`
  }

  function getQuoteAsset() {
    if (!wallet) return 0
    if (!symbol) return 0

    const quoteAsset = wallet.find((w) => w.symbol === symbol.quote_asset)
    if (!quoteAsset) return 0

    return `${symbol.quote_asset}: ${quoteAsset.available.substring(0, 8)}`
  }

  return (
    <>
      {showLabel && (
        <div className="col-span-2 flex mr-4 mb-2">
          <span className="text-gray-900 dark:text-white font-semibold">
            Carteira:
          </span>
        </div>
      )}
      <div className="border dark:border-gray-500 rounded-lg p-1.5 shadow-md bg-white dark:bg-gray-600">
        <span className="text-gray-900 dark:text-gray-100">{`${getBaseAsset()}`}</span>
      </div>
      <div className="border dark:border-gray-500 rounded-lg p-1.5 shadow-md bg-white dark:bg-gray-600">
        <span className="text-gray-900 dark:text-gray-100">{`${getQuoteAsset()}`}</span>
      </div>
    </>
  )
}
