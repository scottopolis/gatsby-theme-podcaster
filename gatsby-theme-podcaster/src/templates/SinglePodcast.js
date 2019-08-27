import React from "react";
import Layout from "./Layout";

const SinglePodcast = ({ pageContext }) => {
  const { podcast } = pageContext;

  podcast.number = podcast.itunes.episode;
  podcast.url = podcast.enclosure.url;
  return (
    <Layout>
      <div
        dangerouslySetInnerHTML={{
          __html: podcast.content
        }}
      />
    </Layout>
  );
};

export default SinglePodcast;
