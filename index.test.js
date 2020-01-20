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

// import moxios from 'moxios';
// import Axios from "axios";
// import nock from "nock";
// import httpAdapter from "axios/lib/adapters/http";
// import getTransactionDAO from "../TransactionDAO";
// import urls from "../../../constants/http/urls";
// import routes from "../../../constants/http/routes";
// import apiClient from "../../../http/apiClient";
// import { attach } from "retry-axios";

// // // attach(apiClient);
// // // const mock = new MockAdapter(apiClient);
// nock.disableNetConnect();
// describe("TransactionDAO", () => {
//   describe("under succesful circumnstances", () => {
//     beforeEach(() => {
//       // moxios.install(apiClient);
//     });
//     afterEach(() => {
//       nock.cleanAll();
//       // mock.reset();
//       // mock.reset();
//       // moxios.uninstall(apiClient);
//     });
//     // it.skip('makes a proper request', async () => {
//     //   mock
//     //     .onPost(/v1\/deposit/)
//     //     .replyOnce(200, { [misc.POE_FIEL_KEY]: 'helloworld' });
//     //   const transactionDao = getTransactionDAO();
//     //   const token = await transactionDao.announceDeposit();
//     //   expect(token).toEqual('helloworld');
//     // });
//     it("returns a token to the user sucesfully", async () => {
//       const dummyToken = "helloworld";
//       const scope = nock(urls.baseURL)
//         .put(/deposit/)
//         .once()
//         .reply(201, { token: dummyToken });
//       try {
//         const token = await getTransactionDAO().doDeposit(23, 20, [
//           "hello",
//           "world"
//         ]);
//         expect(token).toEqual(dummyToken);
//       } catch (error) {
//         scope.done();
//         // error; //?
//       }
//     });
//     it("does a total of three retries", async () => {
//       const dummyToken = "helloworld";
//       const scopes = [
//         nock(urls.baseURL)
//           .put(/deposit/)
//           .reply(500, "hello world"),
//         nock(urls.baseURL)
//           .put(/deposit/)
//           .reply(500, "hello world"),
//         nock(urls.baseURL)
//           .put(/deposit/)
//           .reply(201, { token: "dummytoken" })
//       ];
//       try {
//         const token = await getTransactionDAO().doDeposit(23, 20, [
//           "hello",
//           "wrodl"
//         ]);
//         expect(token).toEqual(dummyToken);
//       } catch (error) {
//         error.config.raxConfig; //?
//         scopes.forEach(s => s.done());
//         // error; //?
//       }
//     });
//   });
// });
