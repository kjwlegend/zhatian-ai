import { toast } from 'sonner';
import { bdService } from '../services/bdService';
import { useBdStore } from '../store/useBdStore';

export const useStructureGenerator = () => {
  const {
    conversation,
    brandBasicInfo,
    bidRequirements,
    structure,
    isGeneratingStructure,
    partialStructure,
    setStructure,
    setIsGeneratingStructure,
    setPartialStructure,
  } = useBdStore();

  const handleGenerateStructure = async () => {
    if (!brandBasicInfo && !bidRequirements && conversation.length === 0) {
      toast.error('请先输入品牌信息或投标需求，并进行一些讨论');
      return;
    }

    try {
      setIsGeneratingStructure(true);
      const response = await bdService.generateStructure(
        conversation,
        brandBasicInfo,
        bidRequirements,
        (content) => {
          setPartialStructure(content);
        }
      );
      setStructure(response);
      toast.success('方案结构生成成功');
    } catch (error) {
      console.error('生成方案结构失败:', error);
      toast.error('生成方案结构失败，请稍后重试');
    } finally {
      setIsGeneratingStructure(false);
      setPartialStructure('');
    }
  };

  return {
    isGenerating: isGeneratingStructure,
    structure,
    partialStructure,
    handleGenerateStructure,
    setStructure,
  };
};
