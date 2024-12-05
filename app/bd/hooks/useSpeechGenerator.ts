import { toast } from 'sonner';
import { bdService } from '../services/bdService';
import { useBdStore } from '../store/useBdStore';

export const useSpeechGenerator = () => {
  const {
    conversation,
    brandBasicInfo,
    bidRequirements,
    structure,
    speech,
    setSpeech,
    isGeneratingSpeech,
    setIsGeneratingSpeech,
    partialSpeech,
    setPartialSpeech,
  } = useBdStore();

  const handleGenerateChineseSpeech = async () => {
    if (!brandBasicInfo && !bidRequirements && conversation.length === 0) {
      toast.error('请先输入品牌信息或投标需求，并进行一些讨论');
      return;
    }

    try {
      setIsGeneratingSpeech(true);
      const response = await bdService.generateChineseSpeech(
        conversation,
        brandBasicInfo,
        bidRequirements,
        structure,
        (content) => {
          setPartialSpeech({
            ...partialSpeech,
            chinese: content,
          });
        }
      );
      setSpeech({
        ...speech,
        chinese: response,
      });
      toast.success('中文演讲稿生成成功');
    } catch (error) {
      console.error('生成中文演讲稿失败:', error);
      toast.error('生成中文演讲稿失败，请稍后重试');
    } finally {
      setIsGeneratingSpeech(false);
      setPartialSpeech({
        ...partialSpeech,
        chinese: '',
      });
    }
  };

  const handleGenerateEnglishSpeech = async () => {
    if (!brandBasicInfo && !bidRequirements && conversation.length === 0) {
      toast.error('请先输入品牌信息或投标需求，并进行一些讨论');
      return;
    }

    try {
      setIsGeneratingSpeech(true);
      const response = await bdService.generateEnglishSpeech(
        conversation,
        brandBasicInfo,
        bidRequirements,
        structure,
        (content) => {
          setPartialSpeech({
            ...partialSpeech,
            english: content,
          });
        }
      );
      setSpeech({
        ...speech,
        english: response,
      });
      toast.success('英文演讲稿生成成功');
    } catch (error) {
      console.error('生成英文演讲稿失败:', error);
      toast.error('生成英文演讲稿失败，请稍后重试');
    } finally {
      setIsGeneratingSpeech(false);
      setPartialSpeech({
        ...partialSpeech,
        english: '',
      });
    }
  };

  return {
    speech,
    isGenerating: isGeneratingSpeech,
    partialSpeech,
    handleGenerateChineseSpeech,
    handleGenerateEnglishSpeech,
    setSpeech,
  };
};
