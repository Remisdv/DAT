import { defaultLocale } from "@/i18n/routing";

// Static export: emit an HTML page that redirects via <meta http-equiv="refresh">.
// Works on GitHub Pages without any server-side redirect or middleware.
// basePath is baked into process.env.NEXT_PUBLIC_BASE_PATH by the build.
export default function RootPage() {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const target = `${base}/${defaultLocale}/`;
    return (
        <html lang={defaultLocale}>
            <head>
                <meta httpEquiv="refresh" content={`0; url=${target}`} />
                <title>CYNA — Documentation</title>
            </head>
            <body
                style={{
                    margin: 0,
                    background: "#07090f",
                    color: "#e2e8f0",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <p style={{ padding: "2rem" }}>
                    Redirection vers <a href={target} style={{ color: "#06b6d4" }}>{target}</a>…
                </p>
            </body>
        </html>
    );
}
