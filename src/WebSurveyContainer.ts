import "./global.scss";
import { dispatchEvent } from "./utils";
import { Constants } from "./Constants";
import { Cookie } from "./helpers/Cookie";

export class WebSurveyContainer {
  public iframe: HTMLIFrameElement;
  public iframeContainer: HTMLDivElement;
  public hideCloseButton = false;
  public closeCallback: Function | null = null;
  urlSource;
  _iframeOpened: boolean | null = null;
  restrictedOrigin = "*";
  config;
  public browserNotSuitable = false;
  readyForPrefills = false;
  _prefills = [];
  pageLoad: boolean;
  closeButton: HTMLButtonElement;

  constructor(config) {
    this.config = config;
    this.init();
  }

  init() {
    [this.iframe, this.iframeContainer] = this.getSurvey();
    this.listenForMessages();
  }

  getSurvey(): [HTMLIFrameElement, HTMLDivElement] {
    let iframe = this.getIframe();
    let iframeContainer = this.getIframeContainer();

    iframeContainer.appendChild(iframe);

    iframeContainer.onwheel = (ev) => {
      ev.stopPropagation();
    };

    window.onresize = (ev) => {
      if (!this.closeButton) {
        return;
      }
      if (window.innerWidth > 768) {
        this.closeButton.style.bottom = `${
          this.iframeContainer.clientHeight - 14
        }px`;
      } else {
        this.closeButton.style.bottom = `${
          this.iframeContainer.clientHeight - 48
        }px`;
      }
    };
    return [iframe, iframeContainer];
  }

  getIframeContainer(): HTMLDivElement {
    let iframeContainer = document.createElement("div");
    iframeContainer.classList.add("ccsdk");
    iframeContainer.classList.add("ifr-cntr");
    iframeContainer.style.transform = "translateY(100vh)";
    return iframeContainer;
  }

  getIframe(): HTMLIFrameElement {
    let iframe = document.createElement("iframe");
    iframe.classList.add("ifr");
    iframe.style.border = "0";
    iframe.style.borderColor = this.config.brandColor;
    return iframe;
  }

  getCloseButton(iframeHeight: number) {
    let button = document.createElement("button");
    button.style.backgroundColor = this.config.brandColor;
    button.innerHTML =
      '<img src="https://cxnext.blob.core.windows.net/venki/times.png" class="close-icon">';

    if (window.innerWidth > 768) {
      button.style.bottom = `${iframeHeight - 14}px`;
    } else {
      button.style.bottom = `${iframeHeight - 48}px`;
    }

    button.addEventListener("click", (event) => {
      if (this.closeCallback) {
        this.closeCallback(event);
      }
      button.style.visibility = "hidden";
      this.close();
    });

    return button;
  }

  public close() {
    if (!this.iframeContainer) {
      return;
    }

    (<any>window).globalSurveyRunning = false;
    this._iframeOpened = false;
    this.iframeContainer.style.transform = "translateY(100vh)";
    setTimeout(() => {
      this.destroy();
    }, 250);
  }

  destroy() {
    try {
      this.iframeContainer.removeChild(this.iframe);
      this.iframe = null;
      document.body.removeChild(this.iframeContainer);
      this.iframeContainer = null;
    } catch (err) {
      console.error(err);
    }
    this.pageLoad = false;
  }

