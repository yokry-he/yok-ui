<script lang="ts">
import { cloneVNode, Comment, computed, defineComponent, h, ref, Text, useId } from 'vue'
import type { CSSProperties, PropType, VNode } from 'vue'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import { useLayerStack } from '../../composables/useLayerStack'

export type YTooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'
export type YTooltipTrigger = 'hover' | 'focus' | 'click' | 'manual'
export type YTooltipTheme = 'dark' | 'light'

function normalizeDelay(delay: number | string) {
  return typeof delay === 'number' ? `${delay}ms` : delay
}

function mergeDescribedBy(existing: unknown, tooltipId: string) {
  if (typeof existing !== 'string' || existing.length === 0) {
    return tooltipId
  }

  return existing.split(/\s+/).includes(tooltipId) ? existing : `${existing} ${tooltipId}`
}

function describeFirstElement(nodes: VNode[], tooltipId: string) {
  let described = false

  return nodes.map((node) => {
    if (described || node.type === Text || node.type === Comment) {
      return node
    }

    described = true

    return cloneVNode(node, {
      'aria-describedby': mergeDescribedBy(node.props?.['aria-describedby'], tooltipId)
    })
  })
}

export default defineComponent({
  name: 'YTooltip',
  props: {
    content: {
      type: String,
      required: true
    },
    placement: {
      type: String as PropType<YTooltipPlacement>,
      default: 'top'
    },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    id: {
      type: String,
      default: ''
    },
    trigger: {
      type: String as PropType<YTooltipTrigger>,
      default: 'hover'
    },
    theme: {
      type: String as PropType<YTooltipTheme>,
      default: 'dark'
    },
    showDelay: {
      type: [Number, String] as PropType<number | string>,
      default: 120
    },
    hideDelay: {
      type: [Number, String] as PropType<number | string>,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:open': (_value: boolean) => true
  },
  setup(props, { slots, emit }) {
    const generatedId = useId()
    const internalOpen = ref(false)
    const referenceRef = ref<HTMLElement | null>(null)
    const floatingRef = ref<HTMLElement | null>(null)
    const tooltipId = computed(() => props.id || `yok-tooltip-${generatedId}`)
    const isControlled = computed(() => props.open !== undefined)
    const open = computed(() => props.disabled ? false : isControlled.value ? Boolean(props.open) : internalOpen.value)
    const placement = computed(() => props.placement)
    const { floatingStyles } = useFloatingLayer(referenceRef, floatingRef, {
      open,
      placement,
      offset: 8
    })
    const { layerStyle } = useLayerStack({
      open,
      type: 'floating',
      elements: [referenceRef, floatingRef]
    })
    const rootStyle = computed(
      () =>
        ({
          '--yok-tooltip-delay': normalizeDelay(props.showDelay),
          '--yok-tooltip-hide-delay': normalizeDelay(props.hideDelay)
        }) as CSSProperties
    )

    function setOpen(value: boolean) {
      if (props.disabled || props.trigger === 'manual') {
        return
      }

      if (!isControlled.value) {
        internalOpen.value = value
      }
      emit('update:open', value)
    }

    function show() {
      setOpen(true)
    }

    function hide() {
      setOpen(false)
    }

    function toggle() {
      setOpen(!open.value)
    }

    function handleMouseenter() {
      if (props.trigger === 'hover') {
        show()
      }
    }

    function handleMouseleave() {
      if (props.trigger === 'hover') {
        hide()
      }
    }

    function handleFocusin() {
      if (props.trigger === 'hover' || props.trigger === 'focus') {
        show()
      }
    }

    function handleFocusout() {
      if (props.trigger === 'hover' || props.trigger === 'focus') {
        hide()
      }
    }

    function handleClick() {
      if (props.trigger === 'click') {
        toggle()
      }
    }

    return () => {
      const trigger = props.disabled
        ? slots.default?.() ?? []
        : describeFirstElement(slots.default?.() ?? [], tooltipId.value)

      return h(
        'span',
        {
          class: 'yok-tooltip',
          style: rootStyle.value
        },
        [
          h('span', {
            ref: referenceRef,
            class: 'yok-tooltip__trigger',
            onMouseenter: handleMouseenter,
            onMouseleave: handleMouseleave,
            onFocusin: handleFocusin,
            onFocusout: handleFocusout,
            onClick: handleClick
          }, trigger),
          h(
            'span',
            {
              ref: floatingRef,
              id: tooltipId.value,
              class: ['yok-tooltip__bubble', `yok-tooltip__bubble--${props.theme}`, { 'yok-tooltip__bubble--open': open.value }],
              style: [floatingStyles.value, layerStyle.value],
              role: 'tooltip',
              'aria-hidden': open.value ? 'false' : 'true'
            },
            props.content
          )
        ]
      )
    }
  }
})
</script>

<style scoped>
.yok-tooltip {
  display: inline-flex;
  width: max-content;
}

.yok-tooltip__trigger {
  display: inline-flex;
}

.yok-tooltip__bubble {
  z-index: var(--yok-zIndex-tooltip, 900);
  max-width: min(240px, calc(100vw - 32px));
  pointer-events: none;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-text);
  color: var(--yok-color-surface);
  font-size: 12px;
  font-weight: 650;
  line-height: 1.45;
  opacity: 0;
  padding: var(--yok-space-2) var(--yok-space-3);
  transition:
    opacity var(--yok-motion-fast),
    transform var(--yok-motion-fast),
    visibility 0ms linear var(--yok-motion-fast);
  transition-delay: 0ms;
  visibility: hidden;
  white-space: nowrap;
}

.yok-tooltip__bubble--light {
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
}

.yok-tooltip__bubble--open {
  opacity: 1;
  transition-delay: var(--yok-tooltip-delay), var(--yok-tooltip-delay), 0ms;
  visibility: visible;
}

.yok-tooltip__bubble:not(.yok-tooltip__bubble--open) {
  transition-delay: var(--yok-tooltip-hide-delay), var(--yok-tooltip-hide-delay), var(--yok-tooltip-hide-delay);
}
</style>
