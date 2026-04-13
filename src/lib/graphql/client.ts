/* ============================================
   GraphQL Client — connects to WPGraphQL
   ============================================ */

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ??
  "http://cms.mix967.fm/graphql";

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { revalidate?: number; tags?: string[] } = {}
): Promise<T> {
  const { revalidate = 60, tags } = options;

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags },
  });

  if (!res.ok) {
    throw new Error(
      `GraphQL request failed: ${res.status} ${res.statusText}`
    );
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(
      `GraphQL errors: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  return json.data;
}

/**
 * Same as fetchGraphQL but returns null on failure instead of throwing.
 * Used for build-time fetches where WordPress may be unreachable.
 */
export async function fetchGraphQLSafe<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { revalidate?: number; tags?: string[] } = {}
): Promise<T | null> {
  try {
    return await fetchGraphQL<T>(query, variables, options);
  } catch (err) {
    console.warn("[GraphQL] Fetch failed (non-fatal):", (err as Error).message);
    return null;
  }
}
