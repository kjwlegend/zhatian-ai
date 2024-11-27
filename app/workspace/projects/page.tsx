"use client"

import { ProjectCard } from "./components/ProjectCard"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Project {
  id: string
  title: string
  description: string
  pagesCount: number
  componentsCount: number
  platforms: Array<"website" | "wechat" | "app">
  pages: Array<{ id: string; name: string }>
  components: Array<{ id: string; name: string }>
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Website Redesign",
      description: "Complete redesign of company website",
      pagesCount: 5,
      componentsCount: 3,
      platforms: ["website"],
      pages: [
        { id: "p1", name: "Home" },
        { id: "p2", name: "About" },
        { id: "p3", name: "Services" },
        { id: "p4", name: "Portfolio" },
        { id: "p5", name: "Contact" },
      ],
      components: [
        { id: "c1", name: "Header" },
        { id: "c2", name: "Footer" },
        { id: "c3", name: "ContactForm" },
      ],
    },
    {
      id: "2",
      title: "E-commerce App",
      description: "Mobile app for our e-commerce platform",
      pagesCount: 7,
      componentsCount: 5,
      platforms: ["app", "wechat"],
      pages: [
        { id: "p6", name: "Login" },
        { id: "p7", name: "ProductList" },
        { id: "p8", name: "ProductDetail" },
        { id: "p9", name: "Cart" },
        { id: "p10", name: "Checkout" },
        { id: "p11", name: "OrderConfirmation" },
        { id: "p12", name: "UserProfile" },
      ],
      components: [
        { id: "c4", name: "ProductCard" },
        { id: "c5", name: "CartItem" },
        { id: "c6", name: "PaymentForm" },
        { id: "c7", name: "OrderSummary" },
        { id: "c8", name: "ReviewStars" },
      ],
    },
  ])

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
  }

  const handleEdit = (id: string, data: { title: string; description: string; platforms: Array<"website" | "wechat" | "app"> }) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...data } : project
      )
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>+ New Project</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  )
}

