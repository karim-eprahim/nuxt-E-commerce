<template>
  <section class="relative overflow-hidden bg-background py-24 px-6">

    <!-- Background glow -->
    <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(234,179,8,0.06)_0%,rgba(239,68,68,0.04)_40%,transparent_70%)]" />
    <!-- Subtle grid -->
    <div class="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]" />

    <div class="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      <!-- ── Left Content ── -->
      <div class="flex flex-col gap-6 lg:items-start items-center text-center lg:text-left">

        <!-- Label -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-300 text-[0.68rem] font-bold tracking-widest uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97H11L10 22l8.91-10.97H13L13 2z"/></svg>
          Limited Time Offer
        </div>

        <!-- Title -->
        <h2 class="text-[clamp(3.5rem,9vw,6.5rem)] font-black leading-[0.95] tracking-[-0.04em] text-foreground">
          FLASH<br />
          <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            DROP
          </span>
        </h2>

        <!-- Description -->
        <p class="text-muted-foreground text-base leading-relaxed max-w-[420px]">
          Final clearance of the Noir Collection. High-performance fabrics,
          legendary silhouettes — exclusively for 24 hours.
        </p>

        <!-- Discount badge -->
        <div class="inline-flex items-baseline gap-1.5 px-5 py-3 rounded-2xl border border-red-500/25 bg-gradient-to-r from-red-500/10 to-amber-500/8">
          <span class="text-[2.4rem] font-black leading-none bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">40%</span>
          <span class="text-sm font-extrabold text-red-400 uppercase tracking-wide">OFF</span>
        </div>

        <!-- Countdown label -->
        <p class="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground -mb-3">Offer ends in:</p>

        <!-- Countdown -->
        <div class="flex items-start gap-2">
          <template v-for="(time, index) in countdown" :key="index">
            <div class="flex flex-col items-center gap-1.5">
              <div class="relative min-w-[68px] px-4 py-3 rounded-xl border border-border/60 bg-secondary/40 backdrop-blur-sm text-center overflow-hidden">
                <!-- Top shine -->
                <div class="absolute inset-x-0 top-0 h-1/2 bg-white/[0.025] rounded-t-xl" />
                <span class="block text-[2rem] font-black text-foreground leading-none tabular-nums">
                  {{ String(time.value).padStart(2, '0') }}
                </span>
              </div>
              <span class="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground">{{ time.label }}</span>
            </div>
            <span v-if="index < countdown.length - 1" class="text-[1.8rem] font-black text-border pt-2 leading-none">:</span>
          </template>
        </div>

        <!-- CTA -->
        <button class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_4px_28px_rgba(239,68,68,0.35)] hover:shadow-[0_8px_40px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">
          Claim 40% Off Now
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>

        <p class="text-[0.7rem] text-muted-foreground">*No code needed. Applied automatically at checkout.</p>
      </div>

      <!-- ── Right Visual ── -->
      <div class="relative flex items-center justify-center min-h-[400px]">

        <!-- Decorative rings -->
        <div class="absolute w-[320px] h-[320px] rounded-full border border-red-500/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ring pointer-events-none" />
        <div class="absolute w-[450px] h-[450px] rounded-full border border-amber-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ring [animation-delay:1.5s] pointer-events-none" />

        <!-- Card -->
        <div class="relative w-full max-w-[340px] rounded-3xl border border-red-500/20 bg-card/80 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:-translate-y-2">

          <!-- Top glow -->
          <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-[280px] h-[180px] rounded-full bg-red-500/20 blur-[60px] pointer-events-none" />

          <!-- Card body -->
          <div class="flex flex-col items-center gap-3 px-8 py-10 border-b border-border/30 relative">
            <!-- Bolt icon with pulse ring -->
            <div class="w-24 h-24 rounded-full border border-red-500/25 bg-gradient-to-br from-red-500/15 to-amber-500/10 flex items-center justify-center text-amber-400 animate-pulse-ring">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97H11L10 22l8.91-10.97H13L13 2z"/></svg>
            </div>
            <span class="text-base font-bold text-foreground">Noir Collection</span>
            <span class="text-[0.7rem] uppercase tracking-widest font-semibold text-muted-foreground">2025 Limited Edition</span>
            <s class="text-xs text-muted-foreground">Was $499</s>
            <span class="text-[1.8rem] font-black bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent leading-none">Now $299</span>
          </div>

          <!-- Stock badge -->
          <div class="flex items-center gap-2 px-6 py-4 text-sm font-semibold text-muted-foreground">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_0_4px_rgba(52,211,153,0.2)]" />
            Only 12 left in stock
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TimeUnit {
  value: number
  label: string
}

const countdown = ref<TimeUnit[]>([
  { value: 8, label: 'Hours' },
  { value: 42, label: 'Mins' },
  { value: 15, label: 'Secs' }
])

onMounted(() => {
  setInterval(() => {
    countdown.value[2].value -= 1
    if (countdown.value[2].value < 0) { countdown.value[2].value = 59; countdown.value[1].value -= 1 }
    if (countdown.value[1].value < 0) { countdown.value[1].value = 59; countdown.value[0].value -= 1 }
    if (countdown.value[0].value < 0) {
      countdown.value = [{ value: 0, label: 'Hours' }, { value: 0, label: 'Mins' }, { value: 0, label: 'Secs' }]
    }
  }, 1000)
})
</script>

<style scoped>
@keyframes ring-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50%       { opacity: 0.2; transform: translate(-50%, -50%) scale(1.06); }
}
@keyframes bolt-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.25); }
  50%       { box-shadow: 0 0 0 14px rgba(239, 68, 68, 0); }
}

.animate-ring       { animation: ring-pulse 4s ease-in-out infinite; }
.animate-pulse-ring { animation: bolt-pulse 2s ease-in-out infinite; }
</style>