/* eslint-disable new-cap */
/* eslint-disable no-new */
import { useEffect, useMemo, useRef } from 'react'

let tvScriptLoadingPromise: any

export function CandleChart() {
  const onLoadScriptRef = useRef<any>()

  function createWidget() {
    if (
      document.getElementById('tradingview_1c4f4') &&
      'TradingView' in window
    ) {
      const tradingViewWidget = window.TradingView as any
      new tradingViewWidget.widget({
        symbol: 'BINANCE:BTCUSDT',
        width: '100%',
        height: '100%',
        interval: '60',
        timezone: 'America/Sao_Paulo',
        theme: 'dark',
        style: '1',
        locale: 'br',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_1c4f4',
        details: true,
        withdateranges: true,
      })
    }
  }

  function loadWidget() {
    onLoadScriptRef.current = createWidget

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.id = 'tradingview-widget-loading-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.type = 'text/javascript'
        script.onload = resolve

        document.head.appendChild(script)
      })
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current(),
    )

    return () => (onLoadScriptRef.current = null)
  }

  useEffect(() => {
    try {
      loadWidget()
    } catch {
      console.log('erro ao carregar candleChart')
    }
  }, [])

  const candleChart = useMemo(
    () => (
      <div className="tradingview-widget-container">
        <div id="tradingview_1c4f4" />
      </div>
    ),
    [],
  )

  return candleChart
}
