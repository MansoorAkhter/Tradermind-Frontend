"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Script from "next/script";

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../public/static/charting_library";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "@/config/firebase";
import { selectUser, setUser } from "@/store/slices/userSlice";
import Chat from "@/components/widget/Chat";
// import { selectUser, setUser } from "@/store/slices/authSlice";

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: "BINANCE:BTCUSDT",
  interval: "1D" as ResolutionString,
  // theme: "dark",
  disabled_features: ["use_localstorage_for_settings"],
  library_path: "/static/charting_library/",
  locale: "en",
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
};

const TVChartContainer = dynamic(
  () => import("@/trading_view").then((mod) => mod.TVChartContainer),
  { ssr: false }
);

const Home = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser(user));
        console.log("Active Google User:", user);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); 
  }, []);


  return (
    <main>
      <div className="relative h-full w-full">
        <Script
          src="/static/datafeeds/udf/dist/bundle.js"
          strategy="lazyOnload"
          onReady={() => {
            setIsScriptReady(true);
          }}
        />
        {isScriptReady && <TVChartContainer {...defaultWidgetProps} />}
      </div>
      <Chat/>
    </main>
  );
};

export default Home;
