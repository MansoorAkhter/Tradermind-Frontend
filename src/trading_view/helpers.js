// Makes requests to CryptoCompare API
// export async function makeApiRequest(path) {
//     try {
//         const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
//         console.log(response)
//         return response.json();
//     } catch(error) {
//         throw new Error(`CryptoCompare request error: ${error.status}`);
//     }
// }

const apiKey =
  process.env.REACT_APP_FINNHUB_API_KEY ||
  "crul3mhr01qno00e1gcgcrul3mhr01qno00e1gd0";

// Makes requests to Finnhub API
export async function makeApiRequest(path) {
  try {
    // console.log(path)
    const url = new URL(`http://192.168.100.41:8000/datasource/crypto/${path}`);
    // console.log(url)
    // url.searchParams.append("token", apiKey);
    const response = await fetch(url.toString());
    return response.json();
  } catch (error) {
    throw new Error(`Finnhub request error: ${error.status}`);
  }
}

// Generates a symbol ID from a pair of the coins or stock symbols
export function generateSymbol(exchange, ticker) {
  const short = `${exchange}:${ticker}`;
  return {
    short,
  };
}

// Parses a full symbol to extract exchange and ticker
export function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+):(\w+)$/);
  if (!match) {
    return null;
  }
  return { exchange: match[1], ticker: match[2] };
}

// Function to obtain all symbols
export async function getAllSymbols() {
  // Fetch symbols for stocks
  // const stockSymbols = await makeApiRequest('stock/symbol?exchange=US');
  // const stockSymbolData = stockSymbols.map(item => ({
  //     symbol: item.displaySymbol,
  //     ticker: item.symbol,
  //     description: item.description,
  //     exchange: item.exchange,
  //     type: 'stock',
  // }));

  // Fetch symbols for cryptocurrencies
  const cryptoSymbols = await makeApiRequest("symbols?exchange=binance");

  const cryptoSymbolData = cryptoSymbols?.map((item) => ({
    symbol: item?.displaySymbol,
    ticker: item?.symbol,
    description: item?.description,
    exchange: "BINANCE", // Specify the exchange as 'BINANCE'
    type: "crypto", // Specify type as 'crypto'
  }));

  return [...cryptoSymbolData];
}

// this is params convertor from trading view termonolgy to finhub acccepted termonolgy
export const resolutionConvertor = (resolution) => {
  switch (resolution) {
    case "1D":
      resolution = "D";
      break;
    case "1W":
      resolution = "W";
      break;
    case "1M":
      resolution = "M";
      break;
    default:
      resolution = resolution;
  }

  return resolution;
};

// export async function makeApiRequest(path, params = {}) {

//     // Build the query string from the params object
//     const queryString = new URLSearchParams({
//         ...params,
//         token: apiKey,
//     }).toString();

//     const url = `https://finnhub.io/api/v1/${path}?${queryString}`;

//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Finnhub request error: ${response.statusText}`);
//         }
//         const data = await response.json();
//         // console.log(data);
//         return data;
//     } catch (error) {
//         console.error('Error making API request:', error);
//         throw error;
//     }
// };

// // Generates a symbol ID from a pair of the coins
// export function generateSymbol(exchange, fromSymbol, toSymbol) {
//     const short = `${fromSymbol}/${toSymbol}`;
//     return {
//         short,
//         full: `${exchange}:${short}`,
//     };
// }

// // Returns all parts of the symbol
// export function parseFullSymbol(fullSymbol) {
//     const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
//     if (!match) {
//         return null;
//     }
//     return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };

// }
