// API route to fetch node data from xandeumstats backend
// This proxies the request to avoid CORS issues

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try xandeumstats backend API
        const response = await fetch('https://xandeumstats.xyz/api/pnodes', {
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        return Response.json(data);
    } catch (error) {
        console.error('Failed to fetch from xandeumstats:', error);

        // Fallback to our own nodes endpoint
        try {
            const fallbackResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/nodes`);
            const fallbackData = await fallbackResponse.json();
            return Response.json(fallbackData);
        } catch (fallbackError) {
            return Response.json(
                { error: 'Failed to fetch node data' },
                { status: 500 }
            );
        }
    }
}
