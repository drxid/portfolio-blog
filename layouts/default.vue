<template>
  <div class="flex min-h-screen flex-col">
    <div class="container-content">
      <AppHeader />
    </div>
    <main class="container-content flex-1 pt-12 sm:pt-16">
      <slot />
    </main>
    <div class="container-content">
      <AppFooter />
    </div>
  </div>
</template>
