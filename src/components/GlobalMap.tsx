import { Node } from "@/lib/types";
import styles from "./GlobalMap.module.css";

interface GlobalMapProps {
    nodes: Node[];
}

export default function GlobalMap({ nodes }: GlobalMapProps) {
    // Approximate coordinates for regions (0-100 scale on standard Robinson projection roughly)
    const getPosition = (region: string) => {
        const jitter = (num: number) => num + (Math.random() - 0.5) * 5;

        switch (region) {
            case "us-east-1": return { x: jitter(28), y: jitter(38) }; // US East
            case "us-west-2": return { x: jitter(18), y: jitter(38) }; // US West
            case "eu-central-1": return { x: jitter(52), y: jitter(28) }; // Germany
            case "eu-west-1": return { x: jitter(49), y: jitter(29) }; // UK
            case "ap-southeast-1": return { x: jitter(78), y: jitter(55) }; // Singapore
            case "ap-northeast-1": return { x: jitter(85), y: jitter(38) }; // Japan
            default: return { x: jitter(50), y: jitter(50) };
        }
    };

    // Map region to color palette style
    const getRegionStyle = (region: string) => {
        switch (region) {
            case "us-east-1":
            case "us-west-2": return styles.primary; // US - Blue
            case "eu-central-1": return styles.secondary; // DE - Yellow
            case "eu-west-1": return styles.tertiary; // GB - Blue (Shared palette)
            case "ap-southeast-1": return styles.quinary; // SG - Red-ish (Simulated)
            case "ap-northeast-1": return styles.quaternary; // JP - Yellow-ish
            default: return "";
        }
    };

    return (
        <div className={styles.mapContainer}>
            <div className={styles.mapContent}>
                {/* Left Side: Metrics Panel */}
                <div className={styles.metricsPanel}>
                    <div className={styles.totalRequestsLabel}>Total Requests</div>
                    <div className={styles.totalRequestsValue}>115,838,147,868</div>
                    <div className={styles.requestsPerSec}>428,079/s</div>

                    <div className={styles.listHeader}>Top Countries by Requests</div>
                    <div className={styles.countryList}>
                        <div className={styles.countryItem}>
                            <div className={styles.countryCode}>
                                <span className={`${styles.legendDot} ${styles.valPrimary}`}></span> US
                            </div>
                            <div className={styles.countryValue}>40,776,365,166</div>
                            <div className={styles.countryRate}>159,044/s</div>
                        </div>
                        <div className={styles.countryItem}>
                            <div className={styles.countryCode}>
                                <span className={`${styles.legendDot} ${styles.valSecondary}`}></span> DE
                            </div>
                            <div className={styles.countryValue}>6,211,366,240</div>
                            <div className={styles.countryRate}>24,361/s</div>
                        </div>
                        <div className={styles.countryItem}>
                            <div className={styles.countryCode}>
                                <span className={`${styles.legendDot} ${styles.valTertiary}`}></span> GB
                            </div>
                            <div className={styles.countryValue}>4,951,970,695</div>
                            <div className={styles.countryRate}>21,281/s</div>
                        </div>
                        <div className={styles.countryItem}>
                            <div className={styles.countryCode}>
                                <span className={`${styles.legendDot} ${styles.valQuaternary}`}></span> IN
                            </div>
                            <div className={styles.countryValue}>4,357,372,261</div>
                            <div className={styles.countryRate}>18,227/s</div>
                        </div>
                        <div className={styles.countryItem}>
                            <div className={styles.countryCode}>
                                <span className={`${styles.legendDot} ${styles.valQuinary}`}></span> BR
                            </div>
                            <div className={styles.countryValue}>3,932,951,467</div>
                            <div className={styles.countryRate}>16,171/s</div>
                        </div>
                        <div className={styles.countryItem}>
                            <div className={styles.countryCode}>
                                <span className={`${styles.legendDot} ${styles.valSecondary}`}></span> SG
                            </div>
                            <div className={styles.countryValue}>3,806,970,361</div>
                            <div className={styles.countryRate}>15,292/s</div>
                        </div>
                        <div className={styles.countryItem}>
                            <div className={styles.countryCode}>
                                <span className={`${styles.legendDot} ${styles.valQuinary}`}></span> JP
                            </div>
                            <div className={styles.countryValue}>3,690,364,431</div>
                            <div className={styles.countryRate}>14,857/s</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Dot Map */}
                <div className={styles.mapViz}>
                    {/* Detailed Dotted World Map SVG */}
                    <svg className={styles.worldMapSvg} viewBox="0 0 1000 450" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dotPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="1" fill="#333" />
                            </pattern>
                        </defs>
                        {/* Outline of World Map (Simplified High-Res Path) */}
                        <path
                            d="M152.4,148.9l-2.3-1.6l-5.6,3.6l-2.6-1.5l-2.1,3.4l-6.3-1.8l-1.3,2.6l-4.4,0.3l-3.9,4.4l0.3,3.9l3.4,4.7l-4.7,2.1
                 l-1.8,4.7l-4.2,1.8l-0.5,4.4l5.2,6.5l0.3,3.9l-4.4,2.9l-5.5-1.6l-4.7,1.3l-2.3,4.2l2.3,4.2l3.6,1.8l-0.5,4.4l-4.2,2.3
                 l-3.4-1.8l-2.1,3.1l-6.8-0.3l-2.3,2.6l-4.4-1.8l-4.9,2.9l-1.3,4.4l2.1,4.9l-1.3,4.2l-4.9,1.3l-1.8,5.7l2.1,3.1l4.4,1.8
                 l-0.5,5.2l-3.9,4.9l-4.4-0.5l-4.4,2.1l0.3,5.2l-2.6,3.4l-6.5-1.3l-1.6,3.4l3.1,3.9l0.5,5.7l-3.1,4.7l-6.8,1.6l-4.4,3.1
                 l-3.4,4.4l1.3,4.2l-2.6,2.3l-0.5,5.7l2.9,3.9l4.9,1.3l3.6,5.2l-1.6,4.4l-5.7,2.1l-3.4,3.6l2.1,4.2l5.7,2.1l4.7,0.3
                 l2.9,3.1l-1.8,6.8l2.9,3.9l4.4,1.8l3.1,5.2l5.2,2.3l4.2-0.5l5.2,2.9l4.4,0.3l3.1,4.4l4.9-0.5l4.4,2.9l5.5-0.3l3.1-3.6
                 l4.4,1.3l4.7,0.3l2.6-2.6l5.7,0.3l3.1,2.9l6.5-1.3l2.6-4.2l5.2-1.3l4.4,1.8l3.1-2.9l6.2,1.3l3.1-2.6l4.4,1.3l3.4-1.8
                 l5.2,1.6l3.6-2.6l3.1,2.3l5.5-0.5l3.9-3.9l4.4,1.6l4.2-2.3l4.7,0.3l3.4-2.6l5.5,1.3l2.3-3.6l4.4,0.3l3.6-2.6l5.2,1.3
                 l2.6-2.9l4.9,1.6l2.9-2.9l4.4,1.6l3.9-2.1l3.1,2.9l5.5-1.3l2.9-3.4l5.2,1.3l3.1-2.9l4.4,1.3l3.6-2.6l4.7,1.8l2.9-3.1
                 l4.9,2.1l3.1-2.9l4.4,2.3l3.9-2.1l4.4,2.3l4.2-2.3l4.7,2.6l2.6-2.9l5.5,2.1l3.1-3.1l4.7,2.3l3.1-2.6l4.7,2.6l4.2-2.9
                 l2.9,2.6l4.9-0.5l4.2,2.6l3.4-2.9l4.4,2.3l4.7-2.3l3.4,2.6l4.4-1.6l2.9,2.6l4.7-0.5l4.4,2.1l3.9-2.1l4.2,2.3l4.7-2.3
                 l3.4,2.6l4.2-2.9l3.1,2.9l4.9-1.3l2.9,2.6l4.4-1.6l3.9,2.6l4.4-1.8l5.2,2.6l3.1-2.9l4.2,2.6l4.9-1.6l3.4,2.9l5.5-1.3
                 l2.9,2.9l4.4-1.3l3.9,2.6l4.2-2.3l5.2,2.1l3.4-2.9l4.7,2.6l3.9-2.6l5.2,2.3l3.1-2.9l4.4,2.3l4.9-2.1l3.4,2.6l5.2-1.3
                 l3.1,3.1l4.4-2.3l3.9,2.6l4.2-2.3l5.2,2.3l4.4-2.3l3.1,2.9l4.9-1.3l4.2,2.6l3.4-2.9l4.4,2.3l4.7-2.1l3.9,2.6l4.2-2.3
                 l5.2,2.3l3.1-2.9l4.4,2.3l4.9-2.1l3.4,2.6l5.2-1.3l3.1,3.1l4.4-2.3M700,100"
                            fill="url(#dotPattern)"
                            style={{ opacity: 0.6 }}
                        />
                        <ellipse cx="220" cy="180" rx="80" ry="90" fill="url(#dotPattern)" opacity="0.3" /> {/* N. America */}
                        <ellipse cx="300" cy="350" rx="60" ry="80" fill="url(#dotPattern)" opacity="0.3" /> {/* S. America */}
                        <ellipse cx="530" cy="200" rx="60" ry="60" fill="url(#dotPattern)" opacity="0.3" /> {/* Europe */}
                        <ellipse cx="550" cy="300" rx="80" ry="90" fill="url(#dotPattern)" opacity="0.3" /> {/* Africa */}
                        <ellipse cx="750" cy="180" rx="120" ry="100" fill="url(#dotPattern)" opacity="0.3" /> {/* Asia */}
                        <ellipse cx="850" cy="380" rx="50" ry="50" fill="url(#dotPattern)" opacity="0.3" /> {/* Australia */}
                    </svg>

                    {nodes.map((node, i) => {
                        const pos = getPosition(node.region);
                        const colorClass = getRegionStyle(node.region);

                        return (
                            <div key={node.id}>
                                <div
                                    className={`${styles.nodeDot} ${colorClass}`}
                                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                />
                                {node.status === 'active' && Math.random() > 0.6 && (
                                    <div
                                        className={`${styles.activePulse} ${colorClass}`}
                                        style={{
                                            left: `${pos.x}%`,
                                            top: `${pos.y}%`,
                                            animationDelay: `${Math.random() * 2}s`
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
