import { Toaster } from 'sonner';
import { MainInteractionArea } from './components/main-interaction-area';
import { BrandInfo } from './components/side/brand-info';
import { BrandSelector } from './components/side/brand-selector';

export default function Page() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-6">BD 智能助手</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
          {/* Left Column - Brand Selection and Information */}
          <div className="space-y-6">
            <BrandSelector />
            <BrandInfo />
          </div>

          {/* Right Column - Main Interaction Area */}
          <div>
            <MainInteractionArea />
          </div>
        </div>
      </main>
    </>
  );
}
