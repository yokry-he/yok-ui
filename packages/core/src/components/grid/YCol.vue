<script lang="ts">
import { computed, defineComponent, h, type CSSProperties, type PropType } from 'vue'
import {
  createColVariableStyles,
  gridBreakpoints,
  normalizeGridNumber,
  resolveResponsiveConfig,
  type YColResponsiveValue,
  type YGridElement
} from './utils'

export default defineComponent({
  name: 'YCol',
  props: {
    as: {
      type: String as PropType<YGridElement>,
      default: 'div'
    },
    span: {
      type: Number,
      default: 24
    },
    offset: {
      type: Number,
      default: 0
    },
    order: {
      type: Number,
      default: 0
    },
    push: {
      type: Number,
      default: 0
    },
    pull: {
      type: Number,
      default: 0
    },
    xs: {
      type: [Number, Object] as PropType<YColResponsiveValue>,
      default: undefined
    },
    sm: {
      type: [Number, Object] as PropType<YColResponsiveValue>,
      default: undefined
    },
    md: {
      type: [Number, Object] as PropType<YColResponsiveValue>,
      default: undefined
    },
    lg: {
      type: [Number, Object] as PropType<YColResponsiveValue>,
      default: undefined
    },
    xl: {
      type: [Number, Object] as PropType<YColResponsiveValue>,
      default: undefined
    },
    xxl: {
      type: [Number, Object] as PropType<YColResponsiveValue>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    const colStyle = computed<CSSProperties>(() => {
      const style: Record<string, string | number> = {
        '--yok-col-span-base': normalizeGridNumber(props.span) ?? 24,
        '--yok-col-offset-base': normalizeGridNumber(props.offset) ?? 0,
        '--yok-col-order-base': typeof props.order === 'number' && !Number.isNaN(props.order) ? Math.round(props.order) : 0,
        '--yok-col-push-base': normalizeGridNumber(props.push) ?? 0,
        '--yok-col-pull-base': normalizeGridNumber(props.pull) ?? 0
      }

      gridBreakpoints.forEach((breakpoint) => {
        const config = resolveResponsiveConfig(props[breakpoint])

        if (config) {
          createColVariableStyles(breakpoint, config, style)
        }
      })

      return style as CSSProperties
    })

    return () => h(
      props.as,
      {
        class: 'yok-col',
        style: colStyle.value
      },
      slots.default?.()
    )
  }
})
</script>

<style scoped>
.yok-col {
  --yok-col-current-span: var(--yok-col-span-xs, var(--yok-col-span-base, 24));
  --yok-col-current-offset: var(--yok-col-offset-xs, var(--yok-col-offset-base, 0));
  --yok-col-current-order: var(--yok-col-order-xs, var(--yok-col-order-base, 0));
  --yok-col-current-push: var(--yok-col-push-xs, var(--yok-col-push-base, 0));
  --yok-col-current-pull: var(--yok-col-pull-xs, var(--yok-col-pull-base, 0));

  position: relative;
  box-sizing: border-box;
  flex: 0 0 calc(var(--yok-col-current-span) * 100% / 24);
  order: var(--yok-col-current-order);
  max-width: calc(var(--yok-col-current-span) * 100% / 24);
  min-width: 0;
  margin-left: calc(var(--yok-col-current-offset) * 100% / 24);
  padding-right: calc(var(--yok-row-gutter-x, 0px) / 2);
  padding-left: calc(var(--yok-row-gutter-x, 0px) / 2);
  left: calc(var(--yok-col-current-push) * 100% / 24);
  right: calc(var(--yok-col-current-pull) * 100% / 24);
}

@media (min-width: 640px) {
  .yok-col {
    --yok-col-current-span: var(--yok-col-span-sm, var(--yok-col-span-xs, var(--yok-col-span-base, 24)));
    --yok-col-current-offset: var(--yok-col-offset-sm, var(--yok-col-offset-xs, var(--yok-col-offset-base, 0)));
    --yok-col-current-order: var(--yok-col-order-sm, var(--yok-col-order-xs, var(--yok-col-order-base, 0)));
    --yok-col-current-push: var(--yok-col-push-sm, var(--yok-col-push-xs, var(--yok-col-push-base, 0)));
    --yok-col-current-pull: var(--yok-col-pull-sm, var(--yok-col-pull-xs, var(--yok-col-pull-base, 0)));
  }
}

@media (min-width: 768px) {
  .yok-col {
    --yok-col-current-span: var(--yok-col-span-md, var(--yok-col-span-sm, var(--yok-col-span-xs, var(--yok-col-span-base, 24))));
    --yok-col-current-offset: var(--yok-col-offset-md, var(--yok-col-offset-sm, var(--yok-col-offset-xs, var(--yok-col-offset-base, 0))));
    --yok-col-current-order: var(--yok-col-order-md, var(--yok-col-order-sm, var(--yok-col-order-xs, var(--yok-col-order-base, 0))));
    --yok-col-current-push: var(--yok-col-push-md, var(--yok-col-push-sm, var(--yok-col-push-xs, var(--yok-col-push-base, 0))));
    --yok-col-current-pull: var(--yok-col-pull-md, var(--yok-col-pull-sm, var(--yok-col-pull-xs, var(--yok-col-pull-base, 0))));
  }
}

@media (min-width: 1024px) {
  .yok-col {
    --yok-col-current-span: var(--yok-col-span-lg, var(--yok-col-span-md, var(--yok-col-span-sm, var(--yok-col-span-xs, var(--yok-col-span-base, 24)))));
    --yok-col-current-offset: var(--yok-col-offset-lg, var(--yok-col-offset-md, var(--yok-col-offset-sm, var(--yok-col-offset-xs, var(--yok-col-offset-base, 0)))));
    --yok-col-current-order: var(--yok-col-order-lg, var(--yok-col-order-md, var(--yok-col-order-sm, var(--yok-col-order-xs, var(--yok-col-order-base, 0)))));
    --yok-col-current-push: var(--yok-col-push-lg, var(--yok-col-push-md, var(--yok-col-push-sm, var(--yok-col-push-xs, var(--yok-col-push-base, 0)))));
    --yok-col-current-pull: var(--yok-col-pull-lg, var(--yok-col-pull-md, var(--yok-col-pull-sm, var(--yok-col-pull-xs, var(--yok-col-pull-base, 0)))));
  }
}

@media (min-width: 1280px) {
  .yok-col {
    --yok-col-current-span: var(--yok-col-span-xl, var(--yok-col-span-lg, var(--yok-col-span-md, var(--yok-col-span-sm, var(--yok-col-span-xs, var(--yok-col-span-base, 24))))));
    --yok-col-current-offset: var(--yok-col-offset-xl, var(--yok-col-offset-lg, var(--yok-col-offset-md, var(--yok-col-offset-sm, var(--yok-col-offset-xs, var(--yok-col-offset-base, 0))))));
    --yok-col-current-order: var(--yok-col-order-xl, var(--yok-col-order-lg, var(--yok-col-order-md, var(--yok-col-order-sm, var(--yok-col-order-xs, var(--yok-col-order-base, 0))))));
    --yok-col-current-push: var(--yok-col-push-xl, var(--yok-col-push-lg, var(--yok-col-push-md, var(--yok-col-push-sm, var(--yok-col-push-xs, var(--yok-col-push-base, 0))))));
    --yok-col-current-pull: var(--yok-col-pull-xl, var(--yok-col-pull-lg, var(--yok-col-pull-md, var(--yok-col-pull-sm, var(--yok-col-pull-xs, var(--yok-col-pull-base, 0))))));
  }
}

@media (min-width: 1536px) {
  .yok-col {
    --yok-col-current-span: var(--yok-col-span-xxl, var(--yok-col-span-xl, var(--yok-col-span-lg, var(--yok-col-span-md, var(--yok-col-span-sm, var(--yok-col-span-xs, var(--yok-col-span-base, 24)))))));
    --yok-col-current-offset: var(--yok-col-offset-xxl, var(--yok-col-offset-xl, var(--yok-col-offset-lg, var(--yok-col-offset-md, var(--yok-col-offset-sm, var(--yok-col-offset-xs, var(--yok-col-offset-base, 0)))))));
    --yok-col-current-order: var(--yok-col-order-xxl, var(--yok-col-order-xl, var(--yok-col-order-lg, var(--yok-col-order-md, var(--yok-col-order-sm, var(--yok-col-order-xs, var(--yok-col-order-base, 0)))))));
    --yok-col-current-push: var(--yok-col-push-xxl, var(--yok-col-push-xl, var(--yok-col-push-lg, var(--yok-col-push-md, var(--yok-col-push-sm, var(--yok-col-push-xs, var(--yok-col-push-base, 0)))))));
    --yok-col-current-pull: var(--yok-col-pull-xxl, var(--yok-col-pull-xl, var(--yok-col-pull-lg, var(--yok-col-pull-md, var(--yok-col-pull-sm, var(--yok-col-pull-xs, var(--yok-col-pull-base, 0)))))));
  }
}
</style>
