import {
  chromeVer_, doc, esc, fgCache, isTop, set_esc, VTr, safer, timeout_, loc_, weakRef_, deref_,
  keydownEvents_, parseSedOptions, Stop_, suppressCommonEvents, setupEventListener, vApi, locHref, isTY, max_, min_,
  OnChrome, OnFirefox, OnEdge, firefoxVer_, safeCall, parseOpenPageUrlOptions
} from "../lib/utils"
import {
  isHTML_, htmlTag_, createElement_, querySelectorAll_unsafe_, SafeEl_not_ff_, docEl_unsafe_, MDW, CLK,
  querySelector_unsafe_, DAC, removeEl_s, appendNode_s, setClassName_s, INP, contains_s, toggleClass_s, modifySel,
  focus_, testMatch, docHasFocus_
} from "../lib/dom_utils"
import {
  pushHandler_, removeHandler_, getMappedKey, prevent_, isEscape_, keybody_, DEL, BSP, ENTER, handler_stack,
  replaceOrSuppressMost_
} from "../lib/keyboard_utils"
import {
  view_, wndSize_, isNotInViewport, getZoom_, prepareCrop_, getViewBox_, padClientRect_, isSelARange,
  getBoundingClientRect_, setBoundary_, wdZoom_, dScale_
} from "../lib/rect"
import { post_, set_contentCommands_, runFallbackKey } from "./port"
import {
  addElementList, ensureBorder, evalIfOK, getSelected, getSelectionText, getParentVApi, curModalElement, createStyle,
  getBoxTagName_old_cr, setupExitOnClick, addUIElement, removeSelection, ui_root, kExitOnClick, collpaseSelection,
  hideHelp, set_hideHelp, set_helpBox, checkHidden,
} from "./dom_ui"
import { hudHide, hudShow, hudTip, hud_text } from "./hud"
import { onKeyup2, set_onKeyup2, passKeys, set_nextKeys, set_passKeys, keyFSM } from "./key_handler"
import { InputHintItem, activate as linkActivate, clear as linkClear, kSafeAllSelector } from "./link_hints"
import { activate as markActivate } from "./marks"
import { FindAction, activate as findActivate, deactivate as findDeactivate, execCommand } from "./mode_find"
import {
  exitInputHint, insert_inputHint, insert_last_, raw_insert_lock, insert_Lock_, resetInsert, set_is_last_mutable,
  set_inputHint, set_insert_global_, set_isHintingInput, set_insert_last_, onWndBlur, exitPassMode, set_exitPassMode,
} from "./insert"
import { activate as visualActivate, deactivate as visualDeactivate } from "./visual"
import {
  activate as scActivate, set_cachedScrollable, onActivate, currentScrolling, set_currentScrolling
} from "./scroller"
import { activate as omniActivate, hide as omniHide } from "./omni"
import { findNextInText, findNextInRel } from "./pagination"
import { traverse, getEditable, filterOutNonReachable } from "./local_links"
import {
  select_, unhover_async, set_lastHovered_, hover_async, lastHovered_, catchAsyncErrorSilently
} from "./async_dispatcher"
/* eslint-disable @typescript-eslint/no-floating-promises */

export const RSC = "readystatechange"

