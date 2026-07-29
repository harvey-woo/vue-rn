// src/web/index.ts
import { createApp as vueCreateApp } from "vue";

// src/web/stylesheet.ts
var _injected = false;
var STYLE_ID = "__rasen_stylesheet__";
var classCache = /* @__PURE__ */ new Map();
var counter = 0;
function nextClass() {
  return `r-${(++counter).toString(36)}`;
}
var UNITLESS = {
  flex: true,
  flexGrow: true,
  flexShrink: true,
  opacity: true,
  zIndex: true,
  fontWeight: true,
  aspectRatio: true
};
var SHORTHANDS = {
  paddingHorizontal: ["paddingLeft", "paddingRight"],
  paddingVertical: ["paddingTop", "paddingBottom"],
  marginHorizontal: ["marginLeft", "marginRight"],
  marginVertical: ["marginTop", "marginBottom"]
};
function expandKey(key) {
  return SHORTHANDS[key] ?? [key];
}
function cssVal(key, value) {
  if (typeof value === "number" && !(key in UNITLESS)) return `${value}px`;
  return String(value);
}
function camelToKebab(key) {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
function expandRule(key, value) {
  return expandKey(key).map((k) => [camelToKebab(k), cssVal(key, value)]);
}
var sheet = null;
function getSheet() {
  if (typeof document === "undefined") return null;
  if (sheet) return sheet;
  const el = document.getElementById(STYLE_ID);
  if (el) {
    sheet = el.sheet;
    return sheet;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  document.head.appendChild(style);
  sheet = style.sheet;
  return sheet;
}
function inject(rule) {
  const s = getSheet();
  if (!s) return;
  try {
    s.insertRule(rule, s.cssRules.length);
  } catch {
  }
}
function compileAtomic(key, value) {
  const ck = `${key}:${String(value)}`;
  const cached = classCache.get(ck);
  if (cached) return cached;
  const pairs = expandRule(key, value);
  if (!pairs.length) return null;
  const cn = nextClass();
  for (const [k, v] of pairs) inject(`.${cn}{${k}:${v}}`);
  classCache.set(ck, cn);
  return cn;
}
var StyleSheet = {
  create(styles) {
    const r = {};
    for (const [name, rules] of Object.entries(styles)) {
      const cls = [];
      for (const [k, v] of Object.entries(rules)) {
        if (v == null) continue;
        const c = compileAtomic(k, v);
        if (c) cls.push(c);
      }
      r[name] = { className: cls.join(" "), $$css: true };
    }
    return r;
  },
  resolve(styles) {
    let cls = "";
    let inline = null;
    for (const s of styles) {
      if (!s) continue;
      if (s.$$css) {
        cls += s.className + " ";
      } else if (typeof s === "object") {
        for (const [k, v] of Object.entries(s)) {
          if (v == null) continue;
          if (!inline) inline = {};
          for (const [ck, cv] of expandRule(k, v)) inline[ck] = cv;
        }
      }
    }
    return [cls.trim(), inline];
  },
  injectKeyframes(name, css) {
    inject(`@keyframes ${name}{${css}}`);
  }
};
function injectReset() {
  if (_injected) return;
  _injected = true;
  const rules = [
    "body{margin:0}",
    "html{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0)}",
    "input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none}",
    "button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}"
  ];
  for (const r of rules) inject(r);
  StyleSheet.injectKeyframes("rasen-spin", "0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}");
}

// src/web/components/View.ts
import { defineComponent } from "vue";

// src/web/create-element.ts
import { h } from "vue";
var TAG_MAP = {
  View: "div",
  Text: "span",
  Image: "img",
  TextInput: "input",
  ScrollView: "div",
  SafeAreaView: "div",
  ActivityIndicator: "div",
  Switch: "div"
};
var EVENT_MAP = {
  onTouchEnd: "onClick",
  onPress: "onClick",
  onPressIn: "onMouseDown",
  onPressOut: "onMouseUp",
  onLongPress: "onContextMenu",
  onChange: "onChange",
  onFocus: "onFocus",
  onBlur: "onBlur",
  onSubmitEditing: "onSubmit",
  onKeyPress: "onKeyDown",
  onLayout: "",
  // skipped
  onContentSizeChange: "",
  onTouchStart: "onTouchStart",
  onTouchMove: "onTouchMove",
  onTouchCancel: "onTouchCancel"
};
var ATTR_MAP = {
  accessibilityLabel: "aria-label",
  accessibilityRole: "role",
  testID: "data-testid",
  nativeID: "id"
};
function resolveStyle(style) {
  if (!style) return ["", null];
  if (Array.isArray(style)) return StyleSheet.resolve(style);
  if (style.$$css) return [style.className, null];
  return StyleSheet.resolve([style]);
}
var A11Y_MAP = {
  disabled: "aria-disabled",
  selected: "aria-selected",
  checked: "aria-checked",
  expanded: "aria-expanded",
  busy: "aria-busy",
  hidden: "aria-hidden"
};
function resolveA11Y(state) {
  const r = {};
  for (const [k, v] of Object.entries(state)) {
    r[A11Y_MAP[k] ?? k] = v;
  }
  return r;
}
function createElement(type, props, _children) {
  const tag = TAG_MAP[type] ?? type;
  if (!props) return h(tag, {}, _children);
  if (type === "TextInput" && props.multiline === true) {
    return createElement("textarea", { ...props, multiline: void 0, type: void 0 }, _children);
  }
  const [className, inlineStyle] = resolveStyle(props.style);
  const a = {};
  let hasClass = false;
  for (const [key, value] of Object.entries(props)) {
    if (key === "style" || key === "children" || key === "key") continue;
    if (key === "class" || key === "className") {
      if (value) a.class = className ? `${className} ${value}` : value;
      hasClass = true;
      continue;
    }
    if (key.startsWith("on")) {
      const mapped = EVENT_MAP[key];
      if (mapped === "") continue;
      const domKey2 = mapped ?? key;
      if (typeof value === "function") a[domKey2] = value;
      continue;
    }
    if (key === "accessibilityState" && typeof value === "object" && value) {
      Object.assign(a, resolveA11Y(value));
      continue;
    }
    if (key === "source" && type === "Image") {
      const src = value?.uri ?? value?.url ?? value;
      if (src) a.src = String(src);
      continue;
    }
    if (key === "resizeMode" && type === "Image") {
      a.style = { ...a.style || {}, objectFit: { cover: "cover", contain: "contain", stretch: "fill", center: "none" }[String(value)] ?? value };
      continue;
    }
    if (key === "secureTextEntry") {
      if (value) a.type = "password";
      continue;
    }
    if (key === "numberOfLines") {
      const n = Number(value);
      a.style = { ...a.style || {}, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: n, WebkitBoxOrient: "vertical" };
      continue;
    }
    if (key === "href" || key === "target" || key === "rel") {
      a[key] = value;
      continue;
    }
    const domKey = ATTR_MAP[key] ?? key;
    const SKIP = [
      "$$css",
      "multiline",
      "numberOfLines",
      "resizeMode",
      "source",
      "accessibilityState",
      "accessibilityLabel",
      "accessibilityRole",
      "testID",
      "nativeID",
      "secureTextEntry"
    ];
    if (!SKIP.includes(key)) a[domKey] = value;
  }
  if (!hasClass && className) a.class = className;
  if (inlineStyle) {
    const existing = a.style;
    a.style = existing ? { ...existing, ...inlineStyle } : inlineStyle;
  }
  return h(tag, a, _children);
}

// src/web/components/View.ts
var base = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "black",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    justifyContent: "flex-start",
    listStyle: "none",
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    textDecoration: "none",
    zIndex: 0
  }
});
var View = defineComponent({
  name: "View",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    href: String,
    target: String,
    rel: String,
    id: String,
    tabIndex: [Number, String],
    testID: String,
    accessibilityLabel: String,
    accessibilityRole: String,
    accessibilityState: Object,
    onTouchEnd: Function,
    onTouchStart: Function,
    onTouchMove: Function,
    onPress: Function,
    onLayout: Function
  },
  setup(props, { slots, attrs }) {
    return () => createElement("View", {
      ...attrs,
      ...props,
      style: [base.root, props.style]
    }, slots.default?.());
  }
});

