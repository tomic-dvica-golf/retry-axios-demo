const instance = require("./index").myInstance;
const nock = require("nock");

instance.defaults.adapter = require("axios/lib/adapters/http");

describe("test", () => {
  it("works for a single request", () => {
    const scopes = [
      nock("https://google.com")
        .put("/hello")
        .reply(201, { token: "dummytoken" })
    ];

    return instance.put("/hello").then(res => {
      expect(res.data.token).toEqual("dummytoken");
      scopes.forEach(s => s.done());
    });
  });
  it("works for one request", () => {
    const scopes = [
      nock("https://google.com")
        .put("/hello")
        .reply(500, "hello world"),
      nock("https://google.com")
        .put("/hello")
        .reply(201, { token: "dummytoken" })
    ];

    return instance.put("/hello").then(res => {
      expect(res.data.token).toEqual("dummytoken");
      scopes.forEach(s => s.done());
    });
  });
  it("does not work out of the box for multiple failing requests", () => {
    const scopes = [
      nock("https://google.com")
        .put("/hello")
        .reply(500, "hello world"),
      nock("https://google.com")
        .put("/hello")
        .reply(500, "hello world"),
      nock("https://google.com")
        .put("/hello")
        .reply(201, { token: "dummytoken" })
    ];

    return instance.put("/hello").then(res => {
      expect(res.data.token).toEqual("dummytoken");
      scopes.forEach(s => s.done());
    });
  });
});
