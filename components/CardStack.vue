<template>
  <div class="wrapper">
    <Card :id="id" :key="id" @dismiss="handleDismiss" />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  setup() {
    const id = ref(0);
    const saved = ref<number[]>([]);
    const discarded = ref<number[]>([]);

    const handleNext = () => {
      id.value += 1;
    };

    const handleDismiss = (type: 'left' | 'right') => {
      if (type === 'left') {
        discarded.value.push(id.value);
      } else {
        saved.value.push(id.value);
      }

      handleNext();
    };

    return {
      id,
      saved,
      discarded,

      handleNext,
      handleDismiss,
    };
  },
});
</script>
