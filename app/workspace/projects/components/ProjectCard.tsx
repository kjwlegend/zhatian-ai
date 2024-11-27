"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Laptop, Smartphone, Globe, Pencil, Trash2, LogIn } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Page {
  id: string
  name: string
}

interface Component {
  id: string
  name: string
}

interface ProjectCardProps {
  id: string
  title: string
  description: string
  pagesCount: number
  componentsCount: number
  platforms: Array<"website" | "wechat" | "app">
  pages: Page[]
  components: Component[]
  onDelete: (id: string) => void
  onEdit: (id: string, data: { title: string; description: string; platforms: Array<"website" | "wechat" | "app"> }) => void
}

export function ProjectCard({
  id,
  title,
  description,
  pagesCount,
  componentsCount,
  platforms,
  pages,
  components,
  onDelete,
  onEdit,
}: ProjectCardProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [editForm, setEditForm] = useState({ title, description, platforms })

  const handleDelete = () => {
    if (deleteConfirmation === title) {
      onDelete(id)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEdit = () => {
    onEdit(id, editForm)
    setIsEditDialogOpen(false)
  }

  const handleEnterProject = () => {
    router.push(`/projects/${id}/pages`)
  }

  const togglePlatform = (platform: "website" | "wechat" | "app") => {
    setEditForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {platforms.includes("website") && (
              <Badge variant="secondary">
                <Globe className="mr-1 h-3 w-3" />
                Web
              </Badge>
            )}
            {platforms.includes("wechat") && (
              <Badge variant="secondary">
                <Smartphone className="mr-1 h-3 w-3" />
                WeChat
              </Badge>
            )}
            {platforms.includes("app") && (
              <Badge variant="secondary">
                <Laptop className="mr-1 h-3 w-3" />
                App
              </Badge>
            )}
          </div>
          <div className="flex gap-4">
            <div className="text-sm">
              <span className="font-medium">{pagesCount}</span> pages
            </div>
            <div className="text-sm">
              <span className="font-medium">{componentsCount}</span> components
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Make changes to your project details here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Platforms</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="website" 
                      checked={editForm.platforms.includes("website")}
                      onCheckedChange={() => togglePlatform("website")}
                    />
                    <Label htmlFor="website">Website</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wechat" 
                      checked={editForm.platforms.includes("wechat")}
                      onCheckedChange={() => togglePlatform("wechat")}
                    />
                    <Label htmlFor="wechat">WeChat Mini Program</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="app" 
                      checked={editForm.platforms.includes("app")}
                      onCheckedChange={() => togglePlatform("app")}
                    />
                    <Label htmlFor="app">App</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Pages</Label>
                  <ul className="space-y-1">
                    {pages.map(page => (
                      <li key={page.id}>{page.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label className="mb-2 block">Components</Label>
                  <ul className="space-y-1">
                    {components.map(component => (
                      <li key={component.id}>{component.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="default" size="sm" onClick={handleEnterProject}>
          <LogIn className="mr-2 h-4 w-4" />
          Enter Project
        </Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the project and all
                associated pages.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="confirmation">
                  Please type <span className="font-medium">{title}</span> to confirm
                </Label>
                <Input
                  id="confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteConfirmation !== title}
              >
                Delete Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

