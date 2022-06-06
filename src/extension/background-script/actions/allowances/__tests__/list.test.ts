import db from "~/extension/background-script/db";
import type { MessageAllowanceList } from "~/types";

import list from "../list";

jest.mock("~/extension/background-script/db");

// const defaultMockState = {
//   password: "123456",
//   saveToStorage: jest.fn,
//   accounts: {},
// };

const message: MessageAllowanceList = {
  application: "LBE",
  origin: { internal: true },
  prompt: true,
  type: "listAllowances",
};

describe("add account to account-list", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("add first account to empty list", async () => {
    // const mockState = defaultMockState;

    // state.getState = jest.fn().mockReturnValue(mockState);
    // state.setState = () => jest.fn;

    // const spy = jest.spyOn(state, "setState");

    expect(await list(message)).toStrictEqual({
      data: { allowances: "random-id-42" },
    });

    // expect(spy).toHaveBeenNthCalledWith(1, {
    //   accounts: {
    //     "random-id-42": {
    //       id: "random-id-42",
    //       connector: "lnd",
    //       config: "secret-config-string-42",
    //       name: "purple",
    //     },
    //   },
    // });

    // expect(spy).toHaveBeenNthCalledWith(2, {
    //   currentAccountId: "random-id-42",
    // });

    // expect(spy).toHaveBeenCalledTimes(2);
  });
});
