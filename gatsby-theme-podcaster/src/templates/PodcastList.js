import React, { useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import PodcastItem from "../components/PodcastItem";
import Layout from "./Layout";
import PodcastContext from "../data/PodcastContext";

const PodcastList = () => {

  const [ currentPodcast, setCurrentPodcast ] = useState()

  const data = useStaticQuery(graphql`
    query {
      allAnchorEpisode {
        nodes {
          id
          title
          content
          isoDate
          enclosure {
            url
          }
          itunes {
            episode
          }
        }
      }
    }
  `);
  const podcasts = data.allAnchorEpisode.nodes;

  const handleChangePodcast = data => {
    setCurrentPodcast(data)
  }

  return (
    <PodcastContext.Provider value={currentPodcast}>
      <Layout>
        {podcasts && podcasts.map(podcast => (
          <div key={podcast.id} className="podcast-list-item border-b border-gray-700 pb-2 mb-2 pt-2 px-4 sm:px-0">
          <PodcastItem changePodcast={handleChangePodcast} podcast={podcast} />
          </div>
        ))}
      </Layout>
    </PodcastContext.Provider>
  );
};

export default PodcastList;
