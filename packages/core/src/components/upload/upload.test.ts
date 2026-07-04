import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import YUpload from './YUpload.vue'
import type { YUploadFile, YUploadRejectedFile, YUploadRequestOptions } from './YUpload.vue'

function setInputFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files
  })
}

async function flushPromises() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('YUpload', () => {
  it('renders label, description, input attributes, and empty state', () => {
    const wrapper = mount(YUpload, {
      props: {
        label: 'Upload assets',
        description: 'PNG or JPG only.',
        accept: '.png,.jpg',
        multiple: true
      }
    })

    expect(wrapper.text()).toContain('Upload assets')
    expect(wrapper.text()).toContain('PNG or JPG only.')
    expect(wrapper.get('input').attributes('accept')).toBe('.png,.jpg')
    expect(wrapper.get('input').attributes('multiple')).toBeDefined()
    expect(wrapper.get('[role="status"]').text()).toBe('No files selected yet')
  })

  it('emits selected files as upload file metadata', async () => {
    const wrapper = mount(YUpload, {
      props: {
        multiple: true
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement

    setInputFiles(input, [
      new File(['first'], 'first.png', { type: 'image/png', lastModified: 1 }),
      new File(['second'], 'second.jpg', { type: 'image/jpeg', lastModified: 2 })
    ])

    await wrapper.get('input').trigger('change')

    const emittedFiles = wrapper.emitted('update:modelValue')?.[0]?.[0] as YUploadFile[]

    expect(emittedFiles).toHaveLength(2)
    expect(emittedFiles[0]).toMatchObject({
      name: 'first.png',
      size: 5,
      type: 'image/png',
      status: 'ready'
    })
    expect(emittedFiles[0].raw).toBeInstanceOf(File)
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(emittedFiles)
  })

  it('limits files with maxFiles and replaces files when multiple is false', async () => {
    const wrapper = mount(YUpload, {
      props: {
        multiple: true,
        maxFiles: 1,
        modelValue: [
          {
            id: 'existing',
            name: 'existing.pdf',
            size: 12,
            status: 'success'
          }
        ]
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement

    setInputFiles(input, [new File(['next'], 'next.pdf', { type: 'application/pdf' })])
    await wrapper.get('input').trigger('change')

    const emittedFiles = wrapper.emitted('update:modelValue')?.[0]?.[0] as YUploadFile[]

    expect(emittedFiles).toHaveLength(1)
    expect(emittedFiles[0].name).toBe('existing.pdf')
    expect(wrapper.emitted('exceed')?.[0]).toEqual([
      expect.arrayContaining([
        expect.objectContaining({
          name: 'next.pdf'
        })
      ]),
      1
    ])
    expect(wrapper.emitted('reject')?.[0]).toEqual([[expect.objectContaining({ name: 'next.pdf' })], 'exceed'])
  })

  it('filters files by accept rules and emits rejected files', async () => {
    const wrapper = mount(YUpload, {
      props: {
        accept: '.png,image/jpeg',
        multiple: true
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement
    const acceptedImage = new File(['first'], 'first.png', { type: 'image/png', lastModified: 1 })
    const acceptedJpeg = new File(['second'], 'second.jpeg', { type: 'image/jpeg', lastModified: 2 })
    const rejectedPdf = new File(['pdf'], 'guide.pdf', { type: 'application/pdf', lastModified: 3 })

    setInputFiles(input, [acceptedImage, acceptedJpeg, rejectedPdf])
    await wrapper.get('input').trigger('change')

    const emittedFiles = wrapper.emitted('update:modelValue')?.[0]?.[0] as YUploadFile[]

    expect(emittedFiles.map((file) => file.name)).toEqual(['first.png', 'second.jpeg'])
    expect(wrapper.emitted('reject')?.[0]).toEqual([[rejectedPdf], 'accept'])
    expect(wrapper.text()).toContain('guide.pdf')
    expect(wrapper.text()).toContain('Unsupported file type. Use .png,image/jpeg.')
    expect(wrapper.get('[aria-label="Rejected files"]').attributes('role')).toBe('alert')
  })

  it('rejects files over maxSize before adding them to the model', async () => {
    const wrapper = mount(YUpload, {
      props: {
        maxSize: 4,
        multiple: true
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement
    const largeFile = new File(['large'], 'large.txt', { type: 'text/plain' })

    setInputFiles(input, [largeFile])
    await wrapper.get('input').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([])
    expect(wrapper.emitted('reject')?.[0]).toEqual([[largeFile], 'size'])
    expect(wrapper.text()).toContain('large.txt')
    expect(wrapper.text()).toContain('Max file size is 4 B.')
  })

  it('uses beforeUpload to block a file with a custom reason', async () => {
    const beforeUpload = vi.fn(() => 'Release packages require owner approval.')
    const wrapper = mount(YUpload, {
      props: {
        beforeUpload
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement
    const file = new File(['zip'], 'release.zip', { type: 'application/zip' })

    setInputFiles(input, [file])
    await wrapper.get('input').trigger('change')
    await flushPromises()

    expect(beforeUpload).toHaveBeenCalledWith(file, [file])
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([])
    expect(wrapper.emitted('reject')?.[0]).toEqual([[file], 'before-upload'])
    expect(wrapper.text()).toContain('Release packages require owner approval.')
  })

  it('runs customRequest with progress and success when autoUpload is enabled', async () => {
    const customRequest = vi.fn(async (options: YUploadRequestOptions) => {
      options.onProgress(42)
      return { message: 'Published', response: { url: '/downloads/release.zip' } }
    })
    const wrapper = mount(YUpload, {
      props: {
        autoUpload: true,
        customRequest
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement
    const file = new File(['zip'], 'release.zip', { type: 'application/zip', lastModified: 4 })

    setInputFiles(input, [file])
    await wrapper.get('input').trigger('change')
    await flushPromises()

    expect(customRequest).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('progress')?.at(-1)?.[0]).toMatchObject({
      name: 'release.zip',
      status: 'uploading',
      progress: 42
    })
    expect(wrapper.emitted('success')?.[0]?.[0]).toMatchObject({
      name: 'release.zip',
      status: 'success',
      progress: 100,
      message: 'Published'
    })
    expect(wrapper.emitted('success')?.[0]?.[1]).toEqual({ url: '/downloads/release.zip' })
  })

  it('retries failed files through the custom request lifecycle', async () => {
    const customRequest = vi.fn(async () => ({ message: 'Recovered', response: { ok: true } }))
    const rawFile = new File(['zip'], 'release.zip', { type: 'application/zip', lastModified: 5 })
    const failedFile: YUploadFile = {
      id: 'failed',
      name: 'release.zip',
      size: rawFile.size,
      type: rawFile.type,
      status: 'error',
      message: 'Network timeout',
      raw: rawFile
    }
    const wrapper = mount(YUpload, {
      props: {
        modelValue: [failedFile],
        customRequest
      }
    })

    await wrapper.get('[aria-label="Retry release.zip"]').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('retry')?.[0]?.[0]).toEqual(failedFile)
    expect(wrapper.emitted('success')?.[0]?.[0]).toMatchObject({
      name: 'release.zip',
      status: 'success',
      message: 'Recovered'
    })
  })

  it('cancels an in-flight upload request', async () => {
    const abort = vi.fn()
    const customRequest = vi.fn(() => ({ abort }))
    const wrapper = mount(YUpload, {
      props: {
        autoUpload: true,
        customRequest
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement
    const rawFile = new File(['zip'], 'release.zip', { type: 'application/zip', lastModified: 6 })

    setInputFiles(input, [rawFile])
    await wrapper.get('input').trigger('change')
    await flushPromises()

    const uploadingFile = (wrapper.emitted('update:modelValue')?.at(-1)?.[0] as YUploadFile[])[0]

    await wrapper.setProps({ modelValue: [uploadingFile] })
    await wrapper.get('[aria-label="Cancel release.zip"]').trigger('click')

    expect(abort).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('abort')?.[0]?.[0]).toEqual(uploadingFile)
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      expect.objectContaining({
        name: 'release.zip',
        status: 'error',
        message: 'Upload canceled.'
      })
    ])
  })

  it('renders picture list preview and download actions', async () => {
    const file: YUploadFile = {
      id: 'shot',
      name: 'preview.png',
      size: 2048,
      status: 'success',
      url: '/assets/preview.png',
      thumbUrl: '/assets/thumb.png'
    }
    const wrapper = mount(YUpload, {
      props: {
        listType: 'picture',
        previewable: true,
        downloadable: true,
        modelValue: [file]
      }
    })

    expect(wrapper.get('img').attributes('src')).toBe('/assets/thumb.png')

    await wrapper.get('[aria-label="Preview preview.png"]').trigger('click')
    await wrapper.get('[aria-label="Download preview.png"]').trigger('click')

    expect(wrapper.emitted('preview')?.[0]).toEqual([file])
    expect(wrapper.emitted('download')?.[0]).toEqual([file])
  })

  it('reorders and clears files from the list actions', async () => {
    const files: YUploadFile[] = [
      { id: 'one', name: 'one.png', size: 1024, status: 'success' },
      { id: 'two', name: 'two.png', size: 2048, status: 'success' }
    ]
    const wrapper = mount(YUpload, {
      props: {
        modelValue: files,
        sortable: true,
        clearable: true
      }
    })

    await wrapper.get('[aria-label="Move two.png up"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([files[1], files[0]])
    expect(wrapper.emitted('reorder')?.[0]).toEqual([[files[1], files[0]]])

    await wrapper.setProps({ modelValue: [files[1], files[0]] })
    await wrapper.get('[aria-label="Clear all files"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
    expect(wrapper.emitted('clear')?.[0]).toEqual([[files[1], files[0]]])
  })

  it('exposes submit and clearFiles methods for manual upload flows', async () => {
    const customRequest = vi.fn(async () => ({ message: 'Submitted' }))
    const rawFile = new File(['zip'], 'manual.zip', { type: 'application/zip', lastModified: 7 })
    const file: YUploadFile = {
      id: 'manual',
      name: 'manual.zip',
      size: rawFile.size,
      type: rawFile.type,
      status: 'ready',
      raw: rawFile
    }
    const wrapper = mount(YUpload, {
      props: {
        modelValue: [file],
        customRequest
      }
    })

    await (wrapper.vm as unknown as { submit: () => Promise<void> }).submit()
    await flushPromises()

    expect(customRequest).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('success')?.[0]?.[0]).toMatchObject({
      name: 'manual.zip',
      status: 'success',
      message: 'Submitted'
    })

    ;(wrapper.vm as unknown as { clearFiles: () => void }).clearFiles()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
  })

  it('renders controlled validation and rejected files with described-by relationships', () => {
    const rejectedFiles: YUploadRejectedFile[] = [
      {
        id: 'blocked',
        name: 'release.exe',
        size: 128000,
        status: 'error',
        reason: 'accept',
        message: 'Only ZIP archives are allowed.'
      }
    ]
    const wrapper = mount(YUpload, {
      props: {
        id: 'release-upload',
        label: 'Release upload',
        description: 'Attach the package archive.',
        accept: '.zip',
        invalid: true,
        error: 'Upload a valid release package before publishing.',
        ariaDescribedby: 'external-help',
        rejectedFiles
      }
    })

    const upload = wrapper.get('.yok-upload')
    const input = wrapper.get('input')

    expect(upload.attributes('aria-invalid')).toBe('true')
    expect(upload.attributes('aria-describedby')).toBe('external-help release-upload-description release-upload-error release-upload-rejected')
    expect(input.attributes('aria-describedby')).toBe(upload.attributes('aria-describedby'))
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#release-upload-error').attributes('role')).toBe('alert')
    expect(wrapper.get('#release-upload-rejected').text()).toContain('release.exe')
    expect(wrapper.get('#release-upload-rejected').text()).toContain('Only ZIP archives are allowed.')
  })

  it('surfaces exceeded files as dismissible rejected items', async () => {
    const wrapper = mount(YUpload, {
      props: {
        multiple: true,
        maxFiles: 1,
        modelValue: [
          {
            id: 'existing',
            name: 'existing.pdf',
            size: 12,
            status: 'success'
          }
        ]
      }
    })
    const input = wrapper.get('input').element as HTMLInputElement

    setInputFiles(input, [new File(['next'], 'next.pdf', { type: 'application/pdf' })])
    await wrapper.get('input').trigger('change')

    expect(wrapper.text()).toContain('next.pdf')
    expect(wrapper.text()).toContain('Max 1 file. Remove one item before adding more.')

    await wrapper.get('[aria-label="Dismiss next.pdf"]').trigger('click')

    expect(wrapper.text()).not.toContain('next.pdf')
    expect(wrapper.emitted('dismissReject')?.[0]).toEqual([
      expect.objectContaining({
        name: 'next.pdf',
        reason: 'exceed'
      }),
      []
    ])
  })

  it('accepts files from drag and drop when drag mode is enabled', async () => {
    const wrapper = mount(YUpload, {
      props: {
        drag: true,
        multiple: true
      }
    })
    const droppedFile = new File(['drop'], 'drop.png', { type: 'image/png' })
    const dataTransfer = {
      files: [droppedFile],
      dropEffect: ''
    }

    await wrapper.get('.yok-upload__control').trigger('dragenter', { dataTransfer })
    expect(wrapper.get('.yok-upload__control').classes()).toContain('yok-upload__control--dragging')

    await wrapper.get('.yok-upload__control').trigger('drop', { dataTransfer })

    const emittedFiles = wrapper.emitted('update:modelValue')?.[0]?.[0] as YUploadFile[]

    expect(emittedFiles).toHaveLength(1)
    expect(emittedFiles[0]).toMatchObject({
      name: 'drop.png',
      status: 'ready'
    })
    expect(wrapper.emitted('drop')?.[0]?.[0]).toEqual(emittedFiles)
    expect(wrapper.get('.yok-upload__control').classes()).not.toContain('yok-upload__control--dragging')
  })

  it('rejects dropped files when disabled', async () => {
    const wrapper = mount(YUpload, {
      props: {
        drag: true,
        disabled: true
      }
    })
    const droppedFile = new File(['drop'], 'drop.png', { type: 'image/png' })

    await wrapper.get('.yok-upload__control').trigger('drop', {
      dataTransfer: {
        files: [droppedFile]
      }
    })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('reject')?.[0]).toEqual([[droppedFile], 'disabled'])
  })

  it('emits remove with the next file list', async () => {
    const files: YUploadFile[] = [
      { id: 'one', name: 'one.png', size: 1024, status: 'ready' },
      { id: 'two', name: 'two.png', size: 2048, status: 'success' }
    ]
    const wrapper = mount(YUpload, {
      props: {
        modelValue: files
      }
    })

    await wrapper.get('[aria-label="Remove one.png"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([files[1]])
    expect(wrapper.emitted('remove')?.[0]).toEqual([files[0], [files[1]]])
  })

  it('disables picker and remove actions when disabled', () => {
    const wrapper = mount(YUpload, {
      props: {
        disabled: true,
        modelValue: [{ id: 'one', name: 'one.png', size: 1024 }]
      }
    })

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.yok-upload__button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.yok-upload__remove').attributes('disabled')).toBeDefined()
  })
})
