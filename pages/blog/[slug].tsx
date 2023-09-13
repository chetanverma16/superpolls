import fs from "fs";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";

// Components
import H1 from "@/components/mdx/H1";
import React from "react";
import P from "@/components/mdx/P";
import H2 from "@/components/mdx/H2";
import H3 from "@/components/mdx/H3";
import BlockQuote from "@/components/mdx/BlockQuote";
import UnorderedList from "@/components/mdx/UnorderedList";
import Footer from "@/components/Footer";
import path from "path";
import { PostPreview } from "@/types/posts";

export default function PostPage({
  source,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-y-6 py-10">
      <Head>
        <title>{source.frontmatter.title as string}</title>
        <meta
          name="description"
          content={source.frontmatter.description as string}
        />
      </Head>
      <div className="flex flex-col gap-y-6">
        <header className="flex flex-col gap-y-6">
          <img
            src={source.frontmatter.previewImage as string}
            alt={source.frontmatter.title as string}
            className="h-96 w-full rounded-xl object-cover shadow-xl"
          />
          <h1 className="text-4xl">{source.frontmatter.title as string}</h1>
        </header>

        <MDXRemote
          {...source}
          // specifying the custom MDX components
          components={{
            h1: H1,
            h2: H2,
            h3: H3,
            p: P,
            blockquote: BlockQuote,
            ul: UnorderedList,
            a: (props) => (
              <a
                className="text-blue-500 underline hover:text-blue-600"
                {...props}
              />
            ),
          }}
        />
      </div>
      <Footer />
    </article>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<{
    slug: string;
  }>,
) {
  const { slug } = ctx.params!;

  // retrieve the MDX blog post file associated
  // with the specified slug parameter
  const postFile = fs.readFileSync(`${process.cwd()}/_posts/${slug}.mdx`);

  // read the MDX serialized content along with the frontmatter
  // from the .mdx blog post file
  const mdxSource = await serialize(postFile, { parseFrontmatter: true });
  return {
    props: {
      source: mdxSource,
    },
    // enable ISR
    revalidate: 60,
  };
}