set_contentCommands_([
  /* kFgCmd.framesGoBack: */ (options: CmdOptions[kFgCmd.framesGoBack], rawStep?: number): void => {
    const maxStep = min_(rawStep! < 0 ? -rawStep! : rawStep!, history.length - 1),
    reuse = (options as Extract<typeof options, {r?: null}>).reuse,
    realStep = rawStep! < 0 ? -maxStep : maxStep;
    if (options.r) {
      timeout_((): void => {
        if (!options.url) {
          if (checkHidden(kFgCmd.framesGoBack, options as typeof options & SafeObject, 1)) { return }
          loc_.reload(!!options.hard)
        } else {
          loc_.href = options.url
        }
        runFallbackKey(options, !1)
      }, 17)
    }
    else if ((OnChrome ? Build.MinCVer >= BrowserVer.Min$tabs$$goBack
              : OnFirefox ? Build.MinFFVer >= FirefoxBrowserVer.Min$tabs$$goBack : !OnEdge)
        || (OnChrome && chromeVer_ > BrowserVer.Min$tabs$$goBack - 1
              || OnFirefox && firefoxVer_ > FirefoxBrowserVer.Min$tabs$$goBack - 1
            ) && maxStep > 1 && !reuse
        || maxStep && reuse && reuse !== "current" // then reuse !== ReuseType.current
    ) {
      // maxStep > 1 && reuse == null || maxStep && reuse && !isCurrent
      post_({ H: kFgReq.framesGoBack, s: realStep, o: options })
    } else {
      maxStep && history.go(realStep);
      runFallbackKey(options, maxStep ? !1 : 2)
    }
  },
  /* kFgCmd.findMode: */ findActivate,
  /* kFgCmd.linkHints: */ linkActivate,
  /* kFgCmd.marks: */ markActivate,
  /* kFgCmd.scroll: */ scActivate,
  /* kFgCmd.visualMode: */ visualActivate,
  /* kFgCmd.vomnibar: */ omniActivate,
  /* kFgCmd.insertMode: */ (opt: CmdOptions[kFgCmd.insertMode]): void => {
    if (opt.u) {
      catchAsyncErrorSilently(unhover_async()).then((): void => {
        hudTip(kTip.didUnHoverLast)
      })
    }
    if (opt.r) {
      set_cachedScrollable(0), set_currentScrolling(null)
      hover_async()
      resetInsert(), linkClear((2 - opt.r) as BOOL), visualDeactivate && visualDeactivate()
      findDeactivate && findDeactivate(FindAction.ExitNoAnyFocus)
      omniHide(), hideHelp && hideHelp()
      onWndBlur()
    }
    if (opt.i) {
      set_insert_global_(opt)
      opt.h && hudShow(kTip.raw, opt.h)
    }
  },

  /* kFgCmd.toggle: */ (options: CmdOptions[kFgCmd.toggle]): void => {
    const key = options.k, backupKey = "_" + key as typeof key,
    cache = safer(fgCache), cur = cache[key];
    let val = options.v, u: undefined;
    if (val === null && (cur === !!cur)) {
      val = !cur;
    }
    if (cache[backupKey] === u) {
      (cache as Generalized<typeof cache>)[backupKey] = cur;
    } else if (cur === val) {
      val = cache[backupKey];
      cache[backupKey] = u as never;
    }
    (cache as Generalized<typeof cache>)[key] = val as typeof cur;
    let notBool = val !== !!val;
    options.n && hudTip(notBool ? kTip.useVal : val ? kTip.turnOn : kTip.turnOff,
        1000, [options.n, notBool ? JSON.stringify(val) : ""]);
  },
  /* kFgCmd.passNextKey: */ (options: CmdOptions[kFgCmd.passNextKey], count0: number): void => {
    let keyCount = 0, count = count0 > 0 ? count0 : -count0
    if (!!options.normal === (count0 > 0)) {
      esc!(HandlerResult.ExitPassMode); // singleton
      if (!passKeys) {
        return hudTip(kTip.noPassKeys);
      }
      const oldEsc = esc!, oldPassKeys = passKeys;
      set_passKeys(null)
      set_esc((i: HandlerResult): HandlerResult => {
        if (i === HandlerResult.Prevent && 0 >= --count || i === HandlerResult.ExitPassMode) {
          hudHide();
          set_passKeys(oldPassKeys)
          set_esc(oldEsc)
          return oldEsc(HandlerResult.Prevent);
        }
        oldEsc(HandlerResult.Nothing)
        set_nextKeys(keyFSM)
        if (keyCount - count || !hud_text) {
          keyCount = count;
          hudShow(kTip.normalMode, count > 1 ? VTr(kTip.nTimes, [count]) : "")
        }
        return i;
      })
      esc!(HandlerResult.Nothing);
      return;
    }
    const keys = safer<{ [keyCode in kKeyCode]: BOOL }>({})
    replaceOrSuppressMost_(kHandler.passNextKey, event => {
      keyCount += +!keys[event.i];
      keys[event.i] = 1;
      return HandlerResult.PassKey;
    })
    set_onKeyup2((event): void => {
      if (keyCount === 0 || --keyCount || --count) {
        keys[event && event.keyCode] = 0
        hudShow(kTip.passNext, count > 1 ? VTr(kTip.nTimes, [count]) : "");
      } else {
        exitPassMode!();
      }
    })
    onKeyup2!(<0> kKeyCode.None)
    set_exitPassMode((): void => {
      set_exitPassMode(null)
      set_onKeyup2(null)
      removeHandler_(kHandler.passNextKey)
      hudHide();
    })
  },
  /* kFgCmd.goNext: */ (req: CmdOptions[kFgCmd.goNext]): void => {
    let parApi: VApiTy | null | void, chosen: GoNextBaseCandidate | false | 0 | null
    if (!isTop && (parApi = getParentVApi())
        && !parApi.a(keydownEvents_)) {
      parApi.f(kFgCmd.goNext, req as CmdOptions[kFgCmd.goNext] & FgOptions, 1)
    } else if (chosen = isHTML_()
        && (req.r && findNextInRel(req.r) || req.p.length && findNextInText(req.p, req))) {
      chosen[1].j(chosen[0])
    } else {
      runFallbackKey(req, kTip.noLinksToGo, VTr(kTip.prev + <number> <boolean | number> req.n))
    }
  },
  /* kFgCmd.autoOpen: */ (options: CmdOptions[kFgCmd.autoOpen]): void => {
    const selected = options.selected, opts2 = parseOpenPageUrlOptions(options),
    str = options.s && !selected ? "" : getSelectionText(1) || (options.text || "") + "",
    url = str.trim(), copied = options.copied
    options.copy && (url || !options.o) && post_({
      H: kFgReq.copy,
      s: str as never as undefined,
      e: parseSedOptions(options),
      u: (str ? "" : options.url ? vApi.u() : doc.title) as "url",
      d: options.decoded || options.decode
    })
    options.o && (url && evalIfOK(url) || post_({
      H: kFgReq.openUrl, c: copied, u: url, o: opts2, n: options
    }))
    options.s && !options.o && post_({
      H: kFgReq.searchAs, u: vApi.u(), c: copied, t: selected ? url : "", o: opts2, n: options
    })
  },
  /* kFgCmd.focusInput: */ (options: CmdOptions[kFgCmd.focusInput], count: number): void => {
    const S = "IH IHS"
    const act = options.act || options.action, known_last = deref_(insert_last_);
    OnFirefox && insert_Lock_()
    if (act && (act[0] !== "l" || known_last && !raw_insert_lock)) {
      let newEl: LockableElement | null | undefined = raw_insert_lock, ret: BOOL = 1;
      if (newEl) {
        if (act === BSP) {
          if (view_(newEl)) { execCommand(DEL, doc); }
        } else {
          set_insert_last_(weakRef_(newEl))
          set_is_last_mutable(0)
          newEl.blur();
        }
      } else if (!(newEl = known_last)) {
        runFallbackKey(options, kTip.noFocused)
      } else if (act !== "last-visible" && view_(newEl) || !isNotInViewport(newEl)) {
        set_insert_last_(null)
        set_is_last_mutable(1)
        getZoom_(newEl);
        prepareCrop_();
        select_(newEl, null, !!options.flash, options.select, true);
      } else if (act[0] === "l") {
        ret = 0;
      } else {
        runFallbackKey(options, kTip.focusedIsHidden)
      }
      if (ret) {
        return;
      }
    }
    insert_inputHint && (insert_inputHint.h = null as never);
    const arr = getViewBox_()
    prepareCrop_(1);
    interface InputHint { [0]: InputHintItem["d"]; [1]: Rect }
    // here those editable and inside UI root are always detected, in case that a user modifies the shadow DOM
    const visibleInputs = traverse(!OnFirefox
          ? VTr(kTip.editableSelector) + kSafeAllSelector : VTr(kTip.editableSelector), options, getEditable
        ) as InputHint[],
    action = options.select, keep = options.keep, pass = options.passExitKey, reachable = options.reachable;
    if (reachable != null ? reachable : fgCache.e) {
      curModalElement || filterOutNonReachable(visibleInputs as Hint[], 1)
    }
    let sel = visibleInputs.length, firstInput = visibleInputs[0]
    if (sel < 2) {
      exitInputHint();
      sel && select_(firstInput[0], firstInput[1], true, action, true)
      runFallbackKey(options, sel ? 0 : kTip.noInputToFocus)
      return
    }
    let preferredSelector = (options.prefer || "") + ""
    preferredSelector && safeCall(testMatch, preferredSelector, firstInput) == null && (preferredSelector = "")
    for (let ind = 0; ind < sel; ind++) {
      const hint = visibleInputs[ind] as Hint & InputHint, j = hint[0].tabIndex;
      hint[2] = preferredSelector && testMatch(preferredSelector, hint)
          ? (OnChrome ? Build.MinCVer >= BrowserVer.MinStableSort : !OnEdge) ? 0.5 : 0.5 + ind / 8192
          : j < 1 ? -ind
          : (OnChrome ? Build.MinCVer >= BrowserVer.MinStableSort : !OnEdge)
          ? j : j + ind / 8192;
    }
    const hints: InputHintItem[] = (visibleInputs as Array<Hint & InputHint>).sort(
        (a, b) => a[2] < 1 || b[2] < 1 ? b[2] - a[2] : a[2] - b[2]).map(
          (link): InputHintItem => {
      const marker = createElement_("span") as InputHintItem["m"],
      rect = padClientRect_(getBoundingClientRect_(link[0]), 3);
      rect.l--, rect.t--, rect.r--, rect.b--;
      setClassName_s(marker, "IH")
      setBoundary_(marker.style, rect);
      return {m: marker, d: link[0]};
    })
    if (count === 1 && known_last) {
      if (OnChrome && Build.MinCVer < BrowserVer.Min$Array$$find$$findIndex) {
        sel = max_(0, hints.map(link => link.d).indexOf(known_last))
      } else {
        sel = max_(0, hints.findIndex(link => link.d === known_last))
      }
    } else {
      sel = count > 0 ? min_(count, sel) - 1 : max_(0, sel + count);
    }
    setClassName_s(hints[sel].m, S)
    ensureBorder(wdZoom_ / dScale_);
    select_(hints[sel].d, visibleInputs[sel][1], false, action, false).then((): void => {
      insert_inputHint!.b = addElementList<false>(hints, arr)
    })
    exitInputHint();
    set_inputHint({ b: null, h: hints })
    pushHandler_((event): HandlerResult => {
      const keyCode = event.i, isIME = keyCode === kKeyCode.ime, repeat = event.e.repeat,
      key = isIME || repeat ? "" : getMappedKey(event, kModeId.Insert)
      if (OnFirefox && !insert_Lock_()) {
        exitInputHint()
        return HandlerResult.Prevent
      }
      if (key === kChar.tab || key === `s-${kChar.tab}`) {
        const hints2 = insert_inputHint!.h, oldSel = sel, len = hints2.length;
        sel = (oldSel + (key < "t" ? len - 1 : 1)) % len;
        set_isHintingInput(1)
        prevent_(event.e); // in case that selecting is too slow
        select_(hints2[sel].d, null, false, action).then((): void => {
          set_isHintingInput(0)
          setClassName_s(hints2[oldSel].m, "IH")
          setClassName_s(hints2[sel].m, S)
        })
        return HandlerResult.Prevent;
      }
      // check `!key` for mapModifier
      else if (!key && (keyCode === kKeyCode.shiftKey || keep && (keyCode === kKeyCode.altKey
                        || keyCode === kKeyCode.ctrlKey
                        || keyCode > kKeyCode.maxNotMetaKey && keyCode < kKeyCode.minNotMetaKeyOrMenu))
              || repeat) {
        return HandlerResult.Nothing;
      }
      else if (keep ? isEscape_(key) || (
          keybody_(key) === ENTER
          && (/* a?c?m?-enter */ key < "s" && (key[0] !== "e" || htmlTag_(insert_inputHint!.h[sel].d) === INP))
        ) : !isIME && keyCode !== kKeyCode.f12
      ) {
        exitInputHint();
        return !isEscape_(key) ? HandlerResult.Nothing : keep || !raw_insert_lock ? HandlerResult.Prevent
          : pass ? HandlerResult.PassKey : HandlerResult.Nothing;
      } else {
        return HandlerResult.Nothing;
      }
    }, kHandler.focusInput)
  },
  /* kFgCmd.editText: */ (options: CmdOptions[kFgCmd.editText], count: number) => {
    const editable = insert_Lock_();
    (editable || options.dom) && timeout_((): void => {
      let commands = options.run.split(<RegExpG> /,\s*/g), sel: Selection | undefined;
      while (0 < count--) {
        for (let i = 0; i < commands.length; i += 3) {
          const cmd = commands[i], a1 = commands[i + 1], a2 = commands[i + 2]
          if (cmd === "exec") {
            execCommand(a1, doc, commands[i + 2])
          } else if (cmd === "replace") {
            (editable as HTMLInputElement).setRangeText(a1, null, null, a2)
          } else if (sel = sel || getSelected(), cmd === "collapse") {
            collpaseSelection(sel, a1 === "end")
          } else {
            modifySel(sel, cmd === "auto" ? isSelARange(sel) : cmd < kChar.f, a1 > kChar.f, a2 as any)
          }
        }
      }
      runFallbackKey(options, 0)
    }, 0);
  },
  /* kFgCmd.scrollSelect: */ (options: CmdOptions[kFgCmd.scrollSelect], count: number): void => {
    const { dir, position: pos } = options
    const el = insert_Lock_() as HTMLSelectElement | null
    if (!el || htmlTag_(el) !== "select") { return }
    let max = el.options.length
      , absCount = count > 0 ? count : -count, step: number
    if (pos) {
      step = (pos > "e" && pos < "m" && pos !== "home") === count > 0 ? max - absCount : absCount - 1
    } else {
      step = el.selectedIndex + (isTY(dir) ? dir > "p" ? -1 : 1 : dir || 1) * count
    }
    step = step >= max ? max - 1 : step < 0 ? 0 : step
    el.selectedIndex = step
    runFallbackKey(options, 0)
  },
  /* kFgCmd.toggleStyle: */ (options: CmdOptions[kFgCmd.toggleStyle]): void => {
    let id = options.id, nodes = querySelectorAll_unsafe_(id ? "#" + id : options.selector!),
    el = nodes && nodes[0], par: SafeElement | null
    if (el) {
      (el as HTMLStyleElement | HTMLLinkElement).disabled = !(el as HTMLStyleElement | HTMLLinkElement).disabled
    } else if (id) {
      el = createStyle(options.css!)
      el.id = id
      par = OnFirefox ? (doc.head || docEl_unsafe_()) as SafeElement | null : SafeEl_not_ff_!(doc.head)
      par && appendNode_s(par, el)
    }
    (el || id) && runFallbackKey(options, 0)
  },
  /* kFgCmd.showHelpDialog: */ ((options: Exclude<CmdOptions[kFgCmd.showHelpDialog], {h?: null}>): any => {
    // Note: not suppress key on the top, because help dialog may need a while to render,
    // and then a keyup may occur before or after it
    const html = options.h, notHTML = !isHTML_()
    if (hideHelp || html && notHTML) { hideHelp && hideHelp(); return }
    if (!html) {
      isTop && notHTML || post_({ H: kFgReq.initHelp,
          a: options as CmdOptions[kFgCmd.showHelpDialog] as ShowHelpDialogOptions,
          w: wndSize_(1) < 400 || wndSize_() < 320 || notHTML })
      return
    }
    let shouldShowAdvanced = options.c, optionUrl = options.o
    const outerBox = createElement_(OnChrome
        && Build.MinCVer < BrowserVer.MinForcedColorsMode ? getBoxTagName_old_cr() : "div")
    setClassName_s(outerBox, "R H" + fgCache.d)
    let box: SafeHTMLElement
    if (OnFirefox) {
      // on FF66, if a page is limited by "script-src 'self'; style-src 'self'"
      //   then `<style>`s created by `.innerHTML = ...` has no effects;
      //   so need `doc.createElement('style').textContent = ...`
      box = new DOMParser().parseFromString((html as Exclude<typeof html, string>).b, "text/html"
          ).body.firstChild as SafeHTMLElement
      box.prepend!(createStyle((html as Exclude<typeof html, string>).h))
      outerBox.append!(box)
    } else {
      outerBox.innerHTML = html as string
      box = outerBox.lastChild as SafeHTMLElement
    }
    box.onclick = Stop_
    suppressCommonEvents(box, MDW)
    if (!OnChrome || Build.MinCVer >= BrowserVer.MinMayNoDOMActivateInClosedShadowRootPassedToFrameDocument
        || chromeVer_ > BrowserVer.MinMayNoDOMActivateInClosedShadowRootPassedToFrameDocument - 1) {
      setupEventListener(box, OnChrome ? DAC : CLK, onActivate)
    }

    const closeBtn = querySelector_unsafe_("#HCls", box) as HTMLElement,
    optLink = querySelector_unsafe_("#HOpt", box) as HTMLAnchorElement,
    advCmd = querySelector_unsafe_("#HAdv", box) as HTMLElement,
    toggleAdvanced = (): void => {
      const el2 = advCmd.firstChild as HTMLElement
      el2.innerText = el2.dataset["sh"[+shouldShowAdvanced] as "s" | "h"]!
      toggleClass_s(box, "HelpDA")
    }
    set_hideHelp(closeBtn.onclick = (event?: EventToPrevent): void => {
      set_hideHelp(null)
      set_helpBox(null)
      event && prevent_(event)
      advCmd.onclick = optLink.onclick = closeBtn.onclick = null as never
      let i: Element | null | undefined = deref_(lastHovered_)
      i && contains_s(outerBox, i) && set_lastHovered_(null)
      if ((i = deref_(currentScrolling)) && contains_s(box, i)) {
        set_currentScrolling(null)
        set_cachedScrollable(0)
      }
      removeHandler_(kHandler.helpDialog)
      removeEl_s(outerBox)
      setupExitOnClick(kExitOnClick.helpDialog | kExitOnClick.REMOVE)
      closeBtn.click()
    })
    if (! locHref().startsWith(optionUrl)) {
      optLink.href = optionUrl
      optLink.onclick = event => {
        post_({ H: kFgReq.focusOrLaunch, u: optionUrl })
        hideHelp!(event)
      }
    } else {
      removeEl_s(optLink)
    }
    advCmd.onclick = event => {
      prevent_(event)
      shouldShowAdvanced = !shouldShowAdvanced
      toggleAdvanced()
      post_({ H: kFgReq.setSetting, k: 0, v: shouldShowAdvanced })
    }
    shouldShowAdvanced && toggleAdvanced()
    ensureBorder(wdZoom_) // safe to skip `getZoom_`
    addUIElement(outerBox, AdjustType.Normal, true)
    options.e && setupExitOnClick(kExitOnClick.helpDialog)
    docHasFocus_() || vApi.f()
    set_currentScrolling(weakRef_(box))
    set_helpBox(box)
    handler_stack.splice((handler_stack.indexOf(kHandler.omni) + 1 || handler_stack.length + 2) - 2, 0, event => {
      if (!insert_Lock_() && isEscape_(getMappedKey(event, kModeId.Normal))) {
        removeSelection(ui_root) || hideHelp!()
        return HandlerResult.Prevent
      }
      return HandlerResult.Nothing
    }, kHandler.helpDialog)
    // if no [tabindex=0], `.focus()` works if :exp and since MinElement$Focus$MayMakeArrowKeySelectIt or on Firefox
    timeout_((): void => { focus_(box) }, 17)
  }) as (options: CmdOptions[kFgCmd.showHelpDialog]) => void
])
