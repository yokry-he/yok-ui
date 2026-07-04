export type QRCodeErrorCorrectionLevel = 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'

export interface QRCodeOptions {
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel
}

export interface QRCodeBitMatrix {
  size: number
  data: Uint8Array
  get(row: number, col: number): number
}

export interface QRCodeModel {
  modules: QRCodeBitMatrix
}

export type QRCodeCreate = (text: string, options?: QRCodeOptions) => QRCodeModel

// qrcode has a stable runtime API but no bundled TypeScript declarations.
// Keep the untyped boundary here so downstream packages do not need Node-flavored @types/qrcode.
// @ts-expect-error qrcode does not ship declarations in this workspace.
import { create as createQRCodeRuntime } from 'qrcode'

export const createQRCode = createQRCodeRuntime as QRCodeCreate