// src/web/components/Text.ts
import { defineComponent as defineComponent2 } from "vue";
var base2 = StyleSheet.create({
  root: {
    color: "inherit",
    display: "inline",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    letterSpacing: "normal",
    lineHeight: 1.4,
    margin: 0,
    padding: 0,
    textAlign: "left",
    textDecoration: "none",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word"
  }
});
var Text = defineComponent2({
  name: "Text",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    numberOfLines: [Number, String],
    selectable: Boolean,
    id: String,
    testID: String,
    accessibilityLabel: String,
    accessibilityRole: String,
    href: String,
    target: String,
    rel: String,
    onPress: Function,
    onTouchEnd: Function,
    onLayout: Function
  },
  setup(props, { slots, attrs }) {
    return () => createElement("Text", {
      ...attrs,
      ...props,
      style: [base2.root, props.style]
    }, slots.default?.());
  }
});

// src/web/components/Image.ts
import { defineComponent as defineComponent3 } from "vue";
var base3 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0,
    overflow: "hidden"
  }
});
var Image = defineComponent3({
  name: "Image",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    source: [Object, Array, String, Number],
    src: String,
    resizeMode: String,
    alt: String,
    id: String,
    testID: String,
    onPress: Function,
    onTouchEnd: Function,
    onLayout: Function
  },
  setup(props, { attrs }) {
    return () => {
      const src = props.src || (typeof props.source === "object" ? props.source?.uri : props.source);
      return createElement("Image", {
        ...attrs,
        ...props,
        src: src ? String(src) : void 0,
        style: [base3.root, props.style],
        children: void 0
      });
    };
  }
});

