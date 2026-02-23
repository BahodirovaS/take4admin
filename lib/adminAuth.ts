export function isValidAdminToken(token: string | null) {
  const expected = process.env.ADMIN_TOKEN;
  return Boolean(expected && token === expected);
}