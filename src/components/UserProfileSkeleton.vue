<template>
  <div>

    <v-skeleton-loader type="heading" class="mb-6" />

    <div class="text-center mb-6">
      <v-skeleton-loader type="avatar" width="96" height="96" class="mx-auto mb-3" />
      <v-skeleton-loader type="button" width="100" height="32" class="mx-auto" />
    </div>

    <v-skeleton-loader type="heading" width="60%" class="mb-3" />
    <v-skeleton-loader
      v-for="n in 8"
      :key="n"
      type="text"
      class="mb-3"
      width="100%"
      height="40"
    />

    <v-skeleton-loader type="heading" width="60%" class="mt-5 mb-3" />
    <div class="d-flex justify-space-between">
      <v-skeleton-loader type="button" width="45%" height="40" />
      <v-skeleton-loader type="button" width="45%" height="40" />
    </div>
  </div>
</template>

<script setup>

</script>