// src/web/components/TextInput.ts
import { defineComponent as defineComponent4, ref, watch } from "vue";
var base4 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: 14
  }
});
var TextInput = defineComponent4({
  name: "TextInput",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    modelValue: String,
    value: String,
    placeholder: String,
    multiline: Boolean,
    secureTextEntry: Boolean,
    autoFocus: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    maxLength: [Number, String],
    testID: String,
    onFocus: Function,
    onBlur: Function,
    onChange: Function,
    onSubmitEditing: Function
  },
  emits: ["update:modelValue", "change", "focus", "blur", "submit"],
  setup(props, { emit, attrs }) {
    const val = ref(props.modelValue ?? props.value ?? "");
    watch(() => props.modelValue, (v) => {
      if (v !== void 0) val.value = v;
    });
    function onInput(e) {
      const t = e.target;
      val.value = t.value;
      emit("update:modelValue", t.value);
      emit("change", t.value);
    }
    return () => createElement("TextInput", {
      ...attrs,
      ...props,
      style: [base4.root, { outline: "none" }, props.style],
      value: val.value,
      onInput
    });
  }
});

// src/web/components/ScrollView.ts
import { defineComponent as defineComponent5 } from "vue";
var base5 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0
  },
  content: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0
  }
});
var ScrollView = defineComponent5({
  name: "ScrollView",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    contentContainerStyle: [Object, Array],
    horizontal: Boolean,
    showsVerticalScrollIndicator: { type: Boolean, default: true },
    showsHorizontalScrollIndicator: { type: Boolean, default: true },
    onTouchEnd: Function,
    onScroll: Function,
    onLayout: Function
  },
  setup(props, { slots, attrs }) {
    return () => {
      const scrollStyle = { overflow: props.horizontal ? "auto hidden" : "hidden auto" };
      const contentStyle = props.horizontal ? { flexDirection: "row" } : {};
      return createElement("ScrollView", {
        ...attrs,
        ...props,
        style: [base5.root, scrollStyle, props.style]
      }, [
        createElement("View", {
          style: [base5.content, contentStyle, props.contentContainerStyle]
        }, slots.default?.())
      ]);
    };
  }
});

// src/web/components/SafeAreaView.ts
import { defineComponent as defineComponent6 } from "vue";
var base6 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0,
    paddingTop: "env(safe-area-inset-top, 0px)",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
    paddingLeft: "env(safe-area-inset-left, 0px)",
    paddingRight: "env(safe-area-inset-right, 0px)"
  }
});
var SafeAreaView = defineComponent6({
  name: "SafeAreaView",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    id: String,
    testID: String,
    onLayout: Function
  },
  setup(props, { slots, attrs }) {
    return () => createElement("View", { ...attrs, ...props, style: [base6.root, props.style] }, slots.default?.());
  }
});

// src/web/components/ActivityIndicator.ts
import { defineComponent as defineComponent7 } from "vue";
var base7 = StyleSheet.create({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  }
});
var sizes = { small: 20, large: 36 };
var ActivityIndicator = defineComponent7({
  name: "ActivityIndicator",
  props: {
    size: { type: [String, Number], default: "small" },
    color: { type: String, default: "#1976D2" },
    animating: { type: Boolean, default: true },
    hidesWhenStopped: { type: Boolean, default: true },
    style: [Object, Array],
    class: [String, Array, Object]
  },
  setup(props) {
    return () => {
      const s = typeof props.size === "number" ? props.size : sizes[props.size] ?? 20;
      const borderW = Math.max(s / 8, 2);
      const visible = props.animating || !props.hidesWhenStopped;
      return createElement("View", {
        style: [base7.root, props.style, !visible && { display: "none" }],
        children: createElement("View", {
          style: {
            width: s,
            height: s,
            borderWidth: borderW,
            borderStyle: "solid",
            borderColor: `${props.color}33`,
            borderTopColor: props.color,
            borderRadius: s / 2,
            animation: props.animating ? "rasen-spin 0.8s linear infinite" : void 0
          }
        })
      });
    };
  }
});

