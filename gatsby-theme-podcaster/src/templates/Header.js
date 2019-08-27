import React from "react";
import ScottHeadshot from "../images/scott-headshot-150.jpg";

const Header = () => (
  <section className="podcast-theme-header p-4 pt-10 w-full bg-gray-900 text-white clearfix border-b border-gray-700">
    <div className="max-w-4xl m-auto">
      <h1 className="text-6xl font-bold leading-none">The Product Business</h1>
      <p className="text-gray-300 italic mt-2 text-sm">The podcast for product bootstrappers. Code => launch => market => grow.</p>
    </div>
    <div className="podcast-header-inner flex justify-around items-center">
      <div className="py-4 w-1/2">
        <img
          src={ScottHeadshot}
          className="block rounded-full border h-12 w-12 sm:float-left mr-2"
          alt="Author avatar"
        />
        <p className="font-bold mt-1">Scott Bolinger</p>
        <p className="text-gray-400 text-xs"><a href="https://twitter.com/scottbolinger" target="_blank">@scottbolinger</a></p>
      </div>
      <div className="w-1/2 text-xs">
        <a href="https://podcasts.apple.com/us/podcast/the-product-business/id1472862480?uo=4" target="_blank" className="btn-rounded w-full sm:w-auto bg-purple-600 hover:bg-purple-500">
          iTunes
        </a>
        <a href="https://overcast.fm/itunes1472862480/the-product-business" target="_blank" className="btn-rounded w-full sm:w-auto bg-orange-500 rounded-full hover:bg-orange-400">
          Overcast
        </a>
        <a href="https://anchor.fm/s/bfdfc04/podcast/rss" target="_blank" className="btn-rounded w-full sm:w-auto rounded-full bg-green-500 hover:bg-green-400">
          RSS
        </a>
      </div>
    </div>
  </section>
);

export default Header;
