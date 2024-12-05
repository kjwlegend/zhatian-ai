import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockCollaborations = [
  { id: 1, title: "2022年度营销方案", type: "PDF", date: "2022-12-01" },
  { id: 2, title: "产品发布会策划", type: "PPTX", date: "2022-09-15" },
  { id: 3, title: "品牌形象升级项目", type: "DOCX", date: "2022-06-30" },
  { id: 4, title: "社交媒体营销报告", type: "PDF", date: "2022-03-20" },
  { id: 5, title: "客户满意度调研", type: "XLSX", date: "2022-01-10" },
]

export function HistoricalCollaboration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>历史合作信息</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <ul className="space-y-2">
            {mockCollaborations.map((doc) => (
              <li key={doc.id} className="flex justify-between items-center border-b pb-2">
                <span>{doc.title}</span>
                <div>
                  <span className="text-sm text-gray-500 mr-2">{doc.type}</span>
                  <span className="text-sm text-gray-500">{doc.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

