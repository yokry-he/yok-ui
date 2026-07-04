# Floating Layer

Yok UI 使用 `@floating-ui/vue` 作为非模态弹层的统一定位底座，并在 core 包内封装 `useFloatingLayer`。这个封装集中处理弹层组件共同需要的 offset、flip、shift、autoUpdate、fixed strategy 和触发器宽度同步，避免 Tooltip、Popover、Dropdown、Select 等组件各自维护一套脆弱的 absolute 定位逻辑。

除定位外，点击触发的非模态弹层统一复用 `useDismissableLayer` 管理关闭协议。它在 document 捕获阶段监听外部 pointer 和 Escape，只要事件目标位于触发器、弹层内部或更高层弹层内部就不会误关闭，保证选择器、日期面板、级联面板里的按钮交互稳定。

弹层层级由 `useLayerStack` 管理。组件仍然有 `--yok-zIndex-*` 作为默认 CSS token，打开时会按当前层栈顺序分配更高的 inline `z-index`，让后打开的弹层天然位于更上方。

## Covered components

| Component | Floating role |
| --- | --- |
| `YTooltip` | hover / focus 触发的轻量说明层 |
| `YPopover` | click 触发的非模态内容面板 |
| `YPopconfirm` | 触发器旁的确认面板 |
| `YDropdown` | menu / menuitem 操作菜单 |
| `YSelect` | combobox / listbox 单选面板 |
| `YDatePicker` | 输入框触发的单日历面板 |
| `YDateRangePicker` | 输入框触发的范围日历面板 |
| `YTimePicker` | 输入框触发的小时 / 分钟选择面板 |
| `YCascader` | 输入框触发的多列级联选择面板 |

`YModal` 和 `YDrawer` 仍然使用 Teleport、焦点循环、滚动锁定和模态语义。它们属于模态 overlay，不参与相对触发器定位。

## Positioning defaults

- `strategy: fixed`：减少滚动容器、文档侧栏和布局层级造成的定位漂移。
- `offset`：组件按场景设置默认间距，Tooltip / Popover / Dropdown 为 8px，Select 为 6px，Popconfirm 为 10px。
- `flip + shift`：当视口空间不足时自动翻转或平移，避免弹层被屏幕边缘裁切。
- `autoUpdate`：触发器、弹层、滚动和窗口尺寸变化时自动重新计算位置。
- `matchReferenceWidth`：Select 等选择器可让面板宽度跟随触发器。

## Dismiss defaults

- `pointerdown outside`：点击触发器和弹层之外的区域会关闭当前非模态弹层。
- `Escape`：键盘 Escape 只由顶层弹层响应，并由组件决定是否把焦点返回触发器。
- `inside interaction`：弹层内部按钮、选项、快捷项和确认按钮不会被外部点击监听抢先关闭。
- `nested layer`：点击更高层弹层内部不会关闭低层 Popover、Dropdown 或 Modal。
- `control reference`：日期、时间和级联选择器使用整个输入控件作为 reference，避免右侧展开、清除按钮被误判为外部点击。
- `Tooltip`：Tooltip 仍然遵循 hover / focus 的轻量说明层行为，不参与点击型 dismiss 协议。

## Layer scale

| Token | Default | Usage |
| --- | --- | --- |
| `--yok-zIndex-tooltip` | `900` | 轻量说明层默认层级 |
| `--yok-zIndex-floating` | `1000` | Select、Dropdown、Popover、DatePicker、TimePicker、Cascader 等非模态弹层 |
| `--yok-zIndex-drawer` | `1900` | Drawer 默认层级 |
| `--yok-zIndex-modal` | `2000` | Modal、CommandPalette 等模态层 |
| `--yok-zIndex-toast` | `3000` | Message / Toast 栈 |

## Motion defaults

- `yok-floating-layer`：非模态弹层使用短 opacity + transform 过渡，进入时轻微上移归位，离开时快速淡出。
- `yok-modal-layer`：Modal 和 CommandPalette 使用遮罩淡入 + 面板轻微缩放归位。
- `yok-drawer-layer`：Drawer 使用遮罩淡入 + 面板从对应边缘轻推入场。
- `prefers-reduced-motion`：用户偏好减少动效时，过渡时长降为 1ms，保留状态切换但减少视觉运动。
- `transform + opacity`：弹层动效只使用这两类属性，避免触发布局重排和滚动抖动。

## Implementation contract

组件仍然负责自己的语义、焦点和事件，例如 `YDropdown` 维护 menu 键盘导航，`YSelect` 维护 combobox / listbox 选择逻辑，`YDatePicker` 维护 grid 键盘导航，`YTooltip` 维护 `aria-describedby`。`useFloatingLayer` 只负责可靠定位，`useDismissableLayer` 只负责通用关闭判断，`useLayerStack` 只负责层级顺序，三者都不接管组件业务状态。

新增非模态弹层组件时，应优先复用 `useFloatingLayer` 和 `useDismissableLayer`，并使用 `--yok-zIndex-floating` 作为 CSS fallback，再套用 `yok-floating-layer` 过渡，最后补充组件自己的可访问性规则和测试。
