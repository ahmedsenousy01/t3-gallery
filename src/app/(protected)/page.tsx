import { getPostsRecommendedPostsWithOwners } from "~/server/queries";
import { Feed } from "../_components/post-feed";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPostsRecommendedPostsWithOwners();
  return <Feed initialPosts={posts} />;
}
