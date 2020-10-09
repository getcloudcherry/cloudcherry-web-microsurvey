import * as Entry from "../src/CCSDKEntry";
import { SurveyManager } from "../src/SurveyManager";
import { TriggerManager } from "../src/TriggerManager";

// describe("ccsdk Entry", () => {
//   beforeAll(() => {
//     document.addEventListener("onImpression", (ev) => {
//       console.log(ev, "#####");
//     });

//     (<any>window).CCSDK =
//       (<any>window).CCSDK ||
//       function () {
//         ((<any>window).CCSDK.q = (<any>window).CCSDK.q || []).push(arguments);
//       };
//     // Entry.setUpEnv();
//   });

//   it("should be available", () => {
//     expect((<any>window).CCSDK).toBeTruthy();
//   });

//   it("should have a q", () => {
//     expect((<any>window).CCSDK.q).toBeFalsy();

//     (<any>window).CCSDK("init", "MR-100550");

//     expect((<any>window).CCSDK.q).toBeTruthy();
//   });

//   it("should collect function calls", () => {
//     expect((<any>window).CCSDK.q).toBeTruthy();

//     (<any>window).CCSDK("prefill", "MR-100550", "qid", "value");

//     expect((<any>window).CCSDK.q.length).toBe(2);

//     expect((<any>window).CCSDK.q[1].length).toBe(4);
//   });

//   it("should run the methods in queue on setUpEnv", () => {
//     Entry.setUpEnv();

//     expect((<any>window).CCSDK.q).toBeFalsy(2);
//   });

//   it("should not collect methods in queue", () => {
//     (<any>window).CCSDK("prefill", "MR-100550", "qid", "value");

//     expect((<any>window).CCSDK.q).toBeFalsy();
//   });

//   it("should get the instance once initiated", () => {
//     let instance = (<any>window).CCSDK("init", "MR-100550", {
//       isActive: true,
//       color: "red",
//       waitSeconds: 0
//     });

//     expect(instance).toBeTruthy();
//   });

//   it("should have one survey instance", () => {
//     expect(SurveyManager).toBeTruthy();
//     expect(SurveyManager.surveyInstances).toBeTruthy();
//     console.log(Object.keys(SurveyManager.surveyInstances), "###");
//     expect(SurveyManager.surveyInstances["MR-100550"]).toBeTruthy();
//   });

//   it("should have one trigger instance", () => {
//     expect(TriggerManager).toBeTruthy();
//     expect(TriggerManager.triggerInstances).toBeTruthy();
//     expect(TriggerManager.triggerInstances["MR-100550"]).toBeTruthy();
//   });
// });

describe("listening to events", () => {
  let mockEventSpy;
  beforeAll(() => {
    mockEventSpy = jasmine.createSpy("event");
    document.addEventListener("onImpression", mockEventSpy);
    (<any>window).CCSDK =
      (<any>window).CCSDK ||
      function () {
        ((<any>window).CCSDK.q = (<any>window).CCSDK.q || []).push(arguments);
      };

    jasmine.clock().install();

    Entry.setUpEnv();

    console.log(Object.keys(SurveyManager.surveyInstances), "#1231");
  });
  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it("should set global running flag", () => {
    // expect(mockEventSpy).toBeTruthy();
    let instance = (<any>window).CCSDK("init", "MR-11000", {
      isActive: true,
      color: "red",
      waitSeconds: 0
    });
    expect(instance).toBeTruthy();

    expect((<any>window).globalSurveyRunning).toBeTruthy();
  });

  it("should call the onImpression call back", () => {
    let instance = (<any>window).CCSDK("init", "MR-11230", {
      isActive: true,
      color: "red",
      waitSeconds: 0
    });
    jasmine.clock().tick(10000);
    expect(mockEventSpy).toHaveBeenCalled();
  });
});
