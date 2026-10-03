import { describe, expect, it } from "vitest";
import { checkoutSchema, orderLinesSchema } from "@/schemas/checkout.schema";
import { checkOrder } from "@/services/order.service";
import { getProductById } from "@/services/product.service";

const valid = {
  fullName: "Nadia Rahman",
  email: "nadia@example.com",
  phone: "01712-345678",
  address: "House 64, Road 13, Uttara",
  city: "Dhaka",
  postalCode: "1230",
};

const errorsFor = (values: Record<string, string>) => {
  const result = checkoutSchema.safeParse(values);
  if (result.success) return {};
  // Like the RHF resolver, report the first issue per field.
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message;
  return errors;
};

describe("checkoutSchema", () => {
  it("accepts valid Bangladeshi delivery details and trims them", () => {
    const result = checkoutSchema.parse({ ...valid, fullName: "  Nadia Rahman  " });
    expect(result.fullName).toBe("Nadia Rahman");
  });

  it("rejects whitespace-only required fields", () => {
    const errors = errorsFor({ ...valid, fullName: "   ", address: "    ", city: " " });
    expect(Object.keys(errors).sort()).toEqual(["address", "city", "fullName"]);
    expect(errors.fullName).toBe("Full name is required");
  });

  it.each(["not-an-email", "a@b", "nadia@example"])("rejects email %j", (email) => {
    expect(errorsFor({ ...valid, email }).email).toBeDefined();
  });

  it.each(["01712345678", "+8801712345678", "8801712345678", "01712 345 678"])("accepts phone %j", (phone) => {
    expect(errorsFor({ ...valid, phone })).toEqual({});
  });

  it.each(["1234567", "01212345678", "0171234567", "abcdefghijk"])("rejects phone %j", (phone) => {
    expect(errorsFor({ ...valid, phone }).phone).toBeDefined();
  });

  it.each(["123", "12345", "12a4"])("rejects postal code %j", (postalCode) => {
    expect(errorsFor({ ...valid, postalCode }).postalCode).toBeDefined();
  });

  it("requires at least one order line with a positive integer quantity", () => {
    expect(orderLinesSchema.safeParse([]).success).toBe(false);
    expect(orderLinesSchema.safeParse([{ id: "prod-001", quantity: 0, price: 1 }]).success).toBe(false);
  });
});

describe("checkOrder", () => {
  it("prices the order from the catalog", async () => {
    const product = (await getProductById("prod-001"))!;
    const result = await checkOrder([{ id: product.id, quantity: 2, price: product.price }]);
    expect(result).toMatchObject({ ok: true, subtotal: product.price * 2, count: 2 });
  });

  it("rejects outdated prices, excess quantity and unknown products, returning fresh catalog data", async () => {
    const product = (await getProductById("prod-001"))!;
    const result = await checkOrder([
      { id: product.id, quantity: product.stock + 1, price: product.price },
      { id: "prod-002", quantity: 1, price: 1 },
      { id: "gone", quantity: 1, price: 100 },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/in stock/);
    expect(result.error).toMatch(/price .* has changed/);
    expect(result.catalog.gone).toBeNull();
    expect(result.catalog[product.id]?.stock).toBe(product.stock);
  });
});
