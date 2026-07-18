import {
  type Component,
  defineComponent,
  h,
  type PropType
} from 'vue'
import {
  createYokIcon,
  type YokIconSize,
  type YokIconStrokeWidth
} from './createYokIcon'
import { yokIconPaths, type YokIconName } from './iconPaths'

const iconComponentCache = new Map<YokIconName, Component>()

function getIconComponent(name: YokIconName) {
  const cached = iconComponentCache.get(name)

  if (cached) {
    return cached
  }

  const icon = yokIconPaths[name]
  const IconComponent = createYokIcon(name, icon.paths, {
    viewBox: icon.viewBox
  })

  iconComponentCache.set(name, IconComponent)

  return IconComponent
}

export const YokIcon = defineComponent({
  name: 'YokIcon',
  props: {
    name: {
      type: String as PropType<YokIconName>,
      required: true
    },
    size: {
      type: [Number, String] as PropType<YokIconSize>,
      default: 16
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    strokeWidth: {
      type: [Number, String] as PropType<YokIconStrokeWidth>,
      default: 2
    },
    fill: {
      type: String,
      default: 'none'
    },
    title: {
      type: String,
      default: ''
    },
    decorative: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return () => {
      const icon = yokIconPaths[props.name]

      if (!icon) {
        return null
      }

      const IconComponent = getIconComponent(props.name)

      return h(IconComponent, {
        size: props.size,
        color: props.color,
        strokeWidth: props.strokeWidth,
        fill: props.fill,
        title: props.title,
        decorative: props.decorative
      })
    }
  }
})
