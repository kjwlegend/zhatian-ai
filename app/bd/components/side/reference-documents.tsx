import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockDocuments = [
  { id: 1, title: "过往投标方案 A", type: "PDF" },
  { id: 2, title: "行业分析报告", type: "DOCX" },
  { id: 3, title: "竞品对比表", type: "XLSX" },
  { id: 4, title: "客户需求调研", type: "PDF" },
  { id: 5, title: "技术方案模板", type: "PPTX" },
]

export function ReferenceDocuments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>参考文档</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <ul className="space-y-2">
            {mockDocuments.map((doc) => (
              <li key={doc.id} className="flex justify-between items-center border-b pb-2">
                <span>{doc.title}</span>
                <span className="text-sm text-gray-500">{doc.type}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

