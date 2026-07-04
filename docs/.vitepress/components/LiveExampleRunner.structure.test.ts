import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('LiveExampleRunner structure', () => {
  it('delegates the API map panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleApiMap from './LiveExampleApiMap.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleApiMap')).toBe(true)
    expect(runner.includes('<section id="live-example-api-map"')).toBe(false)
  })

  it('delegates the acceptance panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleAcceptance from './LiveExampleAcceptance.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleAcceptance')).toBe(true)
    expect(runner.includes('<section id="live-example-acceptance"')).toBe(false)
  })

  it('delegates the source panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleSourcePanel from './LiveExampleSourcePanel.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleSourcePanel')).toBe(true)
    expect(runner.includes('id="live-example-source-panel"')).toBe(false)
  })

  it('delegates the scenario coverage panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleScenarioCoverage from './LiveExampleScenarioCoverage.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleScenarioCoverage')).toBe(true)
    expect(runner.includes('<section id="live-example-scenario-coverage"')).toBe(false)
  })

  it('delegates the sync snapshot panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleSyncSnapshot from './LiveExampleSyncSnapshot.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleSyncSnapshot')).toBe(true)
    expect(runner.includes('<section id="live-example-sync-snapshot"')).toBe(false)
  })

  it('delegates the scenario test plan panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleScenarioTestPlan from './LiveExampleScenarioTestPlan.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleScenarioTestPlan')).toBe(true)
    expect(runner.includes('<section id="live-example-test-plan"')).toBe(false)
  })

  it('delegates the interaction contract panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleInteractionContract from './LiveExampleInteractionContract.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleInteractionContract')).toBe(true)
    expect(runner.includes('<section\n      class="live-example-runner__contract"')).toBe(false)
  })

  it('delegates the run evidence panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleRunEvidence from './LiveExampleRunEvidence.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleRunEvidence')).toBe(true)
    expect(runner.includes('<section class="live-example-runner__run-evidence"')).toBe(false)
  })

  it('delegates the live example toolbar to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleToolbar from './LiveExampleToolbar.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleToolbar')).toBe(true)
    expect(runner.includes('<div class="live-example-runner__toolbar"')).toBe(false)
  })

  it('groups dense evidence panels behind the advanced tools disclosure', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')
    const advancedStart = runner.indexOf('<LiveExampleAdvancedTools')
    const cockpitIndex = runner.indexOf('<ul class="live-example-runner__cockpit"')
    const evidenceIndex = runner.indexOf('<LiveExampleRunEvidence')
    const apiMapIndex = runner.indexOf('<LiveExampleApiMap')
    const contractIndex = runner.indexOf('<LiveExampleInteractionContract')
    const advancedEnd = runner.indexOf('</LiveExampleAdvancedTools>', contractIndex)

    expect(runner.includes("import LiveExampleAdvancedTools from './LiveExampleAdvancedTools.vue'")).toBe(true)
    expect(advancedStart).toBeGreaterThan(-1)
    expect(advancedStart).toBeLessThan(cockpitIndex)
    expect(cockpitIndex).toBeLessThan(evidenceIndex)
    expect(evidenceIndex).toBeLessThan(apiMapIndex)
    expect(apiMapIndex).toBeLessThan(contractIndex)
    expect(contractIndex).toBeLessThan(advancedEnd)
  })

  it('delegates the scenario switcher to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleScenarioStrip from './LiveExampleScenarioStrip.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleScenarioStrip')).toBe(true)
    expect(runner.includes('<section\n      v-if="hasScenarioSwitcher"\n      id="live-example-scenarios"')).toBe(false)
  })

  it('delegates the props panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExamplePropsPanel from './LiveExamplePropsPanel.vue'")).toBe(true)
    expect(runner.includes('<LiveExamplePropsPanel')).toBe(true)
    expect(runner.includes('class="live-example-runner__prop-panel"')).toBe(false)
  })

  it('delegates the event log panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleEventLog from './LiveExampleEventLog.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleEventLog')).toBe(true)
    expect(runner.includes('<section id="live-example-event-log"')).toBe(false)
  })

  it('delegates the preview state panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExamplePreviewState from './LiveExamplePreviewState.vue'")).toBe(true)
    expect(runner.includes('<LiveExamplePreviewState')).toBe(true)
    expect(runner.includes('<section\n        v-if="hasPreviewStateSnapshot"\n        class="live-example-runner__state-panel"')).toBe(false)
  })

  it('delegates the interaction replay panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleReplayPanel from './LiveExampleReplayPanel.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleReplayPanel')).toBe(true)
    expect(runner.includes('<section class="live-example-runner__replay"')).toBe(false)
  })

  it('delegates the editable SFC editor to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExampleEditorPanel from './LiveExampleEditorPanel.vue'")).toBe(true)
    expect(runner.includes('<LiveExampleEditorPanel')).toBe(true)
    expect(runner.includes('<section class="live-example-runner__editor"')).toBe(false)
  })

  it('delegates the preview panel to a focused child component', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')

    expect(runner.includes("import LiveExamplePreviewPanel from './LiveExamplePreviewPanel.vue'")).toBe(true)
    expect(runner.includes('<LiveExamplePreviewPanel')).toBe(true)
    expect(runner.includes('<div class="live-example-runner__preview"')).toBe(false)
  })

  it('groups preview, collapsed editor and source code into one Element Plus style example card', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')
    const css = readFileSync('docs/.vitepress/theme/custom.css', 'utf8')
    const cardStart = runner.indexOf('<section class="live-example-runner__example-card" data-live-example-card="element-plus">')
    const gridIndex = runner.indexOf('<div class="live-example-runner__grid">')
    const editorDisclosureIndex = runner.indexOf('<details class="live-example-runner__editor-disclosure">')
    const editorIndex = runner.indexOf('<LiveExampleEditorPanel')
    const previewIndex = runner.indexOf('<LiveExamplePreviewPanel')
    const sourceIndex = runner.indexOf('<LiveExampleSourcePanel')
    const cardEnd = runner.indexOf('</section>', sourceIndex)

    expect(cardStart).toBeGreaterThan(-1)
    expect(cardStart).toBeLessThan(gridIndex)
    expect(gridIndex).toBeLessThan(editorDisclosureIndex)
    expect(editorDisclosureIndex).toBeLessThan(editorIndex)
    expect(editorIndex).toBeLessThan(previewIndex)
    expect(previewIndex).toBeLessThan(sourceIndex)
    expect(sourceIndex).toBeLessThan(cardEnd)
    expect(runner).toMatch(/<details class="live-example-runner__editor-disclosure">\s*<summary/)
    expect(css).toMatch(/\.live-example-runner__example-card \.live-example-runner__preview\s*\{[^}]*order:\s*1;/)
    expect(css).toMatch(/\.live-example-runner__editor-disclosure\s*\{[^}]*order:\s*2;/)
  })

  it('places the real editable example before scenario matrix, inspector and workflow diagnostics', () => {
    const runner = readFileSync('docs/.vitepress/components/LiveExampleRunner.vue', 'utf8')
    const toolbarIndex = runner.indexOf('<LiveExampleToolbar')
    const scenarioIndex = runner.indexOf('<LiveExampleScenarioStrip')
    const cardIndex = runner.indexOf('<section class="live-example-runner__example-card" data-live-example-card="element-plus">')
    const inspectorIndex = runner.indexOf('<div class="live-example-runner__inspector"')
    const inspectorEndIndex = runner.indexOf('    </div>\n\n    <LiveExampleAdvancedTools', inspectorIndex)
    const advancedIndex = runner.indexOf('<LiveExampleAdvancedTools')

    expect(toolbarIndex).toBeGreaterThan(-1)
    expect(scenarioIndex).toBeGreaterThan(-1)
    expect(cardIndex).toBeGreaterThan(-1)
    expect(inspectorIndex).toBeGreaterThan(-1)
    expect(advancedIndex).toBeGreaterThan(-1)
    expect(inspectorEndIndex).toBeGreaterThan(-1)
    expect(toolbarIndex).toBeLessThan(cardIndex)
    expect(cardIndex).toBeLessThan(scenarioIndex)
    expect(cardIndex).toBeLessThan(inspectorIndex)
    expect(inspectorEndIndex).toBeLessThan(advancedIndex)
  })
})
