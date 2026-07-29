// src/index.ts
import { AppRegistry } from "react-native";
import { createRenderer, getCurrentInstance } from "@vue/runtime-core";
import { RNDocument, normalizeEventName, isEvent } from "@rasenjs/rn-dom";
var _doc = null;
function patchStyle(el, _prev, next) {
  if (next == null) {
    el.removeAttribute("style");
    return;
  }
  el.setAttribute("style", { ...typeof next === "object" ? next : {} });
}
function createVueRenderer() {
  return createRenderer({
    insert(child, parent, anchor) {
      parent.insertBefore(child, anchor ?? void 0);
    },
    remove(child) {
      child.parentNode?.removeChild(child);
    },
    createElement(tag) {
      return _doc.createElement(tag);
    },
    createText(text) {
      return _doc.createTextNode(text);
    },
    createComment(text) {
      return _doc.createComment(text);
    },
    setText(node, text) {
      ;
      node.textContent = text;
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSibling(node) {
      return node.nextSibling ?? null;
    },
    patchProp(el, key, prevValue, nextValue) {
      if (key === "class") return;
      if (key === "style") {
        patchStyle(
          el,
          prevValue,
          nextValue
        );
        return;
      }
      if (isEvent(key)) {
        const rnKey = normalizeEventName(key);
        if (prevValue != null) el.removeAttribute(rnKey);
        if (nextValue != null) el.setAttribute(rnKey, nextValue);
        return;
      }
      if (nextValue == null) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, nextValue);
      }
    },
    setScopeId() {
    },
    insertStaticContent() {
      return [];
    }
  });
}
function createApp(rootComponent) {
  const renderer = createVueRenderer();
  const app = renderer.createApp(rootComponent);
  return {
    mount(container) {
      _doc = container.ownerDocument ?? container;
      app.mount(container);
    },
    unmount() {
      app.unmount();
    },
    use(plugin, ...options) {
      app.use(plugin, ...options);
      return this;
    },
    register(appName, setup) {
      AppRegistry.registerRunnable(appName, ({ rootTag }) => {
        const doc = getOrCreateDocument(rootTag);
        setup?.();
        _doc = doc;
        app.mount(doc.body);
      });
    }
  };
}
function getOrCreateDocument(rootTag) {
  return RNDocument.getOrCreate(rootTag);
}
function useCssModule(name = "$style") {
  const instance = getCurrentInstance();
  if (!instance) {
    return {};
  }
  const modules = instance.type.__cssModules;
  if (!modules) {
    return {};
  }
  const mod = modules[name];
  return mod ?? {};
}
export {
  RNDocument,
  createApp,
  getOrCreateDocument,
  useCssModule
};
//# sourceMappingURL=index.mjs.map