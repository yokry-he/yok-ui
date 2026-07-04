<script lang="ts">
import { Comment, computed, defineComponent, h, type CSSProperties, type PropType, type VNode } from 'vue'
import YAvatar, { type YAvatarShape, type YAvatarSize } from './YAvatar.vue'

export type YAvatarGroupSpacing = 'tight' | 'normal' | number

const spacingValueMap: Record<Exclude<YAvatarGroupSpacing, number>, number> = {
  tight: 12,
  normal: 8
}

function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap((child) => {
    if (Array.isArray(child.children)) {
      return flattenChildren(child.children as VNode[])
    }

    return child.type === Comment ? [] : [child]
  })
}

export default defineComponent({
  name: 'YAvatarGroup',
  props: {
    max: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    spacing: {
      type: [String, Number] as PropType<YAvatarGroupSpacing>,
      default: 'normal'
    },
    label: {
      type: String,
      default: 'Avatar group'
    },
    surplusLabel: {
      type: String,
      default: ''
    },
    size: {
      type: String as PropType<YAvatarSize>,
      default: 'md'
    },
    shape: {
      type: String as PropType<YAvatarShape>,
      default: 'circle'
    }
  },
  setup(props, { slots }) {
    const spacing = computed(() => (typeof props.spacing === 'number' ? props.spacing : spacingValueMap[props.spacing]))
    const style = computed<CSSProperties>(() => ({
      '--yok-avatar-group-spacing': `-${spacing.value}px`
    }))

    return () => {
      const children = flattenChildren(slots.default?.() ?? [])
      const visibleCount = props.max > 0 ? Math.min(props.max, children.length) : children.length
      const visibleChildren = children.slice(0, visibleCount)
      const knownTotal = props.total > 0 ? props.total : children.length
      const surplus = Math.max(knownTotal - visibleCount, 0)
      const surplusText = `+${surplus}`
      const surplusContext = props.label === 'Avatar group' ? 'avatars' : props.label.toLowerCase()
      const surplusAriaLabel = props.surplusLabel || `${surplus} more ${surplusContext}`

      return h(
        'div',
        {
          class: 'yok-avatar-group',
          role: 'group',
          'aria-label': props.label,
          style: style.value
        },
        [
          ...visibleChildren.map((child, index) =>
            h('span', { class: 'yok-avatar-group__item', style: { zIndex: visibleChildren.length - index + 1 } }, [child])
          ),
          surplus > 0
            ? h('span', { class: 'yok-avatar-group__item yok-avatar-group__surplus-wrap', style: { zIndex: 1 } }, [
                h(
                  YAvatar,
                  {
                    class: 'yok-avatar-group__surplus',
                    size: props.size,
                    shape: props.shape,
                    tone: 'primary',
                    label: surplusAriaLabel
                  },
                  () => surplusText
                )
              ])
            : null
        ]
      )
    }
  }
})
</script>

<style scoped>
.yok-avatar-group {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.yok-avatar-group__item {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
}

.yok-avatar-group__item + .yok-avatar-group__item {
  margin-inline-start: var(--yok-avatar-group-spacing);
}

.yok-avatar-group__item :deep(.yok-avatar) {
  box-shadow: 0 0 0 2px var(--yok-color-surface);
}

.yok-avatar-group__surplus :deep(.yok-avatar__content) {
  font-size: 0.85em;
}
</style>
