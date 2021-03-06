declare const enum kCmdInfo { NoTab = 0, ActiveTab = 1, CurWndTabsIfRepeat = 2, CurWndTabs = 3, CurShownTabs = 4 }

type Tab = chrome.tabs.Tab
type BgCmdNoTab<T extends kBgCmd> = (this: void, _fakeArg?: undefined) => void | T
type BgCmdActiveTab<T extends kBgCmd> = (this: void, tabs1: [Tab]) => void | T
type BgCmdCurWndTabs<T extends kBgCmd> = (this: void, tabs1: Tab[]) => void | T

interface BgCmdOptions {
  [kBgCmd.blank]: { /** ms */ for: CountValueOrRef; wait: CountValueOrRef } & Req.FallbackOptions
//#region need cport
  [kBgCmd.goNext]: {
    isNext: boolean; noRel: boolean; patterns: string | string[]; rel: string; $fmt: 1; absolute: true
  } & UserSedOptions & CSSOptions & Req.FallbackOptions & OpenUrlOptions
  [kBgCmd.insertMode]: {
    key: string
    hideHUD: boolean
    /** (deprecated) */ hideHud: boolean
    insert: boolean
    passExitKey: boolean
    reset: boolean
    unhover: boolean
  }
  [kBgCmd.nextFrame]: Req.FallbackOptions
  [kBgCmd.parentFrame]: Req.FallbackOptions
  [kBgCmd.performFind]: {
    active: boolean
    highlight: boolean
    normalize: boolean
    index: "other" | "count" | number
    last: boolean
    postOnEsc: boolean
    query: string
    restart: boolean
    returnToViewport: true
    selected: boolean
  } & Req.FallbackOptions
  [kBgCmd.toggle]: { key: string; value: any } & Req.FallbackOptions
  [kBgCmd.showHelp]: Omit<ShowHelpDialogOptions, "h">
  [kBgCmd.showVomnibar]: VomnibarNS.GlobalOptions
  [kBgCmd.visualMode]: {
    mode: "visual" | "Visual" | "caret" | "Caret" | "line" | "Line" | ""
    richText: boolean
    start: boolean
  } & Req.FallbackOptions
//#endregion
  [kBgCmd.addBookmark]: {
    folder: string; /** (deprecated) */ path: string
    all: true | "window"
  } & LimitedRangeOptions
  [kBgCmd.autoOpenFallback]: Extract<CmdOptions[kFgCmd.autoOpen], { o?: 1 }>
  [kBgCmd.captureTab]: {
    /** 0..100; 0 means .png */ jpeg: number
    /** if true, then ignore .jpeg */ png: boolean
    name: "" | "title"
    show: boolean
  } & Pick<OpenPageUrlOptions, "reuse" | "replace" | "position" | "window">
  [kBgCmd.clearCS]: { type: chrome.contentSettings.ValidTypes }
  [kBgCmd.clearFindHistory]: {}
  [kBgCmd.clearMarks]: { local: boolean; all: boolean }
  [kBgCmd.copyWindowInfo]: UserSedOptions & LimitedRangeOptions & {
    /** (deprecated) */ decoded: boolean
    decode: boolean
    type: "" | "frame" | "browser" | "window" | "tab" | "title" | "url"
    /** default to "${title}: ${url}" */ format: string
    join: "json" | string | boolean
  } & Req.FallbackOptions
  [kBgCmd.createTab]: OpenUrlOptions & { url: string; urls: string[]; evenIncognito: boolean | -1, $pure: boolean }
  [kBgCmd.discardTab]: {}
  [kBgCmd.duplicateTab]: {}
  [kBgCmd.goBackFallback]: Extract<CmdOptions[kFgCmd.framesGoBack], {r?: null}>
  [kBgCmd.goToTab]: { absolute: boolean; noPinned: boolean }
  [kBgCmd.goUp]: { type: "tab" | "frame" } & TrailingSlashOptions & UserSedOptions
  [kBgCmd.joinTabs]: {
    sort: "" | /** time */ true | "time" | "create" | "recency" | "id" | "url" | "host" | "title" | "reverse"
    order: /** split by "," */ ("time" | "rtime" | "recent" | "recency"
          | "host" | "url" | "rhost" | "title" | "create" | "rcreate" | "id" | "window" | "rwindow"
          | "index" | "rindex" | "reverse")[]
    windows: "" | "current" | "all"
  }
  [kBgCmd.mainFrame]: Req.FallbackOptions
  [kBgCmd.moveTab]: { group: "keep" | "ignore" | boolean }
  [kBgCmd.moveTabToNewWindow]: { all: boolean | BOOL }
      & Pick<OpenUrlOptions, "incognito" | "position"> & LimitedRangeOptions
  [kBgCmd.moveTabToNextWindow]: { minimized: false; min: false; end: boolean; right: true | false }
      & Pick<OpenUrlOptions, "position">
  [kBgCmd.openUrl]: OpenUrlOptions & MasksForOpenUrl & {
    urls: string[]; $fmt: 1 | 2
    url: string; url_f: Urls.Url
    copied: boolean | "urls" | "any-urls"; /** has pasted once */ $p: 1
    goNext: boolean | "absolute"; /** for ReuseType.reuse */ prefix: boolean
  } & Ensure<OpenPageUrlOptions, keyof OpenPageUrlOptions>
    & /** for .replace, ReuseType.reuse and JS URLs */ Req.FallbackOptions
  [kBgCmd.reloadTab]: { hard: true; /** (deprecated) */ bypassCache: true; single: boolean } & LimitedRangeOptions
  [kBgCmd.removeRightTab]: LimitedRangeOptions & Req.FallbackOptions
  [kBgCmd.removeTab]: LimitedRangeOptions & {
    highlighted: boolean | "no-current"
    goto: "left" | "right" | "previous"
    /** (deprecated) */ left: boolean
    mayClose: boolean
    /** (deprecated) */ allow_close: boolean
    keepWindow: "at-least-one" | "always"
  } & Req.FallbackOptions
  [kBgCmd.removeTabsR]: {
    filter: "url" | "hash" | "host" | "url+title" | "hash+title" | "host+title"
    other: boolean
  } & Req.FallbackOptions
  [kBgCmd.reopenTab]: Pick<OpenUrlOptions, "group">
  [kBgCmd.restoreGivenTab]: Req.FallbackOptions
  [kBgCmd.restoreTab]: { incognito: "force" | true } & Req.FallbackOptions
  [kBgCmd.runKey]: {
    expect: CommandsNS.EnvItemWithKeys[] | Dict<string | string[]> | `${string}:${string},${string}:${string},`
    keys: string[] | /** space-seperated list */ string
    options?: CommandsNS.EnvItemWithKeys["options"]
  } & Req.FallbackOptions
  [kBgCmd.searchInAnother]: { keyword: string; reuse: UserReuseType } & Req.FallbackOptions
      & OpenUrlOptions & MasksForOpenUrl & OpenPageUrlOptions
  [kBgCmd.sendToExtension]: { id: string; data: any; raw: true } & Req.FallbackOptions
  [kBgCmd.showTip]: { text: string } & Req.FallbackOptions
  [kBgCmd.toggleCS]: { action: "" | "reopen"; incognito: boolean; type: chrome.contentSettings.ValidTypes }
  [kBgCmd.toggleMuteTab]: { all: boolean; other: boolean; others: boolean; mute: boolean } & Req.FallbackOptions
  [kBgCmd.togglePinTab]: LimitedRangeOptions & Req.FallbackOptions
  [kBgCmd.toggleTabUrl]: { keyword: string; parsed: string; reader: boolean } & OpenUrlOptions
  [kBgCmd.toggleVomnibarStyle]: { style: string; current: boolean }
  [kBgCmd.toggleZoom]: { level: number }
  [kBgCmd.visitPreviousTab]: Req.FallbackOptions
  [kBgCmd.closeDownloadBar]: { newWindow?: null | true | false; all: 1 }
}

