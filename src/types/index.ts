/* ============================================
   Mix 967 FM — Core Types
   Matched to WPGraphQL response shapes
   ============================================ */

/* ---------- WordPress media ---------- */

export interface WPImage {
  node: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  };
}

/* ---------- Posts ---------- */

export interface WPPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  featuredImage: WPImage | null;
  categories: {
    nodes: WPTerm[];
  };
  author: {
    node: {
      name: string;
      avatar: { url: string } | null;
    };
  };
}

/* ---------- Shows (Radio Station) ---------- */

export interface WPShow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  showSchedule: string | null;
  showAvatar: string | null;
  showActive: boolean;
  featuredImage: WPImage | null;
}

export interface ShowScheduleSlot {
  day: string;
  start_hour: string;
  start_min: string;
  start_meridian: string;
  end_hour: string;
  end_min: string;
  end_meridian: string;
  disabled?: string;
}

/* ---------- Events (The Events Calendar) ---------- */

export interface WPEvent {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  startDate: string | null;
  endDate: string | null;
  venueName: string | null;
  venueCity: string | null;
  venueAddress: string | null;
  featuredImage: WPImage | null;
}

/* ---------- Pages ---------- */

export interface WPPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage: WPImage | null;
}

/* ---------- Taxonomy ---------- */

export interface WPTerm {
  id: string;
  slug: string;
  name: string;
  count?: number;
}

/* ---------- Now Playing (stream metadata) ---------- */

export interface NowPlaying {
  title: string;
  fetchedAt: number;
}

/* ---------- Homepage Slider (Slide Anything) ---------- */

export interface SliderSlide {
  imageUrl: string;
  altText: string;
  width: number;
  height: number;
  linkUrl: string | null;
  linkTarget: string;
}

/* ---------- Advanced Ads ---------- */

export interface AdvancedAd {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  width: number;
  height: number;
}

/* ---------- Menus ---------- */

export interface WPMenuItem {
  id: string;
  label: string;
  url: string;
  target: string | null;
  parentId: string | null;
  path: string;
}

export interface MenuResponse {
  menu: { menuItems: { nodes: WPMenuItem[] } } | null;
}

/* ---------- GraphQL response wrappers ---------- */

export interface WPPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface PostsResponse {
  posts: { nodes: WPPost[] };
}

export interface PaginatedPostsResponse {
  posts: { nodes: WPPost[]; pageInfo: WPPageInfo };
}

export interface SinglePostResponse {
  post: WPPost;
}

export interface ShowsResponse {
  shows: { nodes: WPShow[] };
}

export interface SingleShowResponse {
  show: WPShow;
}

export interface EventsResponse {
  events: { nodes: WPEvent[] };
}

export interface SingleEventResponse {
  event: WPEvent;
}

export interface PageResponse {
  page: WPPage;
}

export interface CategoriesResponse {
  categories: { nodes: WPTerm[] };
}

export interface SliderResponse {
  homepageSlider: SliderSlide[];
}

export interface AdGroupResponse {
  adGroup: AdvancedAd[];
}
