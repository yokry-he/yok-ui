import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YApprovalCommentBox, {
  type YApprovalAttachment,
  type YApprovalCommentSubmitPayload,
  type YApprovalSuggestion
} from './YApprovalCommentBox.vue'

const suggestions: YApprovalSuggestion[] = [
  { label: '补充键盘说明', value: 'keyboard' },
  { label: '补充 API 表', value: 'api' },
  { label: '需要视觉复核', value: 'visual', tone: 'warning' }
]

const attachments: YApprovalAttachment[] = [
  { name: 'audit-notes.md', url: '/audit-notes.md', size: '12 KB' }
]

describe('YApprovalCommentBox', () => {
  it('renders title, decision options, suggestions, attachments and counter', () => {
    const wrapper = mount(YApprovalCommentBox, {
      props: {
        modelValue: 'Please add keyboard notes.',
        decision: 'requestChanges',
        suggestions,
        attachments,
        maxLength: 120,
        title: 'Review comment',
        description: 'Explain the decision before submitting.'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Approval comment')
    expect(wrapper.text()).toContain('Review comment')
    expect(wrapper.text()).toContain('Explain the decision before submitting.')
    expect(wrapper.text()).toContain('Request changes')
    expect(wrapper.text()).toContain('补充键盘说明')
    expect(wrapper.text()).toContain('audit-notes.md')
    expect(wrapper.text()).toContain('26 / 120')
  })

  it('emits model, decision and suggestion updates', async () => {
    const wrapper = mount(YApprovalCommentBox, {
      props: {
        modelValue: '',
        decision: 'approve',
        suggestions
      }
    })

    await wrapper.get('textarea').setValue('Ready after API table update.')
    await wrapper.findAll('.yok-approval-comment-box__decision')[1].trigger('click')
    await wrapper.findAll('.yok-approval-comment-box__suggestion')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ready after API table update.'])
    expect(wrapper.emitted('update:decision')?.[0]).toEqual(['requestChanges'])
    expect(wrapper.emitted('update:selectedSuggestions')?.[0]).toEqual([['keyboard']])
  })

  it('submits a complete approval payload', async () => {
    const wrapper = mount(YApprovalCommentBox, {
      props: {
        modelValue: 'Looks ready.',
        decision: 'approve',
        selectedSuggestions: ['api'],
        suggestions,
        attachments,
        reviewer: 'Yok',
        target: 'YDataTable'
      }
    })

    await wrapper.get('.yok-approval-comment-box__submit').trigger('click')

    const payload = wrapper.emitted('submit')?.[0]?.[0] as YApprovalCommentSubmitPayload

    expect(payload).toEqual({
      decision: 'approve',
      comment: 'Looks ready.',
      selectedSuggestions: ['api'],
      suggestions: [suggestions[1]],
      attachments,
      reviewer: 'Yok',
      target: 'YDataTable'
    })
  })

  it('requires a non-empty comment before submit', async () => {
    const wrapper = mount(YApprovalCommentBox, {
      props: {
        modelValue: '   ',
        decision: 'reject',
        required: true
      }
    })

    await wrapper.get('.yok-approval-comment-box__submit').trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.emitted('invalid')?.[0]).toEqual(['Comment is required.'])
    expect(wrapper.text()).toContain('Comment is required.')
  })

  it('disables controls while disabled or loading and emits cancel', async () => {
    const wrapper = mount(YApprovalCommentBox, {
      props: {
        modelValue: 'Hold for release.',
        decision: 'requestChanges',
        suggestions,
        disabled: true,
        loading: true
      }
    })

    expect(wrapper.get('textarea').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.yok-approval-comment-box__submit').attributes('disabled')).toBeDefined()

    await wrapper.get('.yok-approval-comment-box__cancel').trigger('click')
    await wrapper.get('.yok-approval-comment-box__submit').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