interface BgCmdInfoMap {
  [kBgCmd.captureTab]: kCmdInfo.ActiveTab
  [kBgCmd.createTab]: kCmdInfo.ActiveTab
  [kBgCmd.discardTab]: kCmdInfo.CurWndTabs
  [kBgCmd.goBackFallback]: kCmdInfo.ActiveTab
  [kBgCmd.goToTab]: kCmdInfo.CurShownTabs | kCmdInfo.CurWndTabs
  [kBgCmd.moveTab]: kCmdInfo.CurShownTabs | kCmdInfo.CurWndTabs
  [kBgCmd.moveTabToNextWindow]: kCmdInfo.ActiveTab
  [kBgCmd.reloadTab]: kCmdInfo.CurWndTabsIfRepeat
  [kBgCmd.removeRightTab]: kCmdInfo.CurWndTabs
  [kBgCmd.removeTabsR]: kCmdInfo.CurWndTabs
  [kBgCmd.reopenTab]: kCmdInfo.ActiveTab
  [kBgCmd.searchInAnother]: kCmdInfo.ActiveTab
  [kBgCmd.toggleCS]: kCmdInfo.ActiveTab
  [kBgCmd.togglePinTab]: kCmdInfo.CurWndTabsIfRepeat
  [kBgCmd.toggleTabUrl]: kCmdInfo.ActiveTab
  [kBgCmd.toggleVomnibarStyle]: kCmdInfo.ActiveTab
  [kBgCmd.visitPreviousTab]: kCmdInfo.CurShownTabs | kCmdInfo.CurWndTabs
}

