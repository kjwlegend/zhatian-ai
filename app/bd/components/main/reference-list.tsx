interface Reference {
  title: string;
  link: string;
  type: 'file' | 'link';
  fileType?: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX';
}

interface ReferenceListProps {
  references: Reference[];
}

export function ReferenceList({ references }: ReferenceListProps) {
  if (!references?.length) return null;

  return (
    <div className="mt-3 p-3 bg-white/80 rounded-md border border-gray-100 shadow-sm">
      <p className="text-xs font-medium text-gray-600 mb-2">参考文档</p>
      <ul className="space-y-1.5">
        {references.map((ref, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-blue-400" />
            <a
              href={ref.link}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
            >
              {ref.type === 'file' && (
                <span className="text-xs text-gray-500">[{ref.fileType}]</span>
              )}
              {ref.title}
              {ref.type === 'link' && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
