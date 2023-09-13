import Head from "next/head";
import { InferGetStaticPropsType } from "next";
import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";

// Components
import PostCard from "@/components/BlogCard";

// Types
import { PostPreview } from "@/types/posts";

export default function Home({
  postPreviews,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Blog | Superpoll</title>
        <meta
          name="description"
          content="A collection of my thoughts and experiences."
        />
      </Head>
      <main className="flex flex-col items-center gap-x-2 py-10">
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-gray-500">
            Unlocking the Power of Polls: Your Guide to Creating Seamless
            Engagement with our App!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
          {postPreviews.map((postPreview, i) => {
            return <PostCard key={i} postPreview={postPreview} />;
          })}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  // get all MDX files
  const postFilePaths = fs.readdirSync("_posts").filter((postFilePath) => {
    return path.extname(postFilePath).toLowerCase() === ".mdx";
  });

  const postPreviews: PostPreview[] = [];

  // read the frontmatter for each file
  for (const postFilePath of postFilePaths) {
    const postFile = fs.readFileSync(`_posts/${postFilePath}`, "utf8");

    // serialize the MDX content to a React-compatible format
    // and parse the frontmatter
    const serializedPost = await serialize(postFile, {
      parseFrontmatter: true,
    });

    postPreviews.push({
      ...serializedPost.frontmatter,
      // add the slug to the frontmatter info
      slug: postFilePath.replace(".mdx", ""),
    } as PostPreview);
  }

  return {
    props: {
      postPreviews: postPreviews,
    },
    // enable ISR
    revalidate: 60,
  };
}
