import { computed, onMounted, onUnmounted, ref } from '@nuxtjs/composition-api';

interface Point {
  x: number;
  y: number;
}

interface GestureData {
  type: string;
  start: Point;
  current: Point;
}

type Gesture = 'left' | 'right';

interface Options {
  gestureDistance?: number;
  onGesture?: (gesture: Gesture) => void;
}

const defaultOptions = {
  gestureDistance: 100,
};

const getPointToPointAngle = (source: Point, dest: Point) => {
  const rad = Math.atan2(dest.y - source.y, dest.x - source.x);

  return radToDeg(rad);
};

const radToDeg = (rad: number) => rad * (180 / Math.PI);

export function useSwipe(options: Options = {}) {
  const elementRef = ref<HTMLElement>();
  const gesture = ref<GestureData | undefined>(undefined);
  const params = { ...defaultOptions, ...options };

  const gestureStart = (e: PointerEvent) => {
    if (gesture.value) {
      return;
    }

    gesture.value = {
      type: e.pointerType,
      start: {
        x: e.clientX,
        y: e.clientY,
      },
      current: {
        x: e.clientX,
        y: e.clientY,
      },
    };
  };

  const gestureMove = (e: PointerEvent) => {
    if (!gesture.value) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    if (gesture.value.type !== e.pointerType) {
      return;
    }

    gesture.value.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const gestureEnd = (e: PointerEvent) => {
    if (e.pointerType !== gesture.value?.type) {
      return;
    }

    if (
      params.onGesture &&
      Math.abs(gesture.value.start.x - gesture.value.current.x) >=
        params.gestureDistance
    ) {
      const gestureType = angle.value > 0 ? 'right' : 'left';
      params.onGesture(gestureType);
    }

    gesture.value = undefined;
  };

  const active = computed(() => !!gesture.value);

  const angle = computed(() => {
    if (!elementRef.value || !gesture.value) {
      return 0;
    }

    const elementPoint = {
      x: elementRef.value.offsetLeft + elementRef.value.clientWidth / 2,
      y: elementRef.value.offsetTop + elementRef.value.clientHeight * 2,
    };

    const startAngle = getPointToPointAngle(elementPoint, gesture.value.start);
    const currentAngle = getPointToPointAngle(
      elementPoint,
      gesture.value.current
    );

    return Math.round((currentAngle - startAngle) * 100) / 100;
  });

  const suppressPointerEvent = (e: TouchEvent) => {
    e.cancelable && e.preventDefault();
  };

  onMounted(() => {
    // Suppress browser gestures(notably MSEdge) from capturing the local event handler
    elementRef.value?.addEventListener('touchmove', suppressPointerEvent);

    elementRef.value?.addEventListener('pointerdown', gestureStart);
    document.addEventListener('pointermove', gestureMove);
    document.addEventListener('pointerup', gestureEnd);
  });

  onUnmounted(() => {
    document.removeEventListener('pointermove', gestureMove);
    document.removeEventListener('pointerup', gestureEnd);
  });

  return {
    elementRef,
    active,
    angle,
  };
}
