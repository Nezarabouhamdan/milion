import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { analyzer } from "vite-bundle-analyzer";
import { readFileSync } from "fs";

// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [
        vue(),
        ...(process.env.ANALYZE === 'true' ? [analyzer({ analyzerPort: 8889 })] : []),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    ssgOptions: {
        script: "async",
        formatting: "minify",
        includedRoutes: () => ["/palm-central"],
        onPageRendered: (_route: string, html: string) => {
            // 1. Remove Google Translate — not needed on this focused landing page.
            //    Use [^<]* (no tag-crossing) to avoid accidentally eating adjacent scripts.
            html = html
                .replace(/<script[^>]*>[^<]*googleTranslateElementInit[^<]*<\/script>/gi, "")
                .replace(/<script[^>]*src="[^"]*translate\.google\.com[^"]*"[^>]*><\/script>/gi, "")
                .replace(/<div[^>]*id="google_translate_element"[^>]*><\/div>/gi, "")
                .replace(/<style>[^<]*\.VIpgJd[^<]*<\/style>/gi, "");

            // 2. Defer GTM and Analytics until after window.load + 3 s.
            //    Removes ~365 ms of main-thread blocking tasks from the LCP critical window.
            //    dataLayer still works for form events because GTM queues pushes that happen
            //    before it loads.
            html = html
                .replace(/<script[^>]+src="[^"]*www\.googletagmanager\.com[^"]*"[^>]*><\/script>/gi, "")
                .replace(/<script>[^<]*gtm\.start[^<]*<\/script>/gi, "")
                .replace(/<script>[^<]*G-GS8QZDD8ZX[^<]*<\/script>/gi, "");
            html = html.replace(
                "</body>",
                `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.addEventListener('load',function(){setTimeout(function(){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MGGJS6WR');var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=G-GS8QZDD8ZX';document.head.appendChild(g);gtag('js',new Date());gtag('config','G-GS8QZDD8ZX');},3000);});</script></body>`
            );

            // 3. Make main app CSS non-render-blocking (~84 KiB, almost none used on landing page)
            html = html.replace(
                /(<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/app-[^"]*\.css)"[^>]*>)/gi,
                (_m: string, _full: string, href: string) =>
                    `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`
            );

            // 4. Make Google Fonts CSS non-render-blocking (750 ms blocker)
            html = html.replace(
                /(<link[^>]*href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"[^>]*rel="stylesheet"[^>]*>|<link[^>]*rel="stylesheet"[^>]*href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"[^>]*>)/gi,
                (_m: string, _full: string, h1: string, h2: string) => {
                    const href = h1 || h2;
                    return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
                }
            );

            // 5. Inline PalmCentral page CSS to eliminate its 460 ms render-blocking request.
            //    The file already exists in dist/assets/ at this point in the SSG pipeline.
            const cssLinkMatch =
                html.match(/<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/PalmCentr[^"]*\.css)"[^>]*>/i) ||
                html.match(/<link[^>]*href="(\/assets\/PalmCentr[^"]*\.css)"[^>]*rel="stylesheet"[^>]*>/i);
            if (cssLinkMatch) {
                try {
                    const cssContent = readFileSync(
                        path.resolve(__dirname, "dist", cssLinkMatch[1].replace(/^\//, "")),
                        "utf-8"
                    );
                    html = html.replace(cssLinkMatch[0], `<style>${cssContent}</style>`);
                } catch {
                    // keep the link tag if the file can't be read (dev mode, etc.)
                }
            }

            // 6. Preload hero image (no crossorigin — must match the <img> tag's no-CORS mode)
            const heroUrl = "https://www.nakheel.com/images/nakheelcorporatelibraries/developments/projects/palm-central_image-03.jpg?sfvrsn=2eabbc59_1";
            html = html.replace(
                /(<meta\s+charset[^>]*>)/i,
                `$1<link rel="preload" as="image" href="${heroUrl}" fetchpriority="high">`
            );

            return html;
        },
    },
});
