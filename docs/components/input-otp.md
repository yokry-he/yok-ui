<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const otp = ref('123')
const loginCode = ref('')
const secureCode = ref('42')
const formModel = reactive({
  code: ''
})
const formRules: Record<string, YFormRule | YFormRule[]> = {
  code: {
    validator: (value: string) => value.length === 4 || '请输入 4 位验证码。',
    trigger: 'change'
  }
}

const basicSetup = [
  "import { ref } from 'vue'",
  "import { YInputOtp } from '@yok-ui/core'",
  '',
  "const otp = ref('123')"
].join('\n')

const basicCode = '<YInputOtp v-model="otp" label="Verification code" :length="6" />'

const pasteSetup = [
  "import { ref } from 'vue'",
  "import { YInputOtp } from '@yok-ui/core'",
  '',
  "const loginCode = ref('')",
  "const secureCode = ref('42')"
].join('\n')

const pasteCode = [
  '<YInputOtp v-model="loginCode" label="Login code" :length="4" />',
  '<YInputOtp v-model="secureCode" label="Secure code" type="password" :length="4" />'
].join('\n')

const formSetup = [
  "import { reactive } from 'vue'",
  "import { YForm, YFormItem, YInputOtp, type YFormRule } from '@yok-ui/core'",
  '',
  'const formModel = reactive({',
  "  code: ''",
  '})',
  'const formRules: Record<string, YFormRule | YFormRule[]> = {',
  '  code: {',
  "    validator: (value: string) => value.length === 4 || '请输入 4 位验证码。',",
  "    trigger: 'change'",
  '  }',
  '}'
].join('\n')

const formCode = [
  '<YForm :model="formModel" :rules="formRules">',
  '  <YFormItem prop="code" label="验证码" required v-slot="{ error, invalid, labelFor, messageId, validate }">',
  '    <YInputOtp',
  '      :id="labelFor"',
  '      :model-value="formModel.code"',
  '      :length="4"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  '      @update:model-value="(value) => { formModel.code = value; validate(\'change\') }"',
  '    />',
  '    <p v-if="error" class="demo-note">{{ error }}</p>',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Input OTP

Input OTP 用于短信验证码、邮箱验证码、二次验证和一次性密码。它把一个字符串拆成多个稳定输入格，支持输入推进、粘贴填充和表单校验。

::: tip TIP
`YInputOtp` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic code {#input-otp-basic-code}

<DocDemo
  title="Basic code"
  description="每个输入格负责一个字符，整体值通过 v-model 以字符串同步。"
  :code="basicCode"
  :setup="basicSetup"
  :usage="['v-model', 'length', 'complete']"
>
  <YInputOtp v-model="otp" label="Verification code" :length="6" />
  <p class="demo-note">Current code: {{ otp || 'empty' }}</p>
</DocDemo>

## Paste and password {#input-otp-paste-and-password}

<DocDemo
  title="Paste and password"
  description="粘贴验证码会自动过滤空白和分隔符；高风险场景可使用 password 类型隐藏字符。"
  :code="pasteCode"
  :setup="pasteSetup"
  :usage="['paste', 'password', 'numeric']"
>
  <div class="demo-stack">
    <YInputOtp v-model="loginCode" label="Login code" :length="4" />
    <YInputOtp v-model="secureCode" label="Secure code" type="password" :length="4" />
  </div>
</DocDemo>

## Form Validation {#input-otp-form-validation}

<DocDemo
  title="Form item"
  description="验证码作为字符串字段接入 YFormItem。错误状态会同步到所有输入格的 aria-invalid 和 aria-describedby。"
  :code="formCode"
  :setup="formSetup"
  :usage="['YFormItem', 'string value', 'aria-describedby']"
>
  <YForm :model="formModel" :rules="formRules">
    <YFormItem prop="code" label="验证码" required v-slot="{ error, invalid, labelFor, messageId, validate }">
      <YInputOtp
        :id="labelFor"
        :model-value="formModel.code"
        :length="4"
        :invalid="invalid"
        :aria-describedby="messageId"
        @update:model-value="(value) => { formModel.code = value; validate('change') }"
      />
      <p v-if="error" class="demo-note">{{ error }}</p>
    </YFormItem>
  </YForm>
</DocDemo>

## Usage notes {#input-otp-usage-notes}

- 默认只允许数字，适合短信验证码；如果需要字母数字混合码，可设置 `mask="alphanumeric"`。
- 粘贴内容会从当前输入格开始填充，方便用户直接粘贴短信里的完整验证码。
- `complete` 只在填满 `length` 位时触发，业务层可在该事件里发起校验请求。
- 与 `YFormItem` 联动时，把 `messageId` 传给 `aria-describedby`，让错误提示与每个输入格关联。

## Input OTP API {#input-otp-api}

<ComponentApiSection name="YInputOtp" />

## Accessibility {#accessibility}

- 输入组使用 `role="group"` 和统一标签，单个输入格有独立的 digit 标签。
- 输入格保留原生 input 焦点和键盘编辑能力，并设置 `autocomplete="one-time-code"`。
- 支持 ArrowLeft、ArrowRight 和 Backspace 的验证码录入路径。
- 错误状态会同步到所有输入格的 `aria-invalid`，并通过 `aria-describedby` 指向表单错误信息。
