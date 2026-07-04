import type { ComponentMeta } from './componentRegistry'

export type InteractionContractMaturity = 'native' | 'documented' | 'verified'

export interface InteractionContractEvidence {
  docs: string[]
  tests: string[]
}

export interface InteractionContract {
  componentName: ComponentMeta['name']
  pattern: string
  keyboard: string[]
  focus: string
  semantics: string[]
  status?: string
  maturity: InteractionContractMaturity
  evidence: InteractionContractEvidence
}

export const interactionContracts: InteractionContract[] = [
  {
    componentName: 'YButton',
    pattern: 'Native action button',
    keyboard: ['Enter / Space activates the native button', 'Disabled buttons are skipped by native disabled behavior'],
    focus: 'The button itself owns focus and exposes Yok UI focus-ring styling without adding wrapper focus stops.',
    semantics: ['button', 'disabled', 'aria-busy'],
    status: 'Loading state sets aria-busy while preserving the native button contract.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/button.md'],
      tests: ['packages/core/src/components/button/button.test.ts']
    }
  },
  {
    componentName: 'YIconButton',
    pattern: 'Icon-only native action button',
    keyboard: ['Enter / Space activates the native button', 'Disabled icon buttons use native disabled behavior'],
    focus: 'The button remains the single focus target; callers provide a required accessible label.',
    semantics: ['button', 'aria-label', 'disabled'],
    status: 'Icon-only actions must expose a label so toolbars and dense controls remain screen-reader friendly.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/button.md'],
      tests: ['packages/core/src/components/button/button.test.ts']
    }
  },
  {
    componentName: 'YSelect',
    pattern: 'Combobox with listbox popup',
    keyboard: ['ArrowDown / ArrowUp moves enabled options', 'Home / End jumps to the edge option', 'Enter / Space selects', 'Escape closes and restores trigger focus'],
    focus: 'Opening focuses the selected or first enabled option; closing returns focus to the combobox trigger.',
    semantics: ['role="combobox"', 'role="listbox"', 'role="option"', 'aria-expanded', 'aria-activedescendant', 'aria-invalid'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/select.md'],
      tests: ['packages/core/src/components/select/select.test.ts']
    }
  },
  {
    componentName: 'YTreeSelect',
    pattern: 'Combobox with tree popup',
    keyboard: ['Enter / Space opens the tree popup', 'Arrow keys move visible tree items or expand branches', 'Enter / Space selects selectable nodes', 'Escape closes and restores trigger focus'],
    focus: 'Opening moves focus to the search box or active treeitem; closing returns focus to the combobox trigger.',
    semantics: ['role="combobox"', 'aria-haspopup="tree"', 'role="tree"', 'role="treeitem"', 'aria-expanded', 'aria-selected', 'aria-activedescendant'],
    status: 'Non-strict mode treats branch nodes as expansion controls; checkStrictly allows any level to be submitted as the value.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/tree-select.md'],
      tests: ['packages/core/src/components/tree-select/tree-select.test.ts']
    }
  },
  {
    componentName: 'YAutocomplete',
    pattern: 'Editable combobox with suggestion listbox',
    keyboard: ['Native text editing remains available', 'ArrowDown / ArrowUp moves enabled suggestions', 'Enter selects the active suggestion', 'Escape closes the suggestion panel'],
    focus: 'The text input owns focus; the suggestion list is referenced with aria-activedescendant while disabled suggestions are skipped for selection.',
    semantics: ['role="combobox"', 'aria-autocomplete="list"', 'role="listbox"', 'role="option"', 'aria-expanded', 'aria-activedescendant', 'aria-invalid'],
    status: 'Free text stays valid even when no suggestion matches; loading and empty states are announced with role="status".',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/autocomplete.md'],
      tests: ['packages/core/src/components/autocomplete/autocomplete.test.ts']
    }
  },
  {
    componentName: 'YMention',
    pattern: 'Textarea combobox with mention suggestions',
    keyboard: ['Native multiline text editing remains available', 'ArrowDown / ArrowUp moves enabled mention suggestions', 'Enter inserts the active mention token', 'Escape closes the suggestion panel'],
    focus: 'The textarea owns focus; the suggestion list is referenced with aria-activedescendant and disabled suggestions are skipped for selection.',
    semantics: ['textarea', 'role="combobox"', 'aria-autocomplete="list"', 'role="listbox"', 'role="option"', 'aria-expanded', 'aria-activedescendant', 'aria-invalid'],
    status: 'Free text remains intact when no mention matches; loading and empty states are announced with role="status".',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/mention.md'],
      tests: ['packages/core/src/components/mention/mention.test.ts']
    }
  },
  {
    componentName: 'YDatePicker',
    pattern: 'Combobox-like date grid dialog',
    keyboard: ['Arrow keys move active date', 'Home / End jumps within week', 'PageUp / PageDown changes month', 'Enter / Space selects date', 'Escape closes'],
    focus: 'Opening moves focus into the active date grid; Escape closes the floating panel.',
    semantics: ['role="dialog"', 'role="grid"', 'aria-selected', 'aria-expanded'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/date-picker.md'],
      tests: ['packages/core/src/components/date-picker/date-picker.test.ts']
    }
  },
  {
    componentName: 'YDateRangePicker',
    pattern: 'Range date grid dialog',
    keyboard: ['Arrow keys move active date', 'Enter / Space selects start and end', 'Home / End jumps within week', 'PageUp / PageDown changes month', 'Escape closes'],
    focus: 'The range grid keeps one active date and exposes selected start/end dates through aria-selected.',
    semantics: ['role="dialog"', 'role="grid"', 'aria-selected', 'aria-expanded'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/date-range-picker.md'],
      tests: ['packages/core/src/components/date-picker/date-range-picker.test.ts']
    }
  },
  {
    componentName: 'YTimePicker',
    pattern: 'Dialog with hour and minute listboxes',
    keyboard: ['Arrow keys move options', 'Enter / Space confirms a time part', 'Escape closes'],
    focus: 'Opening exposes two listboxes for hour and minute selection while preserving trigger semantics.',
    semantics: ['role="dialog"', 'role="listbox"', 'aria-selected', 'aria-expanded'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/time-picker.md'],
      tests: ['packages/core/src/components/time-picker/time-picker.test.ts']
    }
  },
  {
    componentName: 'YCascader',
    pattern: 'Cascading listbox selector',
    keyboard: ['Arrow keys move between options and columns', 'ArrowRight can trigger lazy branch loading', 'Enter / Space selects or loads a branch', 'Escape closes'],
    focus: 'Focus remains inside the active listbox column while the selected path, lazy loading state and retryable failures are announced by option state.',
    semantics: ['role="listbox"', 'role="option"', 'aria-selected', 'aria-multiselectable', 'aria-busy', 'role="status"', 'role="alert"'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/cascader.md'],
      tests: ['packages/core/src/components/cascader/cascader.test.ts']
    }
  },
  {
    componentName: 'YRate',
    pattern: 'Radiogroup rating',
    keyboard: ['Arrow keys changes rating', 'Home / End jumps to min and max rating'],
    focus: 'Each rating option is keyboard reachable and communicates checked state.',
    semantics: ['role="radiogroup"', 'role="radio"', 'aria-checked', 'aria-label'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/rate.md'],
      tests: ['packages/core/src/components/rate/rate.test.ts']
    }
  },
  {
    componentName: 'YSegmented',
    pattern: 'Native radio segmented control',
    keyboard: ['Tab enters the selected native radio', 'Arrow keys move between same-name radio options', 'Disabled segments are skipped by native disabled behavior'],
    focus: 'The native radio input owns focus while the visual segment exposes the selected state through adjacent content styling.',
    semantics: ['role="radiogroup"', 'input type="radio"', 'name', 'disabled', 'aria-label'],
    status: 'The compact visual treatment does not replace radio semantics; callers should provide label or ariaLabel.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/segmented.md'],
      tests: ['packages/core/src/components/segmented/segmented.test.ts']
    }
  },
  {
    componentName: 'YCalendar',
    pattern: 'Month grid date selector',
    keyboard: ['Tab reaches enabled date buttons', 'Enter / Space activates the focused date button', 'Disabled dates use native disabled behavior'],
    focus: 'Each date cell is a native button inside the grid; header controls and dates keep predictable document order.',
    semantics: ['role="grid"', 'role="columnheader"', 'role="gridcell"', 'button', 'aria-selected', 'aria-pressed'],
    status: 'Calendar uses native buttons for date cells so selection, disabled state and focus are visible without custom roving tabindex.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/calendar.md'],
      tests: ['packages/core/src/components/calendar/calendar.test.ts']
    }
  },
  {
    componentName: 'YCarousel',
    pattern: 'Region carousel with controlled slide index',
    keyboard: ['Tab reaches the carousel viewport', 'ArrowLeft / ArrowRight changes horizontal slides', 'ArrowUp / ArrowDown changes vertical slides', 'Indicator buttons activate with Enter / Space'],
    focus: 'The viewport is focusable for arrow-key navigation while arrows and indicators remain native buttons in document order.',
    semantics: ['role="region"', 'aria-label', 'role="group"', 'aria-roledescription="slide"', 'aria-current', 'button'],
    status: 'Carousel pauses autoplay on hover and keeps slide navigation controlled through modelValue.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/carousel.md'],
      tests: ['packages/core/src/components/carousel/carousel.test.ts']
    }
  },
  {
    componentName: 'YColorPicker',
    pattern: 'Native color input with preset buttons',
    keyboard: ['Native input keyboard behavior', 'Preset buttons activate with Enter / Space'],
    focus: 'The native color input and preset buttons remain independently focusable.',
    semantics: ['input type="color"', 'aria-pressed', 'aria-invalid'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/color-picker.md'],
      tests: ['packages/core/src/components/color-picker/color-picker.test.ts']
    }
  },
  {
    componentName: 'YInput',
    pattern: 'Native text input field',
    keyboard: ['Native text input keyboard behavior', 'Tab reaches the input in form order'],
    focus: 'The input owns focus and receives form ids from FormItem or external props.',
    semantics: ['input', 'label', 'aria-invalid', 'aria-describedby'],
    status: 'Error and helper text are connected through aria-invalid and aria-describedby.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/input.md'],
      tests: ['packages/core/src/components/input/input.test.ts']
    }
  },
  {
    componentName: 'YInputNumber',
    pattern: 'Numeric input with stepper controls',
    keyboard: ['ArrowUp increases by step', 'ArrowDown decreases by step', 'Native input editing remains available'],
    focus: 'The text input remains the primary focus target; step buttons are native buttons with explicit labels.',
    semantics: ['input', 'aria-invalid', 'role="alert"', 'aria-label="Increase value"', 'aria-label="Decrease value"'],
    status: 'Blur normalizes transient input values and emits change after clamping and precision handling.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/input-number.md'],
      tests: ['packages/core/src/components/input-number/input-number.test.ts']
    }
  },
  {
    componentName: 'YSlider',
    pattern: 'Range slider',
    keyboard: ['Native range input keyboard behavior', 'Range mode exposes independent minimum and maximum thumbs'],
    focus: 'Each range input is independently focusable and reports its own value state.',
    semantics: ['input type="range"', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-invalid'],
    status: 'Tooltip text is presentation-only while the native range inputs expose values to assistive technology.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/slider.md'],
      tests: ['packages/core/src/components/slider/slider.test.ts']
    }
  },
  {
    componentName: 'YSplitter',
    pattern: 'Resizable panel separator',
    keyboard: ['Arrow keys resize adjacent panels by keyboardStep', 'Home / End moves the separator to the constrained edge', 'Collapse controls use native button behavior'],
    focus: 'Each separator is a focusable control with role separator; panel content keeps its own natural focus order.',
    semantics: ['role="separator"', 'aria-orientation', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-pressed'],
    status: 'Pointer dragging, keyboard resizing and panel collapse all emit the same controlled sizes map.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/splitter.md'],
      tests: ['packages/core/src/components/splitter/splitter.test.ts']
    }
  },
  {
    componentName: 'YTextarea',
    pattern: 'Native multiline text field',
    keyboard: ['Native textarea keyboard behavior', 'Tab reaches the textarea in form order'],
    focus: 'The textarea owns focus and receives form ids from FormItem or external props.',
    semantics: ['textarea', 'label', 'aria-invalid', 'aria-describedby'],
    status: 'Helper and error relationships follow the same form-field contract as Input.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/textarea.md'],
      tests: ['packages/core/src/components/textarea/textarea.test.ts']
    }
  },
  {
    componentName: 'YForm',
    pattern: 'Validated form coordinator',
    keyboard: ['Native submit behavior triggers validation', 'Focusable field controls stay in document order'],
    focus: 'Validation errors are registered per field and can be used by summaries or scroll-to-error recovery paths.',
    semantics: ['form', 'role="alert"', 'aria-invalid', 'aria-describedby'],
    status: 'Submit prevents the native page reload and emits a structured validation result.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/form.md'],
      tests: ['packages/core/src/components/form/form.test.ts']
    }
  },
  {
    componentName: 'YFormItem',
    pattern: 'Form field label and message wrapper',
    keyboard: ['Focusable field control remains supplied by the default slot', 'Tab order is controlled by the slotted input'],
    focus: 'Slot props provide stable label and message ids for the actual input control.',
    semantics: ['label', 'aria-invalid', 'aria-describedby', 'role="alert"'],
    status: 'Required, hint and error states are exposed without assuming the child control DOM.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/form-item.md'],
      tests: ['packages/core/src/components/form-item/form-item.test.ts']
    }
  },
  {
    componentName: 'YCheckbox',
    pattern: 'Native checkbox option',
    keyboard: ['Space toggles the native checkbox', 'Tab reaches the checkbox in form order'],
    focus: 'The native checkbox remains the focus target while label text expands the visible hit area.',
    semantics: ['input type="checkbox"', 'label'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/checkbox.md'],
      tests: ['packages/core/src/components/checkbox/checkbox.test.ts']
    }
  },
  {
    componentName: 'YRadioGroup',
    pattern: 'Native radio group',
    keyboard: ['Native radio keyboard behavior changes selection within the group', 'Tab reaches the checked radio option'],
    focus: 'Each radio input remains independently focusable through native browser behavior.',
    semantics: ['input type="radio"', 'fieldset-like group label', 'label'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/radio-group.md'],
      tests: ['packages/core/src/components/radio/radio.test.ts']
    }
  },
  {
    componentName: 'YSwitch',
    pattern: 'Button switch',
    keyboard: ['Enter / Space toggles the switch button'],
    focus: 'The switch button is the single focus target and announces checked state.',
    semantics: ['button', 'role="switch"', 'aria-checked'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/switch.md'],
      tests: ['packages/core/src/components/switch/switch.test.ts']
    }
  },
  {
    componentName: 'YFormSummary',
    pattern: 'Assertive form error summary',
    keyboard: ['Error buttons focus their related field', 'Tab moves through error links in document order'],
    focus: 'Clicking an error summary item focuses the field identified by fieldId.',
    semantics: ['role="alert"', 'aria-live="assertive"', 'tabindex="-1"'],
    status: 'Errors are announced assertively and can be used as a recovery path.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/form-summary.md'],
      tests: ['packages/core/src/components/form-summary/form-summary.test.ts']
    }
  },
  {
    componentName: 'YUpload',
    pattern: 'Native file input with drag affordance',
    keyboard: ['Native file button opens file picker', 'Remove file buttons use native button behavior'],
    focus: 'The file input remains reachable even when drag mode is enabled.',
    semantics: ['input type="file"', 'aria-live', 'role="status"'],
    status: 'File count and empty states use live/status semantics.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/upload.md'],
      tests: ['packages/core/src/components/upload/upload.test.ts']
    }
  },
  {
    componentName: 'YTransfer',
    pattern: 'Dual listbox transfer with checkbox selection',
    keyboard: ['Checkboxes use native Space toggling', 'Move buttons activate with Enter / Space'],
    focus: 'Source and target lists keep independent checkbox focus paths.',
    semantics: ['role="listbox"', 'aria-multiselectable', 'input type="checkbox"', 'aria-label'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/transfer.md'],
      tests: ['packages/core/src/components/transfer/transfer.test.ts']
    }
  },
  {
    componentName: 'YTabs',
    pattern: 'Tabs with associated tab panels',
    keyboard: [
      'ArrowLeft / ArrowRight moves horizontal tabs',
      'ArrowUp / ArrowDown moves vertical tabs',
      'Home / End jumps to first and last enabled tab',
      'Enter / Space activates the focused tab in manual mode'
    ],
    focus: 'Tabs use roving tabindex so one enabled tab is in the tab order; the active tab and tabpanel remain linked through ids and aria-controls.',
    semantics: ['role="tablist"', 'role="tab"', 'role="tabpanel"', 'aria-selected', 'aria-controls', 'aria-labelledby', 'aria-orientation'],
    status: 'Auto activation follows focus when panel content is instant; manual activation keeps focus movement separate from selection.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/tabs.md'],
      tests: ['packages/core/src/components/tabs/tabs.test.ts']
    }
  },
  {
    componentName: 'YAvatar',
    pattern: 'Avatar image or initials fallback',
    keyboard: ['No custom keyboard behavior; avatar remains presentation-first unless wrapped by an interactive control'],
    focus: 'Avatar itself does not enter the tab order.',
    semantics: ['img alt', 'initials fallback'],
    status: 'Image avatars expose alt text; initials fallback keeps text content available.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/avatar.md'],
      tests: ['packages/core/src/components/avatar/avatar.test.ts']
    }
  },
  {
    componentName: 'YAvatarGroup',
    pattern: 'Labeled avatar collection with surplus summary',
    keyboard: ['No custom keyboard behavior; visible avatars keep their own native semantics', 'Surplus avatar remains non-interactive unless wrapped by a caller action'],
    focus: 'The group itself does not add a focus stop; focus remains on any slotted interactive avatar content.',
    semantics: ['role="group"', 'aria-label', 'surplus aria-label'],
    status: 'Avatar groups describe the collaboration set while surplus avatars announce the hidden member count.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/avatar.md'],
      tests: ['packages/core/src/components/avatar/avatar.test.ts']
    }
  },
  {
    componentName: 'YBrandHero',
    pattern: 'Marketing hero landmark with native actions',
    keyboard: ['Primary and secondary actions use native button keyboard behavior', 'Custom action slots must keep their own focus order'],
    focus: 'The hero itself does not trap focus; focus moves through visible actions in document order.',
    semantics: ['section', 'h1', 'button', 'aria-hidden decorative visual'],
    status: 'Decorative hero visuals are hidden from assistive technology while title, description and actions remain textual.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/brand-hero.md'],
      tests: ['packages/brand/src/components/brand-hero/brand-hero.test.ts']
    }
  },
  {
    componentName: 'YFeatureGrid',
    pattern: 'Responsive feature article grid',
    keyboard: ['No custom keyboard behavior; feature cards remain static content', 'Interactive content inside a feature card keeps native focus behavior'],
    focus: 'Feature cards do not add extra focus stops; focus belongs to any slotted or nested interactive content supplied by the page.',
    semantics: ['article', 'h3', 'text description'],
    status: 'Each feature requires a title and description so the card remains understandable without decorative media.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/feature-grid.md'],
      tests: ['packages/brand/src/components/feature-grid/feature-grid.test.ts']
    }
  },
  {
    componentName: 'YLogoCloud',
    pattern: 'Labeled logo and package-name collection',
    keyboard: ['No custom keyboard behavior; logo labels render as readable static text', 'If callers wrap logos with links, links keep native keyboard behavior'],
    focus: 'The logo cloud itself does not enter the tab order; focus remains on caller-provided interactive logo wrappers.',
    semantics: ['section', 'aria-label', 'readable text labels'],
    status: 'Logo entries should be real names or package labels, not image-only decoration.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/logo-cloud.md'],
      tests: ['packages/brand/src/components/logo-cloud/logo-cloud.test.ts']
    }
  },
  {
    componentName: 'YProfileCard',
    pattern: 'Profile article with decorative avatar initials',
    keyboard: ['No custom keyboard behavior; profile metadata remains static content', 'Tags inherit the non-interactive tag contract'],
    focus: 'The card itself does not add a focus stop; links or actions added around the card keep their own focus behavior.',
    semantics: ['article', 'h3', 'aria-hidden avatar initials', 'tag text'],
    status: 'Name and role provide the identity; avatar initials are decorative and hidden from assistive technology.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/profile-card.md'],
      tests: ['packages/brand/src/components/profile-card/profile-card.test.ts']
    }
  },
  {
    componentName: 'YBreadcrumb',
    pattern: 'Breadcrumb navigation',
    keyboard: ['Native link navigation uses browser keyboard behavior', 'Disabled items are not rendered as links'],
    focus: 'Only real breadcrumb links enter the tab order; the current page item is marked separately.',
    semantics: ['nav', 'aria-label', 'aria-current="page"', 'aria-disabled'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/breadcrumb.md'],
      tests: ['packages/core/src/components/breadcrumb/breadcrumb.test.ts']
    }
  },
  {
    componentName: 'YLayout',
    pattern: 'Semantic application layout',
    keyboard: ['Layout itself adds no custom keyboard trap', 'Focusable children keep native document order'],
    focus: 'Header, aside, main and footer remain semantic regions; focus is owned by slotted interactive children.',
    semantics: ['role="group"', 'aria-label', 'header', 'aside', 'main', 'footer'],
    status: 'Layout keeps flex sizing in CSS variables so app shells can compose navigation without extra wrapper focus stops.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/layout.md'],
      tests: ['packages/core/src/components/layout/layout.test.ts']
    }
  },
  {
    componentName: 'YMenu',
    pattern: 'Application navigation menu',
    keyboard: [
      'Arrow keys move focus between enabled menu items',
      'Home / End jumps to first and last enabled item',
      'Enter / Space selects leaf items or toggles submenus'
    ],
    focus: 'Menu focus stays on native buttons; disabled items use native disabled behavior and are skipped by keyboard movement.',
    semantics: ['role="navigation"', 'role="menubar"', 'role="menuitem"', 'aria-current', 'aria-expanded', 'aria-orientation'],
    status: 'Menu is data-driven so route state can stay external while uncontrolled usage remains interactive in docs examples.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/menu.md'],
      tests: ['packages/core/src/components/menu/menu.test.ts']
    }
  },
  {
    componentName: 'YBacktop',
    pattern: 'Back-to-top helper button',
    keyboard: ['Native button activates with Enter / Space'],
    focus: 'The fixed helper is a single button focus target when visible.',
    semantics: ['button', 'aria-label'],
    status: 'Click requests smooth scroll to the top and emits a click event.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/backtop.md'],
      tests: ['packages/core/src/components/backtop/backtop.test.ts']
    }
  },
  {
    componentName: 'YFloatButton',
    pattern: 'Fixed floating action button',
    keyboard: ['Native button activates with Enter / Space', 'Disabled floating buttons use native disabled behavior'],
    focus: 'The floating action is a single fixed button focus target and does not trap focus.',
    semantics: ['button', 'aria-label', 'disabled', 'title'],
    status: 'The backtop action reuses the native button path and emits click after requesting smooth scroll.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/float-button.md'],
      tests: ['packages/core/src/components/float-button/float-button.test.ts']
    }
  },
  {
    componentName: 'YFloatButtonGroup',
    pattern: 'Expandable floating action menu',
    keyboard: [
      'Native trigger button toggles with Enter / Space',
      'Expanded action items are native menuitem buttons',
      'Disabled action items use native disabled behavior'
    ],
    focus: 'Focus stays on the trigger or action buttons; expanding the group does not move focus unexpectedly.',
    semantics: ['button', 'aria-label', 'aria-expanded', 'aria-haspopup="menu"', 'role="menu"', 'role="menuitem"'],
    status: 'Controlled and uncontrolled open states emit update:open and openChange so products can synchronize page shortcuts.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/float-button.md'],
      tests: ['packages/core/src/components/float-button/float-button.test.ts']
    }
  },
  {
    componentName: 'YAffix',
    pattern: 'Sticky page action region',
    keyboard: ['Affix itself adds no keyboard trap', 'Slotted buttons and links keep native Tab order'],
    focus: 'Focus remains on slotted controls while the wrapper only manages sticky positioning.',
    semantics: ['role="region"', 'aria-label', 'position: sticky'],
    status: 'The component emits scroll and fixed-state changes without moving focus.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/affix.md'],
      tests: ['packages/core/src/components/affix/affix.test.ts']
    }
  },
  {
    componentName: 'YAnchor',
    pattern: 'In-page anchor navigation',
    keyboard: ['Tab reaches enabled anchor links in DOM order', 'Enter activates the focused link and scrolls to the target section'],
    focus: 'The native anchor owns focus; disabled anchors are rendered as non-focusable text.',
    semantics: ['nav', 'aria-label', 'a[href]', 'aria-current="location"', 'aria-disabled'],
    status: 'Anchor synchronizes active section during scroll without adding custom roving tabindex.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/components/anchor.md'],
      tests: ['packages/core/src/components/anchor/anchor.test.ts']
    }
  },
  {
    componentName: 'YSteps',
    pattern: 'Step navigation and progress indicator',
    keyboard: ['Selectable steps activate with Enter / Space', 'Disabled step buttons use native disabled behavior'],
    focus: 'Selectable steps are buttons in a labelled nav landmark; current step is announced with aria-current.',
    semantics: ['nav', 'aria-label', 'aria-current="step"', 'button', 'disabled'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/steps.md'],
      tests: ['packages/core/src/components/steps/steps.test.ts']
    }
  },
  {
    componentName: 'YTour',
    pattern: 'Product tour dialog with target spotlight',
    keyboard: ['Tab stays inside the open tour dialog', 'Escape requests close when closeOnEscape is true', 'Previous, next, finish and skip controls activate with Enter / Space'],
    focus: 'The open tour owns focus through the overlay a11y layer while the highlighted target stays visible without becoming an extra focus stop.',
    semantics: ['role="dialog"', 'aria-modal', 'aria-label', 'aria-hidden spotlight', 'data-yok-tour-active'],
    status: 'Tour mirrors the product-guide pattern used by mature libraries while keeping current and open fully controlled.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/tour.md'],
      tests: ['packages/core/src/components/tour/tour.test.ts']
    }
  },
  {
    componentName: 'YPagination',
    pattern: 'Pagination navigation',
    keyboard: ['Previous, next and page buttons activate with Enter / Space', 'Disabled navigation buttons are skipped by native button disabled behavior'],
    focus: 'Pagination controls stay inside a labelled nav landmark.',
    semantics: ['nav', 'aria-label', 'button', 'disabled'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/pagination.md'],
      tests: ['packages/core/src/components/pagination/pagination.test.ts']
    }
  },
  {
    componentName: 'YCollapse',
    pattern: 'Disclosure panels',
    keyboard: ['Panel trigger buttons activate with Enter / Space', 'Disabled triggers cannot be activated'],
    focus: 'Each trigger button remains in document order and announces expanded state.',
    semantics: ['button', 'aria-expanded', 'disabled'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/collapse.md'],
      tests: ['packages/core/src/components/collapse/collapse.test.ts']
    }
  },
  {
    componentName: 'YDropdown',
    pattern: 'Menu button',
    keyboard: ['ArrowDown / ArrowUp moves menu items', 'Home / End jumps to edge item', 'Escape closes and returns focus'],
    focus: 'Opening focuses the active menu item; Escape restores focus to the trigger.',
    semantics: ['aria-haspopup="menu"', 'aria-expanded', 'role="menu"', 'role="menuitem"'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/dropdown.md'],
      tests: ['packages/core/src/components/dropdown/dropdown.test.ts']
    }
  },
  {
    componentName: 'YTooltip',
    pattern: 'Hover and focus description layer',
    keyboard: ['Focus shows tooltip', 'Blur hides tooltip'],
    focus: 'The trigger keeps focus; tooltip content is referenced through aria-describedby.',
    semantics: ['role="tooltip"', 'aria-describedby'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/tooltip.md'],
      tests: ['packages/core/src/components/tooltip/tooltip.test.ts']
    }
  },
  {
    componentName: 'YPopover',
    pattern: 'Dismissable popover dialog',
    keyboard: ['Enter / Space toggles', 'Escape closes and restores trigger focus'],
    focus: 'Dismissal returns focus to the popover trigger.',
    semantics: ['role="button"', 'role="dialog"', 'aria-expanded', 'aria-controls'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/popover.md'],
      tests: ['packages/core/src/components/popover/popover.test.ts']
    }
  },
  {
    componentName: 'YModal',
    pattern: 'Modal dialog',
    keyboard: ['Tab cycles within dialog', 'Escape closes when enabled'],
    focus: 'Opening focuses the dialog; closing restores focus to the invoking trigger.',
    semantics: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby', 'aria-describedby'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/modal.md'],
      tests: ['packages/core/src/components/modal/modal.test.ts']
    }
  },
  {
    componentName: 'YDrawer',
    pattern: 'Modal side sheet',
    keyboard: ['Tab cycles within drawer', 'Escape closes when enabled'],
    focus: 'Opening focuses the drawer; closing restores focus to the invoking trigger.',
    semantics: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby', 'aria-describedby'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/drawer.md'],
      tests: ['packages/core/src/components/drawer/drawer.test.ts']
    }
  },
  {
    componentName: 'YPopconfirm',
    pattern: 'Confirmation popover',
    keyboard: ['Trigger uses native button behavior', 'Confirm and cancel actions activate with Enter / Space'],
    focus: 'Confirmation actions stay in the opened popover and emit explicit confirm or cancel intent.',
    semantics: ['button', 'confirmation panel', 'action buttons'],
    status: 'The trigger can be provided through trigger or default slot for copyable live examples.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/popconfirm.md'],
      tests: ['packages/core/src/components/popconfirm/popconfirm.test.ts']
    }
  },
  {
    componentName: 'YMessage',
    pattern: 'Global or inline status message',
    keyboard: ['Closable messages expose a native close button'],
    focus: 'Messages do not steal focus; close controls stay reachable when rendered.',
    semantics: ['role="status"', 'role="alert"', 'aria-atomic'],
    status: 'Service messages support manual close, auto close, update and scoped container behavior.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/message.md'],
      tests: ['packages/core/src/components/message/message.test.ts']
    }
  },
  {
    componentName: 'YMessageBox',
    pattern: 'Promise alertdialog with confirm and prompt modes',
    keyboard: ['Opening moves focus into the dialog', 'Tab / Shift + Tab stays inside the active dialog', 'Escape closes the top dialog when enabled', 'Enter submits prompt input when focused'],
    focus: 'The dialog traps focus while open, disables close controls during async confirmation, and restores focus to the trigger after closing.',
    semantics: ['role="dialog"', 'role="alertdialog"', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-busy'],
    status: 'Service API resolves confirm actions, rejects cancel/close actions, validates prompt input and supports destroyAll for pending dialogs.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/message-box.md'],
      tests: ['packages/core/src/components/message-box/message-box.test.ts']
    }
  },
  {
    componentName: 'YNotification',
    pattern: 'Global or inline notification',
    keyboard: ['Closable notifications expose a native close button', 'Notification service does not steal focus from the current workflow'],
    focus: 'Notifications appear in a corner stack without moving focus; users can tab to the close button when they choose to dismiss it.',
    semantics: ['role="status"', 'role="alert"', 'aria-atomic', 'button close control'],
    status: 'Service notifications support manual close, auto close, update, scoped container and placement behavior.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/notification.md'],
      tests: ['packages/core/src/components/notification/notification.test.ts']
    }
  },
  {
    componentName: 'YQRCode',
    pattern: 'Accessible SVG QR code with status actions',
    keyboard: ['Refresh and download actions use native button behavior', 'Expired QR codes keep the refresh action reachable with Tab'],
    focus: 'Rendering a QR code does not move focus; status overlays keep actions in the same visual region.',
    semantics: ['role="img"', 'aria-label', 'role="status"', 'role="alert"', 'aria-busy'],
    status: 'SVG rendering, loading state, expired refresh state, logo protection and download behavior are covered by component tests.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/qr-code.md'],
      tests: ['packages/core/src/components/qr-code/qr-code.test.ts']
    }
  },
  {
    componentName: 'YAlert',
    pattern: 'Inline alert with optional dismissal and action slot',
    keyboard: ['Action slot controls follow document order', 'Dismiss button uses native button behavior'],
    focus: 'Alert content remains in document flow; action and close controls do not create a focus trap.',
    semantics: ['role="status"', 'role="alert"', 'aria-live', 'aria-atomic', 'button aria-label'],
    status: 'Assertive danger alerts, custom close labels, action slots and icon visibility are verified.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/alert.md'],
      tests: ['packages/core/src/components/alert/alert.test.ts']
    }
  },
  {
    componentName: 'YSkeleton',
    pattern: 'Loading placeholder',
    keyboard: ['No custom keyboard behavior; skeletons never add focus stops'],
    focus: 'Decorative skeletons are hidden from assistive technology; labelled skeletons announce loading status.',
    semantics: ['aria-hidden="true"', 'role="status"', 'aria-label'],
    status: 'Row count is clamped to keep loading states compact and readable.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/skeleton.md'],
      tests: ['packages/core/src/components/skeleton/skeleton.test.ts']
    }
  },
  {
    componentName: 'YProgress',
    pattern: 'Determinate progress indicator',
    keyboard: ['No custom keyboard behavior; progress remains read-only'],
    focus: 'Progressbar does not enter the tab order and is announced by label and value.',
    semantics: ['role="progressbar"', 'aria-label', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
    status: 'Values are clamped to the 0 to 100 range.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/progress.md'],
      tests: ['packages/core/src/components/progress/progress.test.ts']
    }
  },
  {
    componentName: 'YResult',
    pattern: 'Result state panel',
    keyboard: ['No custom keyboard behavior; extra slot actions keep native focus behavior'],
    focus: 'Result content stays in reading order and action slots define their own focus targets.',
    semantics: ['aria-label', 'status preset', 'extra action region'],
    status: 'Success, warning, info and http-like result presets are covered.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/result.md'],
      tests: ['packages/core/src/components/result/result.test.ts']
    }
  },
  {
    componentName: 'YTag',
    pattern: 'Compact status tag',
    keyboard: ['No custom keyboard behavior; tags remain presentation-first'],
    focus: 'Tags do not create focus stops unless callers place interactive content inside.',
    semantics: ['text content', 'tone class'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/tag-badge.md'],
      tests: ['packages/core/src/components/tag/tag.test.ts']
    }
  },
  {
    componentName: 'YBadge',
    pattern: 'Compact count and status badge',
    keyboard: ['No custom keyboard behavior; badges remain presentation-first', 'Wrapped targets keep their native keyboard behavior'],
    focus: 'Badges do not create focus stops; focus remains on the slotted target when one is provided.',
    semantics: ['role="status"', 'aria-live="polite"', 'aria-label', 'count value', 'dot status'],
    status: 'Count, overflow, zero, dot and positioned target badges are covered.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/tag-badge.md'],
      tests: ['packages/core/src/components/tag/tag.test.ts']
    }
  },
  {
    componentName: 'YEmpty',
    pattern: 'Empty state with optional action',
    keyboard: ['No custom keyboard behavior; action slot controls keep native behavior'],
    focus: 'The empty state itself is read-only and slotted actions remain the only focus targets.',
    semantics: ['title text', 'description text', 'action region'],
    status: 'Default slot can act as an action fallback for copyable live examples.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/empty.md'],
      tests: ['packages/core/src/components/empty/empty.test.ts']
    }
  },
  {
    componentName: 'YCopyButton',
    pattern: 'Clipboard copy action',
    keyboard: ['Native button activates with Enter / Space'],
    focus: 'Copy action is a single button focus target and emits copied when the clipboard write succeeds.',
    semantics: ['button', 'copied event'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/code-block.md'],
      tests: ['packages/product/src/components/copy-button/copy-button.test.ts']
    }
  },
  {
    componentName: 'YCodeBlock',
    pattern: 'Readable code block with copy affordance',
    keyboard: ['No custom keyboard behavior for code text; embedded copy action uses button behavior'],
    focus: 'Long code remains scrollable without adding unrelated focus traps.',
    semantics: ['code text', 'language label', 'copy action'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/code-block.md'],
      tests: ['packages/product/src/components/code-block/code-block.test.ts']
    }
  },
  {
    componentName: 'YList',
    pattern: 'Structured content list',
    keyboard: ['No custom keyboard behavior; slotted action controls keep their native tab order'],
    focus: 'List items do not trap focus; extra, action and footer slots define their own focus targets.',
    semantics: ['ul', 'li', 'aria-label', 'aria-busy', 'role="status"', 'aria-disabled'],
    status: 'Loading and empty states use status semantics while disabled items remain visibly marked.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/list.md'],
      tests: ['packages/core/src/components/list/list.test.ts']
    }
  },
  {
    componentName: 'YLoading',
    pattern: 'Loading status and blocking overlay',
    keyboard: ['Inline loading does not add an unnecessary tab stop', 'Overlay loading preserves wrapped content order while marking the region busy'],
    focus: 'Container and fullscreen loading states do not steal focus; callers decide whether surrounding actions should be disabled.',
    semantics: ['role="status"', 'aria-live="polite"', 'aria-busy', 'aria-label'],
    status: 'Loading names the pending task; Progress handles numeric completion and Skeleton handles layout placeholders.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/loading.md'],
      tests: ['packages/core/src/components/loading/loading.test.ts']
    }
  },
  {
    componentName: 'YDescriptions',
    pattern: 'Description list for read-only metadata',
    keyboard: ['No custom keyboard behavior; slotted controls keep native tab order'],
    focus: 'The component is read-only by default and does not add focusable wrappers around metadata.',
    semantics: ['dl', 'dt', 'dd', 'aria-label', 'role="status"'],
    status: 'Empty metadata is announced through a status region.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/descriptions.md'],
      tests: ['packages/core/src/components/descriptions/descriptions.test.ts']
    }
  },
  {
    componentName: 'YStatistic',
    pattern: 'Live numeric statistic',
    keyboard: ['No custom keyboard behavior; extra slot controls keep native tab order'],
    focus: 'The statistic itself is read-only while slotted controls remain independent focus targets.',
    semantics: ['aria-label', 'aria-busy', 'aria-live="polite"', 'role="status"'],
    status: 'Loading values are announced with status semantics; value changes are polite.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/statistic.md'],
      tests: ['packages/core/src/components/statistic/statistic.test.ts']
    }
  },
  {
    componentName: 'YCountdown',
    pattern: 'Live countdown timer',
    keyboard: ['No custom keyboard behavior; extra slot controls keep native tab order'],
    focus: 'Countdown is read-only while slotted controls remain independent focus targets.',
    semantics: ['role="timer"', 'aria-label', 'aria-live="polite"', 'tabular numeric value'],
    status: 'Remaining time updates politely and finish events are tested without relying on color alone.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/statistic.md'],
      tests: ['packages/core/src/components/statistic/countdown.test.ts']
    }
  },
  {
    componentName: 'YImage',
    pattern: 'Image with optional preview dialog',
    keyboard: ['Preview trigger is a native button', 'Escape closes the preview dialog'],
    focus: 'Previewable images enter the tab order through the trigger button while static images remain read-only.',
    semantics: ['img alt', 'button preview trigger', 'role="status"', 'role="img"', 'role="dialog"', 'aria-modal="true"'],
    status: 'Loading and failed states expose readable semantics; preview open and close events are tested.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/image.md'],
      tests: ['packages/core/src/components/image/image.test.ts']
    }
  },
  {
    componentName: 'YTimeline',
    pattern: 'Ordered timeline',
    keyboard: ['No custom keyboard behavior; action slot controls keep native tab order'],
    focus: 'Timeline items stay in reading order and slotted actions decide focus targets.',
    semantics: ['ol', 'li', 'aria-label', 'aria-disabled', 'aria-busy'],
    status: 'Loading timeline nodes expose busy semantics.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/timeline.md'],
      tests: ['packages/core/src/components/timeline/timeline.test.ts']
    }
  },
  {
    componentName: 'YCard',
    pattern: 'Content card with optional footer actions',
    keyboard: ['No custom keyboard behavior; footer and extra slot controls keep native behavior'],
    focus: 'The card is a content container and does not create extra focus stops.',
    semantics: ['section-like container', 'header content', 'footer action region'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/card.md'],
      tests: ['packages/core/src/components/card/card.test.ts']
    }
  },
  {
    componentName: 'YWatermark',
    pattern: 'Decorative watermark overlay',
    keyboard: ['No custom keyboard behavior; child content remains responsible for focus order'],
    focus: 'The overlay is hidden from assistive technology and does not intercept focus.',
    semantics: ['aria-hidden="true"', 'content wrapper'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/watermark.md'],
      tests: ['packages/core/src/components/watermark/watermark.test.ts']
    }
  },
  {
    componentName: 'YTable',
    pattern: 'Native data table with sortable and filterable headers',
    keyboard: ['Sort buttons activate with Enter / Space', 'Filter controls use details, checkbox, radio and button semantics', 'Row selection uses native checkbox behavior'],
    focus: 'Interactive header and row controls remain in table reading order.',
    semantics: ['table', 'caption', 'scope="col"', 'aria-sort', 'aria-busy', 'role="status"'],
    status: 'Loading, empty and summary regions are announced through status semantics.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/table.md'],
      tests: ['packages/core/src/components/table/table.test.ts']
    }
  },
  {
    componentName: 'YVirtualList',
    pattern: 'Virtualized list viewport',
    keyboard: ['Tab reaches the list viewport when it is focusable', 'Native scrolling keeps the rendered range synchronized'],
    focus: 'The scroll viewport exposes list semantics while rendered rows keep aria-posinset and aria-setsize.',
    semantics: ['role="list"', 'role="listitem"', 'aria-setsize', 'aria-posinset', 'role="status"'],
    status: 'Empty state uses status semantics and rendered items preserve their absolute list positions.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/virtual-list.md'],
      tests: ['packages/core/src/components/virtual-list/virtual-list.test.ts']
    }
  },
  {
    componentName: 'YDataTable',
    pattern: 'Admin data table composed from table, pagination and bulk actions',
    keyboard: ['Toolbar actions use native buttons', 'Column setting checkboxes use native checkbox behavior', 'Pagination and row selection inherit their component contracts'],
    focus: 'Remote, loading, error and bulk states do not remove table controls from keyboard order.',
    semantics: ['aria-busy', 'role="status"', 'role="alert"', 'aria-pressed'],
    status: 'Loading, error, bulk selection and empty states are announced.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/data-table.md'],
      tests: ['packages/admin/src/components/data-table/data-table.test.ts']
    }
  },
  {
    componentName: 'YBulkActionBar',
    pattern: 'Bulk selection action toolbar',
    keyboard: ['Action buttons activate with Enter / Space', 'Clear selection uses a native button and remains reachable after bulk actions appear'],
    focus: 'The toolbar appears after selection without stealing focus from the table row or checkbox that created the selection.',
    semantics: ['role="toolbar"', 'button', 'aria-live="polite"'],
    status: 'Selection count changes are exposed as status text while actions remain explicit buttons.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/bulk-action-bar.md'],
      tests: ['packages/admin/src/components/bulk-action-bar/bulk-action-bar.test.ts']
    }
  },
  {
    componentName: 'YCrudLayout',
    pattern: 'CRUD page shell with search, table and action regions',
    keyboard: ['Header actions use native button or link behavior', 'Sticky search and table regions preserve document tab order'],
    focus: 'Search, toolbar, table and pagination regions stay in reading order even when the header is sticky.',
    semantics: ['main', 'section', 'aria-labelledby', 'button'],
    status: 'The layout coordinates page regions without introducing wrapper focus traps.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/crud-layout.md'],
      tests: ['packages/admin/src/components/crud-layout/crud-layout.test.ts']
    }
  },
  {
    componentName: 'YDataToolbar',
    pattern: 'Data operation toolbar',
    keyboard: ['Toolbar buttons activate with Enter / Space', 'Search and filter controls remain in source order'],
    focus: 'Density, refresh, search and custom controls stay individually focusable and do not depend on toolbar wrapper focus.',
    semantics: ['role="toolbar"', 'button', 'input', 'aria-label'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/data-toolbar.md'],
      tests: ['packages/admin/src/components/data-toolbar/data-toolbar.test.ts']
    }
  },
  {
    componentName: 'YDataView',
    pattern: 'Saved-view data workspace',
    keyboard: ['Saved view controls use native buttons', 'Table, pagination and preference controls inherit their component keyboard contracts'],
    focus: 'Switching saved views updates content without moving focus away from the active view or table control.',
    semantics: ['section', 'aria-current', 'button', 'aria-busy'],
    status: 'Saved-view changes keep table request state and preference state traceable.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/data-view.md'],
      tests: ['packages/admin/src/components/data-view/data-view.test.ts']
    }
  },
  {
    componentName: 'YFieldArray',
    pattern: 'Repeatable form field group',
    keyboard: ['Add and remove controls activate with Enter / Space', 'Nested fields keep native input tab order'],
    focus: 'Adding an item places the new controls in DOM order; removing an item leaves the remaining group reachable.',
    semantics: ['fieldset', 'legend', 'button', 'aria-describedby'],
    status: 'Minimum and maximum item constraints are communicated through disabled action states and helper text.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/field-array.md'],
      tests: ['packages/admin/src/components/field-array/field-array.test.ts']
    }
  },
  {
    componentName: 'YMetricCard',
    pattern: 'Metric summary card',
    keyboard: ['Interactive card actions use native buttons or links', 'Static metric cards do not add unnecessary tab stops'],
    focus: 'Only actionable content receives focus; metric value and trend text remain readable in normal document flow.',
    semantics: ['article', 'aria-label', 'aria-describedby'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/metric-card.md'],
      tests: ['packages/admin/src/components/metric-card/metric-card.test.ts']
    }
  },
  {
    componentName: 'YPageHeader',
    pattern: 'Page heading and action region',
    keyboard: ['Back action uses native button or link behavior', 'Header actions remain in source order after the title'],
    focus: 'The heading stays semantic while actions remain separate focus targets.',
    semantics: ['header', 'h1', 'nav', 'button', 'a'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/page-header.md'],
      tests: ['packages/admin/src/components/page-header/page-header.test.ts']
    }
  },
  {
    componentName: 'YResourcePage',
    pattern: 'Resource management page composed from search, saved views, table and detail drawer',
    keyboard: ['Search submits with native form controls', 'Detail drawer and table inherit their overlay and table keyboard contracts'],
    focus: 'Opening detail view moves work into the drawer contract; closing returns the user to the page workflow.',
    semantics: ['main', 'form', 'table', 'dialog', 'aria-busy'],
    status: 'The page-level shell keeps search, saved view, data and detail regions traceable as one workflow.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/resource-page.md'],
      tests: ['packages/admin/src/components/resource-page/resource-page.test.ts']
    }
  },
  {
    componentName: 'YReviewWorkflow',
    pattern: 'Approval workflow panel',
    keyboard: ['Approve and reject actions activate with Enter / Space', 'Step controls and comments stay in document order'],
    focus: 'Current review step and action area remain visually and semantically connected without trapping focus.',
    semantics: ['section', 'aria-current', 'button', 'role="status"'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/review-workflow.md'],
      tests: ['packages/admin/src/components/review-workflow/review-workflow.test.ts']
    }
  },
  {
    componentName: 'YSavedViews',
    pattern: 'Saved view selector and management actions',
    keyboard: ['View buttons activate with Enter / Space', 'Save and manage actions are reachable as native buttons'],
    focus: 'The active view is announced without moving focus when users save, rename or switch views.',
    semantics: ['nav', 'aria-current', 'button', 'aria-live="polite"'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/saved-views.md'],
      tests: ['packages/admin/src/components/saved-views/saved-views.test.ts']
    }
  },
  {
    componentName: 'YSchemaForm',
    pattern: 'Schema-driven validated form',
    keyboard: ['Generated fields keep native field keyboard behavior', 'Submit and reset use native button activation'],
    focus: 'Validation summary and field errors connect back to generated controls through stable ids.',
    semantics: ['form', 'label', 'aria-invalid', 'aria-describedby', 'role="alert"'],
    status: 'Schema-generated controls preserve the same validation contract as hand-written form fields.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/schema-form.md'],
      tests: ['packages/admin/src/components/schema-form/schema-form.test.ts']
    }
  },
  {
    componentName: 'YSearchPanel',
    pattern: 'Search panel with field groups and actions',
    keyboard: ['Search and reset use native button activation', 'Filter fields remain in grouped form order'],
    focus: 'Collapsing or clearing filters keeps the panel heading, active fields and actions in predictable order.',
    semantics: ['form', 'fieldset', 'legend', 'button', 'aria-expanded'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/search-panel.md'],
      tests: ['packages/admin/src/components/search-panel/search-panel.test.ts']
    }
  },
  {
    componentName: 'YStatusTimeline',
    pattern: 'Status timeline with current step and optional actions',
    keyboard: ['Step actions activate with Enter / Space', 'Disabled timeline items do not expose misleading action targets'],
    focus: 'The active timeline item is announced through current state while custom action slots remain in document order.',
    semantics: ['list', 'listitem', 'aria-current', 'button'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/status-timeline.md'],
      tests: ['packages/admin/src/components/status-timeline/status-timeline.test.ts']
    }
  },
  {
    componentName: 'YFilterTabs',
    pattern: 'Filter tabs',
    keyboard: ['Arrow keys move enabled tabs', 'Home / End jumps to edge tab'],
    focus: 'Disabled filter tabs stay skipped by native button disabled behavior.',
    semantics: ['role="tablist"', 'role="tab"', 'aria-selected'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/filter-tabs.md'],
      tests: ['packages/admin/src/components/filter-tabs/filter-tabs.test.ts']
    }
  },
  {
    componentName: 'YSearchForm',
    pattern: 'Search form with collapsible advanced fields',
    keyboard: ['Submit and reset use native form behavior', 'Expand button toggles with Enter / Space'],
    focus: 'Collapsing preserves the form heading and active filters while fields remain in logical DOM order.',
    semantics: ['form', 'aria-expanded', 'role="status"', 'aria-live="polite"'],
    status: 'Active filter count is announced politely.',
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/search-form.md'],
      tests: ['packages/admin/src/components/search-form/search-form.test.ts']
    }
  },
  {
    componentName: 'YCommandPalette',
    pattern: 'Command combobox dialog',
    keyboard: ['ArrowDown / ArrowUp moves active command', 'Enter selects active command', 'Escape closes'],
    focus: 'Open state keeps input focus while active command is exposed through combobox state.',
    semantics: ['role="dialog"', 'role="combobox"', 'role="listbox"', 'role="option"', 'aria-activedescendant'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/command-palette.md'],
      tests: ['packages/product/src/components/command-palette/command-palette.test.ts']
    }
  },
  {
    componentName: 'YTree',
    pattern: 'Tree view',
    keyboard: ['Arrow keys navigate tree items', 'Home / End jumps to edge node', 'Enter / Space selects or checks'],
    focus: 'The active treeitem exposes level, expanded, selected, checked and async loading state.',
    semantics: ['role="tree"', 'role="treeitem"', 'aria-level', 'aria-expanded', 'aria-selected', 'aria-checked', 'aria-busy', 'role="status"', 'role="alert"'],
    maturity: 'verified',
    evidence: {
      docs: ['docs/guide/accessibility.md', 'docs/components/tree.md'],
      tests: ['packages/core/src/components/tree/tree.test.ts']
    }
  }
]

export const interactionContractByComponent = new Map(
  interactionContracts.map((contract) => [contract.componentName, contract])
)

export const interactionContractComponentNames = new Set(
  interactionContracts.map((contract) => contract.componentName)
)

export function getInteractionContract(componentName: ComponentMeta['name']) {
  return interactionContractByComponent.get(componentName)
}

export function hasInteractionContract(componentName: ComponentMeta['name']) {
  return interactionContractComponentNames.has(componentName)
}
