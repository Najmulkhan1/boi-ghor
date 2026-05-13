"use client";

import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { ScrollMode } from '@react-pdf-viewer/core';

// CSS Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

interface Props {
  fileUrl: string;
}

export default function EnhancedPDFViewer({ fileUrl }: Props) {
  // প্লাগিন সেটআপ
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  return (
    <div className="h-[80vh] md:h-[90vh] w-full relative group">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[
            defaultLayoutPluginInstance,
            pageNavigationPluginInstance
          ]}
          // মোবাইলের জন্য জুম লেভেল অটো (Page Fit) রাখা হয়েছে
          defaultScale={SpecialZoomLevel.PageFit}
          theme="dark"
          // স্ক্রল মোড ভার্টিকাল থেকে সিঙ্গেল পেজ করলে মোবাইলে সুবিধা হয়
          scrollMode={ScrollMode.Vertical} 
        />
      </Worker>

      {/* মোবাইলের জন্য কুইক নেভিগেশন ওভারলে (Optional) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-lg px-6 py-2 rounded-full border border-white/10 z-10 md:hidden">
         <button 
           onClick={() => pageNavigationPluginInstance.jumpToPreviousPage()}
           className="text-white text-xs font-bold px-2"
         >
           আগেরটি
         </button>
         <div className="w-[1px] h-4 bg-white/20"></div>
         <button 
           onClick={() => pageNavigationPluginInstance.jumpToNextPage()}
           className="text-white text-xs font-bold px-2"
         >
           পরেরটি
         </button>
      </div>
    </div>
  );
}