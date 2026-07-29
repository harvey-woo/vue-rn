// src/router.ts
import { createMemoryHistory } from "vue-router";

// src/router-link.ts
import { defineComponent, h } from "@vue/runtime-core";
import { useLink } from "vue-router";
function isTextNode(vnode) {
  return typeof vnode.children === "string" || typeof vnode.children === "number";
}
function wrapText(vnodes, style) {
  return vnodes.map((v) => isTextNode(v) ? h("Text", { style }, v.children) : v);
}
var RouterLink = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  props: {
    to: { type: [String, Object], required: true },
    replace: Boolean,
    /**
     * When true, renders only the slot content without wrapping View.
     * Use this when you need full control over the touchable wrapper.
     */
    custom: Boolean,
    /**
     * Style forwarded to the inner Text when in default (non-custom) mode.
     * Ignored in custom mode — apply styles directly to your own elements.
     */
    style: [Object, Array]
  },
  setup(props, { slots }) {
    const link = useLink(props);
    return () => {
      const scope = {
        route: link.route,
        href: link.href,
        isActive: link.isActive,
        isExactActive: link.isExactActive,
        navigate: link.navigate
      };
      const slotContent = slots.default?.(scope) ?? [];
      if (props.custom) {
        return slotContent.length === 0 ? h("View") : slotContent;
      }
      return h("View", { onTouchEnd: link.navigate }, wrapText(slotContent, props.style));
    };
  }
});

// src/router.ts
function createRNHistory(base) {
  return createMemoryHistory(base);
}
export {
  RouterLink,
  createRNHistory
};
//# sourceMappingURL=router.mjs.map