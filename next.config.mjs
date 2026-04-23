import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
    },
});

const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? "/DAT" : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    basePath,
    images: { unoptimized: true },
    trailingSlash: true,
    pageExtensions: ["ts", "tsx", "mdx"],
    reactStrictMode: true,
    eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(withMDX(nextConfig));
