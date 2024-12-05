import { toast } from 'sonner';
import { bdService } from '../services/bdService';
import { BrandBasicInfo, BrandNews, HistoricalProject, useBdStore } from '../store/useBdStore';

export const useBrandSelector = () => {
  const {
    selectedBrand,
    customBrand,
    setSelectedBrand,
    setCustomBrand,
    setBrandBasicInfo,
    setBrandNews,
    setHistoricalProjects,
    setIsLoadingBasicInfo,
    setIsLoadingNews,
    setIsLoadingProjects,
  } = useBdStore();

  const fetchBrandInfo = async (brandName: string) => {
    // 获取基础信息
    setIsLoadingBasicInfo(true);
    try {
      const basicInfo: BrandBasicInfo = await bdService.getBrandBasicInfo(brandName);
      setBrandBasicInfo(basicInfo);
      toast.success(`成功获取 ${brandName} 的基础信息`);
    } catch (error) {
      console.error('获取品牌基础信息失败:', error);
      toast.error(`获取 ${brandName} 的基础信息失败`);
      setBrandBasicInfo(null);
    } finally {
      setIsLoadingBasicInfo(false);
    }

    // 获取新闻信息
    setIsLoadingNews(true);
    try {
      const news: BrandNews[] | null = await bdService.getBrandNews(brandName);
      setBrandNews(news);
    } catch (error) {
      console.error('获取品牌新闻失败:', error);
      setBrandNews(null);
    } finally {
      setIsLoadingNews(false);
    }

    // 获取历史项目
    setIsLoadingProjects(true);
    try {
      const projects: HistoricalProject[] | null = await bdService.getBrandProjects(brandName);
      setHistoricalProjects(projects);
    } catch (error) {
      console.error('获取历史项目失败:', error);
      setHistoricalProjects(null);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleBrandSelect = async (brand: string) => {
    setSelectedBrand(brand);
    setCustomBrand('');
    await fetchBrandInfo(brand);
  };

  const handleCustomBrandSubmit = async () => {
    if (!customBrand.trim()) return;
    setSelectedBrand('');
    await fetchBrandInfo(customBrand);
  };

  return {
    selectedBrand,
    customBrand,
    setCustomBrand,
    handleBrandSelect,
    handleCustomBrandSubmit,
  };
};
