const request = require("supertest");
const app = require("../app");

const fields = [
  "id",
  "created_at",
  "updated_at",
  "box_type",
  "title",
  "slug",
  "short_title",
  "marketing_description",
  "calories_kcal",
  "protein_grams",
  "fat_grams",
  "carbs_grams",
  "bulletpoint1",
  "bulletpoint2",
  "bulletpoint3",
  "recipe_diet_type_id",
  "season",
  "base",
  "protein_source",
  "preparation_time_minutes",
  "shelf_life_days",
  "equipment_needed",
  "origin_country",
  "recipe_cuisine",
  "in_your_box",
  "gousto_reference"
];

describe("Test get recipe", () => {
  test("It should respond to the GET method", () => {
    return request(app)
      .get("/recipes/1")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
  test("It should return all expected fields", () => {
    return request(app)
      .get("/recipes/1")
      .then(response => {
        // Check all fields are returned
        const bodyKeys = Object.keys(response.body);
        fields.forEach(field => expect(bodyKeys).toContain(field));
        expect(bodyKeys.length).toEqual(fields.length);
      });
  });
});

describe("Test set recipe", () => {
  test("It should respond to the POST method", () => {
    return request(app)
      .post("/recipes/1")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
  test("It should return all expected fields", () => {
    return request(app)
      .post("/recipes/1")
      .then(response => {
        // Check all fields are returned
        const bodyKeys = Object.keys(response.body);
        fields.forEach(field => expect(bodyKeys).toContain(field));
        expect(bodyKeys.length).toEqual(fields.length);
      });
  });
  test("If a field is set it should be saved", () => {
    const boxType = "test box";
    return request(app)
      .post("/recipes/1")
      .send({ box_type: boxType })
      .then(response => {
        // Updated field is sent back
        expect(response.body.box_type).toBe(boxType);
        // Updated field stays for the next request
        request(app)
          .post("/recipes/1")
          .then(response => expect(response.body.box_type).toBe(boxType));
      });
  });
});

describe("Test pagination", () => {
  test("It should respond to the GET method", () => {
    return request(app)
      .get("/recipes/cuisine/italian")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
  test("It should return expected properties", () => {
    return request(app)
      .get("/recipes/cuisine/italian")
      .then(response => {
        const properties = ["items", "page", "more"];
        // Check expected properties are returned
        const bodyKeys = Object.keys(response.body);
        properties.forEach(property => expect(bodyKeys).toContain(property));
        expect(bodyKeys.length).toEqual(properties.length);
      });
  });
  test("It should indicate when there are no more pages of content", () => {
    return request(app)
      .get("/recipes/cuisine/italian?page=" + Number.MAX_SAFE_INTEGER)
      .then(response => {
        expect(response.body.more).toBe(false);
      });
  });
  test("It should return different content for page one and two for `italian`", () => {
    return request(app)
      .get("/recipes/cuisine/italian?page=0")
      .then(response => {
        const pageOne = response.body;
        request(app)
          .get("/recipes/cuisine/italian?page=1")
          .then(response => {
            const pageTwo = response.body;
            expect(pageOne).not.toBe(pageTwo);
          });
      });
  });
  test("It should return items only containing `id`, `title`, and `marketing_description`", () => {
    return request(app)
      .get("/recipes/cuisine/italian")
      .then(response => {
        const properties = ["id", "title", "marketing_description"];
        // Check expected properties are returned
        const itemKeys = Object.keys(response.body.items[0]);
        console.log(itemKeys);
        properties.forEach(property => expect(itemKeys).toContain(property));
        expect(itemKeys.length).toEqual(properties.length);
      });
  });
});
