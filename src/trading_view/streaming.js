
// finhub
const apiKey = 'crul3mhr01qno00e1gcgcrul3mhr01qno00e1gd0';
// const websocketUrl = `wss://ws.finnhub.io?token=${apiKey}`;
const websocketUrl = `ws://192.168.100.41:8000/datasource/ws`;

const socket = new WebSocket(websocketUrl);

const channelToSubscription = new Map();

socket.onopen = () => {
    console.log('[socket] Connected');
};

socket.onclose = (event) => {
    console.log('[socket] Disconnected:', event.reason);
};

socket.onerror = (error) => {
    console.log('[socket] Error:', error);
};

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('[socket] Message:', message);

    // Check if the message is a trade
    if (message.s && typeof message.p === 'number') {
        const tradePrice = parseFloat(message.p);
        const tradeTime = Math.floor(message.t); // Convert timestamp to seconds

        const subscriptionItem = channelToSubscription.get(message.s);
        if (subscriptionItem === undefined) {
            return; // No subscription found for this channel
        }

        const { resolution } = subscriptionItem; // Assuming the interval is stored in the subscription item
        const lastBar = subscriptionItem.lastBar;
        const nextBarTime = getNextBarTime(lastBar.time, resolution);
        // console.log(subscriptionItem, 'hereeee', nextBarTime, tradeTime)

        let bar;
        if (tradeTime >= nextBarTime) {
            // If the current trade time is greater than the next bar time, start a new bar
            bar = {
                time: nextBarTime,
                open: tradePrice,
                high: tradePrice,
                low: tradePrice,
                close: tradePrice,
            };
            // console.log('[socket] Generate new bar', bar);
        } else {
            // Update the existing bar with new trade information
            bar = {
                ...lastBar,
                high: Math.max(lastBar.high, tradePrice),
                low: Math.min(lastBar.low, tradePrice),
                close: tradePrice,
            };
        }

        // Update the subscription item with the new or updated bar
        subscriptionItem.lastBar = bar;

        // Send data to every subscriber of that symbol
        subscriptionItem.handlers.forEach(handler => handler.callback(bar));
    }
};



function getNextBarTime(barTime, resolution) {
    console.log(resolution);
    const date = new Date(barTime * 1000); // Convert seconds to milliseconds for JavaScript Date manipulation
    
    switch (resolution) {
        case '1D': // daily
            date.setDate(date.getDate() + 1);
            break;
        case '240': // 4 hours
            date.setHours(date.getHours() + 4);
            break;
        case '60': // hourly
            date.setHours(date.getHours() + 1);
            break;
        case '15': // 15 minutes
            date.setMinutes(date.getMinutes() + 15);
            break;
        case '5': // 5 minutes
            date.setMinutes(date.getMinutes() + 5);
            break;
        case '1': // 1 minute
            date.setMinutes(date.getMinutes() + 1);
            break;
        case '1W': // weekly
            date.setDate(date.getDate() + 7);
            break;
        case '1M': // monthly
            date.setMonth(date.getMonth() + 1);
            break;
        default:
            console.log('Unsupported interval', resolution);
            return barTime; // Return the original barTime if resolution is unsupported
    }
    return Math.floor(date.getTime() / 1000); // Convert milliseconds back to seconds
}


export function subscribeOnStream(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback,
    lastBar
) {
    console.log("======================================",
        symbolInfo,
        resolution,
        onRealtimeCallback,
        subscriberUID,
        onResetCacheNeededCallback,
        lastBar,
        "======================================"
    );

    const parsedSymbol = `${symbolInfo.ticker}`;
    console.log("object", parsedSymbol);

    const handler = {
        id: subscriberUID,
        callback: onRealtimeCallback,
    };

    let subscriptionItem = channelToSubscription.get(parsedSymbol);

    if (subscriptionItem) {
        // Existing subscription found
        if (subscriptionItem.resolution !== resolution) {
            // Resolution has changed
            console.log(`[subscribeBars]: Updating subscription for symbol ${parsedSymbol}`);

            // Update the resolution, lastBar, and possibly other properties
            subscriptionItem.subscriberUID = subscriberUID; // Update subscriber UID if necessary
            subscriptionItem.resolution = resolution; // Update resolution
            subscriptionItem.lastBar = lastBar; // Update lastBar
            subscriptionItem.handlers = [handler]; // Reset handlers or add as necessary

            // Optionally, clear or reset data related to the old resolution
            // This might involve notifying handlers of the change
            subscriptionItem.handlers.forEach(handler => handler.callback(null)); // Notify handlers if needed
        } else {
            // Resolution has not changed, just add the new handler
            subscriptionItem.handlers.push(handler);
        }
    } else {
        // New subscription
        subscriptionItem = {
            subscriberUID,
            resolution,
            lastBar,
            handlers: [handler],
        };

        channelToSubscription.set(parsedSymbol, subscriptionItem);
        console.log('[subscribeBars]: Subscribe to streaming. Symbol:', parsedSymbol);

        // Send initial subscription request to the WebSocket
        socket.send(JSON.stringify({
            'type': 'subscribe',
            'symbol': parsedSymbol,
        }));
    }
}

export function unsubscribeFromStream(subscriberUID) {

    for (const channelString of channelToSubscription.keys()) {
        const subscriptionItem = channelToSubscription.get(channelString);
        const handlerIndex = subscriptionItem.handlers
            .findIndex(handler => handler.id === subscriberUID);

        if (handlerIndex !== -1) {
            // Remove from handlers
            subscriptionItem.handlers.splice(handlerIndex, 1);

            if (subscriptionItem.handlers.length === 0) {
                // Unsubscribe from the channel if it is the last handler
                console.log('[unsubscribeBars]: Unsubscribe from streaming. Symbol:', channelString);

                // Sending unsubscription request using the new data provider's format
                socket.send(JSON.stringify({
                    'type': 'unsubscribe',
                    'symbol': channelString
                }));

                channelToSubscription.delete(channelString);
                break;
            }
        }
    }
}
