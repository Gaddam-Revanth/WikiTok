import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-wikitok-red mb-6">About WikiTok</h1>
      <p className="text-lg text-gray-800 text-center max-w-2xl mb-8">
        WikiTok is a revolutionary platform that transforms the way you consume knowledge.
        Inspired by the dynamic and engaging format of short-form video platforms, WikiTok
        delivers bite-sized, visually rich articles from Wikipedia, making learning
        accessible, enjoyable, and highly efficient.
      </p>

      <h2 className="text-3xl font-semibold text-wikitok-blue mb-4">Our Uniqueness</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg mb-8">
        <li className="mb-2"><b>Bite-Sized Learning:</b> Get key information quickly without overwhelming long reads.</li>
        <li className="mb-2"><b>Visual Engagement:</b> Articles are presented with compelling visuals to enhance understanding and retention.</li>
        <li className="mb-2"><b>Dynamic Discovery:</b> Explore new topics effortlessly through an intuitive, continuous feed.</li>
        <li className="mb-2"><b>Interactive Experience:</b> Engage with content in a fresh, modern way.</li>
      </ul>

      <h2 className="text-3xl font-semibold text-wikitok-blue mb-4">Key Features</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg mb-8">
        <li className="mb-2"><b>Seamless Article Feed:</b> Swipe through articles like short videos, keeping you engaged.</li>
        <li className="mb-2"><b>Intelligent Search:</b> Quickly find articles on any topic with smart suggestions.</li>
        <li className="mb-2"><b>Curated Content:</b> Discover trending and relevant information tailored to your interests.</li>
        <li className="mb-2"><b>Responsive Design:</b> Enjoy a consistent experience across all your devices.</li>
      </ul>

      <p className="text-lg text-gray-800 text-center max-w-2xl">
        At WikiTok, we believe that knowledge should be exciting and easy to access.
        Join us in redefining the future of learning!
      </p>
    </div>
  );
};

export default About;