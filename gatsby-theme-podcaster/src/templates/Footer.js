import React, { useContext } from "react";
import PodcastPlayer from "../components/syntax-podcast-player";
import PodcastContext from "../data/PodcastContext";

const Footer = () => {
  const podcast = useContext(PodcastContext);
  console.log("footer", podcast);
  if (podcast) {
    podcast.number = podcast.itunes.episode;
    podcast.url = podcast.enclosure.url;
  }

  return (
    <>
      {podcast ? (
        <div className="podcast-footer fixed bottom-0 left-0 right-0">
          <PodcastPlayer show={podcast} />
        </div>
      ) : (
        ""
      )}

      {/* <section className="p-2 w-full bg-gray-900 text-white">
        <div className="max-w-4xl m-auto flex justify-between">
          <span>Copyright Scott Bolinger</span>
          <span>Nav Links</span>
        </div>
      </section> */}
    </>
  );
};

export default Footer;
