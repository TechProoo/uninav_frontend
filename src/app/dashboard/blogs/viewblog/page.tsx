import { Calendar, Eye } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="news_content_cover py-8 px-4">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-12 md:col-span-5 text-left md:text-right px-6">
            <span className="inline-block bg-red-700 text-white rounded-xl px-3 py-1 text-sm font-bold">
              {/* Replace with actual category */}
              Category
            </span>
            <h1 className="text-4xl font-bold fnt text-white mt-4 leading-tight">
              {/* Replace with actual title */}
              Title Goes Here
            </h1>
            <div className="mt-4 text-gray-400 text-sm">
              <b>
                Author -{" "}
                <span className="text-white font-semibold">
                  {/* Replace with actual author */}
                  Author Name
                </span>
              </b>
            </div>
            <div className="hero_icons mt-4 flex items-center justify-start gap-1 md:justify-end text-gray-300 text-sm">
              <Eye size={15} className="text-gray-500" />
              <b className="text-sm">{/* Replace with actual views */}0</b>
            </div>

            <div className="mt-4 flex items-center justify-start md:justify-end text-gray-300 text-sm">
              <Calendar size={14} className="mr-2" />
              <span>
                {/* Replace with actual date */}
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="news_content_img rounded-lg overflow-hidden shadow-lg">
              <img
                src="/placeholder.jpg" // Replace with actual image URL
                alt="News Title"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="news_content w-11/12 md:w-9/12 lg:w-7/12 mx-auto my-12 text-gray-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <blockquote className="italic text-lg text-gray-600 border-l-4 border-gray-400 pl-4">
            {/* Replace with actual description */}
            News description goes here.
          </blockquote>
        </div>
        <article className="leading-relaxed text-lg space-y-6">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{
              __html: "<p>News content goes here.</p>", // Replace with actual HTML content
            }}
          />
        </article>

        <div className="mt-5 flex gap-3 items-center">
          <span className="fnth">Tags: </span>
        </div>
      </div>
    </div>
  );
};

export default page;
