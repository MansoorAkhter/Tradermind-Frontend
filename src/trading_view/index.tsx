"use client";
import styles from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from "../../public/static/charting_library/";
import datafeed from "./datafeed";
import Link from "next/link";
import { resolutionConvertor } from "./helpers";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { BASE_URL } from "@/utils/page";

export const TVChartContainer = (
  props: Partial<ChartingLibraryWidgetOptions>
) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [modalContent, setModalContent] = useState(""); // State to control modal content
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);

  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: datafeed,
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale as LanguageCode,
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      theme: "dark",
      header_widget_buttons_mode: "adaptive",
      overrides: {
        "paneProperties.background": "#020024",
        "paneProperties.backgroundType": "solid",
        "linetoolabcd.bold": true,
      },
    };

    let tvWidget = new widget(widgetOptions);
    tvWidgetRef.current = tvWidget; // Store tvWidget instance in ref

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        // Create the harmonic pattern
        const patternPoints = [
          { price: 47073.73, time: 1614211200 }, // X
          { price: 46276.87, time: 1614297600 }, // A
          { price: 46106.43, time: 1614384000 }, // B
          { price: 45135.66, time: 1614470400 }, // C
          { price: 49587.03, time: 1614556800 }, // D
        ];

        tvWidget.activeChart().createMultipointShape(patternPoints, {
          shape: "xabcd_pattern",
          lock: false,
          disableUndo: false,
          disableSave: false,
          showInObjectsTree: true,
          text: "Gartley Pattern",
          overrides: {
            color: "blue",
            linewidth: 2,
          },
        });

        // Add Dropdown for Detection
        tvWidget.createDropdown({
          title: "Detection",
          tooltip: "Select detection type",
          items: [
            {
              title: "Detect Candlestick Patterns",
              onSelect: () => {
                setModalContent("candlestickPatterns");
                setIsModalOpen(true);
              },
            },
            {
              title: "Detect Chart Patterns",
              onSelect: () => {
                setModalContent("chart");
                setIsModalOpen(true);
              },
            },
          ],
        });
        const button = tvWidget.createButton();
        button.addEventListener("click", () => {
          if (tvWidgetRef.current)
            autoDrawFibonacciRetracement(tvWidgetRef.current.activeChart());
        });
        button.innerHTML = "Auto Fib Retracement";
        button.style.padding = "10px";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease";
        button.style.borderRadius = "5px";

        // Hover effect with JavaScript
        button.addEventListener("mouseenter", () => {
          button.style.backgroundColor = "rgb(42, 46, 57)"; // Light white on hover
        });

        button.addEventListener("mouseleave", () => {
          button.style.backgroundColor = "transparent"; // Back to original color
        });
      });

      fetchPatternsAndDraw(tvWidget);
    });

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
      }
    };
  }, [props]);

  const url = `${BASE_URL}/users/test-candlestick`;
  const buildUrlWithParams = (url: string, params: any) => {
    const query = new URLSearchParams(params).toString();
    return `${url}?${query}`;
  };

  // Function to auto draw Fibonacci retracement
  const autoDrawFibonacciRetracement = async (chart: any) => {
    // Extract symbol, resolution, and visible range dynamically from the chart
    const symbol = chart.symbol(); // Get the symbol from the chart
    const resolution = chart.resolution(); // Get the resolution from the chart
    const visibleRange = chart.getVisibleRange(); // Get visible range (from and to timestamps)

    // Parameters for the API call, dynamically set the symbol and resolution
    const params = {
      symbol: symbol, // Dynamically fetch the symbol
      resolution: resolutionConvertor(resolution) || "15", // Default to 15-minute resolution if not available
      token: process.env.REACT_APP_FINNHUB_API_KEY,
      from: Math.floor(visibleRange.from), // Use the visible range for "from"
      to: Math.floor(visibleRange.to), // Use the visible range for "to"
    };

    try {
      // Build the URL with query parameters
      const requestUrl = buildUrlWithParams(url, params);

      // Fetch data using fetch API
      const response = await fetch(requestUrl);
      const data = await response.json();

      if (data.s === "ok") {
        // Convert to a format that works with JavaScript
        const df = {
          high: data.h,
          low: data.l,
          time: data.t.map((t: any) => new Date(t * 1000)), // Convert UNIX time to JavaScript Date
        };

        // Identifying the high and low points for Fibonacci retracement
        const highIndex = df.high.indexOf(Math.max(...df.high));
        const lowIndex = df.low.indexOf(Math.min(...df.low));

        const highPrice = df.high[highIndex];
        const lowPrice = df.low[lowIndex];

        const highTime = Math.floor(df.time[highIndex].getTime() / 1000); // Time in UNIX seconds
        const lowTime = Math.floor(df.time[lowIndex].getTime() / 1000); // Time in UNIX seconds

        // Determine trend direction and set Fibonacci levels
        let trend;
        let points = [];

        if (highIndex > lowIndex) {
          // Uptrend: Place highPrice second
          trend = "Uptrend";
          points = [
            { price: highPrice, time: highTime },
            { price: lowPrice, time: lowTime },
          ];
        } else {
          // Downtrend: Place lowPrice first
          trend = "Downtrend";
          points = [
            { price: lowPrice, time: lowTime },
            { price: highPrice, time: highTime },
          ];
        }

        // Output for debugging
        console.log("Symbol:", symbol);
        console.log("Resolution:", resolution);
        console.log("Visible Range:", visibleRange);
        console.log("High Price:", highPrice, "Time:", highTime);
        console.log("Low Price:", lowPrice, "Time:", lowTime);
        console.log("Trend:", trend);

        // Draw Fibonacci retracement on the chart
        chart.createMultipointShape(points, {
          shape: "fib_retracement",
          lock: false,
          disableUndo: false,
          disableSave: false,
          showInObjectsTree: true,
          overrides: {
            "trendline.color": "#00FF00",
            "trendline.width": 2,
          },
        });
      } else {
        console.log("Failed to retrieve data:", data);
      }
    } catch (error) {
      console.error("Error fetching data for Fibonacci retracement:", error);
    }
  };

  // Fetch patterns and draw on chart
  const fetchPatternsAndDraw = async (tvWidget: any, param?: any) => {
    if (!tvWidget) {
      console.error("tvWidget is not ready");
      return;
    }
    if (param) {
      let currentSymbol = tvWidget.activeChart().symbol();
      let currentInterval = tvWidget.activeChart().resolution();
      switch (currentInterval) {
        case "1":
        case "5":
        case "15":
          currentInterval = `histominute`;
          break;
        case "60":
        case "240":
          currentInterval = "histohour";
          break;
        case "1D":
          currentInterval = "histoday";
          break;
        case "1W":
          currentInterval = "1w";
          break;
        // 1M remains unchanged
        case "1M":
          break;
        default:
          console.warn(`Unexpected interval: ${currentInterval}`);
      }

      currentSymbol = currentSymbol.split(":")[1]; // Remove the prefix (e.g., "BINANCE:")
      currentSymbol = currentSymbol.replace(/USDT$/, "");
      const postData = {
        symbol: currentSymbol,
        target: param?.method,
        pattern_type: modalContent,
        interval: currentInterval,
      };

      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(`${apiUrl}/users/test-candlestick`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        const patterns = await response.json();
        console.log("Patterns received:", patterns);

        if (modalContent === "chart") {
          if (patterns.length == 0) {
            tvWidget.showNoticeDialog({
              title: "No Pattern Detected",
              body: `Unable to find ${param?.name} `,
              callback: () => {
                console.log("Noticed!");
              },
            });
          }
          patterns.forEach((pattern: any) => {
            tvWidget.activeChart().createMultipointShape(pattern, {
              shape: "head_and_shoulders",
              lock: false,
              disableUndo: false,
              disableSave: false,
              showInObjectsTree: true,
            });
          });
        } else {
          patterns.forEach((pattern: any) => {
            const date = new Date(pattern.T + "Z");
            const millisecondsSinceEpoch = date.getTime() / 1000;

            console.log(millisecondsSinceEpoch);

            try {
              const shape = tvWidget.activeChart().createExecutionShape();
              shape
                .setText(param?.method)
                .setTooltip(param?.detail)
                .setTextColor("#e4e87a")
                .setArrowColor("#e4e87a")
                .setDirection("buy")
                .setTime(millisecondsSinceEpoch)
                .setArrowHeight(32)
                .setArrowSpacing(10);
            } catch (shapeError) {
              console.error("Error creating shape:", shapeError);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching pattern data:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div ref={chartContainerRef} className={styles.TVChartContainer} />
    </>
  );
};
