
<script setup>
import { RouterView } from 'vue-router';
import UserProfileSkeleton from './components/UserProfileSkeleton.vue';
</script>]

<template>
  <!-- <v-app>
    <Suspense>
      <template #default> -->
        <RouterView v-slot="{ Component }">
          <v-container>
            <component :is="Component" />
          </v-container>
        </RouterView>
      <!-- </template>
      <template #fallback>
        <v-container>
          <UserProfileSkeleton />
        </v-container> -->
      <!-- </template> -->
    <!-- </Suspense>
  </v-app> -->''
</template> 


<style scoped></style>
