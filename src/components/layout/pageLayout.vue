<script setup lang="ts">
import { useSystemStore } from '~/store/system';

const systemStore = useSystemStore();
</script>

<template>
  <nut-config-provider :theme="systemStore.theme">
    <div class="page-layout">
      <slot />
    </div>
  </nut-config-provider>
</template>
