'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const foundersData = [
  {
    id: 1,
    name: '孔经纬',
    role: '创始人 & 产品主负责人',
    avatar: '/avatar/kjw.png',
    image: '/avatar/kjw.png',
    summary:
      '孔经纬是一位拥有超过10年丰富经验的技术专家和产品visionary。作为创始人和产品主负责人，他在软件开发和产品设计领域展现出非凡的才华和洞察力。',
    bio: '孔经纬参与并领导过多个大型项目，涵盖了从企业级应用到创新型消费产品的广泛范围。他的技术专长包括全栈开发、云计算架构和人工智能应用，而他在产品管理方面的才能则体现在其对用户需求的敏锐洞察和对市场趋势的准确把握。\n\n在他的领导下，团队成功开发了多个备受赞誉的产品，这些产品不仅在技术上领先，更在用户体验和商业价值上取得了显著成就。',
    expertise: ['全栈开发', '云计算架构', '人工智能应用', '产品战略', '团队领导力'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 2,
    name: '王晓波',
    role: '产品主负责人 & 首席前端工程师',
    avatar: '/avatar/wxb.png',
    image: '/avatar/wxb.png',
    summary:
      '王晓波是一位杰出的产品专家和前端技术大师，在数字产品开发领域拥有深厚的专业知识和丰富的实践经验。作为产品主负责人和首席前端工程师，他在产品概念化、用户体验设计和前端技术实现方面都展现出卓越的才能。',
    bio: '王晓波是一位杰出的产品专家和前端技术大师，在数字产品开发领域拥有深厚的专业知识和丰富的实践经验。作为产品主负责人和首席前端工程师，王晓波在产品概念化、用户体验设计和前端技术实现方面都展现出卓越的才能。\n\n他对最新的前端技术和框架有着深入的理解，包括但不限于React、Vue、Angular等主流框架，以及各种现代化的CSS预处理器和构建工具。王晓波不仅精通技术，还具有敏锐的产品洞察力，能够准确把握用户需求，将复杂的业务逻辑转化为直观、易用的界面设计。\n\n在他的领导下，前端团队不断推陈出新，开发出了一系列性能卓越、用户体验一流的web应用和移动应用。王晓波特别擅长优化前端性能，确保应用在各种设备和网络条件下都能流畅运行。他还积极推动前端自动化测试和持续集成的实践，大大提高了团队的开发效率和产品质量。',
    expertise: ['前端开发', '用户体验', '性能优化'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 3,
    name: '孔超',
    role: '架构师 & 产品后端负责人',
    avatar: '/avatar/kc.png',
    image: '/avatar/kc.png',
    summary:
      '孔超是一位经验丰富的架构师和产品后端负责人，在软件架构设计和后端开发领域拥有深厚的专业知识。他的技术视野宽广，对各种后端技术栈都有深入的理解。',
    bio: '孔超是一位经验丰富的架构师和产品后端负责人，在软件架构设计和后端开发领域拥有深厚的专业知识。他的技术视野宽广，对各种后端技术栈都有深入的理解，包括但不限于Java、Python、Node.js等。\n\n作为架构师，孔超擅长设计可扩展、高性能的系统架构，能够有效地解决复杂的技术挑战。他特别注重系统的可维护性和可扩展性，总是能够在技术债务和快速迭代之间找到最佳平衡点。在他的领导下，后端团队成功构建了多个高并发、低延迟的大型系统，为公司的核心业务提供了强有力的技术支持。\n\n孔超不仅关注技术本身，还深谙业务需求，能够将业务目标转化为可行的技术方案。他与产品团队紧密合作，确保技术实现与产品愿景保持一致。此外，孔超还是DevOps实践的积极推动者，致力于优化开发流程，提高团队效率。',
    expertise: ['后端开发', '软件架构', '系统设计'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  {
    id: 4,
    name: '郑川旸',
    role: '产品业务及构思负责人 & 战略顾问',
    avatar: '/avatar/zcy.png',
    image: '/avatar/zcy.png',
    summary:
      '郑川旸是一位富有远见的产品战略家和业务专家，在产品构思、业务发展和战略规划方面拥有卓越的才能。作为产品业务及构思负责人和战略顾问，他在公司的产品方向和业务发展中扮演着关键角色。',
    bio: '郑川旸是一位富有远见的产品战略家和业务专家，在产品构思、业务发展和战略规划方面拥有卓越的才能。作为产品业务及构思负责人和战略顾问，他在公司的产品方向和业务发展中扮演着关键角色。\n\n郑川旸拥有敏锐的市场洞察力，能够准确把握用户需求和行业趋势。他善于将创新理念转化为可行的产品概念，并制定清晰的产品路线图。在他的引导下，公司成功开发了多个引领市场的创新产品，为用户创造了巨大价值。\n\n作为战略顾问，郑川旸在公司的长期发展规划中发挥着重要作用。他深入分析市场动态和竞争格局，为公司制定了清晰的战略方向。他的建议不仅涉及产品开发，还包括市场定位、商业模式创新和合作伙伴关系等方面，全面推动公司的可持续发展。',
    expertise: ['市场分析', '战略规划', '业务发展'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
];

export default function FoundersPage() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">

      <div className="relative pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <motion.h1
            className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            创新引领者
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-gray-600 max-w-xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            携手打造未来科技，引领创新浪潮
          </motion.p>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-2xl" />
      </div>

      <main className="container mx-auto px-6 relative z-10">
        <section className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-24">
          {foundersData.map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{ perspective: '2000px' }}
            >
              <AnimatePresence>
                <motion.div
                  className="relative w-full h-[520px] cursor-pointer rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  onClick={() => handleCardClick(founder.id)}
                  animate={{ rotateY: flippedCard === founder.id ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <Card
                    className={`absolute w-full h-full backface-hidden bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl overflow-hidden`}
                    style={{
                      transform: flippedCard === founder.id ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      visibility: flippedCard === founder.id ? 'hidden' : 'visible',
                    }}
                  >
                    <CardHeader className="p-0">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-60 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-gray-800 text-xl font-medium">
                        {founder.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {founder.role}
                      </CardDescription>
                      <p className="mt-4 text-gray-700 text-sm line-clamp-3">{founder.summary}</p>

                      <div className="mt-5 max-h-16 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {founder.expertise.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full whitespace-nowrap"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex gap-4 justify-center">
                        <a
                          href={founder.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <GithubIcon size={18} />
                        </a>
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <LinkedinIcon size={18} />
                        </a>
                        <a
                          href={founder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <TwitterIcon size={18} />
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Back of card */}
                  <Card
                    className={`absolute w-full h-full backface-hidden bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl overflow-auto`}
                    style={{
                      transform: flippedCard === founder.id ? 'rotateY(0deg)' : 'rotateY(180deg)',
                      visibility: flippedCard === founder.id ? 'visible' : 'hidden',
                    }}
                  >
                    <CardContent className="p-6" style={{ transform: 'rotateY(180deg)' }}>
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <CardTitle className="text-gray-800 text-xl font-medium">
                            {founder.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedCard(null);
                            }}
                          >
                            <ArrowLeftIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                            {founder.bio}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </section>

        <section className="text-center mb-24">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            我们的使命
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            我们致力于革新人们与技术的交互方式。我们的目标是创造直观、强大的工具，
            赋能个人和企业，将复杂变简单，将不可能变为可能。
          </p>
        </section>

        <section className="text-center mb-24">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            加入我们
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed mb-8">
            我们始终在寻找充满激情的人才加入团队，共同塑造技术的未来。
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            探索职业机会
          </Button>
        </section>
      </main>
    </div>
  );
}
