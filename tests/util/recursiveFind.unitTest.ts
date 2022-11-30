import recursiveFind from "./recursiveFind";

type TestCase = Record<string, any> & {
  nextTestTypesOrCategories?: TestCase[];
};
interface TestCases {
  testCase: TestCase[];
  shouldReturn: TestCase | undefined;
  testFunction: (args: any) => boolean;
  nestKey?: string;
}

const testCases: TestCases[] = [
  {
    testCase: [
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: { bar: "foo" },
    testFunction: (testCase: any) => testCase.bar === "foo",
  },
  {
    testCase: [
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foobar",
          },
        ],
      },
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: { bar: "foo" },
    testFunction: (testCase: any) => testCase.bar === "foo",
  },
  {
    testCase: [
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: {
      foo: "bar",
      nextTestTypesOrCategories: [
        {
          bar: "foo",
        },
      ],
    },
    testFunction: (testCase: any) => !testCase.bar,
  },
  {
    testCase: [
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: undefined,
    testFunction: (testCase: any) => testCase.bar === "bar",
  },
  {
    testCase: [
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: { foo: "bar", nextTestTypesOrCategories: [{ bar: "foo" }] },
    testFunction: (testCase: any) => testCase.foo === "bar",
  },
  {
    testCase: [
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
          {
            nextTestTypesOrCategories: [
              {
                bar: "foobar",
              },
            ],
          },
        ],
      },
    ],
    shouldReturn: { bar: "foobar" },
    testFunction: (testCase: any) => testCase.bar === "foobar",
  },
  {
    testCase: [
      {
        foo: "bar",
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: undefined,
    testFunction: (testCase: any) => testCase.foo === "foo",
  },
  {
    testCase: [
      {
        foo: "bar",
        someNestKey: [
          {
            foo: "foo",
          },
        ],
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: { foo: "foo" },
    testFunction: (testCase: any) => testCase.foo === "foo",
    nestKey: "someNestKey",
  },
  {
    testCase: [
      {
        foo: "bar",
        someNestKey: [
          {
            foo: "foo",
          },
        ],
        nextTestTypesOrCategories: [
          {
            bar: "foo",
          },
        ],
      },
    ],
    shouldReturn: undefined,
    testFunction: (testCase: any) => testCase.bar === "foobar",
    nestKey: "someNestKey",
  },
];

describe("recursiveFind", () => {
  it.each(testCases)(
    "should return 'shouldReturn' for each 'testCase' given a 'testFunction'",
    (value) => {
      const { testCase, shouldReturn, testFunction, nestKey } = value;
      expect(recursiveFind(testFunction, testCase, nestKey)).toEqual(
        shouldReturn
      );
    }
  );
});
