import { Metadata } from "next";
import Image from "next/image";
import { Feather, Heart, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Chronicle, our values, our team, and our mission to share knowledge.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: <Lightbulb className="w-6 h-6 text-violet-600" />,
      title: "Curiosity First",
      description: "We believe in continuous learning, testing ideas, and exploring new horizons in tech and design.",
    },
    {
      icon: <Heart className="w-6 h-6 text-violet-600" />,
      title: "Human Design",
      description: "Design is not just how it looks, but how it works and feels to the human beings using it.",
    },
    {
      icon: <Users className="w-6 h-6 text-violet-600" />,
      title: "Collaborative Growth",
      description: "We grow together by sharing insights openly and building a welcoming community of creators.",
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Intro Hero */}
      <section className="bg-gradient-to-b from-white to-slate-50/50 py-16 md:py-24 border-b border-gray-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Feather className="w-12 h-12 text-violet-600 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            We write to explain, inspire, and connect.
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Chronicle is a digital publication dedicated to exploring technology, craftsmanship in web design, and strategies for a balanced modern life.
          </p>
        </div>
      </section>

      {/* Story & Image Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Chronicle started as a tiny newsletter for developers and designers who felt overwhelmed by the sheer pace of the digital world. We wanted a place that didn&apos;t just report news, but distilled it into deep, evergreen guides and practical tutorials.
            </p>
            <p className="text-gray-600 leading-relaxed text-base">
              Over the years, we&apos;ve expanded our topics to include design systems, color psychology, workspace ergonomics, and mindfulness. We believe that professional excellence and personal wellness are deeply intertwined.
            </p>
            <div className="pt-4">
              <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-700 bg-violet-50/30 py-3 pr-2 rounded-r-xl">
                &ldquo;Simplicity is the ultimate sophistication. We aim to clear the noise and focus on what truly matters.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Image - let's use the workspace layout image we generated! */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
            <Image
              src="/images/lifestyle-blog.png"
              alt="Cozy creative workspace showing a journal and plants"
              fill
              sizes="(max-width: 1024px) 100vw, 550px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-slate-50/50 border-t border-b border-gray-100/50 py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Our Core Values</h2>
            <p className="text-gray-500 mt-2">The principles that guide our writing and curation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
