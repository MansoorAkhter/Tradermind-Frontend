// /chart‑project/src/datafeed.js
import {
  makeApiRequest,
  generateSymbol,
  parseFullSymbol,
  getAllSymbols,
  resolutionConvertor,
} from "./helpers.js";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming.js";

const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ["1", "5", "15", "1h", "4h", "1D", "1W", "1M"],
  exchanges: [
    { value: "BINANCE", name: "Binance", desc: "Binance Exchange" }, // Add Binance
    { value: "NYSE", name: "NYSE", desc: "New York Stock Exchange" },
    { value: "NASDAQ", name: "NASDAQ", desc: "NASDAQ Stock Exchange" },
  ],
  symbols_types: [
    {
      name: "crypto",
      value: "crypto",
    },
  ],
};

export default {
  onReady: (callback) => {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    console.log("[searchSymbols]: Method call");
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const fullName = `${symbol.exchange}:${symbol.ticker}`;
      const isFullSymbolContainsInput =
        fullName.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension
  ) => {
    console.log("[resolveSymbol]: Method call", symbolName);
    const symbols = await getAllSymbols();
    // console.log(symbols)
    const symbolItem = symbols.find(({ ticker }) => ticker === symbolName);
    console.log(symbolItem);
    if (!symbolItem) {
      console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
      onResolveErrorCallback("Cannot resolve symbol");
      return;
    }
    const symbolInfo = {
      ticker: symbolItem.ticker,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 8,
      data_status: "streaming",
    };
    console.log("[resolveSymbol]: Symbol resolved", symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },
  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log("[getBars]: Method call", symbolInfo, resolution, from, to);

    try {
      const data = await makeApiRequest(
        `candles/?symbol=${symbolInfo.ticker}&resolution=${resolutionConvertor(
          resolution
        )}&from_=${from}&to=${to}`
      );

      if (!data || data.s !== "ok" || !data.t || data.c.length === 0) {
        console.error("[getBars]: Invalid data received or no data", data);
        onHistoryCallback([], { noData: true });
        return;
      }

      let bars = [];
      data.t.forEach((time, index) => {
        if (time >= from && time < to) {
          const bar = {
            time: time * 1000, // Convert to milliseconds
            low: data.l[index],
            high: data.h[index],
            open: data.o[index],
            close: data.c[index],
            volume: data.v[index],
          };
          if (bar.time && !isNaN(bar.time)) {
            bars.push(bar);
          }
        }
      });

      if (firstDataRequest && bars.length > 0) {
        lastBarsCache.set(symbolInfo.ticker, { ...bars[bars.length - 1] });
      }

      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.error("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    console.log(
      "[subscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );

    // Ensure last bar cache is valid
    const lastBar = lastBarsCache.get(symbolInfo.ticker);
    if (!lastBar || !lastBar.time) {
      console.error("[subscribeBars]: Invalid last bar", lastBar);
      return; // Exit early if the last bar is invalid
    }

    subscribeOnStream(
      symbolInfo,
      resolution,
      (bar) => {
        // Ensure the bar is valid before processing
        if (bar && bar.time && !isNaN(bar.time)) {
          onRealtimeCallback(bar);
        } else {
          console.log("[subscribeBars]: Invalid bar received", bar);
          return; // Exit if the bar is invalid
        }
      },
      subscriberUID,
      onResetCacheNeededCallback,
      lastBar
    );
  },

  unsubscribeBars: (subscriberUID) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    unsubscribeFromStream(subscriberUID);
  },
};
