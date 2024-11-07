import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

const foundersData = [
  {
    id: 1,
    name: '孔经纬',
    role: '创始人 & 产品主负责人',
    avatar: '/avatar/kjw.png',
    image: '/avatar/kjw.png',
    bio: '孔经纬是一位拥有超过10年丰富经验的技术专家和产品visionary。作为创始人和产品主负责人，他在软件开发和产品设计领域展现出非凡的才华和洞察力。孔经纬参与并领导过多个大型项目，涵盖了从企业级应用到创新型消费产品的广泛范围。\n\n他的技术专长包括全栈开发、云计算架构和人工智能应用，而他在产品管理方面的才能则体现在其对用户需求的敏锐洞察和对市场趋势的准确把握。孔经纬不仅是一位出色的技术领袖，更是一位富有远见的产品策略家，他总能将复杂的技术概念转化为引人入胜的用户体验。\n\n在他的领导下，团队成功开发了多个备受赞誉的产品，这些产品不仅在技术上领先，更在用户体验和商业价值上取得了显著成就。孔经纬的创新精神和执行力是公司持续成长和成功的核心驱动力。',
  },
  {
    id: 2,
    name: '王晓波',
    role: '产品主负责人 & 首席前端工程师',
    avatar: '/avatar/wxb.png',
    image: '/avatar/wxb.png',
    bio: '王晓波是一位杰出的产品专家和前端技术大师，在数字产品开发领域拥有深厚的专业知识和丰富的实践经验。作为产品主负责人和首席前端工程师，王晓波在产品概念化、用户体验设计和前端技术实现方面都展现出卓越的才能。\n\n他对最新的前端技术和框架有着深入的理解，包括但不限于React、Vue、Angular等主流框架，以及各种现代化的CSS预处理器和构建工具。王晓波不仅精通技术，还具有敏锐的产品洞察力，能够准确把握用户需求，将复杂的业务逻辑转化为直观、易用的界面设计。\n\n在他的领导下，前端团队不断推陈出新，开发出了一系列性能卓越、用户体验一流的web应用和移动应用。王晓波特别擅长优化前端性能，确保应用在各种设备和网络条件下都能流畅运行。他还积极推动前端自动化测试和持续集成的实践，大大提高了团队的开发效率和产品质量。\n\n除了技术专长，王晓波还是一位出色的团队领导者和导师。他热衷于分享知识，经常组织团队内部的技术分享会和培训，培养了许多优秀的前端人才。他的远见卓识和技术热情不仅推动了公司产品的不断进步，也为整个前端社区的发展做出了重要贡献。',
  },
  {
    id: 3,
    name: '孔超',
    role: '架构师 & 产品后端负责人',
    avatar: '/avatar/kc.png',
    image: '/avatar/kc.png',
    bio: '孔超是一位经验丰富的架构师和产品后端负责人，在软件架构设计和后端开发领域拥有深厚的专业知识。他的技术视野宽广，对各种后端技术栈都有深入的理解，包括但不限于Java、Python、Node.js等。\n\n作为架构师，孔超擅长设计可扩展、高性能的系统架构，能够有效地解决复杂的技术挑战。他特别注重系统的可维护性和可扩展性，总是能够在技术债务和快速迭代之间找到最佳平衡点。在他的领导下，后端团队成功构建了多个高并发、低延迟的大型系统，为公司的核心业务提供了强有力的技术支持。\n\n孔超不仅关注技术本身，还深谙业务需求，能够将业务目标转化为可行的技术方案。他与产品团队紧密合作，确保技术实现与产品愿景保持一致。此外，孔超还是DevOps实践的积极推动者，致力于优化开发流程，提高团队效率。\n\n作为一个技术导师，孔超乐于分享他的知识和经验，培养了许多优秀的后端工程师。他的技术博客和开源贡献在整个开发者社区中广受好评，进一步彰显了他在技术领域的影响力。',
  },
  {
    id: 4,
    name: '郑川旸',
    role: '产品业务及构思负责人 & 战略顾问',
    avatar: '/avatar/zcy.png',
    image: '/avatar/zcy.png',
    bio: '郑川旸是一位富有远见的产品战略家和业务专家，在产品构思、业务发展和战略规划方面拥有卓越的才能。作为产品业务及构思负责人和战略顾问，他在公司的产品方向和业务发展中扮演着关键角色。\n\n郑川旸拥有敏锐的市场洞察力，能够准确把握用户需求和行业趋势。他善于将创新理念转化为可行的产品概念，并制定清晰的产品路线图。在他的引导下，公司成功开发了多个引领市场的创新产品，为用户创造了巨大价值。\n\n作为战略顾问，郑川旸在公司的长期发展规划中发挥着重要作用。他深入分析市场动态和竞争格局，为公司制定了清晰的战略方向。他的建议不仅涉及产品开发，还包括市场定位、商业模式创新和合作伙伴关系等方面，全面推动公司的可持续发展。\n\n郑川旸特别擅长跨团队协作，他与技术、设计、市场等各个团队保持紧密沟通，确保产品vision能够得到准确的执行。他提倡以用户为中心的设计理念，不断推动产品优化和用户体验提升。\n\n除了在公司内部的贡献，郑川旸还是业内知名的思想领袖。他经常受邀在各种行业会议上发表演讲，分享他对产品开发和业务创新的独到见解。他的观点和预测常常引领行业趋势，为整个科技生态系统的发展做出了重要贡献。',
  },
];

export default function Component() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">我们的创始团队</h1>
          <p className="text-xl md:text-2xl text-center mb-12">携手打造未来科技</p>
          <div className="flex flex-wrap justify-center gap-8">
            {foundersData.map((founder) => (
              <div key={founder.id} className="text-center">
                <img
                  src={founder.avatar}
                  alt={founder.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
                />
                <h3 className="font-semibold">{founder.name}</h3>
                <p className="text-sm opacity-75">{founder.role}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <a
              href="#founders"
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors"
            >
              了解更多 <ChevronDownIcon className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-20">
        <div className="container mx-auto px-4">
          {foundersData.map((founder, index) => (
            <div
              key={founder.id}
              className={`flex flex-col md:flex-row items-center gap-8 mb-20 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/3">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">{founder.name}</h2>
                <h3 className="text-xl text-gray-600 mb-6">{founder.role}</h3>
                <div className="space-y-4">
                  {founder.bio.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
