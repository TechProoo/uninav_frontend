"use client";

import React from "react";
import { motion } from "framer-motion";
import { Book, Users, DollarSign, Shield } from "lucide-react";
import Services from "./Services";
import Image from "next/image";
import Logo from "../../public/Image/uninav-logo-image.png";
import Button from "./ui/Button-styled";
import { useRouter } from "next/navigation";

const About = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 },
    },
    initial: {
      scale: 1,
      rotate: 0,
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="about_bg">
      <div className="m-auto py-1 md:py-10 w-10/12">
        <div className="items-center gap-5 grid grid-cols-12">
          <motion.div
            className="col-span-12 md:col-span-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div
              className="flex justify-center items-center bg-gradient-to-r from-purple-50 dark:from-slate-800 to-blue-50 dark:to-slate-700 rounded-lg h-48 md:h-60"
              animate={{
                boxShadow: [
                  "0px 0px 0px rgba(0,0,0,0)",
                  "0px 10px 30px rgba(0,0,0,0.1)",
                  "0px 0px 0px rgba(0,0,0,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={Logo}
                  alt="UniNav Logo"
                  width={120}
                  height={120}
                  className="opacity-80"
                />
              </motion.div>
            </motion.div>
            <div className="about_left py-5 md:py-10 border_c md:w-full fst">
              <div className="m-auto w-11/12">
                <h1 className="font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl md:text-left text-center">
                  Enhancing Learning, One Resource at a Time
                </h1>
                <p className="mt-4 text-gray-700 text-md dark:text-gray-300 md:text-xl">
                  Transforming the way students connect, learn, and grow through
                  seamless access to academic resources and collaborative tools.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="col-span-12 md:col-span-6">
            <div className="gap-5 grid grid-cols-12">
              <motion.div
                className="col-span-12 md:col-span-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={1}
                transition={{ delay: 0.1 }}
              >
                <div className="about_right py-4 md:py-6 border_c mdw-full about_first fst">
                  <div className="m-auto w-11/12">
                    <motion.div
                      whileHover="hover"
                      initial="initial"
                      variants={iconVariants}
                      className="inline-flex justify-center items-center bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10"
                    >
                      <Book className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </motion.div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Study Material Repository
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Access & share lecture notes, textbooks, and past
                      questions by Faculty, Department, and Course.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="col-span-12 md:col-span-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={2}
                transition={{ delay: 0.2 }}
              >
                <div className="about_right py-4 md:py-6 border_c md:w-full fst">
                  <div className="m-auto w-11/12">
                    <motion.div
                      whileHover="hover"
                      initial="initial"
                      variants={iconVariants}
                      className="inline-flex justify-center items-center bg-green-100 dark:bg-green-900 rounded-full w-10 h-10"
                    >
                      <Users className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </motion.div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Study Group Recommendations
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Get connected with WhatsApp-based study groups tailored to
                      your courses.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="col-span-12 md:col-span-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={3}
                transition={{ delay: 0.3 }}
              >
                <div className="about_right py-4 md:py-6 border_c md:w-full fst">
                  <div className="m-auto w-11/12">
                    <motion.div
                      whileHover="hover"
                      initial="initial"
                      variants={iconVariants}
                      className="inline-flex justify-center items-center bg-purple-100 dark:bg-purple-900 rounded-full w-10 h-10"
                    >
                      <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                    </motion.div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Monetize Your Notes
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Earn by sharing premium academic resources with other
                      students.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="col-span-12 md:col-span-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={4}
                transition={{ delay: 0.4 }}
              >
                <div className="about_right py-4 md:py-6 border_c md:w-full fst">
                  <div className="m-auto w-11/12">
                    <motion.div
                      whileHover="hover"
                      initial="initial"
                      variants={iconVariants}
                      className="inline-flex justify-center items-center bg-amber-100 dark:bg-amber-900 rounded-full w-10 h-10"
                    >
                      <Shield className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                    </motion.div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Role-Based Access
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Enjoy a secure platform with customized access for
                      students, tutors, and admins.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <Services />
        <motion.div
          className="relative shadow-md mt-10 rounded-lg w-full h-auto md:h-[600px] overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Overlay content */}
          <div className="z-10 relative flex flex-col justify-center items-center px-4 md:px-10 py-10 md:py-0 h-full text-center">
            <h1 className="drop-shadow-sm mb-4 md:mb-6 font-extrabold text-[var(--bg-dark)] text-3xl md:text-5xl">
              Enhancing Learning, One Resource at a Time
            </h1>
            <p className="opacity-90 mb-6 md:mb-8 max-w-2xl text-[var(--bg-dark)] text-lg md:text-xl">
              Seamless access to academic resources, study groups, and tools
              that help you grow.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigateTo("/auth/login")}
                text={"Get Started"}
              />
            </motion.div>
          </div>

          {/* Optional illustration on larger screens */}
          <div className="hidden md:block right-0 bottom-0 absolute opacity-90 w-[220px] md:w-[280px]">
            <Image
              src={Logo}
              alt="Study Illustration"
              className="object-contain"
              width={280}
              height={280}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
