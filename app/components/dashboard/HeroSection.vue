<template>
    <section class="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-16">
        <!-- Inner layout -->
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl w-full mx-auto">
            <!-- ── Left Content ── -->
            <div class="flex flex-col gap-6 lg:items-start items-center text-center lg:text-left">
                <!-- Badge -->
                <div
                    class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-widest uppercase">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    New Season Collection
                </div>

                <!-- Title -->
                <h1 class="text-[clamp(3rem,8vw,6rem)] font-black leading-none tracking-tighter text-foreground">
                    THE FUTURE<br />
                    OF
                    <span
                        class="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        STYLE
                    </span>
                </h1>

                <!-- Description -->
                <p class="text-muted-foreground text-lg leading-relaxed max-w-md">
                    Redefining the digital atelier experience through curated aesthetics
                    and innovative textures. Discover our latest drop.
                </p>

                <!-- Stats -->
                <div class="flex items-center gap-6">
                    <div class="flex flex-col gap-0.5">
                        <span class="text-2xl font-extrabold text-foreground leading-none">12K+</span>
                        <span
                            class="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">Products</span>
                    </div>
                    <div class="w-px h-9 bg-border" />
                    <div class="flex flex-col gap-0.5">
                        <span class="text-2xl font-extrabold text-foreground leading-none">98%</span>
                        <span
                            class="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">Satisfaction</span>
                    </div>
                    <div class="w-px h-9 bg-border" />
                    <div class="flex flex-col gap-0.5">
                        <span class="text-2xl font-extrabold text-foreground leading-none">50+</span>
                        <span
                            class="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">Brands</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-wrap gap-3 pt-2">
                    <button
                        class="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-[0_4px_24px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                        Shop Collection
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        class="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-foreground bg-secondary/50 border border-border hover:bg-secondary hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                        View Lookbook
                    </button>
                </div>
            </div>

            <!-- ── Right Showcase ── -->
            <div class="relative flex items-center justify-center min-h-[460px]">
                <!-- Glow orbs -->
                <div
                    class="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-[60px] animate-blob pointer-events-none" />
                <div
                    class="absolute -bottom-6 -right-8 w-40 h-40 rounded-full bg-violet-500/15 blur-[50px] animate-blob [animation-delay:2s] pointer-events-none" />

                <!-- Card -->
                <div
                    class="relative w-full max-w-[400px] rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_48px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0.3)]">
                    <!-- Floating badge -->
                    <div
                        class="absolute -top-3 right-5 px-3 py-1 rounded-full text-[0.65rem] font-black tracking-widest uppercase text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-[0_4px_12px_rgba(99,102,241,0.4)]">
                        NEW
                    </div>

                    <!-- Image area -->
                    <div
                        class="h-80 rounded-t-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-purple-950 flex flex-col items-center justify-center gap-3">
                        <div
                            class="w-24 h-24 rounded-full border border-white/15 bg-white/8 flex items-center justify-center animate-spin-slow">
                            <span
                                class="text-4xl bg-gradient-to-br from-indigo-300 to-fuchsia-400 bg-clip-text text-transparent select-none">✦</span>
                        </div>
                        <p class="text-[0.72rem] uppercase tracking-[0.15em] text-white/40 font-semibold">
                            2025 Collection
                        </p>
                    </div>

                    <!-- Info row -->
                    <div class="flex items-center justify-between px-5 py-4 border-t border-border/40">
                        <div class="flex flex-col gap-0.5">
                            <span class="text-sm font-bold text-foreground">Noir Essentials</span>
                            <span
                                class="text-base font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">$299</span>
                        </div>
                        <button
                            class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] transition-all duration-200"
                            aria-label="Add to cart">
                            <Icon name="lucide:shopping-cart" size="20" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Component logic
</script>

<style scoped>
@keyframes blob-float {

    0%,
    100% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-24px) scale(1.04);
    }
}

@keyframes spin-slow {
    from {
        transform: rotate(0deg) scale(1);
    }

    33% {
        transform: rotate(10deg) scale(1.05);
    }

    66% {
        transform: rotate(-5deg) scale(0.97);
    }

    to {
        transform: rotate(0deg) scale(1);
    }
}

.animate-blob {
    animation: blob-float 8s ease-in-out infinite;
}

.animate-spin-slow {
    animation: spin-slow 4s ease-in-out infinite;
}
</style>
