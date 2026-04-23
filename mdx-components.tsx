import type { MDXComponents } from "mdx/types";
import { Mermaid } from "@/components/mermaid";
import { Timeline } from "@/components/timeline";
import { TradeoffTabs } from "@/components/tradeoff-tabs";
import { Callout } from "@/components/callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        Mermaid,
        Timeline,
        TradeoffTabs,
        Callout,
        ...components,
    };
}
