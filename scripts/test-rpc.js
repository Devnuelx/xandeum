
const RPC_ENDPOINT = "https://rpc.xandeum.network";
const RPC_TIMEOUT = 5000;

async function testRpc() {
    console.log(`Testing connection to: ${RPC_ENDPOINT}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RPC_TIMEOUT);

    try {
        const start = Date.now();
        const response = await fetch(RPC_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getClusterNodes",
                params: [],
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const elapsed = Date.now() - start;

        console.log(`Response Status: ${response.status} (${response.statusText})`);
        console.log(`Latency: ${elapsed}ms`);

        if (!response.ok) {
            console.error("Request failed.");
        } else {
            const text = await response.text();
            console.log("Response Body Preview:", text.substring(0, 500));
        }

    } catch (error) {
        if (error.name === "AbortError") {
            console.error(error.name);
            console.error("TIMEOUT: Request took longer than 5000ms");
        } else {
            console.error("FETCH ERROR:", error.message);
            if (error.cause) console.error("Cause:", error.cause);
        }
    }
}

testRpc();