// src/web/components/Switch.ts
import { defineComponent as defineComponent8, ref as ref2 } from "vue";
var base8 = StyleSheet.create({
  root: {
    alignItems: "center",
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    userSelect: "none"
  },
  track: {
    borderRadius: 15,
    height: 30,
    position: "relative",
    transitionDuration: "0.2s",
    width: 50
  },
  thumb: {
    borderRadius: 13,
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    height: 26,
    position: "absolute",
    top: 2,
    transitionDuration: "0.2s",
    width: 26
  }
});
var Switch = defineComponent8({
  name: "Switch",
  props: {
    value: Boolean,
    disabled: Boolean,
    trackColor: [String, Object],
    thumbColor: { type: String, default: "#fff" },
    style: [Object, Array],
    class: [String, Array, Object],
    onValueChange: Function,
    onChange: Function
  },
  emits: ["update:value", "change"],
  setup(props, { emit, attrs }) {
    const isOn = ref2(props.value ?? false);
    function toggle() {
      if (props.disabled) return;
      isOn.value = !isOn.value;
      emit("update:value", isOn.value);
      emit("change", isOn.value);
      props.onValueChange?.(isOn.value);
      props.onChange?.(isOn.value);
    }
    return () => {
      const trackOff = typeof props.trackColor === "object" ? props.trackColor?.false ?? "#E5E5EA" : props.trackColor ?? "#E5E5EA";
      const trackOn = typeof props.trackColor === "object" ? props.trackColor?.true ?? "#34C759" : "#34C759";
      return createElement("View", {
        ...attrs,
        ...props,
        style: [base8.root, props.style],
        onClick: toggle,
        role: "switch",
        ariaChecked: isOn.value,
        children: [
          createElement("View", {
            key: "track",
            style: [base8.track, { backgroundColor: isOn.value ? trackOn : trackOff }],
            children: createElement("View", {
              key: "thumb",
              style: [base8.thumb, {
                backgroundColor: props.thumbColor,
                left: isOn.value ? 22 : 2,
                right: isOn.value ? 2 : 22
              }]
            })
          })
        ]
      });
    };
  }
});

// src/web/components/Pressable.ts
import { defineComponent as defineComponent9, ref as ref3 } from "vue";
var base9 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0
  }
});
var Pressable = defineComponent9({
  name: "Pressable",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    disabled: Boolean,
    onPress: Function,
    onLongPress: Function,
    onPressIn: Function,
    onPressOut: Function,
    onTouchEnd: Function,
    id: String,
    testID: String,
    accessibilityLabel: String,
    accessibilityRole: String,
    accessibilityState: Object
  },
  emits: ["press", "longPress", "pressIn", "pressOut"],
  setup(props, { slots, attrs, emit }) {
    const pressed = ref3(false);
    let longPressTimer = null;
    let isLongPress = false;
    function handlePointerDown(e) {
      if (props.disabled) return;
      pressed.value = true;
      isLongPress = false;
      emit("pressIn", e);
      props.onPressIn?.(e);
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        emit("longPress", e);
        props.onLongPress?.(e);
      }, 500);
    }
    function handlePointerUp(e) {
      if (props.disabled) return;
      pressed.value = false;
      emit("pressOut", e);
      props.onPressOut?.(e);
      if (longPressTimer) clearTimeout(longPressTimer);
      if (!isLongPress) {
        emit("press", e);
        props.onPress?.(e);
      }
    }
    function handlePointerLeave() {
      pressed.value = false;
      if (longPressTimer) clearTimeout(longPressTimer);
    }
    return () => {
      const slotProps = { pressed: pressed.value };
      const children = slots.default?.(slotProps);
      return createElement("View", {
        ...attrs,
        ...props,
        style: [base9.root, props.style],
        onTouchStart: handlePointerDown,
        onTouchEnd: handlePointerUp,
        onTouchCancel: handlePointerLeave,
        onMouseDown: handlePointerDown,
        onMouseUp: handlePointerUp,
        onMouseLeave: handlePointerLeave,
        cursor: props.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        children
      });
    };
  }
});

