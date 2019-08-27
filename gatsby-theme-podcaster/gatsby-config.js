module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-anchor",
      options: {
        rss: "https://anchor.fm/s/bfdfc04/podcast/rss"
      }
    },
    {
        resolve: `gatsby-theme-tailwindcss`,
        options: {
          postCssPlugins: [require("autoprefixer")],
        },
      },
  ]
};
