export function triggerEvent(el: any, eventName: string, data: Object) {
  if (typeof CustomEvent === "function") {
    var event = <any>new CustomEvent(eventName, { detail: data });
  } else {
    var event = <any>document.createEvent("CustomEvent");
    event.initCustomEvent(eventName, true, true, data);
  }

  el.dispatchEvent(event);
}

export function dispatchEvent(type, payload) {
  let event = new CustomEvent(type, {
    detail: payload,
    bubbles: true,
    cancelable: false
  });
  let iframe = document.querySelector(".ccsdk.ifrcntr");

  (iframe || document).dispatchEvent(event);
}