type UnknownValue = "42" | -0 | false | { fake: 42 } | undefined | null
type CountValueOrRef = number | "count" | "number" | "ready"
type KnownOptions<K extends keyof BgCmdOptions> = {
  [P in keyof BgCmdOptions[K]]?: BgCmdOptions[K][P] | null
}
type UnknownOptions<K extends keyof BgCmdOptions> = {
  readonly [P in keyof BgCmdOptions[K]]?: BgCmdOptions[K][P] | UnknownValue
}

interface MasksForOpenUrl {
  url_mask: string
  /** (deprecated) */ url_mark: string
  host_mask: string; host_mark: string
  tabid_mask: string; tabId_mask: string; tabid_mark: string; tabId_mark: string
  title_mask: string; title_mark: string
  id_mask: string; id_mark: string; id_marker: string
}

interface LimitedRangeOptions {
  limited: boolean
}

declare namespace CommandsNS {
  interface RawOptions extends SafeDict<any> {
    count?: number | string // float factor to scale the `$count` in its default options
    $count?: number // absolute count: will ignore .count if manually specified
    $desc?: string
    $key?: string
    $if?: {
      sys?: string
      browser?: BrowserType
    } | null
  }
  interface Options extends ReadonlySafeDict<any>, SharedPublicOptions, SharedInnerOptions {}
  interface SharedPublicOptions {
    $count?: number
  }
  interface SharedInnerOptions {
    $o?: Options
    $noWarn?: boolean
  }
  interface RawCustomizedOptions extends RawOptions {
    command?: string
  }
  interface RawLinkHintsOptions extends RawOptions {
    mode?: number | string | null
    characters?: string | null
  }
  // encoded info
  interface CustomHelpInfo {
    key_: string; desc_: string; $key_?: undefined
  }
  interface NormalizedCustomHelpInfo {
    $key_: string; $desc_: string
  }
  type BgDescription = [ alias: keyof BgCmdOptions, background: 1, repeat: number, defaultOptions?: {} ]
  type FgDescription = [ alias: keyof CmdOptions, background: 0, repeat: number, defaultOptions?: {} ]
  /** [ enum, is background, count limit, default options ] */
  type Description = BgDescription | FgDescription
  interface BaseHelpItem {
    help_: CustomHelpInfo | NormalizedCustomHelpInfo | null
  }
  interface BaseItem extends BaseHelpItem {
    readonly options_: Options | RawOptions | "__not_parsed__" | null
    readonly repeat_: number
    readonly command_: kCName
  }
  interface NormalizedItem extends BaseItem {
    readonly options_: Options | null
  }
  interface UnnormalizedItem extends BaseItem {
    readonly options_: "__not_parsed__"
    help_: null
  }
  interface ItemWithHelpInfo extends BaseHelpItem {
    help_: NormalizedCustomHelpInfo | null
  }
  type ValidItem = NormalizedItem | UnnormalizedItem
  type Item = ValidItem & ({ readonly alias_: keyof BgCmdOptions; readonly background_: 1
      } | { readonly alias_: keyof CmdOptions; readonly background_: 0 })
  interface EnvItemOptions extends CommandsNS.SharedPublicOptions {}
  interface EnvItemOptions extends Pick<CommandsNS.RawOptions, "count"> {}
}