  public setSource(url: string) {
    if (!this.iframe) {
      return;
    }

    this.iframe.src = url;
    this.urlSource = url;
    let that = this;

    this.iframe.onload = () => {
      console.info("Iframe loaded. Ready for showing to user.");
      this.pageLoad = true;
    };

    function websurveyConfigCallBack(event) {
      if (event.data) {
        try {
          let message = JSON.parse(event.data);
          if (
            message &&
            message.type === "GET_CONFIG" &&
            message.token === that.config.token
          ) {
            that.config.pagedLayout = false;
            that.setConfig(that.config);
            window.removeEventListener("message", websurveyConfigCallBack);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    window.addEventListener("message", websurveyConfigCallBack);
  }

  public setConfig(config) {
    let message = JSON.stringify({
      config,
      options: {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      },
      mode: "MICROSURVEY"
    });

    this.iframe.contentWindow.postMessage(message, this.restrictedOrigin);
  }

  open() {
    if (this.browserNotSuitable) {
      console.info(
        "Cookie and Storage not accessible for survey. Survey will not show up."
      );
      return;
    }
    (<any>window).globalSurveyRunning = true;
    if (!this.iframeContainer || !this.iframe) {
      this.init();
      this.attachIframe();
      this.setConfig(this.urlSource);
    } else {
      this.attachIframe();
    }
  }

  attachIframe() {
    document.body.appendChild(this.iframeContainer);
    let that = this;
    function pollForPageLoad() {
      if (that.pageLoad) {
        that.iframeContainer.style.transform = "none";
        that.iframeContainer.style.transform = "unset";
      } else {
        setTimeout(() => {
          pollForPageLoad();
        }, 150);
      }
    }

    // poll for page load
    pollForPageLoad();

    this._iframeOpened = true;
    if (!this.hideCloseButton) {
      let scaleFactor = 1; // 0.66;
      this.closeButton = this.getCloseButton(
        this.iframe.clientHeight * scaleFactor
      );
      this.closeButton.classList.add("close-btn");
      this.iframeContainer.appendChild(this.closeButton);
    }
  }

  listenForMessages() {
    var that = this;
    window.addEventListener("message", (ev) => {
      if (ev.data) {
        try {
          let message = JSON.parse(ev.data);
          if (message.type === "READY_FOR_PREFILLS") {
            that.readyForPrefills = true;
            if (that._prefills.length > 0) {
              that._prefills.forEach((x: [any, any]) => {
                that.postPrefillsToSurvey(x[0], x[1]);
              });
            }
          } else if (message.type === "STORAGE_EXCEPTION") {
            that._iframeOpened = false;
            that.close();
            that.browserNotSuitable = true;
            console.info("Storage exception within iframe");
          } else if (message.type === "REDIRECT_TO_FALLBACK") {
            that.setConfig(that.config);
            that.readyForPrefills = false;
          } else if (message.type === "EVENT_FROM_SURVEY") {
            let eventTypeMap = {
              START: "onStart",
              ANSWERED: "onAnswer",
              DATA: "onData",
              END: "onEnd",
              QUESTION: "onQuestion"
            };

            if (message.data.eventType === "END") {
              if (
                message.data.response !== null &&
                message.data.response.token === that.config.token
              ) {
                setTimeout(() => {
                  that.close();
                  // websurvey sets the cookie in the iframe and not in the parent page
                  //set done cookie for 30 days.
                  Cookie.set(that.config.token + "-finish", "true", 30, "/");
                  dispatchEvent(
                    `${Constants.SURVEY_CLOSE_EVENT}-${that.config.token}`,
                    that.config.token
                  );
                }, 3000);

                if (message.data.response.url) {
                  // redirect url will be opened in new window
                  window.open(message.data.response.url, "_blank");
                }
              }
            }
            dispatchEvent(
              `${eventTypeMap[message.data.eventType]}-${that.config.token}`,
              message.data.response
            );
          }
        } catch (err) {}
      }
    });
  }

  public prefill(object, type) {
    if (this.readyForPrefills && object) {
      this.postPrefillsToSurvey(object, type);
    } else {
      this._prefills.push([object, type]);
    }
  }

  postPrefillsToSurvey(prefills, type) {
    let message = JSON.stringify({
      prefills: prefills,
      prefillType: type,
      type: "PREFILLS_FROM_HOST"
    });

    this.iframe.contentWindow.postMessage(message, this.restrictedOrigin);
  }
}
