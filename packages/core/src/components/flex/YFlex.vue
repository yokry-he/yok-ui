<script lang="ts">
import { computed, defineComponent, h, type CSSProperties, type PropType } from 'vue'

export type YFlexSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | number | string
export type YFlexGap = YFlexSize | [YFlexSize, YFlexSize]
export type YFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type YFlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline' | 'normal'
export type YFlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'normal'
export type YFlexWrap = boolean | 'reverse'
export type YFlexElement = 'div' | 'span' | 'section' | 'nav' | 'header' | 'footer' | 'main' | 'ul' | 'ol'

const flexSizeMap: Record<Exclude<YFlexSize, number | string>, string> = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '20px'
}

const alignMap: Record<YFlexAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
  normal: 'normal'
}

const justifyMap: Record<YFlexJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  normal: 'normal'
}

function resolveFlexSize(size: YFlexSize) {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return size in flexSizeMap ? flexSizeMap[size as keyof typeof flexSizeMap] : size
}

export default defineComponent({
  name: 'YFlex',
  props: {
    as: {
      type: String as PropType<YFlexElement>,
      default: 'div'
    },
    direction: {
      type: String as PropType<YFlexDirection>,
      default: 'row'
    },
    vertical: {
      type: Boolean,
      default: false
    },
    align: {
      type: String as PropType<YFlexAlign>,
      default: 'normal'
    },
    justify: {
      type: String as PropType<YFlexJustify>,
      default: 'normal'
    },
    gap: {
      type: [String, Number, Array] as PropType<YFlexGap>,
      default: 'md'
    },
    wrap: {
      type: [Boolean, String] as PropType<YFlexWrap>,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    flex: {
      type: [String, Number],
      default: ''
    },
    ariaLabel: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    const resolvedDirection = computed<YFlexDirection>(() => props.vertical ? 'column' : props.direction)

    const rootStyle = computed<CSSProperties>(() => {
      const [rowGap, columnGap] = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap]
      const style: CSSProperties = {
        '--yok-flex-gap-row': resolveFlexSize(rowGap),
        '--yok-flex-gap-column': resolveFlexSize(columnGap),
        '--yok-flex-align': alignMap[props.align],
        '--yok-flex-justify': justifyMap[props.justify]
      }

      if (props.flex !== '') {
        style.flex = typeof props.flex === 'number' ? String(props.flex) : props.flex
      }

      return style
    })

    return () => h(
      props.as,
      {
        class: [
          'yok-flex',
          `yok-flex--direction-${resolvedDirection.value}`,
          `yok-flex--align-${props.align}`,
          `yok-flex--justify-${props.justify}`,
          {
            'yok-flex--inline': props.inline,
            'yok-flex--wrap': props.wrap === true,
            'yok-flex--wrap-reverse': props.wrap === 'reverse'
          }
        ],
        role: props.ariaLabel ? 'group' : undefined,
        'aria-label': props.ariaLabel || undefined,
        style: rootStyle.value
      },
      slots.default?.()
    )
  }
})
</script>

<style scoped>
.yok-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: var(--yok-flex-align);
  justify-content: var(--yok-flex-justify);
  gap: var(--yok-flex-gap-row) var(--yok-flex-gap-column);
  min-width: 0;
}

.yok-flex--inline {
  display: inline-flex;
  vertical-align: middle;
}

.yok-flex--direction-row {
  flex-direction: row;
}

.yok-flex--direction-row-reverse {
  flex-direction: row-reverse;
}

.yok-flex--direction-column {
  flex-direction: column;
}

.yok-flex--direction-column-reverse {
  flex-direction: column-reverse;
}

.yok-flex--wrap {
  flex-wrap: wrap;
}

.yok-flex--wrap-reverse {
  flex-wrap: wrap-reverse;
}
</style>
