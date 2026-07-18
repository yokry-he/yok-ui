import { describe, expect, it } from 'vitest'
import {
  getComponentVerificationItems,
  getComponentVerificationSummary
} from './componentVerification'

describe('componentVerification', () => {
  it('promotes only routes backed by generated multi-viewport browser evidence', () => {
    const items = getComponentVerificationItems()
    const select = items.find((item) => item.component.docs === '/components/select')
    const button = items.find((item) => item.component.docs === '/components/button')

    expect(select?.documented).toBe(true)
    expect(select?.exampleReady).toBe(true)
    expect(select?.browserVerified).toBe(true)
    expect(select?.verifiedViewports).toEqual(['desktop', 'mobile', 'tablet'])
    expect(select?.stage).toBe('release-ready')

    expect(button?.documented).toBe(true)
    expect(button?.exampleReady).toBe(true)
    expect(button?.browserVerified).toBe(false)
    expect(button?.releaseReady).toBe(false)
    expect(button?.stage).toBe('example-ready')
  })

  it('never marks a component release-ready without browser evidence', () => {
    const items = getComponentVerificationItems()

    expect(items.filter((item) => item.releaseReady).every((item) => item.browserVerified)).toBe(true)
  })

  it('reports route evidence separately from component registration counts', () => {
    const summary = getComponentVerificationSummary()

    expect(summary.registeredComponents).toBeGreaterThan(100)
    expect(summary.documentedRoutes).toBeGreaterThan(100)
    expect(summary.exampleReadyRoutes).toBeGreaterThan(100)
    expect(summary.browserVerifiedRoutes).toBe(1)
    expect(summary.releaseReadyComponents).toBeGreaterThan(0)
    expect(summary.releaseReadyComponents).toBeLessThan(summary.registeredComponents)
  })
})
