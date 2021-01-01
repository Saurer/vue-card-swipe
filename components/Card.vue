<template>
  <div class="wrapper">
    <transition
      appear
      appear-class="appear"
      appear-active-class="appear-active"
      appear-to-class="appear-to"
      :name="animation"
      @after-leave="handleDismiss"
    >
      <div
        v-if="!leave"
        ref="elementRef"
        class="card"
        :class="{
          interacting: active,
        }"
        :style="{
          transform: animation || !active ? null : `rotate(${angle}deg)`,
        }"
      >
        <img class="image" :src="imageUrl" />
        <div>Hello</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  touch-action: none;
}

.card {
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 30px;
  border-radius: 10px;
  user-select: none;
  width: 400px;
  height: 610px;
  overflow: hidden;

  touch-action: none;
  transform-origin: center 200%;
  transition: transform ease-in 0.3s, transorm-origin ease-in 0.3s;
}

.image {
  width: 400px;
  height: 300px;
  background: #ccc;
}

.card.interacting {
  transition: none;
}

.appear {
  transform: translateY(-100%) scale(0.9);
}

.appear-active {
  transform-origin: center bottom;
  transition: transform ease-out 0.4s, transorm-origin ease-out 0.4s;
}

.appear-to {
  transform: translateY(0) scale(1);
}

.left-leave-active {
  transform-origin: center 200%;
  transition: transform ease-in 0.3s, transorm-origin ease-in 0.3s;
}

.left-leave-to {
  transform: rotate(-90deg) scale(1.2);
  transform-origin: center 200%;
}

.right-leave-active {
  transform-origin: center 200%;
  transition: transform ease-in 0.3s, transorm-origin ease-in 0.3s;
}

.right-leave-to {
  transform: rotate(90deg) scale(1.2);
  transform-origin: center 200%;
}
</style>

<script lang="ts">
import Vue from 'vue';
import {
  computed,
  defineComponent,
  ref,
  watchEffect,
} from '@nuxtjs/composition-api';
import { useSwipe } from '~/composition';

export default defineComponent({
  props: {
    id: Number,
  },

  setup(props, context) {
    const animation = ref('');
    const leave = ref(false);

    const gestureData = useSwipe({
      gestureDistance: 150,
      onGesture: (type) => (animation.value = type),
    });

    watchEffect(() => {
      if (animation.value) {
        Vue.nextTick(() => {
          leave.value = true;
        });
      }
    });

    const handleDismiss = () => context.emit('dismiss', animation.value);

    const imageUrl = computed(
      () => `https://picsum.photos/id/${props.id}/400/300`
    );

    return {
      ...gestureData,
      animation,
      leave,
      imageUrl,

      handleDismiss,
    };
  },
});
</script>
