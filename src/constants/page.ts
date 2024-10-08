export const candlestickPatterns = [
    { name: 'Inverted Hammer', method: 'InvertedHammer' , detail: "A single candle pattern that appears in a downtrend suggesting a potential reversal or support." },
    { name: 'Doji Star', method: 'DojiStar' , detail: "Features a narrow price range between open and close, signifying indecision among traders." },
    { name: 'Bearish Harami', method: 'BearishHarami' , detail: "Occurs in an uptrend, a small candle completely inside the range of a larger previous candle, suggesting a potential reversal to bearish." },
    { name: 'Bullish Harami', method: 'BullishHarami' , detail: "A smaller body entirely within the range of the previous larger candle's body, potentially indicating a bullish reversal." },
    { name: 'Dark Cloud Cover', method: 'DarkCloudCover' , detail: "A bearish reversal pattern at the end of an uptrend, with a second candle opening at new highs but closing below the midpoint of the first candle's body." },
    { name: 'Doji', method: 'Doji' , detail: "A session where the open and close are the same or nearly the same, representing indecision in the market." },
    { name: 'Dragonfly Doji', method: 'DragonflyDoji' , detail: "A type of Doji where the open, high, and close prices are the same, indicating potential market reversal or trend continuation." },
    { name: 'Hanging Man', method: 'HangingMan' , detail: "A bearish reversal pattern that occurs at the top of an uptrend and signals a potential downward reversal." },
    { name: 'Gravestone Doji', method: 'GravestoneDoji' , detail: "A bearish pattern that appears during an uptrend, with open, close, and low prices at the same level." },
    { name: 'Bearish Engulfing', method: 'BearishEngulfing' , detail: "A pattern where a large bearish candle completely engulfs the previous bullish candle, suggesting a shift to bearish momentum." },
    { name: 'Bullish Engulfing', method: 'BullishEngulfing' , detail: "A bullish reversal pattern where a large bullish candle completely engulfs a smaller bearish candle from the previous session." },
    { name: 'Hammer', method: 'Hammer' , detail: "A bullish reversal pattern that occurs during a downtrend, indicating potential upward reversal with a small body and long lower shadow." },
    { name: 'Morning Star', method: 'MorningStar' , detail: "A bullish reversal pattern consisting of three candles that suggests the end of a downtrend and the start of an uptrend." },
    { name: 'Morning Star Doji', method: 'MorningStarDoji' , detail: "A variation of the Morning Star where the middle candle is a Doji, indicating a strong reversal signal." },
    { name: 'Piercing Pattern', method: 'PiercingPattern' , detail: "A bullish two-candle reversal pattern appearing at the end of a downtrend, with the second candle opening below but closing within the body of the first." },
    { name: 'Rain Drop', method: 'RainDrop' , detail: "A unique pattern that focuses on price action and volume, representing equilibrium but with a focus on the latter half of the trading session." },
    { name: 'Rain Drop Doji', method: 'RainDropDoji' , detail: "Similar to the Rain Drop but with a Doji formation, emphasizing indecision but with an emphasis on closing conditions." },
    { name: 'Star', method: 'Star' , detail: "A small body candle that gaps away from the previous body, indicating a potential reversal or the onset of a pause in the trend." },
    { name: 'Shooting Star', method: 'ShootingStar' , detail: "A bearish reversal pattern that appears after an uptrend with a small body and long upper shadow, indicating selling pressure." },
    { name: 'Three White Soldiers', method: 'ThreeWhiteSoldiers' , detail: "A bullish pattern characterized by three consecutive long-bodied candles that close progressively higher, suggesting a strong upward momentum." },
    { name: 'Three Black Crows', method: 'ThreeBlackCrows' , detail: "A bearish reversal pattern characterized by three consecutive long-bodied candles that close progressively lower, suggesting a strong downward momentum." },
    { name: 'Bullish Three Method Formation', method: 'BullishThreeMethodFormation' , detail: "A continuation pattern consisting of a long bullish candle, followed by small candles within its range, and then another long bullish candle." },
    { name: 'Bearish Three Method Formation', method: 'BearishThreeMethodFormation' , detail: "A bearish continuation pattern where a long bearish candle is followed by smaller candles contained within its range, and concluded by another long bearish candle." },
    { name: 'Tweezer Tops', method: 'TweezerTops' , detail: "A bearish reversal pattern with two or more consecutive sessions with matching highs, usually at the end of an uptrend." },
    { name: 'Tweezer Bottoms', method: 'TweezerBottoms', detail: "A bullish reversal pattern with two or more consecutive sessions with matching lows, typically found at the end of a downtrend." }
];


export const chartPatterns = [
  { name: 'Head and shoulders', method: 'headAndShoulders' , detail: "A single candle pattern that appears in a downtrend suggesting a potential reversal or support." },
  { name: 'Inverse head and shoulders', method: 'inverseHeadAndShoulders' , detail: "A single candle pattern that appears in a downtrend suggesting a potential reversal or support." },
]