// src/web/components/StatusBar.ts
import { defineComponent as defineComponent10 } from "vue";
var base10 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0,
    height: "100%",
    overflow: "hidden",
    pointerEvents: "none"
  }
});
var StatusBar = defineComponent10({
  name: "StatusBar",
  props: {
    barStyle: { type: String, default: "default" },
    backgroundColor: { type: String, default: "transparent" },
    translucent: Boolean,
    hidden: Boolean
  },
  setup(props) {
    return () => {
      if (typeof document === "undefined") return null;
      const themeColor = props.barStyle === "dark" ? "#000" : "#fff";
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", props.backgroundColor);
      else {
        const m = document.createElement("meta");
        m.name = "theme-color";
        m.content = props.backgroundColor;
        document.head.appendChild(m);
      }
      document.body.style.backgroundColor = props.backgroundColor;
      return null;
    };
  }
});

// src/web/components/KeyboardAvoidingView.ts
import { defineComponent as defineComponent11 } from "vue";
var base11 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0
  }
});
var KEYBOARD_PADDING = { paddingBottom: 300 };
var KeyboardAvoidingView = defineComponent11({
  name: "KeyboardAvoidingView",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    behavior: { type: String, default: "padding" },
    keyboardVerticalOffset: { type: Number, default: 0 }
  },
  setup(props, { slots, attrs }) {
    return () => {
      const extra = props.behavior === "padding" ? KEYBOARD_PADDING : {};
      return createElement("View", {
        ...attrs,
        ...props,
        style: [base11.root, extra, props.style]
      }, slots.default?.());
    };
  }
});

// src/web/components/ImageBackground.ts
import { defineComponent as defineComponent12 } from "vue";
var base12 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0
  }
});
var ImageBackground = defineComponent12({
  name: "ImageBackground",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    source: [Object, Array, String, Number],
    src: String,
    resizeMode: String,
    imageStyle: [Object, Array],
    id: String,
    testID: String
  },
  setup(props, { slots, attrs }) {
    return () => {
      const src = props.src || (typeof props.source === "object" ? props.source?.uri : props.source);
      return createElement("View", {
        ...attrs,
        ...props,
        style: [base12.root, props.style],
        children: [
          createElement(Image, {
            key: "bg",
            style: [
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%"
              },
              props.imageStyle
            ],
            src: src ? String(src) : void 0,
            resizeMode: props.resizeMode,
            children: void 0
          }),
          createElement("View", {
            key: "content",
            style: { flex: 1 },
            children: slots.default?.()
          })
        ]
      });
    };
  }
});

// src/web/components/Button.ts
import { defineComponent as defineComponent13 } from "vue";
var base13 = StyleSheet.create({
  root: {
    alignItems: "center",
    backgroundColor: "#1976D2",
    borderRadius: 4,
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    userSelect: "none",
    transitionDuration: "0.15s",
    transitionProperty: "opacity"
  },
  text: {
    color: "#fff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.3,
    textTransform: "uppercase"
  },
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  }
});
var Button = defineComponent13({
  name: "Button",
  props: {
    title: { type: String, required: true },
    color: String,
    disabled: Boolean,
    onPress: Function,
    accessibilityLabel: String,
    testID: String
  },
  emits: ["press"],
  setup(props, { emit }) {
    function handlePress(e) {
      if (props.disabled) return;
      emit("press", e);
      props.onPress?.(e);
    }
    return () => {
      const bgColor = props.disabled ? "#999" : props.color ?? "#1976D2";
      return createElement("View", {
        style: [
          base13.root,
          props.disabled && base13.disabled,
          { backgroundColor: bgColor }
        ],
        onClick: handlePress,
        role: "button",
        ariaDisabled: props.disabled || void 0,
        accessibilityLabel: props.accessibilityLabel,
        testID: props.testID,
        tabIndex: props.disabled ? -1 : 0,
        children: createElement("Text", {
          style: base13.text,
          children: props.title
        })
      });
    };
  }
});

