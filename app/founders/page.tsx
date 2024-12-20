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
      '孔经纬是一位拥有超过10年技术开发和5年咨询背景的资深专家和产品visionary。作为创始人和产品主负责人，他在软件开发、大数据分析、大语言模型应用和AI工作流设计等领域展现出非凡的才华和前瞻性洞察力。',
    bio: '孔经纬参与并领导过多个大型项目，涵盖了从企业级应用到创新型AI产品的广泛范围。他的技术专长包括全栈开发、云计算架构、大语言模型应用和AI系统设计，同时在产品管理方面展现出对用户需求的敏锐洞察和对市场趋势的准确把握。\n\n他在咨询领域积累了丰富的经验，为多家企业提供数字化转型和AI落地方案。在大数据分析和AI工作流程优化方面有着深入的实践，善于将前沿技术转化为实际的商业价值。\n\n在他的领导下，团队成功开发了多个备受赞誉的产品，这些产品不仅在技术创新上处于领先地位，更在用户体验和商业价值实现上取得了显著成就。',
    expertise: ['全栈开发', '云计算架构', '人工智能应用', '产品战略', '团队领导力'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    isLead: true,
  },
  {
    id: 5,
    name: '刘鎏',
    role: '产品战略顾问 & 架构顾问',
    avatar: '/avatar/ll.png',
    image: '/avatar/ll.png',
    summary:
      '刘鎏是一位拥有20年丰富经验的技术专家和产品战略家。作为产品战略顾问和架构顾问，他为公司的技术方向和产品战略提供了宝贵的专业指导。',
    bio: '刘鎏在技术领域深耕20年，积累了丰富的架构设计和技术管理经验。他曾参与并主导过多个大型企业级项目的架构设计和技术选型，对分布式系统、微服务架构、云原生技术等都有着深刻的理解和实践经验。\n\n作为产品战略顾问，刘鎏善于从技术视角出发，为产品发展方向提供战略性建议。他能够准确评估技术趋势对产品发展的影响，并提出具有前瞻性的解决方案。他的建议往往能够帮助团队在技术创新和商业价值之间找到最佳平衡点。\n\n凭借其丰富的行业经验，刘鎏在技术架构优化、系统性能提升、技术债务管理等方面都做出了重要贡献，为公司的长期技术发展奠定了坚实基础。',
    expertise: ['架构设计', '技术战略', '系统优化', '技术管理'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    isLead: false,
  },
  {
    id: 6,
    name: '易俊',
    role: '运维架构支持',
    avatar: '/avatar/yj.png',
    image: '/avatar/yj.png',
    summary:
      '易俊是一位拥有20年丰富经验的运维架构专家。作为运维架构支持，他在系统运维、DevOps实践和基础设施架构方面有着深厚的专业积累。',
    bio: '易俊在IT运维和基础设施架构领域深耕20年，积累了丰富的实战经验。他精通各类云平台、容器技术和自动化运维工具，在系统可用性、性能优化和安全防护等方面都有着独到的见解。\n\n作为运维架构支持，易俊负责设计和维护公司的核心基础设施，确保系统的高可用性和可扩展性。他推动了公司DevOps文化的建设，通过引入现代化的CI/CD流程和监控系统，显著提升了团队的开发效率和系统的运维质量。\n\n凭借其丰富的经验，易俊在灾备方案制定、性能调优、安全加固等方面都做出了重要贡献，为公司的技术基础设施提供了坚实的保障。',
    expertise: ['系统运维', 'DevOps', '云架构', '安全防护', '性能优化'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    isLead: false,
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
    isLead: false,
  },
  {
    id: 7,
    name: '宋佃超',
    role: '私域产品专家 & 产品分析及对接顾问',
    avatar: '/avatar/sdc.png',
    image: '/avatar/sdc.png',
    summary:
      '宋佃超是一位资深的私域产品专家和产品分析顾问，在私域运营和产品分析领域拥有丰富的经验。作为产品分析及对接顾问，他为公司的私域产品战略和用户增长提供专业指导。',
    bio: '宋佃超在私域产品运营和用户增长领域有着深厚的积累，精通私域流量运营、用户行为分析和产品优化策略。他对用户需求有着敏锐的洞察力，能够通过数据分析准确把握用户痛点和市场机会。\n\n作为产品分析及对接顾问，宋佃超负责制定和优化公司的私域产品策略，设计有效的用户触达和转化方案。他善于运用各类数据分析工具，通过深入的用户研究和行为分析，为产品决策提供数据支持。\n\n凭借其在私域产品领域的专业经验，宋佃超在用户增长策略、私域运营体系搭建、产品转化率优化等方面都做出了重要贡献，为公司的产品成功奠定了坚实基础。',
    expertise: ['私域运营', '用户增长', '数据分析', '产品策略', '用户研究'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    isLead: false,
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
    isLead: false,
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
    isLead: false,
  },
];

export default function FoundersPage() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  const leadFounder = foundersData.find((founder) => founder.isLead);
  const otherFounders = foundersData.filter((founder) => !founder.isLead);

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
        {leadFounder && (
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              产品主负责人
            </h2>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-lg">
              <CardContent className="p-8 flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <img
                    src={leadFounder.image}
                    alt={leadFounder.name}
                    className="w-48 h-48 rounded-full object-cover mx-auto"
                  />
                </div>
                <div className="md:w-2/3 md:pl-8">
                  <h3 className="text-2xl font-bold mb-2">{leadFounder.name}</h3>
                  <p className="text-lg text-gray-600 mb-4">{leadFounder.role}</p>
                  <p className="text-gray-700 mb-4">{leadFounder.summary}</p>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{leadFounder.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {leadFounder.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={leadFounder.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <GithubIcon size={24} />
                    </a>
                    <a
                      href={leadFounder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <LinkedinIcon size={24} />
                    </a>
                    <a
                      href={leadFounder.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <TwitterIcon size={24} />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            核心团队
          </h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {otherFounders.map((founder, index) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={founder.avatar}
                        alt={founder.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{founder.name}</h3>
                        <p className="text-gray-600">{founder.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 flex-grow">{founder.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {founder.expertise.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 justify-end">
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
              </motion.div>
            ))}
          </div>
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
