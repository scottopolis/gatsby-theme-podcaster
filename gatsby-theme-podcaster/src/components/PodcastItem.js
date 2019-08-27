import React, { useState } from "react";
import { FaPlayCircle } from "react-icons/fa";

const PodcastItem = data => {
  const [isOpen, toggleOpen] = useState(false);
  const { podcast } = data;
  podcast.number = podcast.itunes.episode;
  podcast.url = podcast.enclosure.url;

  const sendData = () => {
    data.changePodcast(podcast);
  };

  const doToggle = () => {
    if (isOpen) {
      toggleOpen(false);
      return;
    }

    toggleOpen(true);
  };

  return (
    <div className="text-left w-full flex">
      <div className="">
      <span
          onClick={sendData}
          className="float-left text-4xl p-0 mr-4 pt-1 text-gray-400 cursor-pointer"
        >
          <FaPlayCircle />
        </span>
      </div>


      <div className="flex-1">
        
        <h3 onClick={sendData} className="text-gray-100 cursor-pointer">
          Episode {podcast.title}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {new Date(podcast.isoDate).toLocaleDateString("en-US")}
        </p>
        <div className="accordion text-sm text-gray-300">
          <span
            onClick={() => {
              doToggle();
            }}
            className="text-xs text-purple-500 cursor-pointer py-2 mt-1 block"
          >
            {isOpen ? "Hide details" : "Details"}
          </span>
          <div
            className={isOpen ? `h-auto` : `h-0 overflow-hidden`}
            dangerouslySetInnerHTML={{
              __html: podcast.content
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PodcastItem;