// src/web/components/CheckBox.ts
import { defineComponent as defineComponent14 } from "vue";
var CheckBox = defineComponent14({
  name: "CheckBox",
  props: {
    value: Boolean,
    disabled: Boolean,
    color: String,
    onValueChange: Function,
    onChange: Function,
    testID: String
  },
  emits: ["update:value", "change"],
  setup(props, { emit }) {
    function handleChange(e) {
      if (props.disabled) return;
      const target = e.target;
      emit("update:value", target.checked);
      emit("change", target.checked);
      props.onValueChange?.(target.checked);
      props.onChange?.(target.checked);
    }
    return () => createElement("input", {
      type: "checkbox",
      checked: props.value ?? false,
      disabled: props.disabled || void 0,
      onChange: handleChange,
      style: {
        accentColor: props.color,
        cursor: props.disabled ? "not-allowed" : "pointer",
        width: 20,
        height: 20,
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        backgroundColor: props.value ? props.color ?? "#1976D2" : "#fff",
        border: `2px solid ${props.value ? props.color ?? "#1976D2" : "#999"}`,
        borderRadius: 3,
        transition: "all 0.15s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      },
      role: "checkbox",
      ariaChecked: props.value ?? false,
      "data-testid": props.testID
    });
  }
});

// src/web/components/ProgressBar.ts
import { defineComponent as defineComponent15 } from "vue";
var base14 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "#E5E5EA",
    borderRadius: 999,
    display: "flex",
    flexShrink: 0,
    height: 4,
    overflow: "hidden",
    width: "100%"
  },
  fill: {
    borderRadius: 999,
    height: "100%",
    transitionDuration: "0.3s",
    transitionProperty: "width"
  }
});
var ProgressBar = defineComponent15({
  name: "ProgressBar",
  props: {
    progress: { type: Number, default: 0 },
    color: { type: String, default: "#1976D2" },
    indeterminate: Boolean,
    trackColor: { type: String, default: "#E5E5EA" },
    style: [Object, Array],
    class: [String, Array, Object]
  },
  setup(props) {
    return () => {
      const pct = Math.min(Math.max(props.progress, 0), 1) * 100;
      return createElement("View", {
        style: [base14.root, { backgroundColor: props.trackColor }, props.style],
        role: "progressbar",
        ariaValueNow: props.indeterminate ? void 0 : pct,
        ariaValueMin: 0,
        ariaValueMax: 100,
        children: createElement("View", {
          style: [
            base14.fill,
            {
              backgroundColor: props.color,
              width: props.indeterminate ? "30%" : `${pct}%`
            }
          ]
        })
      });
    };
  }
});

// src/web/components/Touchable.ts
import { defineComponent as defineComponent17 } from "vue";

// src/web/components/shared.ts
import { ref as ref4 } from "vue";
function usePressHandlers(props, emit, extra) {
  const pressed = ref4(false);
  let longPressTimer = null;
  let isLong = false;
  function onPointerDown(e) {
    if (props.disabled) return;
    pressed.value = true;
    isLong = false;
    emit("pressIn", e);
    props.onPressIn?.(e);
    longPressTimer = setTimeout(() => {
      isLong = true;
      emit("longPress", e);
      props.onLongPress?.(e);
    }, 500);
  }
  function onPointerUp(e) {
    if (props.disabled) return;
    pressed.value = false;
    emit("pressOut", e);
    props.onPressOut?.(e);
    if (longPressTimer) clearTimeout(longPressTimer);
    if (!isLong) {
      emit("press", e);
      props.onPress?.(e);
      extra?.onPress?.(e);
    }
  }
  function onPointerLeave() {
    pressed.value = false;
    if (longPressTimer) clearTimeout(longPressTimer);
  }
  return { pressed, onPointerDown, onPointerUp, onPointerLeave };
}

