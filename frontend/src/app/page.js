'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  
  const router = useRouter(); 

  const handleClick = () => {
    router.push('/login'); };

  
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover" autoPlay loop muted>
            <source src="https://res.cloudinary.com/dv97iagt7/video/upload/v1741463814/Military1_bpk27j.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl p-6"
        >
          <h1 className="text-5xl font-bold text-white">
            Elite Forces Training
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Preparing the next generation of warriors with cutting-edge military
            training.
          </p>
          <Button onClick={handleClick} className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
            Enroll Now
          </Button>
        </motion.div>
      </section>

      {/* Scrolling Animations Section */}
      <section className="py-20 px-6 bg-lightblue-100 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          Our Training Programs
        </h2>
        <div className="space-y-12">
          {[
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464104/training1_tjk93g.jpg',
              title: 'Tactical Combat',
              desc: 'Master close-quarters combat techniques.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464100/training2_ilrqd9.jpg',
              title: 'Survival Skills',
              desc: 'Learn essential survival tactics in extreme conditions.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464123/training3_g7jg9t.jpg',
              title: 'Advanced Weaponry',
              desc: 'Train with cutting-edge military technology.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464099/training4_f4bz4s.jpg',
              title: 'Navigation Training',
              desc: 'Master map reading and navigation skills.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464120/training5_efyget.jpg',
              title: 'Sniper Training',
              desc: 'Sharpen your precision shooting skills.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464119/training6_rxtf6k.jpg',
              title: 'Paratrooper Drills',
              desc: 'Train for aerial insertions and extractions.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464107/training7_zm8rxz.jpg',
              title: 'Cyber Warfare',
              desc: 'Learn digital combat and security measures.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464106/training8_ydk2up.jpg',
              title: 'Explosives Handling',
              desc: 'Master safe handling and deployment of explosives.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464109/training9_jb0owh.jpg',
              title: 'Maritime Operations',
              desc: 'Operate effectively in naval combat scenarios.',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464113/training10_aroe86.jpg',
              title: 'Hand-to-Hand Combat',
              desc: 'Excel in close combat and self-defense techniques.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
              className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="relative w-full h-64 md:h-80 lg:h-96">
                <Image
                  src={item.img}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 rounded-t-lg"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center z-10">
                  <h3 className="text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-200">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Alternate Scroll Animation */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          Elite Missions
        </h2>
        <div className="space-y-12">
          {[
            {
              img: '/mission1.jpg',
              title: 'Recon Missions',
              desc: 'Gather intelligence from high-risk areas.',
            },
            {
              img: '/mission2.jpg',
              title: 'Rescue Operations',
              desc: 'Save hostages and stranded soldiers in combat zones.',
            },
            {
              img: '/mission3.jpg',
              title: 'Covert Ops',
              desc: 'Execute classified operations under deep cover.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: false }}
              className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="relative w-full h-64 md:h-80 lg:h-96">
                <Image
                  src={item.img}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 rounded-t-lg"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center z-10">
                  <h3 className="text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-200">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white text-center">
        <h2 className="text-4xl font-bold">Ready to Join?</h2>
        <p className="mt-4 text-lg" >
          Sign up today and become part of the elite.
        </p>
        <Button onClick={handleClick} className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-200">
          Get Started
        </Button>
      </section>
    </div>
  );
}
