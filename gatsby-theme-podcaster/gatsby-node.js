const path = require('path');

// create the podcasts index page, and the single podcast pages
exports.createPages = async ({ actions, graphql, reporter }) => {
  const basePath = "/";
  actions.createPage({
    path: basePath,
    component: require.resolve("./src/templates/PodcastList.js")
  });

  const result = await graphql(`
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

  if (result.errors) {
    reporter.panic("error loading podcasts", reporter.errors);
    return;
  }

  const podcasts = result.data.allAnchorEpisode.nodes;

  podcasts.forEach(podcast => {
    actions.createPage({
      path: podcast.id,
      component: require.resolve("./src/templates/SinglePodcast.js"),
      context: {
        podcast: podcast
      }
    });
  });
};
