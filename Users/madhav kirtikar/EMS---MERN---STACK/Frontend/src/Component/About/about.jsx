 import React from "react";
import karanImg from "../../Assets/karann1.jpg";

const team = [
  {
    name: "KARAN WAKLE",
    role: "UI/UX Designer & Frontend Developer",
    img: karanImg,
    desc: "Passionate about crafting beautiful, user-friendly interfaces and seamless user experiences. Loves to turn ideas into reality with code and creativity.",
    linkedin: "https://www.linkedin.com/in/karanwakle/",
    github: "https://github.com/karanwakle"
  },
  {
    name: "MADHAV KIRTIKAR",
    role: "Backend Developer",
    img: "https://via.placeholder.com/120?text=Madhav",
    desc: "Expert in backend logic, APIs, and database management. Ensures everything runs smoothly behind the scenes.",
    linkedin: "",
    github: ""
  }
];

const AboutUs = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex flex-col items-center py-12 px-4">
    <div className="max-w-2xl text-center mb-10">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4 tracking-tight drop-shadow">Meet The Team</h1>
      <p className="text-gray-700 text-lg">
        We are a duo of passionate developers dedicated to building modern, efficient, and user-friendly web applications.<br />
        Our mission is to simplify employee management for everyone.
      </p>
    </div>
    <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-10">
      {team.map((member, idx) => (
        <div key={idx} className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100 hover:scale-105 transition-transform duration-300">
          <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-green-200 shadow">
            <img
              src={member.img}
              alt={member.name}
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-1">{member.name}</h2>
          <p className="text-green-600 font-medium mb-2">{member.role}</p>
          <p className="text-gray-600 text-center text-base mb-3">{member.desc}</p>
          <div className="flex gap-4">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xl">
                <svg width="24" height="24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black text-xl">
                <svg width="24" height="24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 012.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
    <div className="mt-14 max-w-2xl text-center text-gray-700 text-base bg-white/70 rounded-xl p-6 shadow border border-green-100">
      <p>
        <span className="font-semibold text-blue-800">Why choose us?</span><br />
        We blend creativity and technical expertise to deliver robust, scalable, and visually appealing solutions.<br />
        <span className="text-green-700">Let's build something amazing together!</span>
      </p>
    </div>
  </div>
);

export default AboutUs;