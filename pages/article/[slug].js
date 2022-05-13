import Moment from "react-moment";
import ReactMarkdown from "react-markdown";

import Seo from "../../components/seo";
import Layout from "../../components/layout";
import NextImage from '../../components/image'

import { fetchAPI } from "../../lib/api";
import { getStrapiMedia } from "../../lib/media";

const Article = ({ article, categories }) => {
  if (!article) return null

  const imageUrl = getStrapiMedia(article.attributes?.cover);

  const seo = {
    metaTitle: article.attributes.title,
    metaDescription: article.attributes.description,
    shareImage: article.attributes.cover.data.url,
    article: true,
  };

  const authorImage = article.attributes.author.data.attributes.avatar
  const blocks = article?.attributes?.blocks

  return (
    <Layout categories={categories.data}>
      <Seo seo={seo} />
      <NextImage image={article.attributes.cover}></NextImage>
      <h1 className="uk-text-center">{article.attributes.title}</h1>
      <div className="uk-section">
        <div className="uk-container uk-container-small">
          {blocks.map((block) => {
            if (!block) return null

            if (block.__component === 'shared.rich-text') {
              return <ReactMarkdown key={block.id}>{block.body}</ReactMarkdown>
            }

            return null
          })}
          <hr className="uk-divider-small" />
          <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
            <div style={{
              height: '150px',
              width: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              paddingLeft: '0px'
            }}>
              {authorImage && (
                <NextImage
                  image={authorImage}
                  alt={
                    authorImage.alternativeText
                  }
                />
              )}
            </div>
            <div className="uk-width-expand">
              <p className="uk-margin-remove-bottom">
                By {article.attributes.author.data.attributes.name}
              </p>
              <p className="uk-text-meta uk-margin-remove-top">
                <Moment format="MMM Do YYYY">
                  {article.attributes.published_at}
                </Moment>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  const articlesRes = await fetchAPI("/articles", { fields: ["slug"] });
  const paths = articlesRes.data.map((article) => ({
    params: {
      slug: article.attributes.slug,
    },
  }))

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articlesRes = await fetchAPI("/articles", {
    filters: {
      slug: params.slug,
    },
    populate: ["image", "category", "author.avatar", "cover", "blocks"],
  });
  const categoriesRes = await fetchAPI("/categories");
  return {
    props: { article: articlesRes.data[0], categories: categoriesRes },
    revalidate: 1,
  };
}

export default Article;