// src/web/components/Touchable.ts
var base15 = StyleSheet.create({
  root: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: "relative",
    zIndex: 0
  }
});
var TouchableOpacity = defineComponent17({
  name: "TouchableOpacity",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    disabled: Boolean,
    activeOpacity: { type: Number, default: 0.2 },
    onPress: Function,
    onLongPress: Function,
    onPressIn: Function,
    onPressOut: Function,
    id: String,
    testID: String,
    accessibilityLabel: String,
    accessibilityRole: String
  },
  emits: ["press", "longPress", "pressIn", "pressOut"],
  setup(props, { slots, attrs, emit }) {
    const { pressed, onPointerDown, onPointerUp, onPointerLeave } = usePressHandlers(props, emit);
    return () => {
      return createElement("View", {
        ...attrs,
        ...props,
        style: [
          base15.root,
          props.style,
          { opacity: pressed.value ? props.activeOpacity : 1, transition: "opacity 0.15s" },
          props.disabled && { cursor: "not-allowed" }
        ],
        onTouchStart: onPointerDown,
        onTouchEnd: onPointerUp,
        onTouchCancel: onPointerLeave,
        onMouseDown: onPointerDown,
        onMouseUp: onPointerUp,
        onMouseLeave: onPointerLeave,
        cursor: props.disabled ? "not-allowed" : "pointer",
        userSelect: "none"
      }, slots.default?.());
    };
  }
});
var TouchableHighlight = defineComponent17({
  name: "TouchableHighlight",
  props: {
    style: [Object, Array],
    class: [String, Array, Object],
    disabled: Boolean,
    activeOpacity: { type: Number, default: 0.85 },
    underlayColor: { type: String, default: "rgba(0,0,0,0.12)" },
    onPress: Function,
    onLongPress: Function,
    onPressIn: Function,
    onPressOut: Function,
    id: String,
    testID: String,
    accessibilityLabel: String,
    accessibilityRole: String
  },
  emits: ["press", "longPress", "pressIn", "pressOut"],
  setup(props, { slots, attrs, emit }) {
    const { pressed, onPointerDown, onPointerUp, onPointerLeave } = usePressHandlers(props, emit);
    return () => {
      return createElement("View", {
        ...attrs,
        ...props,
        style: [
          base15.root,
          props.style,
          {
            backgroundColor: pressed.value ? props.underlayColor : "transparent",
            transition: "background-color 0.15s, opacity 0.15s",
            opacity: pressed.value ? props.activeOpacity : 1
          },
          props.disabled && { cursor: "not-allowed" }
        ],
        onTouchStart: onPointerDown,
        onTouchEnd: onPointerUp,
        onTouchCancel: onPointerLeave,
        onMouseDown: onPointerDown,
        onMouseUp: onPointerUp,
        onMouseLeave: onPointerLeave,
        cursor: props.disabled ? "not-allowed" : "pointer",
        userSelect: "none"
      }, slots.default?.());
    };
  }
});
var TouchableWithoutFeedback = defineComponent17({
  name: "TouchableWithoutFeedback",
  props: {
    disabled: Boolean,
    onPress: Function,
    onLongPress: Function,
    onPressIn: Function,
    onPressOut: Function,
    id: String,
    testID: String
  },
  emits: ["press", "longPress", "pressIn", "pressOut"],
  setup(props, { slots, attrs, emit }) {
    const { onPointerDown, onPointerUp, onPointerLeave } = usePressHandlers(props, emit);
    return () => createElement("View", {
      ...attrs,
      ...props,
      onTouchStart: onPointerDown,
      onTouchEnd: onPointerUp,
      onTouchCancel: onPointerLeave,
      onMouseDown: onPointerDown,
      onMouseUp: onPointerUp,
      onMouseLeave: onPointerLeave,
      cursor: props.disabled ? "not-allowed" : "pointer"
    }, slots.default?.());
  }
});

