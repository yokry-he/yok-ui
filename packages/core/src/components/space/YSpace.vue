<script lang="ts">
import { Comment, Fragment, Text, computed, defineComponent, h, type PropType, type VNode, type VNodeChild } from 'vue'

export type YSpaceSize = 'xs' | 'sm' | 'md' | 'lg' | number
export type YSpaceSizePair = YSpaceSize | [YSpaceSize, YSpaceSize]
export type YSpaceDirection = 'horizontal' | 'vertical'
export type YSpaceAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch'
export type YSpaceJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

const spaceSizeMap: Record<Exclude<YSpaceSize, number>, string> = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '20px'
}

function resolveSpaceSize(size: YSpaceSize) {
  return typeof size === 'number' ? `${size}px` : spaceSizeMap[size]
}

function flattenChildren(children: VNodeChild[]): VNode[] {
  return children.flatMap((child) => {
    if (Array.isArray(child)) {
      return flattenChildren(child)
    }

    if (typeof child !== 'object' || child === null) {
      return []
    }

    if (child.type === Fragment && Array.isArray(child.children)) {
      return flattenChildren(child.children as VNodeChild[])
    }

    if (child.type === Comment) {
      return []
    }

    if (child.type === Text && typeof child.children === 'string' && !child.children.trim()) {
      return []
    }

    return [child]
  })
}

export default defineComponent({
  name: 'YSpace',
  props: {
    direction: {
      type: String as PropType<YSpaceDirection>,
      default: 'horizontal'
    },
    size: {
      type: [String, Number, Array] as PropType<YSpaceSizePair>,
      default: 'md'
    },
    align: {
      type: String as PropType<YSpaceAlign>,
      default: 'center'
    },
    justify: {
      type: String as PropType<YSpaceJustify>,
      default: 'start'
    },
    wrap: {
      type: Boolean,
      default: false
    },
    fill: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    const gapStyle = computed(() => {
      const [rowSize, columnSize] = Array.isArray(props.size) ? props.size : [props.size, props.size]

      return {
        '--yok-space-gap-row': resolveSpaceSize(rowSize),
        '--yok-space-gap-column': resolveSpaceSize(columnSize)
      }
    })

    return () => {
      const Tag = props.inline ? 'span' : 'div'
      const items = flattenChildren(slots.default?.() ?? [])
      const separator = slots.separator
      const children = items.flatMap((item, index) => {
        const wrappedItem = h('span', { class: 'yok-space__item' }, [item])

        if (!separator || index === items.length - 1) {
          return [wrappedItem]
        }

        return [
          wrappedItem,
          h('span', { class: 'yok-space__separator', 'aria-hidden': 'true' }, separator())
        ]
      })

      return h(
        Tag,
        {
          class: [
            'yok-space',
            `yok-space--${props.direction}`,
            `yok-space--align-${props.align}`,
            `yok-space--justify-${props.justify}`,
            {
              'yok-space--wrap': props.wrap,
              'yok-space--fill': props.fill,
              'yok-space--inline': props.inline
            }
          ],
          style: gapStyle.value
        },
        children
      )
    }
  }
})
</script>

<style scoped>
.yok-space {
  display: flex;
  gap: var(--yok-space-gap-row) var(--yok-space-gap-column);
  width: fit-content;
}

.yok-space--inline {
  display: inline-flex;
  vertical-align: middle;
}

.yok-space--horizontal {
  flex-direction: row;
}

.yok-space--vertical {
  flex-direction: column;
}

.yok-space--wrap {
  flex-wrap: wrap;
}

.yok-space--fill {
  width: 100%;
}

.yok-space--fill .yok-space__item {
  min-width: 0;
}

.yok-space--align-start {
  align-items: flex-start;
}

.yok-space--align-center {
  align-items: center;
}

.yok-space--align-end {
  align-items: flex-end;
}

.yok-space--align-baseline {
  align-items: baseline;
}

.yok-space--align-stretch {
  align-items: stretch;
}

.yok-space--justify-start {
  justify-content: flex-start;
}

.yok-space--justify-center {
  justify-content: center;
}

.yok-space--justify-end {
  justify-content: flex-end;
}

.yok-space--justify-between {
  justify-content: space-between;
}

.yok-space--justify-around {
  justify-content: space-around;
}

.yok-space--justify-evenly {
  justify-content: space-evenly;
}

.yok-space__item,
.yok-space__separator {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: inherit;
  min-width: 0;
}

.yok-space--fill.yok-space--vertical .yok-space__item,
.yok-space--fill.yok-space--horizontal .yok-space__item {
  flex: 1 1 auto;
}

.yok-space__separator {
  color: var(--yok-color-textMuted);
}
</style>
