# Learn SvelteKit

nothing but learning trials

## Steps

```bash
pnpm dlx shadcn-svelte@latest init
pnpm dlx shadcn-svelte@latest add button card input label checkbox

pnpm add better-auth lucide-svelte svelte-sonner
```

`vite.config.ts` add:

```TypeScript
ssr: {
    noExternal: ["svelte-sonner", "lucide-svelte"]
}
```
