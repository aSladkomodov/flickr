import mapping from "../mapping";

const FIXTURE = {
  agency: "test789",
  contacts: {
    socials: [{ name: "Slack" }, { name: "Skype", price: 2000 }],
    total: 2000,
  },
  tags: ["android", "iphone"],
};

const callback = (key, value) => value;

describe("mapping (simple mappings)", () => {
  it("a → b", () => {
    const expected = { assistance: "test789" };

    expect(
      mapping({ mapping: { agency: "assistance" }, callback }, FIXTURE)
    ).toEqual(expected);
  });

  it("a → b.c", () => {
    const actual = mapping(
      { mapping: { agency: "contacts.assistance" }, callback },
      FIXTURE
    );
    const expected = { contacts: { assistance: "test789" } };

    expect(actual).toEqual(expected);
  });

  it("a.b → c", () => {
    const actual = mapping(
      { mapping: { "contacts.total": "total" }, callback },
      FIXTURE
    );
    const expected = { total: 2000 };

    expect(actual).toEqual(expected);
  });

  it("a.b → c.d", () => {
    const actual = mapping(
      { mapping: { "contacts.total": "contacts.amount" }, callback },
      FIXTURE
    );
    const expected = { contacts: { amount: 2000 } };

    expect(actual).toEqual(expected);
  });
});

describe("mapping (arrays)", () => {
  it("a[] → b[]", () => {
    const actual = mapping(
      { mapping: { "tags[]": "contactsTags[]" }, callback },
      FIXTURE
    );
    const expected = { contactsTags: ["android", "iphone"] };

    expect(actual).toEqual(expected);
  });

  it("a[] → []", () => {
    const actual = mapping({ mapping: { "tags[]": "[]" }, callback }, FIXTURE);
    const expected = ["android", "iphone"];

    expect(actual).toEqual(expected);
  });

  it("[] → []", () => {
    const actual = mapping({ mapping: { "[]": "[]" }, callback }, FIXTURE.tags);
    const expected = ["android", "iphone"];

    expect(actual).toEqual(expected);
  });

  it("[] → tags[]", () => {
    const actual = mapping(
      { mapping: { "[]": "tags[]" }, callback },
      FIXTURE.tags
    );
    const expected = { tags: ["android", "iphone"] };

    expect(actual).toEqual(expected);
  });

  it("a[].b → c[].d", () => {
    const actual = mapping(
      { mapping: { "socials[].name": "lines[].title" }, callback },
      FIXTURE.contacts
    );
    const expected = { lines: [{ title: "Slack" }, { title: "Skype" }] };

    expect(actual).toEqual(expected);
  });

  it("a.b[].c → d.e[].f", () => {
    const actual = mapping(
      {
        mapping: { "contacts.socials[].name": "agency.lines[].title" },
        callback,
      },
      FIXTURE
    );
    const expected = {
      agency: { lines: [{ title: "Slack" }, { title: "Skype" }] },
    };

    expect(actual).toEqual(expected);
  });

  it("a[].b → c[]", () => {
    const actual = mapping(
      { mapping: { "socials[].name": "lines[]" }, callback },
      FIXTURE.contacts
    );
    const expected = { lines: ["Slack", "Skype"] };

    expect(actual).toEqual(expected);
  });

  it("a[].b → []", () => {
    const actual = mapping(
      { mapping: { "socials[].name": "[]" }, callback },
      FIXTURE.contacts
    );
    const expected = ["Slack", "Skype"];

    expect(actual).toEqual(expected);
  });

  it("[].a → b[]", () => {
    const actual = mapping(
      { mapping: { "[].name": "lines[]" }, callback },
      FIXTURE.contacts.socials
    );
    const expected = { lines: ["Slack", "Skype"] };

    expect(actual).toEqual(expected);
  });

  it("[] → [].a", () => {
    const actual = mapping(
      { mapping: { "[]": "[].tag" }, callback },
      FIXTURE.tags
    );
    const expected = [{ tag: "android" }, { tag: "iphone" }];

    expect(actual).toEqual(expected);
  });
});

describe("mapping (other)", () => {
  it("Nested keys → nested keys with callback", () => {
    const config = { "trainer.birthDate": "values.birthDate" };
    const values = { trainer: { birthDate: "1990-01-01T00:00:00.000Z" } };
    const callback = (keyFrom, valueFrom) => {
      switch (keyFrom) {
        case "trainer.birthDate": {
          const d = new Date(valueFrom);

          return `0${d.getDate()}-0${d.getMonth() + 1}-${d.getFullYear()}`;
        }
        default:
          return valueFrom;
      }
    };
    const actual = mapping(config, values, callback);
    const expected = { values: { birthDate: "01-01-1990" } };

    expect(actual).toEqual(expected);
  });

  it("Config with an internal callback", () => {
    const a = {
      mapping: { agency: "agencyName" },
      callback: (keyFrom, valueFrom) => valueFrom,
    };
    const values = { agency: "12345" };
    const actual = mapping(a, values);
    const expected = { agencyName: "12345" };

    expect(actual).toEqual(expected);
  });
});
