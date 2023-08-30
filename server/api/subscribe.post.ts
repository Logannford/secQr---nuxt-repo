export default defineEventHandler(async (event) => {
  const params = await readBody(event);
  return params
});