interface StatefulBgCmdOptions {
  [kBgCmd.createTab]: null
  [kBgCmd.goNext]: "patterns" | "reuse"
  [kBgCmd.openUrl]: "urls" | "group" | "replace"
}
interface SafeStatefulBgCmdOptions {
  [kBgCmd.runKey]: "expect"
  [kBgCmd.showVomnibar]: "mode"
}

type KeysWithFallback<O extends object, K extends keyof O = keyof O> =
    K extends keyof O ? O[K] extends Req.FallbackOptions ? K : never : never
type SafeOptionKeys<O, K extends keyof O = keyof O> =
    K extends keyof O ? K extends `$${string}` ? K extends "$f" | "$retry"? K : never
    : K extends "fallback" ? never : K : never
type OptionalPick<T, K extends keyof T> = { [P in K]?: T[P] | null; };
type CmdOptionSafeToClone<K extends keyof BgCmdOptions | keyof CmdOptions> =
  K extends keyof BgCmdOptions ? OptionalPick<BgCmdOptions[K], SafeOptionKeys<BgCmdOptions[K]>>
  : K extends keyof CmdOptions ? Pick<CmdOptions[K], SafeOptionKeys<CmdOptions[K]>>
  : never

/** must keep plain, because it may be sent to content scripts */
interface CurrentEnvCache {
  fullscreen?: boolean
  url?: string
}

declare const enum CNameLiterals {
  focusOptions = "focusOptions",
  userCustomized = "userCustomized"
}

