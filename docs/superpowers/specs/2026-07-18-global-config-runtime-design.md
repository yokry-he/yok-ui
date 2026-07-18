# Yok UI Global Config Runtime Design

## Goal

Turn `YConfigProvider` into Yok UI's single scoped runtime configuration source while preserving the existing `YThemeProvider` API. The first complete slice covers locale, direction, size, density, theme, font, z-index, token overrides, and Button defaults.

## Current Problem

- `YConfigProvider` only exposes `size`, `density`, `locale` as a string, and `namespace`.
- `YThemeProvider` owns theme tokens and hard-codes a font stack, so theme and global configuration can disagree.
- `app.use(YokUi)` cannot receive global defaults.
- Locale changes do not provide translated component copy.
- Component-specific defaults have no typed inheritance model.

## Reference Model

Element Plus uses Config Provider and plugin options for locale, size, z-index, namespace, empty values, and component-specific defaults. Yok UI will follow that proven scoped-inheritance model while adding first-class theme and font configuration so applications do not need separate provider trees.

## Public API

`YConfigProvider` accepts:

- `size`: `sm | md | lg`
- `density`: `comfortable | compact`
- `locale`: locale code or a `YokLocale` object
- `direction`: `ltr | rtl | auto`
- `namespace`: CSS/runtime namespace
- `theme`: one of the 12 built-in `YokThemeName` values
- `font`: built-in font preset name or a custom CSS font stack
- `zIndex`: initial overlay z-index
- `tokens`: scoped `YokThemeTokens` override
- `button`: typed global Button defaults

Supported built-in locales in this slice are `en-US`, `zh-CN`, and `ja-JP`. Supported font presets are `system`, `humanist`, `rounded`, `serif`, and `mono`; they use dependency-free CSS stacks and therefore do not trigger remote font downloads.

## Runtime Architecture

`context.ts` remains the injection boundary. It exposes computed values plus a stable `t(key, params)` translation function. Locale definitions live in a dedicated `locale` directory. Font preset metadata lives beside the config runtime rather than in the theme token package because users may change typography without changing color tokens.

`YConfigProvider` merges each prop with the nearest parent context. Objects such as Button defaults merge shallowly by field, so a nested provider can change one default without discarding the rest. The provider writes semantic attributes and scoped CSS variables to one wrapper element.

`YThemeProvider` becomes a compatibility facade over `YConfigProvider`. Existing `theme`, `density`, and `tokens` calls continue to work, while nested config remains consistent.

The core plugin accepts the same configuration options and provides a root context through `app.provide`. This supports applications that prefer `app.use(YokUi, options)` without requiring a wrapper component.

## Precedence

1. Explicit component prop
2. Nearest nested provider component default
3. Parent provider or plugin default
4. Yok UI built-in default

## First Consumers

- `YButton` consumes global Button defaults for visual type, variant, native type, shape flags, and automatic Chinese spacing.
- Date and date-range components continue consuming a locale code and therefore remain backward compatible when the provider receives a locale object.
- Provider-rendered `lang`, `dir`, theme, density, size, namespace, font, and z-index attributes become inspectable browser evidence.

## Error Handling

- Unknown locale codes fall back to `en-US` while preserving the requested code in no public state.
- Missing translation keys fall back to the English message, then to the key itself.
- Invalid custom font input is not transformed; consumers are responsible for supplying a valid CSS font-family string.
- Nested providers never mutate parent objects.

## Testing

- Unit tests cover locale resolution, fallback translation, interpolation, font resolution, and immutable object merging.
- Provider tests cover nested inheritance and rendered attributes/CSS variables.
- Theme compatibility tests verify `YThemeProvider` delegates to the shared runtime.
- Plugin tests verify app-level options are injected.
- Button tests verify component props override global defaults.
- Existing full test, typecheck, package build, docs build, and desktop/mobile browser checks remain required.

## Compatibility

Existing string `locale`, `YThemeProvider`, and provider size/density usage remain valid. No production dependency is added. Namespace-driven class rewriting is intentionally excluded because it requires a separate CSS build strategy; this slice only keeps namespace available to runtime consumers and data attributes.
