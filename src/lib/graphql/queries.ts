/* ============================================
   GraphQL Queries — Mix 967 FM
   Matched to WPGraphQL + mu-plugin schema
   ============================================ */

/* ---------- Posts ---------- */

export const GET_RECENT_POSTS = `
  query GetRecentPosts($first: Int = 6) {
    posts(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            id
            slug
            name
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

export const GET_POSTS_PAGINATED = `
  query GetPostsPaginated($first: Int = 12, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            id
            slug
            name
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          id
          slug
          name
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

/* ---------- Shows (Radio Station plugin) ---------- */

export const GET_ALL_SHOWS = `
  query GetAllShows {
    shows(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        excerpt
        showSchedule
        showAvatar
        showActive
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const GET_SHOW_BY_SLUG = `
  query GetShowBySlug($slug: ID!) {
    show(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      showSchedule
      showAvatar
      showActive
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

/* ---------- Events (The Events Calendar) ---------- */

export const GET_UPCOMING_EVENTS = `
  query GetUpcomingEvents($first: Int = 8) {
    events(
      first: $first
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        slug
        title
        excerpt
        startDate
        endDate
        venueName
        venueCity
        venueAddress
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const GET_EVENT_BY_SLUG = `
  query GetEventBySlug($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      startDate
      endDate
      venueName
      venueCity
      venueAddress
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

/* ---------- Pages ---------- */

export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

/* ---------- Homepage Slider (Slide Anything) ---------- */

export const GET_HOMEPAGE_SLIDER = `
  query GetHomepageSlider {
    homepageSlider {
      imageUrl
      altText
      width
      height
      linkUrl
      linkTarget
    }
  }
`;

/* ---------- Advanced Ads ---------- */

export const GET_AD_GROUP = `
  query GetAdGroup($group: String!) {
    adGroup(group: $group) {
      id
      title
      imageUrl
      linkUrl
      width
      height
    }
  }
`;

/* ---------- Search ---------- */

export const SEARCH_POSTS = `
  query SearchPosts($search: String!, $first: Int = 20) {
    posts(first: $first, where: { status: PUBLISH, search: $search }) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            id
            slug
            name
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

/* ---------- Post Count ---------- */

export const GET_POST_COUNT = `
  query GetPostCount {
    postCount
  }
`;

/* ---------- Menus ---------- */

export const GET_MENU = `
  query GetMenu($slug: ID!) {
    menu(id: $slug, idType: SLUG) {
      menuItems(first: 100) {
        nodes {
          id
          label
          url
          target
          parentId
          path
        }
      }
    }
  }
`;

/* ---------- Categories ---------- */

export const GET_CATEGORIES = `
  query GetCategories {
    categories(first: 50, where: { hideEmpty: true }) {
      nodes {
        id
        slug
        name
        count
      }
    }
  }
`;
