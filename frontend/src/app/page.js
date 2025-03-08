'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter(); 

  const handleLogin = () => router.push('/login');
  const handleAbout = () => router.push('/about-us');

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
            Strategic Defense Operations
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Centralized platform for modern defense coordination and resource management
          </p>
          <Button onClick={handleLogin} className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
            Get Started
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-lightblue-100 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          System Features
        </h2>
        <div className="space-y-12">
          {[
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464104/training1_tjk93g.jpg',
              title: 'Operations Dashboard',
              desc: 'Real-time tracking of all defense operations with weather and location updates',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464100/training2_ilrqd9.jpg',
              title: 'Resource Management',
              desc: 'Optimize allocation of personnel, vehicles, and equipment',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741464123/training3_g7jg9t.jpg',
              title: 'Role-based Access',
              desc: 'Four-tier user roles with granular permissions control',
            },
            // Add more features as needed
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

      {/* Core Capabilities Section */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          Core Capabilities
        </h2>
        <div className="space-y-12">
          {[
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741467712/mission1_ua1cwd.jpg',
              title: 'Audit Logs',
              desc: 'Complete transaction history with advanced filtering',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741467712/mission2_w9evse.jpg',
              title: 'Real-time Notifications',
              desc: 'Instant alerts for critical system events and updates',
            },
            {
              img: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741467714/mission3_oth5d5.jpg',
              title: 'Advanced Analytics',
              desc: 'Generate detailed reports with visual data representations',
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
        <h2 className="text-4xl font-bold">Ready to Transform Defense Management?</h2>
        <p className="mt-4 text-lg">
          Join elite defense teams optimizing their operations through centralized control
        </p>
        <Button onClick={handleLogin} className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-200">
          Access System
        </Button>
        <Button onClick={handleAbout} className="mt-6 ml-[10px] bg-white text-blue-600 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-200">
          About Our Platform
        </Button>
      </section>
    </div>
  );
}