import { Link } from "react-router-dom";

export default function Rightbar({ onBackClick }) {
  return (
    <div className="fixed top-0 right-0 h-screen p-4 bg-black text-white overflow-y-auto  lg:block w-full lg:relative lg:top-auto lg:right-auto lg:h-auto">
      <div className="mb-4 flex justify-between lg:hidden">
        <Link
          to="/homepage"
          className="bg-gray-800 text-white py-2 px-4 rounded-full"
          onClick={() => window.location.reload()}
        >
          Back
        </Link>
        <input
          type="text"
          className="w-2/3 p-2 bg-[#202327] text-gray-300 rounded-full"
          placeholder="Search"
        />
      </div>

      <div className="mb-4 hidden lg:block">
        <input
          type="text"
          className="w-full p-2 bg-[#202327] text-gray-300 rounded-full"
          placeholder="Search"
        />
      </div>

      <div className="p-4 rounded-lg mb-6 border border-gray-700">
        <h3 className="font-bold text-xl">Subscribe to Premium</h3>
        <p className="text-gray-500 text-sm mt-2">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-full mt-4">
          Subscribe
        </button>
      </div>

      <div className="border border-gray-700 p-4 rounded-lg mb-6">
        <h3 className="font-bold text-xl">What's happening</h3>
        <ul className="mt-4 space-y-2">
          <li className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Politics • Trending</p>
              <p>#برنامج_جودة_الحياة</p>
              <p className="text-gray-400 text-sm">35.6K posts</p>
            </div>
            <button className="text-gray-500">...</button>
          </li>
          <li className="flex justify-between">
            <div>
              <p>#الديوان_الملكي</p>
              <p className="text-gray-400 text-sm">Trending in Saudi Arabia</p>
            </div>
            <button className="text-gray-500">...</button>
          </li>
          <li className="flex justify-between">
            <div>
              <p>#فزعه_الشعب_السعودي</p>
              <p className="text-gray-400 text-sm">35.6K posts</p>
            </div>
            <button className="text-gray-500">...</button>
          </li>
          <li className="flex justify-between">
            <div>
              <p>#الملك_سلمان_بن_عبدالعزيز</p>
              <p className="text-gray-400 text-sm">Trending in Saudi Arabia</p>
            </div>
            <button className="text-gray-500">...</button>
          </li>
          <li className="flex justify-between">
            <div>
              <p>#السعودية_اليابان</p>
              <p className="text-gray-400 text-sm">Trending in Saudi Arabia</p>
            </div>
            <button className="text-gray-500">...</button>
          </li>
        </ul>
        <button className="text-blue-500 mt-4">Show more</button>
      </div>

      <div className="border border-gray-700 p-4 rounded-lg mb-6">
        <h3 className="font-bold text-xl">Who to follow</h3>
        <ul className="mt-4 space-y-4">
          <li className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://pbs.twimg.com/profile_images/1367488769268604941/VOR-G5R8_400x400.jpg"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <p className="font-bold">Oelhan</p>
                <p className="text-gray-400 text-sm">@oelhan_tv</p>
              </div>
            </div>
            <button className="bg-white text-black font-semibold px-1 py-1 rounded-full">
              Follow
            </button>
          </li>
          <li className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://pbs.twimg.com/profile_images/1829034348164620288/jp6NBfTb_400x400.png"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <p className="font-bold">Lorcan</p>
                <p className="text-gray-400 text-sm">@LorcanArt</p>
              </div>
            </div>
            <button className="bg-white text-black font-semibold px-1 py-1 rounded-full">
              Follow
            </button>
          </li>
          <li className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://pbs.twimg.com/profile_images/1661473980379811842/9S74g0Qe_400x400.jpg"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <p className="font-bold">tjo</p>
                <p className="text-gray-400 text-sm">@0xTjo</p>
              </div>
            </div>
            <button className="bg-white text-black font-semibold px-1 py-1 rounded-full">
              Follow
            </button>
          </li>
        </ul>
        <button className="text-blue-500 mt-4">Show more</button>
      </div>

      <div className="text-gray-400 text-sm mt-4">
        <p>Terms of Service • Privacy Policy • Cookie Policy</p>
        <p>Accessibility • Ads info • More • © 2024 X Corp.</p>
      </div>
    </div>
  );
}
