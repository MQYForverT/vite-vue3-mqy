<template>
  <div class="app-container">
    <div class="app-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'MainBody'
})
</script>
