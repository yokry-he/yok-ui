export interface YokIconPathData {
  viewBox: string
  paths: string[]
  tags?: string[]
}

const viewBox = '0 0 24 24'

function icon(paths: string[], tags: string[] = []): YokIconPathData {
  return {
    viewBox,
    paths,
    tags
  }
}

export const yokIconPaths = {
  check: icon(['M20 6 9 17l-5-5'], ['success', 'done']),
  close: icon(['M18 6 6 18', 'M6 6l12 12'], ['dismiss', 'x']),
  plus: icon(['M12 5v14', 'M5 12h14'], ['add', 'create']),
  minus: icon(['M5 12h14'], ['remove']),
  search: icon(['M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z', 'M21 21l-4.35-4.35'], ['find']),
  settings: icon(['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.64 8.94a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3.04V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.08A1.7 1.7 0 0 0 19.4 15z'], ['config']),
  user: icon(['M20 21a8 8 0 0 0-16 0', 'M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z'], ['account']),
  users: icon(['M17 21a5 5 0 0 0-10 0', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21a4 4 0 0 0-5-3.86', 'M16 3.13a4 4 0 0 1 0 7.75'], ['team']),
  lock: icon(['M6 10V8a6 6 0 0 1 12 0v2', 'M5 10h14v11H5z'], ['secure']),
  unlock: icon(['M8 10V8a4 4 0 0 1 7.46-2', 'M5 10h14v11H5z'], ['open']),
  shield: icon(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'], ['security']),
  bell: icon(['M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z', 'M10 21h4'], ['notice']),
  home: icon(['M3 11 12 3l9 8', 'M5 10v11h14V10', 'M9 21v-7h6v7'], ['dashboard']),
  mail: icon(['M4 5h16v14H4z', 'M4 7l8 6 8-6'], ['email', 'message']),
  phone: icon(['M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.8L7.8 9.4a15.8 15.8 0 0 0 6.8 6.8l1.1-1.1a2 2 0 0 1 1.8-.6l2.8.4a2 2 0 0 1 1.7 2z'], ['call', 'contact']),
  mapPin: icon(['M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'], ['location', 'address']),
  globe: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M2 12h20', 'M12 2a15 15 0 0 1 0 20', 'M12 2a15 15 0 0 0 0 20'], ['world', 'language']),
  menu: icon(['M4 6h16', 'M4 12h16', 'M4 18h16'], ['nav']),
  moreHorizontal: icon(['M5 12h.01', 'M12 12h.01', 'M19 12h.01'], ['ellipsis']),
  moreVertical: icon(['M12 5h.01', 'M12 12h.01', 'M12 19h.01'], ['ellipsis']),
  refresh: icon(['M21 12a9 9 0 0 1-15.5 6.3L3 16', 'M3 21v-5h5', 'M3 12A9 9 0 0 1 18.5 5.7L21 8', 'M21 3v5h-5'], ['reload']),
  loading: icon(['M21 12a9 9 0 1 1-3-6.7'], ['spinner']),
  info: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16v-4', 'M12 8h.01'], ['tip']),
  warning: icon(['M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', 'M12 9v4', 'M12 17h.01'], ['alert']),
  help: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M9.1 9a3 3 0 1 1 5.8 1c-.7 1.2-2.1 1.5-2.6 2.6', 'M12 17h.01'], ['question']),
  star: icon(['M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3z'], ['favorite']),
  heart: icon(['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z'], ['like']),
  eye: icon(['M1.5 12S5 5 12 5s10.5 7 10.5 7S19 19 12 19 1.5 12 1.5 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'], ['visible']),
  eyeOff: icon(['M3 3l18 18', 'M10.6 10.6A3 3 0 0 0 13.4 13.4', 'M9.9 4.3A10.7 10.7 0 0 1 12 4c7 0 10.5 8 10.5 8a16 16 0 0 1-3 4.3', 'M6.5 6.5A16 16 0 0 0 1.5 12S5 20 12 20a10.7 10.7 0 0 0 5.5-1.5'], ['hidden']),
  filter: icon(['M3 5h18l-7 8v5l-4 2v-7L3 5z'], ['funnel']),
  copy: icon(['M8 8h11v11H8z', 'M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1'], ['duplicate']),
  edit: icon(['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'], ['write']),
  trash: icon(['M3 6h18', 'M8 6V4h8v2', 'M6 6l1 15h10l1-15', 'M10 11v6', 'M14 11v6'], ['delete']),
  share: icon(['M18 8a3 3 0 1 0-2.8-4', 'M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M18 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M8.6 14.9l6.8-3.8', 'M8.6 19.1l6.8 3.8'], ['send']),
  save: icon(['M5 3h13l1 1v17H5z', 'M8 3v6h8V3', 'M8 21v-7h8v7'], ['store', 'persist']),
  print: icon(['M6 9V3h12v6', 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M6 14h12v7H6z'], ['printer']),
  undo: icon(['M9 7H4v5', 'M4 12a8 8 0 1 0 2.3-5.7L4 8.6'], ['back', 'history']),
  redo: icon(['M15 7h5v5', 'M20 12a8 8 0 1 1-2.3-5.7L20 8.6'], ['forward', 'history']),
  sortAsc: icon(['M5 17h6', 'M5 12h10', 'M5 7h14', 'M17 19V9', 'M14 12l3-3 3 3'], ['order', 'ascending']),
  sortDesc: icon(['M5 7h6', 'M5 12h10', 'M5 17h14', 'M17 5v10', 'M14 12l3 3 3-3'], ['order', 'descending']),
  drag: icon(['M9 5h.01', 'M15 5h.01', 'M9 12h.01', 'M15 12h.01', 'M9 19h.01', 'M15 19h.01'], ['handle', 'move']),
  maximize: icon(['M8 3H3v5', 'M21 8V3h-5', 'M16 21h5v-5', 'M3 16v5h5'], ['expand', 'fullscreen']),
  minimize: icon(['M8 3v5H3', 'M16 3v5h5', 'M16 21v-5h5', 'M8 21v-5H3'], ['collapse', 'fullscreen']),
  chevronDown: icon(['M6 9l6 6 6-6'], ['expand']),
  chevronUp: icon(['M18 15l-6-6-6 6'], ['collapse']),
  chevronLeft: icon(['M15 18l-6-6 6-6'], ['previous']),
  chevronRight: icon(['M9 18l6-6-6-6'], ['next']),
  arrowUp: icon(['M12 19V5', 'M5 12l7-7 7 7'], ['up']),
  arrowDown: icon(['M12 5v14', 'M19 12l-7 7-7-7'], ['down']),
  arrowLeft: icon(['M19 12H5', 'M12 19l-7-7 7-7'], ['back']),
  arrowRight: icon(['M5 12h14', 'M12 5l7 7-7 7'], ['forward']),
  externalLink: icon(['M14 3h7v7', 'M10 14 21 3', 'M21 14v7H3V3h7'], ['open']),
  upload: icon(['M12 16V4', 'M5 11l7-7 7 7', 'M4 20h16'], ['import']),
  download: icon(['M12 4v12', 'M19 9l-7 7-7-7', 'M4 20h16'], ['export']),
  login: icon(['M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4', 'M10 17l5-5-5-5', 'M15 12H3'], ['sign-in']),
  logout: icon(['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'], ['sign-out']),
  input: icon(['M4 7h16v10H4z', 'M8 12h8'], ['field']),
  textarea: icon(['M4 5h16v14H4z', 'M8 9h8', 'M8 13h8', 'M8 17h4'], ['field']),
  checkbox: icon(['M4 5h14v14H4z', 'M8 12l3 3 6-7'], ['form']),
  radio: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'], ['form']),
  switch: icon(['M7 8h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8z', 'M7 12h.01'], ['toggle']),
  calendar: icon(['M7 3v4', 'M17 3v4', 'M4 9h16', 'M5 5h14v16H5z'], ['date']),
  calendarCheck: icon(['M7 3v4', 'M17 3v4', 'M4 9h16', 'M5 5h14v16H5z', 'M8 15l2 2 5-5'], ['date', 'success']),
  calendarClock: icon(['M7 3v4', 'M17 3v4', 'M4 9h16', 'M5 5h14v16H5z', 'M12 13v3l2 1'], ['date', 'schedule']),
  clock: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'], ['time']),
  calculator: icon(['M5 3h14v18H5z', 'M8 6h8v3H8z', 'M8 13h.01', 'M12 13h.01', 'M16 13h.01', 'M8 17h.01', 'M12 17h.01', 'M16 17h.01'], ['number', 'finance']),
  form: icon(['M5 3h14v18H5z', 'M8 7h8', 'M8 11h8', 'M8 15h5'], ['schema']),
  slider: icon(['M4 7h10', 'M18 7h2', 'M4 17h2', 'M10 17h10', 'M14 5v4', 'M8 15v4'], ['range']),
  select: icon(['M5 7h14v10H5z', 'M8 11l4 4 4-4'], ['dropdown']),
  tag: icon(['M20 13 13 20 4 11V4h7l9 9z', 'M7.5 7.5h.01'], ['label']),
  success: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M8 12l3 3 5-6'], ['done']),
  error: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M15 9l-6 6', 'M9 9l6 6'], ['danger']),
  notice: icon(['M4 4h16v12H7l-3 3V4z'], ['message']),
  toast: icon(['M5 6h14v10H5z', 'M8 10h8', 'M8 14h5'], ['notification']),
  modal: icon(['M4 5h16v14H4z', 'M7 8h10', 'M7 12h10'], ['dialog']),
  tooltip: icon(['M12 3a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7z', 'M12 10h.01'], ['popover']),
  empty: icon(['M4 7h16v12H4z', 'M8 11h8', 'M9 15h6'], ['blank']),
  table: icon(['M3 5h18v14H3z', 'M3 10h18', 'M8 5v14', 'M16 5v14'], ['grid']),
  list: icon(['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'], ['rows']),
  chartBar: icon(['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2'], ['analytics']),
  chartLine: icon(['M3 18l6-6 4 4 8-10', 'M3 21h18'], ['trend']),
  pieChart: icon(['M12 3v9h9', 'M21 12a9 9 0 1 1-9-9'], ['report']),
  database: icon(['M4 6c0-2 16-2 16 0s-16 2-16 0z', 'M4 6v6c0 2 16 2 16 0V6', 'M4 12v6c0 2 16 2 16 0v-6'], ['data']),
  server: icon(['M4 4h16v6H4z', 'M4 14h16v6H4z', 'M8 7h.01', 'M8 17h.01'], ['host']),
  activity: icon(['M3 12h4l3-8 4 16 3-8h4'], ['monitor']),
  code: icon(['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'], ['developer']),
  terminal: icon(['M4 5h16v14H4z', 'M7 9l3 3-3 3', 'M12 15h5'], ['command']),
  cpu: icon(['M8 8h8v8H8z', 'M4 10h4', 'M4 14h4', 'M16 10h4', 'M16 14h4', 'M10 4v4', 'M14 4v4', 'M10 16v4', 'M14 16v4'], ['chip', 'system']),
  cloud: icon(['M17.5 19H7a5 5 0 1 1 1.2-9.9A6 6 0 0 1 19 11.5 3.8 3.8 0 0 1 17.5 19z'], ['network', 'service']),
  folder: icon(['M3 6h7l2 2h9v11H3z'], ['directory']),
  file: icon(['M6 3h9l5 5v13H6z', 'M14 3v6h6'], ['document']),
  fileText: icon(['M6 3h9l5 5v13H6z', 'M14 3v6h6', 'M9 13h6', 'M9 17h6'], ['document']),
  fileCode: icon(['M6 3h9l5 5v13H6z', 'M14 3v6h6', 'M11 13l-2 2 2 2', 'M15 13l2 2-2 2'], ['source']),
  image: icon(['M4 5h16v14H4z', 'M8 13l3-3 4 4 2-2 3 3', 'M8 9h.01'], ['picture']),
  archive: icon(['M4 4h16v4H4z', 'M6 8h12v12H6z', 'M10 12h4'], ['box']),
  clipboard: icon(['M9 4h6v4H9z', 'M6 6h3', 'M15 6h3', 'M6 6v15h12V6'], ['paste']),
  link: icon(['M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 1 0-7.1-7.1l-1.1 1.1', 'M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 1 0 12 20l1.1-1.1'], ['url']),
  bookmark: icon(['M6 4h12v17l-6-4-6 4z'], ['save']),
  play: icon(['M8 5v14l11-7z'], ['media']),
  pause: icon(['M8 5h3v14H8z', 'M13 5h3v14h-3z'], ['media']),
  stop: icon(['M7 7h10v10H7z'], ['media']),
  volume: icon(['M4 9v6h4l5 4V5L8 9H4z', 'M16 9a4 4 0 0 1 0 6'], ['sound']),
  mute: icon(['M4 9v6h4l5 4V5L8 9H4z', 'M18 9l4 4', 'M22 9l-4 4'], ['sound']),
  camera: icon(['M4 7h4l2-3h4l2 3h4v13H4z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'], ['photo']),
  mic: icon(['M12 3a3 3 0 0 1 3 3v6a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3z', 'M5 11a7 7 0 0 0 14 0', 'M12 18v4', 'M8 22h8'], ['audio', 'record']),
  layout: icon(['M3 5h18v14H3z', 'M3 10h18', 'M9 10v9'], ['page']),
  sidebar: icon(['M3 5h18v14H3z', 'M8 5v14'], ['navigation']),
  grid: icon(['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'], ['layout']),
  columns: icon(['M4 5h16v14H4z', 'M12 5v14'], ['layout']),
  rows: icon(['M4 5h16v14H4z', 'M4 12h16'], ['layout']),
  card: icon(['M4 6h16v12H4z', 'M4 10h16'], ['surface']),
  panel: icon(['M4 5h16v14H4z', 'M8 9h8', 'M8 13h5'], ['surface']),
  dashboard: icon(['M4 13a8 8 0 1 1 16 0', 'M12 13l4-4', 'M4 13h3', 'M17 13h3'], ['overview']),
  kanban: icon(['M4 5h16v14H4z', 'M8 9v6', 'M12 9v3', 'M16 9v8'], ['board', 'workflow']),
  layers: icon(['M12 3 3 8l9 5 9-5-9-5z', 'M3 12l9 5 9-5', 'M3 16l9 5 9-5'], ['stack']),
  package: icon(['M12 3 3 8l9 5 9-5-9-5z', 'M3 8v8l9 5 9-5V8', 'M12 13v8'], ['box']),
  cart: icon(['M6 6h15l-2 9H8L6 3H3', 'M9 21h.01', 'M18 21h.01'], ['commerce']),
  creditCard: icon(['M3 5h18v14H3z', 'M3 10h18', 'M7 15h3'], ['payment']),
  gift: icon(['M20 12v9H4v-9', 'M3 7h18v5H3z', 'M12 7v14', 'M12 7H8a2 2 0 1 1 4 0z', 'M12 7h4a2 2 0 1 0-4 0z'], ['reward']),
  wallet: icon(['M4 7h16v12H4z', 'M16 12h5v4h-5z', 'M4 7l3-3h10l3 3'], ['money']),
  receipt: icon(['M6 3h12v18l-3-2-3 2-3-2-3 2z', 'M9 8h6', 'M9 12h6', 'M9 16h4'], ['bill']),
  truck: icon(['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7z', 'M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'], ['delivery']),
  briefcase: icon(['M10 6V4h4v2', 'M4 7h16v12H4z', 'M4 12h16'], ['work', 'business']),
  building: icon(['M4 21V5h10v16', 'M14 9h6v12', 'M8 9h2', 'M8 13h2', 'M8 17h2', 'M17 13h.01', 'M17 17h.01'], ['company', 'office']),
  target: icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'], ['goal', 'focus']),
  palette: icon(['M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.3-3.5 1.7 1.7 0 0 1 1.2-3h1a5 5 0 0 0 0-10z', 'M7.5 10h.01', 'M10 7.5h.01', 'M14 7.5h.01', 'M16.5 10h.01'], ['theme', 'color']),
  rocket: icon(['M5 19c1.5-4.5 5-9.5 12-12 0 7-4.5 10.5-12 12z', 'M9 15l-3 3', 'M14 7h3v3', 'M5 19l4-1 2-2'], ['launch', 'growth']),
  logoMark: icon(['M12 3 20 7v10l-8 4-8-4V7l8-4z', 'M8 9l4 2 4-2', 'M8 15l4 2 4-2'], ['brand']),
  sparkle: icon(['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z'], ['cute']),
  mint: icon(['M5 19c8 0 14-6 14-14C11 5 5 11 5 19z', 'M5 19c3-4 6-7 10-10'], ['fresh']),
  candy: icon(['M8 8a6 6 0 1 0 8 8 6 6 0 0 0-8-8z', 'M3 6l4 2', 'M17 16l4 2', 'M6 3l2 4', 'M16 17l2 4'], ['cute'])
} satisfies Record<string, YokIconPathData>

export type YokIconName = keyof typeof yokIconPaths

export function getYokIconComponentName(name: YokIconName) {
  const normalized = name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join('')

  return `Y${normalized}Icon`
}

export const yokIconCategories = {
  system: [
    'check', 'close', 'plus', 'minus', 'search', 'settings', 'user', 'users',
    'lock', 'unlock', 'shield', 'bell', 'home', 'mail', 'phone', 'mapPin',
    'globe', 'menu', 'moreHorizontal', 'moreVertical', 'refresh', 'loading',
    'info', 'warning', 'help', 'star', 'heart', 'eye', 'eyeOff', 'filter',
    'copy', 'edit', 'trash', 'share', 'save', 'print', 'undo', 'redo',
    'sortAsc', 'sortDesc', 'drag', 'maximize', 'minimize'
  ],
  arrow: [
    'chevronDown', 'chevronUp', 'chevronLeft', 'chevronRight', 'arrowUp',
    'arrowDown', 'arrowLeft', 'arrowRight', 'externalLink', 'upload',
    'download', 'login', 'logout'
  ],
  form: [
    'input', 'textarea', 'checkbox', 'radio', 'switch', 'calendar', 'clock',
    'calendarCheck', 'calendarClock', 'calculator', 'form', 'slider', 'select',
    'tag'
  ],
  feedback: [
    'success', 'error', 'notice', 'toast', 'modal', 'tooltip', 'empty'
  ],
  data: [
    'table', 'list', 'chartBar', 'chartLine', 'pieChart', 'database',
    'server', 'activity', 'code', 'terminal', 'cpu', 'cloud'
  ],
  file: [
    'folder', 'file', 'fileText', 'fileCode', 'image', 'archive', 'clipboard',
    'link', 'bookmark'
  ],
  media: [
    'play', 'pause', 'stop', 'volume', 'mute', 'camera', 'mic'
  ],
  layout: [
    'layout', 'sidebar', 'grid', 'columns', 'rows', 'card', 'panel',
    'dashboard', 'kanban', 'layers', 'package'
  ],
  commerce: [
    'cart', 'creditCard', 'gift', 'wallet', 'receipt', 'truck'
  ],
  business: [
    'briefcase', 'building', 'target', 'palette', 'rocket'
  ],
  brand: [
    'logoMark', 'sparkle', 'mint', 'candy'
  ]
} satisfies Record<string, YokIconName[]>

export type YokIconCategory = keyof typeof yokIconCategories

export interface YokIconEntry {
  name: YokIconName
  componentName: string
  category: YokIconCategory
  tags: string[]
  viewBox: string
}

function findIconCategory(name: YokIconName): YokIconCategory {
  const entries = Object.entries(yokIconCategories) as Array<[YokIconCategory, YokIconName[]]>
  const matched = entries.find(([, names]) => names.includes(name))

  return matched?.[0] ?? 'system'
}

export function getYokIconEntries(category?: YokIconCategory | 'all'): YokIconEntry[] {
  const sourceNames = category && category !== 'all'
    ? yokIconCategories[category]
    : Object.keys(yokIconPaths) as YokIconName[]

  return sourceNames.map((name) => {
    const icon = yokIconPaths[name]

    return {
      name,
      componentName: getYokIconComponentName(name),
      category: findIconCategory(name),
      tags: icon.tags ?? [],
      viewBox: icon.viewBox
    }
  })
}

export function searchYokIcons(query: string, category?: YokIconCategory | 'all'): YokIconEntry[] {
  const normalizedQuery = query.trim().toLowerCase()
  const entries = getYokIconEntries(category)

  if (!normalizedQuery) {
    return entries
  }

  return entries.filter((entry) => {
    const haystack = [
      entry.name,
      entry.componentName,
      entry.category,
      ...entry.tags
    ].join(' ').toLowerCase()

    return haystack.includes(normalizedQuery)
  })
}