// src/web/apis/index.ts
var Alert = {
  alert(title, message, buttons) {
    if (typeof window === "undefined") return;
    if (!buttons || buttons.length <= 1) {
      const result = window.confirm(`${title}
${message ?? ""}`);
      if (result && buttons?.[0]?.onPress) buttons[0].onPress();
      return;
    }
    const dialog = document.createElement("div");
    dialog.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999";
    const box = document.createElement("div");
    box.style.cssText = "background:#fff;border-radius:12px;padding:24px;max-width:320px;width:90%;box-shadow:0 4px 20px rgba(0,0,0,0.15);font-family:system-ui,sans-serif";
    if (title) {
      const h2 = document.createElement("h3");
      h2.textContent = title;
      h2.style.cssText = "margin:0 0 8px;font-size:17px;font-weight:600";
      box.appendChild(h2);
    }
    if (message) {
      const p = document.createElement("p");
      p.textContent = message;
      p.style.cssText = "margin:0 0 20px;font-size:13px;color:#666";
      box.appendChild(p);
    }
    for (const btn of buttons ?? []) {
      const b = document.createElement("button");
      b.textContent = btn.text ?? "OK";
      b.style.cssText = `display:block;width:100%;padding:10px;margin-top:8px;border:none;border-radius:8px;font-size:15px;cursor:pointer;${btn.style === "cancel" ? "background:#f5f5f5;color:#666" : btn.style === "destructive" ? "background:#ff3b30;color:#fff" : "background:#1976D2;color:#fff"}`;
      b.onclick = () => {
        document.body.removeChild(dialog);
        btn.onPress?.();
      };
      box.appendChild(b);
    }
    dialog.appendChild(box);
    document.body.appendChild(dialog);
  },
  prompt(_title, _message, _callbackOrButtons, _type) {
    if (typeof window === "undefined") return "";
    return window.prompt(_title ?? "", "") ?? "";
  }
};
var Platform = {
  OS: "web",
  Version: navigator?.userAgent ?? "",
  select(specifics) {
    return specifics.web ?? specifics.default ?? {};
  },
  isTesting: false,
  isNative: false
};
var _listeners = /* @__PURE__ */ new Set();
function getWindow() {
  if (typeof window === "undefined") return { width: 1024, height: 768, scale: 1, fontScale: 1 };
  return { width: window.innerWidth, height: window.innerHeight, scale: 1, fontScale: 1 };
}
function getScreen() {
  if (typeof window === "undefined") return { width: 1024, height: 768, scale: 1, fontScale: 1 };
  return { width: window.screen.width, height: window.screen.height, scale: 1, fontScale: 1 };
}
if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    const dims = { window: getWindow(), screen: getScreen() };
    _listeners.forEach((fn) => fn(dims));
  });
}
var Dimensions = {
  get(dim) {
    return dim === "screen" ? getScreen() : getWindow();
  },
  addEventListener(type, handler) {
    _listeners.add(handler);
    return { remove: () => _listeners.delete(handler) };
  },
  removeEventListener(_type, handler) {
    _listeners.delete(handler);
  }
};
var PixelRatio = {
  get() {
    return typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1;
  },
  getFontScale() {
    return 1;
  },
  getPixelSizeForLayoutSize(layoutSize) {
    return Math.round(layoutSize * this.get());
  },
  roundToNearestPixel(layoutSize) {
    return Math.round(layoutSize * this.get()) / this.get();
  }
};
var Linking = {
  canOpenURL(_url) {
    return Promise.resolve(true);
  },
  openURL(url) {
    if (typeof window !== "undefined") window.open(url, "_blank");
    return Promise.resolve();
  },
  addEventListener(_type, _handler) {
    return { remove: () => {
    } };
  },
  removeEventListener(_type, _handler) {
  }
};
var Clipboard = {
  getString() {
    if (typeof navigator === "undefined") return Promise.resolve("");
    return navigator.clipboard?.readText() ?? Promise.resolve("");
  },
  setString(text) {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(text);
  }
};
var appStateListeners = /* @__PURE__ */ new Set();
var currentState = "active";
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    currentState = document.hidden ? "background" : "active";
    appStateListeners.forEach((fn) => fn(currentState));
  });
}
var AppState = {
  currentState: "active",
  addEventListener(_type, handler) {
    appStateListeners.add(handler);
    return { remove: () => appStateListeners.delete(handler) };
  },
  removeEventListener(_type, handler) {
    appStateListeners.delete(handler);
  }
};
var Share = {
  share(options) {
    if (typeof navigator !== "undefined" && navigator.share) {
      return navigator.share({ title: options.title, text: options.message, url: options.url }).then(() => ({ action: "shared.action" })).catch(() => ({ action: "dismissed.action" }));
    }
    const text = [options.title, options.message, options.url].filter(Boolean).join("\n");
    Clipboard.setString(text);
    Alert.alert("Copied to clipboard", text);
    return Promise.resolve({ action: "shared.action" });
  }
};
function useWindowDimensions() {
  return Dimensions.get("window");
}
function useColorScheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function useLocaleContext() {
  return { direction: "ltr", locale: navigator?.language ?? "en-US" };
}

// src/web/index.ts
var componentMap = {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Switch,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  ImageBackground,
  Button,
  CheckBox,
  ProgressBar,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback
};
function createWebApp(rootComponent) {
  injectReset();
  const app = vueCreateApp(rootComponent);
  for (const [name, comp] of Object.entries(componentMap)) {
    app.component(name, comp);
  }
  return app;
}
var webPlugin = {
  install(app) {
    injectReset();
    for (const [name, comp] of Object.entries(componentMap)) {
      app.component(name, comp);
    }
  }
};
export {
  ActivityIndicator,
  Alert,
  AppState,
  Button,
  CheckBox,
  Clipboard,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  PixelRatio,
  Platform,
  Pressable,
  ProgressBar,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  createWebApp,
  useColorScheme,
  useLocaleContext,
  useWindowDimensions,
  webPlugin
};
//# sourceMappingURL=index.mjs.map