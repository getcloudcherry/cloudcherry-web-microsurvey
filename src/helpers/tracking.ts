import { RequestHelper } from "./Request";

export class MatomoTracker {
  public username;
  public token;

  trackEvent(event, payload, successCb, errorCb) {
    // removed matomo tracking
    // let url
    // try {
    //   url = new URL('https://matomo.getcloudcherry.com/piwik.php');
    // } catch (err) {
    //   if (errorCb && typeof errorCb === 'function') {
    //     errorCb();
    //   }
    //   return;
    // }
    // if (!url || !url.searchParams) {
    //   if (errorCb && typeof errorCb === 'function') {
    //     errorCb();
    //     return;
    //   } else {
    //     return;
    //   }
    // }
    // // constants for project
    // const idsite = 4;
    // const rec = 1;
    // let searchParams = {
    //   idsite,
    //   rec,
    //   action_name: event,
    //   url: window.location.href,
    //   action_url: window.location.href,
    //   uid: this.username,
    //   _cvar: { '1': ['Token', payload.token] },
    //   new_visit: event === 'Welcome Pop up Position' ? 1 : 0,
    //   e_c: event,
    //   e_a: payload.data.action,
    //   e_n: payload.data.name,
    //   rand: Math.ceil(Math.random() * 100)
    // };
    // Object.keys(searchParams).forEach(x => {
    //   let param;
    //   if (typeof searchParams[x] === 'string') {
    //     param = searchParams[x];
    //   } else {
    //     param = JSON.stringify(searchParams[x]);
    //   }
    //   url.searchParams.set(x, param);
    // })
    // return RequestHelper.post(url.toString(), null, successCb, errorCb);
  }
}
