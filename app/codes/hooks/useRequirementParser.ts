import { useCallback } from 'react';

export function useRequirementParser() {
  const parseContent = useCallback((content: string) => {
    // Only get sections that start with # or ##
    const markdownSections = content
      .split(/(?=# |\n## )/g)
      .filter((section) => {
        const trimmedSection = section.trim();
        return trimmedSection.startsWith('# ') || trimmedSection.startsWith('## ');
      })
      .map((section) => section.trim());

    // Join all valid sections back together with newlines
    return markdownSections.join('\n\n');
  }, []);

  return {
    parseContent,
  };
}
