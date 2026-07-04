import {
  defineComponent,
  h,
  type PropType
} from 'vue'
import { createYokIcon, type YokIconSize } from './createYokIcon'
import { yokIconPaths, type YokIconName } from './iconPaths'

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
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return () => {
      const icon = yokIconPaths[props.name]

      if (!icon) {
        return null
      }

      const IconComponent = createYokIcon(props.name, icon.paths, {
        viewBox: icon.viewBox
      })

      return h(IconComponent, {
        size: props.size,
        color: props.color,
        title: props.title
      })
    }
  }
})