interface CmdNameIds {
  "LinkHints.activate": kFgCmd.linkHints
  "LinkHints.activateCopyLinkText": kFgCmd.linkHints
  "LinkHints.activateCopyLinkUrl": kFgCmd.linkHints
  "LinkHints.activateDownloadImage": kFgCmd.linkHints
  "LinkHints.activateDownloadLink": kFgCmd.linkHints
  "LinkHints.activateEdit": kFgCmd.linkHints
  "LinkHints.activateHover": kFgCmd.linkHints
  "LinkHints.activateLeave": kFgCmd.linkHints
  "LinkHints.activateMode": kFgCmd.linkHints
  "LinkHints.activateModeToCopyLinkText": kFgCmd.linkHints
  "LinkHints.activateModeToCopyLinkUrl": kFgCmd.linkHints
  "LinkHints.activateModeToDownloadImage": kFgCmd.linkHints
  "LinkHints.activateModeToDownloadLink": kFgCmd.linkHints
  "LinkHints.activateModeToEdit": kFgCmd.linkHints
  "LinkHints.activateModeToHover": kFgCmd.linkHints
  "LinkHints.activateModeToLeave": kFgCmd.linkHints
  "LinkHints.activateModeToOpenImage": kFgCmd.linkHints
  "LinkHints.activateModeToOpenIncognito": kFgCmd.linkHints
  "LinkHints.activateModeToOpenInNewForegroundTab": kFgCmd.linkHints
  "LinkHints.activateModeToOpenInNewTab": kFgCmd.linkHints
  "LinkHints.activateModeToOpenVomnibar": kFgCmd.linkHints
  "LinkHints.activateModeToSearchLinkText": kFgCmd.linkHints
  "LinkHints.activateModeToSelect": kFgCmd.linkHints
  "LinkHints.activateModeToUnhover": kFgCmd.linkHints
  "LinkHints.activateModeWithQueue": kFgCmd.linkHints
  "LinkHints.activateOpenImage": kFgCmd.linkHints
  "LinkHints.activateOpenIncognito": kFgCmd.linkHints
  "LinkHints.activateOpenInNewForegroundTab": kFgCmd.linkHints
  "LinkHints.activateOpenInNewTab": kFgCmd.linkHints
  "LinkHints.activateOpenVomnibar": kFgCmd.linkHints
  "LinkHints.activateSearchLinkText": kFgCmd.linkHints
  "LinkHints.activateSelect": kFgCmd.linkHints
  "LinkHints.activateUnhover": kFgCmd.linkHints
  "LinkHints.activateWithQueue": kFgCmd.linkHints
  "LinkHints.click": kFgCmd.linkHints
  "LinkHints.unhoverLast": kFgCmd.insertMode
  "Marks.activate": kFgCmd.marks
  "Marks.activateCreate": kFgCmd.marks
  "Marks.activateCreateMode": kFgCmd.marks
  "Marks.activateGoto": kFgCmd.marks
  "Marks.activateGotoMode": kFgCmd.marks
  "Marks.clearGlobal": kBgCmd.clearMarks
  "Marks.clearLocal": kBgCmd.clearMarks
  "Vomnibar.activate": kBgCmd.showVomnibar
  "Vomnibar.activateBookmarks": kBgCmd.showVomnibar
  "Vomnibar.activateBookmarksInNewTab": kBgCmd.showVomnibar
  "Vomnibar.activateEditUrl": kBgCmd.showVomnibar
  "Vomnibar.activateEditUrlInNewTab": kBgCmd.showVomnibar
  "Vomnibar.activateHistory": kBgCmd.showVomnibar
  "Vomnibar.activateHistoryInNewTab": kBgCmd.showVomnibar
  "Vomnibar.activateInNewTab": kBgCmd.showVomnibar
  "Vomnibar.activateTabs": kBgCmd.showVomnibar
  "Vomnibar.activateTabSelection": kBgCmd.showVomnibar
  "Vomnibar.activateUrl": kBgCmd.showVomnibar
  "Vomnibar.activateUrlInNewTab": kBgCmd.showVomnibar
  addBookmark: kBgCmd.addBookmark
  autoCopy: kFgCmd.autoOpen
  autoOpen: kFgCmd.autoOpen
  blank: kBgCmd.blank
  captureTab: kBgCmd.captureTab
  clearCS: kBgCmd.clearCS
  clearContentSetting: kBgCmd.clearCS
  clearContentSettings: kBgCmd.clearCS
  clearFindHistory: kBgCmd.clearFindHistory
  closeDownloadBar: kBgCmd.closeDownloadBar
  closeOtherTabs: kBgCmd.removeTabsR
  closeTabsOnLeft: kBgCmd.removeTabsR
  closeTabsOnRight: kBgCmd.removeTabsR
  copyCurrentTitle: kBgCmd.copyWindowInfo
  copyCurrentUrl: kBgCmd.copyWindowInfo
  copyWindowInfo: kBgCmd.copyWindowInfo
  createTab: kBgCmd.createTab
  debugBackground: kBgCmd.openUrl
  discardTab: kBgCmd.discardTab
  duplicateTab: kBgCmd.duplicateTab
  editText: kFgCmd.editText
  enableCSTemp: kBgCmd.toggleCS
  enableContentSettingTemp: kBgCmd.toggleCS
  enterFindMode: kBgCmd.performFind
  enterInsertMode: kBgCmd.insertMode
  enterVisualLineMode: kBgCmd.visualMode
  enterVisualMode: kBgCmd.visualMode
  firstTab: kBgCmd.goToTab
  focusInput: kFgCmd.focusInput
  focusOrLaunch: kBgCmd.openUrl
  goBack: kFgCmd.framesGoBack
  goForward: kFgCmd.framesGoBack
  goNext: kBgCmd.goNext
  goPrevious: kBgCmd.goNext
  goToRoot: kBgCmd.goUp
  goUp: kBgCmd.goUp
  joinTabs: kBgCmd.joinTabs
  lastTab: kBgCmd.goToTab
  mainFrame: kBgCmd.mainFrame
  moveTabLeft: kBgCmd.moveTab
  moveTabRight: kBgCmd.moveTab
  moveTabToIncognito: kBgCmd.moveTabToNewWindow
  moveTabToNewWindow: kBgCmd.moveTabToNewWindow
  moveTabToNextWindow: kBgCmd.moveTabToNextWindow
  newTab: kBgCmd.createTab
  nextFrame: kBgCmd.nextFrame
  nextTab: kBgCmd.goToTab
  openCopiedUrlInCurrentTab: kBgCmd.openUrl
  openCopiedUrlInNewTab: kBgCmd.openUrl
  openUrl: kBgCmd.openUrl
  parentFrame: kBgCmd.parentFrame
  passNextKey: kFgCmd.passNextKey
  performAnotherFind: kBgCmd.performFind
  performBackwardsFind: kBgCmd.performFind
  performFind: kBgCmd.performFind
  previousTab: kBgCmd.goToTab
  quickNext: kBgCmd.goToTab
  reload: kFgCmd.framesGoBack
  reloadGivenTab: kBgCmd.reloadTab
  reloadTab: kBgCmd.reloadTab
  removeRightTab: kBgCmd.removeRightTab
  removeTab: kBgCmd.removeTab
  reopenTab: kBgCmd.reopenTab
  reset: kFgCmd.insertMode
  restoreGivenTab: kBgCmd.restoreGivenTab
  restoreTab: kBgCmd.restoreTab
  runKey: kBgCmd.runKey
  scrollDown: kFgCmd.scroll
  scrollFullPageDown: kFgCmd.scroll
  scrollFullPageUp: kFgCmd.scroll
  scrollLeft: kFgCmd.scroll
  scrollPageDown: kFgCmd.scroll
  scrollPageUp: kFgCmd.scroll
  scrollPxDown: kFgCmd.scroll
  scrollPxLeft: kFgCmd.scroll
  scrollPxRight: kFgCmd.scroll
  scrollPxUp: kFgCmd.scroll
  scrollRight: kFgCmd.scroll
  scrollSelect: kFgCmd.scrollSelect
  scrollTo: kFgCmd.scroll
  scrollToBottom: kFgCmd.scroll
  scrollToLeft: kFgCmd.scroll
  scrollToRight: kFgCmd.scroll
  scrollToTop: kFgCmd.scroll
  scrollUp: kFgCmd.scroll
  searchAs: kFgCmd.autoOpen
  searchInAnother: kBgCmd.searchInAnother
  sendToExtension: kBgCmd.sendToExtension
  showHelp: kBgCmd.showHelp
  simBackspace: kFgCmd.focusInput
  simulateBackspace: kFgCmd.focusInput
  sortTabs: kBgCmd.joinTabs
  switchFocus: kFgCmd.focusInput
  toggleCS: kBgCmd.toggleCS
  toggleContentSetting: kBgCmd.toggleCS
  toggleLinkHintCharacters: kBgCmd.toggle
  toggleMuteTab: kBgCmd.toggleMuteTab
  togglePinTab: kBgCmd.togglePinTab
  toggleReaderMode: kBgCmd.toggleTabUrl
  toggleStyle: kFgCmd.toggleStyle
  toggleSwitchTemp: kBgCmd.toggle
  toggleViewSource: kBgCmd.toggleTabUrl
  toggleVomnibarStyle: kBgCmd.toggleVomnibarStyle
  showTip: kBgCmd.showTip
  visitPreviousTab: kBgCmd.visitPreviousTab
  wait: kBgCmd.blank
  zoomIn: kBgCmd.toggleZoom
  zoomOut: kBgCmd.toggleZoom
  zoomReset: kBgCmd.toggleZoom
}
type kCName = keyof CmdNameIds

declare const enum kShortcutAliases { nextTab1 = "quickNext" }
type StandardShortcutNames = "createTab" | "goBack" | "goForward" | "previousTab"
    | "nextTab" | "reloadTab" | CNameLiterals.userCustomized
