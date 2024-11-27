"use client"

import * as React from "react"
import { Search, MessageSquare, Plus, CheckCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Component {
  id: string
  name: string
  description: string
  framework: string
  tags: string[]
  thumbnails: string
  usage: number
  author: string
  verified: boolean
}

const frameworks = ["React", "Vue", "Angular", "Svelte"]
const tags = ["UI", "Layout", "Form", "Navigation", "Data Display", "Feedback", "Other"]

export default function ComponentMarketplace() {
  const [selectedFrameworks, setSelectedFrameworks] = React.useState<string[]>([])
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  // Mock data - replace with actual API call
  const components: Component[] = [
    {
      id: "1",
      name: "DataGrid",
      description: "Advanced data grid with sorting and filtering",
      framework: "React",
      tags: ["Data Display", "UI"],
      thumbnails: "/placeholder.svg",
      usage: 1234,
      author: "johndoe",
      verified: true
    },
    // Add more components as needed
  ]

  const filteredComponents = components.filter(component => {
    const matchesFramework = selectedFrameworks.length === 0 || selectedFrameworks.includes(component.framework)
    const matchesTags = selectedTags.length === 0 || component.tags.some(tag => selectedTags.includes(tag))
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFramework && matchesTags && matchesSearch
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const toggleFramework = (framework: string) => {
    setSelectedFrameworks(prev => 
      prev.includes(framework) ? prev.filter(f => f !== framework) : [...prev, framework]
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downloads">Most Downloads</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">By Framework:</h3>
          <div className="flex flex-wrap gap-2">
            {frameworks.map(framework => (
              <Badge
                key={framework}
                variant={selectedFrameworks.includes(framework) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFramework(framework)}
              >
                {framework}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">By Tag:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredComponents.map(component => (
          <Dialog key={component.id}>
            <DialogTrigger asChild>
              <Card className="flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <Badge variant="secondary">{component.framework}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pb-2">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={component.thumbnails}
                      alt={`${component.name} preview`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {component.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 text-xs text-muted-foreground">
                  <div className="flex justify-between w-full">
                    <span>by {component.author}</span>
                    <span>{component.usage.toLocaleString()} usage</span>
                  </div>
                </CardFooter>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{component.name}</DialogTitle>
                  {component.verified && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <img
                  src={component.thumbnails}
                  alt={`${component.name} preview`}
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-sm text-muted-foreground">{component.description}</p>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Framework:</h4>
                  <Badge>{component.framework}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {component.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Start Chat
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add to Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

