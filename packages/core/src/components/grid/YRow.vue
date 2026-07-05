<script lang="ts">
import { computed, defineComponent, h, type CSSProperties, type PropType } from 'vue'
import {
  gridBreakpoints,
  toGridSize,
  type YGridAlign,
  type YGridElement,
  type YGridGutter,
  type YGridGutterSize,
  type YGridJustify,
  type YGridResponsiveGutter
} from './utils'

const justifyMap: Record<YGridJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly'
}

const alignMap: Record<YGridAlign, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  stretch: 'stretch'
}

function isResponsiveGutter(value: YGridGutterSize | YGridResponsiveGutter): value is YGridResponsiveGutter {
  return typeof value === 'object' && value !== null
}

function applyGutterVariables(axis: 'x' | 'y', gutter: YGridGutterSize | YGridResponsiveGutter, style: CSSProperties) {
  if (!isResponsiveGutter(gutter)) {
    style[`--yok-row-gutter-${axis}`] = toGridSize(gutter)
    return
  }

  gridBreakpoints.forEach((breakpoint) => {
    const value = gutter[breakpoint]

    if (value !== undefined) {
      style[`--yok-row-gutter-${axis}-${breakpoint}`] = toGridSize(value)
    }
  })
}

export default defineComponent({
  name: 'YRow',
  props: {
    as: {
      type: String as PropType<YGridElement>,
      default: 'div'
    },
    gutter: {
      type: [Number, String, Array, Object] as PropType<YGridGutter>,
      default: 0
    },
    justify: {
      type: String as PropType<YGridJustify>,
      default: 'start'
    },
    align: {
      type: String as PropType<YGridAlign>,
      default: 'top'
    },
    wrap: {
      type: Boolean,
      default: true
    },
    ariaLabel: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    const rowStyle = computed<CSSProperties>(() => {
      const [horizontalGutter, verticalGutter] = Array.isArray(props.gutter)
        ? props.gutter
        : [props.gutter, 0]
      const style: CSSProperties = {
        '--yok-row-justify': justifyMap[props.justify],
        '--yok-row-align': alignMap[props.align]
      }

      applyGutterVariables('x', horizontalGutter, style)
      applyGutterVariables('y', verticalGutter, style)

      return style
    })

    return () => h(
      props.as,
      {
        class: [
          'yok-row',
          `yok-row--justify-${props.justify}`,
          `yok-row--align-${props.align}`,
          { 'yok-row--nowrap': !props.wrap }
        ],
        role: props.ariaLabel ? 'group' : undefined,
        'aria-label': props.ariaLabel || undefined,
        style: rowStyle.value
      },
      slots.default?.()
    )
  }
})
</script>

<style scoped>
.yok-row {
  --yok-row-gutter-x: var(--yok-row-gutter-x-xs, 0px);
  --yok-row-gutter-y: var(--yok-row-gutter-y-xs, 0px);

  display: flex;
  flex-wrap: wrap;
  align-items: var(--yok-row-align);
  justify-content: var(--yok-row-justify);
  min-width: 0;
  margin-right: calc(var(--yok-row-gutter-x) / -2);
  margin-left: calc(var(--yok-row-gutter-x) / -2);
  row-gap: var(--yok-row-gutter-y);
}

.yok-row--nowrap {
  flex-wrap: nowrap;
}

@media (min-width: 640px) {
  .yok-row {
    --yok-row-gutter-x: var(--yok-row-gutter-x-sm, var(--yok-row-gutter-x-xs, 0px));
    --yok-row-gutter-y: var(--yok-row-gutter-y-sm, var(--yok-row-gutter-y-xs, 0px));
  }
}

@media (min-width: 768px) {
  .yok-row {
    --yok-row-gutter-x: var(--yok-row-gutter-x-md, var(--yok-row-gutter-x-sm, var(--yok-row-gutter-x-xs, 0px)));
    --yok-row-gutter-y: var(--yok-row-gutter-y-md, var(--yok-row-gutter-y-sm, var(--yok-row-gutter-y-xs, 0px)));
  }
}

@media (min-width: 1024px) {
  .yok-row {
    --yok-row-gutter-x: var(--yok-row-gutter-x-lg, var(--yok-row-gutter-x-md, var(--yok-row-gutter-x-sm, var(--yok-row-gutter-x-xs, 0px))));
    --yok-row-gutter-y: var(--yok-row-gutter-y-lg, var(--yok-row-gutter-y-md, var(--yok-row-gutter-y-sm, var(--yok-row-gutter-y-xs, 0px))));
  }
}

@media (min-width: 1280px) {
  .yok-row {
    --yok-row-gutter-x: var(--yok-row-gutter-x-xl, var(--yok-row-gutter-x-lg, var(--yok-row-gutter-x-md, var(--yok-row-gutter-x-sm, var(--yok-row-gutter-x-xs, 0px)))));
    --yok-row-gutter-y: var(--yok-row-gutter-y-xl, var(--yok-row-gutter-y-lg, var(--yok-row-gutter-y-md, var(--yok-row-gutter-y-sm, var(--yok-row-gutter-y-xs, 0px)))));
  }
}

@media (min-width: 1536px) {
  .yok-row {
    --yok-row-gutter-x: var(--yok-row-gutter-x-xxl, var(--yok-row-gutter-x-xl, var(--yok-row-gutter-x-lg, var(--yok-row-gutter-x-md, var(--yok-row-gutter-x-sm, var(--yok-row-gutter-x-xs, 0px))))));
    --yok-row-gutter-y: var(--yok-row-gutter-y-xxl, var(--yok-row-gutter-y-xl, var(--yok-row-gutter-y-lg, var(--yok-row-gutter-y-md, var(--yok-row-gutter-y-sm, var(--yok-row-gutter-y-xs, 0px))))));
  }
}
</style>
